'use client';

import { useSettings } from '@/context/SettingsProvider';

export function useFontScale() {
  const { fontScale, setFontScale } = useSettings();
  return {
    fontScale,
    increase: () => setFontScale(Math.min(140, fontScale + 10)),
    decrease: () => setFontScale(Math.max(80, fontScale - 10)),
    reset: () => setFontScale(100),
  };
}
