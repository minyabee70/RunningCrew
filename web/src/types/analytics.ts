import type { RunningSession } from '@/types';

export type PeriodFilter = 'all' | '3months' | '1month' | '2weeks';

export interface EnrichedRoutePoint {
  lat: number;
  lng: number;
  recorded_at: string;
  distance_m: number;
  speed_kmh?: number | null;
  pace_sec_per_km?: number | null;
  altitude?: number | null;
  heart_rate?: number | null;
  cadence?: number | null;
  vertical_oscillation?: number | null;
  [key: string]: unknown;
}

export interface MetricPoint {
  distance_m: number;
  pace_sec_per_km?: number | null;
  speed_kmh?: number | null;
  altitude?: number | null;
  heart_rate?: number | null;
  cadence?: number | null;
  calories_rate?: number;
}

export interface SessionMetricsResponse {
  points: EnrichedRoutePoint[];
  bounds: { south: number; north: number; west: number; east: number } | null;
}

export interface TrendSession {
  id: string;
  started_at: string;
  distance_meters: number;
  avg_pace_sec_per_km: number | null;
  duration_seconds?: number;
  calories?: number;
  runningScore?: number;
}

export interface TrendsResponse {
  sessionCount: number;
  totalDistanceMeters: number;
  avgPaceSecPerKm: number;
  sessions: TrendSession[];
}

export interface RunningScoreResult {
  score: number;
  grade: string;
  metricStatuses: Record<string, 'excellent' | 'good' | 'needs_review' | 'critical'>;
  critiques: string[];
}

export type SessionWithScore = RunningSession & { runningScore?: RunningScoreResult };
