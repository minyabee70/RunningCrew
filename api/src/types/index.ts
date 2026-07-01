export type UserRole = 'member' | 'subscriber' | 'admin' | 'creator';
export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'free';
export type EffectiveTier = 'member' | 'subscriber' | 'admin';
export type SessionStatus = 'active' | 'completed' | 'cancelled';

export interface RoutePoint {
  lat: number;
  lng: number;
  recorded_at: string;
  altitude?: number;
  speed_kmh?: number;
  heart_rate?: number;
  cadence?: number;
  vertical_oscillation?: number;
}

export interface User {
  id: string;
  google_id: string;
  email: string;
  display_name: string | null;
  role: UserRole;
  trial_started_at: Date | null;
  subscription_status: SubscriptionStatus;
  subscription_expires_at: Date | null;
  language: string;
  ui_theme: string;
  font_scale: number;
  height_cm: number;
  weight_kg: number;
  created_at: Date;
  updated_at: Date;
}

export interface RunningSession {
  id: string;
  user_id: string;
  status: SessionStatus;
  started_at: Date;
  ended_at: Date | null;
  distance_meters: number;
  duration_seconds: number;
  avg_pace_sec_per_km: number | null;
  route_points: RoutePoint[];
  calories: number;
  heart_rate_avg: number | null;
  cadence_avg: number | null;
  vertical_oscillation_avg: number | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface AiAnalysis {
  id: string;
  session_id: string;
  analysis_type: string;
  summary: string;
  insights: Record<string, unknown>;
  model_version: string;
  created_at: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
  effectiveTier: EffectiveTier;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
