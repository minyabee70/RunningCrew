import pool from '../config/database';
import { DatabaseError, NotFoundError } from '../errors/AppError';
import type { User } from '../types';
import { resolveEffectiveTier } from './subscriptionService';
import jwt from 'jsonwebtoken';
import type { AuthPayload } from '../types';

const CREATOR_EMAIL = process.env.CREATOR_EMAIL ?? 'minyabee70@gmail.com';

function mapUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    google_id: row.google_id as string,
    email: row.email as string,
    display_name: row.display_name as string | null,
    role: row.role as User['role'],
    trial_started_at: row.trial_started_at as Date | null,
    subscription_status: row.subscription_status as User['subscription_status'],
    subscription_expires_at: row.subscription_expires_at as Date | null,
    language: row.language as string,
    ui_theme: row.ui_theme as string,
    font_scale: Number(row.font_scale),
    height_cm: Number(row.height_cm),
    weight_kg: Number(row.weight_kg),
    created_at: row.created_at as Date,
    updated_at: row.updated_at as Date,
  };
}

export async function findByGoogleId(googleId: string): Promise<User | null> {
  try {
    const result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  } catch (err) {
    throw new DatabaseError('Failed to find user', err);
  }
}

export async function findById(id: string): Promise<User | null> {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  } catch (err) {
    throw new DatabaseError('Failed to find user', err);
  }
}

export async function syncGoogleUser(data: {
  googleId: string;
  email: string;
  displayName: string;
}): Promise<{ user: User; token: string }> {
  try {
    const adminCheck = await pool.query(
      'SELECT 1 FROM designated_admins WHERE google_id = $1',
      [data.googleId]
    );
    const isDesignatedAdmin = adminCheck.rows.length > 0;
    const isCreator = data.email === CREATOR_EMAIL;

    let role = 'member';
    if (isCreator) role = 'creator';
    else if (isDesignatedAdmin) role = 'admin';

    const existing = await findByGoogleId(data.googleId);

    let user: User;
    if (existing) {
      const result = await pool.query(
        `UPDATE users SET email = $2, display_name = $3,
         role = CASE WHEN role IN ('creator', 'admin') THEN role ELSE $4 END,
         updated_at = NOW()
         WHERE google_id = $1 RETURNING *`,
        [data.googleId, data.email, data.displayName, role]
      );
      user = mapUser(result.rows[0]);
    } else {
      const result = await pool.query(
        `INSERT INTO users (google_id, email, display_name, role, trial_started_at, subscription_status)
         VALUES ($1, $2, $3, $4, NOW(), 'trial') RETURNING *`,
        [data.googleId, data.email, data.displayName, role]
      );
      user = mapUser(result.rows[0]);
    }

    const effectiveTier = resolveEffectiveTier(user);
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      effectiveTier,
    });

    return { user, token };
  } catch (err) {
    if (err instanceof DatabaseError) throw err;
    throw new DatabaseError('Failed to sync user', err);
  }
}

export function signToken(payload: AuthPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.verify(token, secret) as AuthPayload;
}

export async function updateSettings(
  userId: string,
  settings: Partial<Pick<User, 'language' | 'ui_theme' | 'font_scale'>>
): Promise<User> {
  try {
    const result = await pool.query(
      `UPDATE users SET
        language = COALESCE($2, language),
        ui_theme = COALESCE($3, ui_theme),
        font_scale = COALESCE($4, font_scale),
        updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [userId, settings.language ?? null, settings.ui_theme ?? null, settings.font_scale ?? null]
    );
    if (!result.rows[0]) throw new NotFoundError('User not found');
    return mapUser(result.rows[0]);
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    throw new DatabaseError('Failed to update settings', err);
  }
}

export async function updateBiometrics(
  userId: string,
  data: { height_cm?: number; weight_kg?: number }
): Promise<User> {
  try {
    const result = await pool.query(
      `UPDATE users SET
        height_cm = COALESCE($2, height_cm),
        weight_kg = COALESCE($3, weight_kg),
        updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [userId, data.height_cm ?? null, data.weight_kg ?? null]
    );
    if (!result.rows[0]) throw new NotFoundError('User not found');
    return mapUser(result.rows[0]);
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    throw new DatabaseError('Failed to update biometrics', err);
  }
}

export async function listAllUsers(): Promise<User[]> {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows.map(mapUser);
  } catch (err) {
    throw new DatabaseError('Failed to list users', err);
  }
}

export async function updateSubscription(
  userId: string,
  status: string,
  expiresAt?: string | null
): Promise<User> {
  try {
    const result = await pool.query(
      `UPDATE users SET subscription_status = $2,
        subscription_expires_at = $3, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [userId, status, expiresAt ?? null]
    );
    if (!result.rows[0]) throw new NotFoundError('User not found');
    return mapUser(result.rows[0]);
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    throw new DatabaseError('Failed to update subscription', err);
  }
}
