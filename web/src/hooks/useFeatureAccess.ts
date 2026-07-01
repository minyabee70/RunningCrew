'use client';

import { useSettings } from '@/context/SettingsProvider';
import { canAccessFeature, type FeatureKey } from '@/types';

export function useFeatureAccess(feature: FeatureKey): boolean {
  const { effectiveTier } = useSettings();
  return canAccessFeature(effectiveTier, feature);
}
