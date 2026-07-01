import pool from '../config/database';
import { geminiModel, GEMINI_TIMEOUT_MS } from '../config/gemini';
import {
  AppError,
  DatabaseError,
  GeminiApiError,
  GeminiTimeoutError,
  NotFoundError,
} from '../errors/AppError';
import type { AiAnalysis, RunningSession } from '../types';
import { sampleRoutePoints } from './metricsService';
import * as sessionService from './sessionService';

function mapAnalysis(row: Record<string, unknown>): AiAnalysis {
  return {
    id: row.id as string,
    session_id: row.session_id as string,
    analysis_type: row.analysis_type as string,
    summary: row.summary as string,
    insights: (row.insights as Record<string, unknown>) ?? {},
    model_version: row.model_version as string,
    created_at: row.created_at as Date,
  };
}

export async function getLatestAnalysis(
  sessionId: string,
  analysisType = 'summary'
): Promise<AiAnalysis | null> {
  try {
    const result = await pool.query(
      `SELECT * FROM ai_analysis WHERE session_id = $1 AND analysis_type = $2
       ORDER BY created_at DESC LIMIT 1`,
      [sessionId, analysisType]
    );
    return result.rows[0] ? mapAnalysis(result.rows[0]) : null;
  } catch (err) {
    throw new DatabaseError('Failed to fetch analysis', err);
  }
}

function isAnalysisStale(analysis: AiAnalysis, session: RunningSession): boolean {
  return new Date(session.updated_at) > new Date(analysis.created_at);
}

function buildAnalysisPrompt(session: RunningSession): string {
  const samples = sampleRoutePoints(session.route_points);
  return `You are a running coach. Analyze this running session and respond in Korean Markdown.

Distance: ${session.distance_meters}m
Duration: ${session.duration_seconds}s
Avg pace: ${session.avg_pace_sec_per_km ?? 'N/A'} sec/km
Calories: ${session.calories}
Heart rate avg: ${session.heart_rate_avg ?? 'N/A'}
Cadence avg: ${session.cadence_avg ?? 'N/A'}
Route samples: ${JSON.stringify(samples)}

Include sections: ## 요약, ## 페이스 분석, ## 개선 제안, ## 회복 팁`;
}

async function callGeminiWithTimeout(prompt: string): Promise<string> {
  if (!geminiModel) throw new GeminiApiError('Gemini API not configured');

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), GEMINI_TIMEOUT_MS);
  });

  try {
    const result = await Promise.race([geminiModel.generateContent(prompt), timeoutPromise]);
    const text = result.response.text();
    if (!text) throw new GeminiApiError('Empty Gemini response');
    return text;
  } catch (err) {
    if (err instanceof Error && err.message === 'GEMINI_TIMEOUT') {
      throw new GeminiTimeoutError('Gemini API request timed out');
    }
    throw new GeminiApiError('Gemini API request failed', err);
  }
}

async function saveAnalysis(
  sessionId: string,
  markdown: string,
  session: RunningSession
): Promise<AiAnalysis> {
  try {
    const result = await pool.query(
      `INSERT INTO ai_analysis (session_id, analysis_type, summary, insights, model_version)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        sessionId,
        'summary',
        markdown,
        JSON.stringify({
          route_point_count: session.route_points.length,
          distance_meters: session.distance_meters,
          duration_seconds: session.duration_seconds,
          session_updated_at: session.updated_at,
          cached: false,
        }),
        'gemini-1.5-flash',
      ]
    );
    return mapAnalysis(result.rows[0]);
  } catch (err) {
    throw new DatabaseError('Failed to save analysis', err);
  }
}

export async function analyzeSession(
  sessionId: string,
  options?: { force?: boolean }
): Promise<AiAnalysis & { cached?: boolean }> {
  let session: RunningSession | null;

  try {
    session = await sessionService.getSessionById(sessionId);
    if (!session) throw new NotFoundError(`Session ${sessionId} not found`);
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new DatabaseError('Failed to fetch session data', err);
  }

  if (!options?.force) {
    try {
      const cached = await getLatestAnalysis(sessionId, 'summary');
      if (cached && !isAnalysisStale(cached, session)) {
        return { ...cached, insights: { ...cached.insights, cached: true }, cached: true };
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new DatabaseError('Failed to check cache', err);
    }
  } else {
    try {
      await pool.query(
        `DELETE FROM ai_analysis WHERE session_id = $1 AND analysis_type = 'summary'`,
        [sessionId]
      );
    } catch (err) {
      throw new DatabaseError('Failed to clear cache', err);
    }
  }

  let markdown: string;
  try {
    markdown = await callGeminiWithTimeout(buildAnalysisPrompt(session));
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new GeminiApiError('Gemini API request failed', err);
  }

  try {
    return await saveAnalysis(sessionId, markdown, session);
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new DatabaseError('Failed to save analysis result', err);
  }
}
