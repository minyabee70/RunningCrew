import type { EffectiveTier, User } from '../types';

const TRIAL_DAYS = 10;

export function daysSince(date: Date | null): number {
  if (!date) return Infinity;
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

export function trialDaysLeft(user: User): number {
  if (!user.trial_started_at) return 0;
  return Math.max(0, TRIAL_DAYS - daysSince(user.trial_started_at));
}

export function resolveEffectiveTier(user: User): EffectiveTier {
  if (user.role === 'creator' || user.role === 'admin') return 'admin';
  if (user.subscription_status === 'active') {
    if (user.subscription_expires_at && new Date(user.subscription_expires_at) < new Date()) {
      return 'member';
    }
    return 'subscriber';
  }
  if (user.subscription_status === 'trial') {
    return trialDaysLeft(user) > 0 ? 'subscriber' : 'member';
  }
  return 'member';
}

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
