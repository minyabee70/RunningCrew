export type EffectiveTier = 'member' | 'subscriber' | 'admin';

export type FeatureKey =
  | 'journal'
  | 'analysis_basic'
  | 'analysis_precision'
  | 'analysis_advanced'
  | 'history_basic'
  | 'history_advanced'
  | 'admin_users'
  | 'admin_stats';

const FEATURE_TIERS: Record<FeatureKey, EffectiveTier> = {
  journal: 'member',
  analysis_basic: 'member',
  analysis_precision: 'subscriber',
  analysis_advanced: 'subscriber',
  history_basic: 'member',
  history_advanced: 'subscriber',
  admin_users: 'admin',
  admin_stats: 'admin',
};

const TIER_RANK: Record<EffectiveTier, number> = {
  member: 0,
  subscriber: 1,
  admin: 2,
};

export function canAccessFeature(tier: EffectiveTier, feature: FeatureKey): boolean {
  return TIER_RANK[tier] >= TIER_RANK[FEATURE_TIERS[feature]];
}

export interface RunningSession {
  id: string;
  user_id: string;
  status: string;
  started_at: string;
  ended_at: string | null;
  distance_meters: number;
  duration_seconds: number;
  avg_pace_sec_per_km: number | null;
  route_points: Array<{
    lat: number;
    lng: number;
    recorded_at: string;
    altitude?: number;
    speed_kmh?: number;
    heart_rate?: number;
    cadence?: number;
    vertical_oscillation?: number;
  }>;
  calories: number;
  heart_rate_avg?: number | null;
  cadence_avg?: number | null;
}

export interface UserSettings {
  language: string;
  ui_theme: string;
  font_scale: number;
  height_cm: number;
  weight_kg: number;
  effectiveTier: EffectiveTier;
  trialDaysLeft: number;
  subscription_status: string;
  role: string;
}
