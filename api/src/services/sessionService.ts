import pool from '../config/database';
import { DatabaseError, NotFoundError } from '../errors/AppError';
import type { RoutePoint, RunningSession } from '../types';

function mapSession(row: Record<string, unknown>): RunningSession {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    status: row.status as RunningSession['status'],
    started_at: row.started_at as Date,
    ended_at: row.ended_at as Date | null,
    distance_meters: Number(row.distance_meters),
    duration_seconds: Number(row.duration_seconds),
    avg_pace_sec_per_km: row.avg_pace_sec_per_km != null ? Number(row.avg_pace_sec_per_km) : null,
    route_points: (row.route_points as RoutePoint[]) ?? [],
    calories: Number(row.calories),
    heart_rate_avg: row.heart_rate_avg != null ? Number(row.heart_rate_avg) : null,
    cadence_avg: row.cadence_avg != null ? Number(row.cadence_avg) : null,
    vertical_oscillation_avg:
      row.vertical_oscillation_avg != null ? Number(row.vertical_oscillation_avg) : null,
    notes: row.notes as string | null,
    created_at: row.created_at as Date,
    updated_at: row.updated_at as Date,
  };
}

export async function createSession(userId: string, startedAt?: string): Promise<RunningSession> {
  try {
    const result = await pool.query(
      `INSERT INTO running_sessions (user_id, started_at, status)
       VALUES ($1, COALESCE($2::timestamptz, NOW()), 'active') RETURNING *`,
      [userId, startedAt ?? null]
    );
    return mapSession(result.rows[0]);
  } catch (err) {
    throw new DatabaseError('Failed to create session', err);
  }
}

export async function getSessionById(id: string, userId?: string): Promise<RunningSession | null> {
  try {
    const result = userId
      ? await pool.query('SELECT * FROM running_sessions WHERE id = $1 AND user_id = $2', [id, userId])
      : await pool.query('SELECT * FROM running_sessions WHERE id = $1', [id]);
    return result.rows[0] ? mapSession(result.rows[0]) : null;
  } catch (err) {
    throw new DatabaseError('Failed to fetch session', err);
  }
}

export async function listSessionsByUser(
  userId: string,
  opts: { status?: string; from?: string; to?: string; limit?: number; offset?: number } = {}
): Promise<RunningSession[]> {
  try {
    const conditions = ['user_id = $1'];
    const params: unknown[] = [userId];
    let idx = 2;

    if (opts.status) {
      conditions.push(`status = $${idx++}`);
      params.push(opts.status);
    }
    if (opts.from) {
      conditions.push(`started_at >= $${idx++}`);
      params.push(opts.from);
    }
    if (opts.to) {
      conditions.push(`started_at <= $${idx++}`);
      params.push(opts.to);
    }

    const limit = opts.limit ?? 50;
    const offset = opts.offset ?? 0;
    params.push(limit, offset);

    const result = await pool.query(
      `SELECT * FROM running_sessions WHERE ${conditions.join(' AND ')}
       ORDER BY started_at DESC LIMIT $${idx++} OFFSET $${idx}`,
      params
    );
    return result.rows.map(mapSession);
  } catch (err) {
    throw new DatabaseError('Failed to list sessions', err);
  }
}

export async function updateSessionMetrics(
  id: string,
  userId: string,
  metrics: {
    distance_meters?: number;
    duration_seconds?: number;
    avg_pace_sec_per_km?: number;
    calories?: number;
  }
): Promise<RunningSession> {
  try {
    const result = await pool.query(
      `UPDATE running_sessions SET
        distance_meters = COALESCE($3, distance_meters),
        duration_seconds = COALESCE($4, duration_seconds),
        avg_pace_sec_per_km = COALESCE($5, avg_pace_sec_per_km),
        calories = COALESCE($6, calories),
        updated_at = NOW()
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [
        id,
        userId,
        metrics.distance_meters ?? null,
        metrics.duration_seconds ?? null,
        metrics.avg_pace_sec_per_km ?? null,
        metrics.calories ?? null,
      ]
    );
    if (!result.rows[0]) throw new NotFoundError('Session not found');
    return mapSession(result.rows[0]);
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    throw new DatabaseError('Failed to update metrics', err);
  }
}

export async function appendRoutePoints(
  id: string,
  userId: string,
  points: RoutePoint[]
): Promise<RunningSession> {
  try {
    const result = await pool.query(
      `UPDATE running_sessions SET
        route_points = route_points || $3::jsonb,
        updated_at = NOW()
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId, JSON.stringify(points)]
    );
    if (!result.rows[0]) throw new NotFoundError('Session not found');
    return mapSession(result.rows[0]);
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    throw new DatabaseError('Failed to append points', err);
  }
}

export async function completeSession(
  id: string,
  userId: string,
  endedAt?: string
): Promise<RunningSession> {
  try {
    const result = await pool.query(
      `UPDATE running_sessions SET status = 'completed',
        ended_at = COALESCE($3::timestamptz, NOW()), updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND status = 'active' RETURNING *`,
      [id, userId, endedAt ?? null]
    );
    if (!result.rows[0]) throw new NotFoundError('Active session not found');
    return mapSession(result.rows[0]);
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    throw new DatabaseError('Failed to complete session', err);
  }
}

export async function cancelSession(id: string, userId: string): Promise<RunningSession> {
  try {
    const result = await pool.query(
      `UPDATE running_sessions SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );
    if (!result.rows[0]) throw new NotFoundError('Session not found');
    return mapSession(result.rows[0]);
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    throw new DatabaseError('Failed to cancel session', err);
  }
}

export async function getSessionStats(): Promise<{
  totalSessions: number;
  totalUsers: number;
  trialUsers: number;
  activeSubscribers: number;
}> {
  try {
    const [sessions, users, trial, active] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS c FROM running_sessions'),
      pool.query('SELECT COUNT(*)::int AS c FROM users'),
      pool.query("SELECT COUNT(*)::int AS c FROM users WHERE subscription_status = 'trial'"),
      pool.query("SELECT COUNT(*)::int AS c FROM users WHERE subscription_status = 'active'"),
    ]);
    return {
      totalSessions: sessions.rows[0].c,
      totalUsers: users.rows[0].c,
      trialUsers: trial.rows[0].c,
      activeSubscribers: active.rows[0].c,
    };
  } catch (err) {
    throw new DatabaseError('Failed to get stats', err);
  }
}
