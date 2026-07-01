'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import type { EffectiveTier, UserSettings } from '@/types';
import { apiFetch } from '@/services/api';
import { ko, en } from '@/i18n';

interface SettingsContextValue {
  language: 'ko' | 'en';
  uiTheme: string;
  fontScale: number;
  heightCm: number;
  weightKg: number;
  effectiveTier: EffectiveTier;
  trialDaysLeft: number;
  subscription_status: string;
  role: string;
  userId: string;
  apiToken: string;
  setLanguage: (l: 'ko' | 'en') => void;
  setUiTheme: (t: string) => void;
  setFontScale: (n: number) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const s = session as Record<string, unknown> | null;
  const apiToken = (s?.apiToken as string) ?? '';
  const userId = (s?.userId as string) ?? '';

  const [language, setLanguageState] = useState<'ko' | 'en'>('ko');
  const [uiTheme, setUiThemeState] = useState('default');
  const [fontScale, setFontScaleState] = useState(100);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);
  const [effectiveTier, setEffectiveTier] = useState<EffectiveTier>('member');
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [subscription_status, setSubscriptionStatus] = useState('trial');
  const [role, setRole] = useState('member');

  const refreshSettings = async () => {
    if (!apiToken || !userId) return;
    try {
      const data = await apiFetch<UserSettings>(`/api/users/${userId}/settings`, { token: apiToken });
      setLanguageState(data.language as 'ko' | 'en');
      setUiThemeState(data.ui_theme);
      setFontScaleState(data.font_scale);
      setHeightCm(Number(data.height_cm));
      setWeightKg(Number(data.weight_kg));
      setEffectiveTier(data.effectiveTier);
      setTrialDaysLeft(data.trialDaysLeft);
      setSubscriptionStatus(data.subscription_status);
      setRole(data.role);
    } catch {
      if (s?.effectiveTier) setEffectiveTier(s.effectiveTier as EffectiveTier);
      if (s?.trialDaysLeft != null) setTrialDaysLeft(s.trialDaysLeft as number);
      if (s?.role) setRole(s.role as string);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, [apiToken, userId]);

  useEffect(() => {
    document.documentElement.style.fontSize = fontScale === 100 ? '' : `${fontScale}%`;
    const root = document.getElementById('running-crew-root');
    if (root) {
      root.className = uiTheme !== 'default' ? `theme-${uiTheme}` : '';
    }
  }, [fontScale, uiTheme]);

  const t = (key: string, vars?: Record<string, string | number>) => {
    const dict = language === 'ko' ? ko : en;
    let text = dict[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  const persistSettings = async (patch: Record<string, unknown>) => {
    if (!apiToken || !userId) return;
    await apiFetch(`/api/users/${userId}/settings`, {
      method: 'PATCH',
      token: apiToken,
      body: JSON.stringify(patch),
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        uiTheme,
        fontScale,
        heightCm,
        weightKg,
        effectiveTier,
        trialDaysLeft,
        subscription_status,
        role,
        userId,
        apiToken,
        setLanguage: (l) => {
          setLanguageState(l);
          persistSettings({ language: l });
        },
        setUiTheme: (th) => {
          setUiThemeState(th);
          persistSettings({ ui_theme: th });
        },
        setFontScale: (n) => {
          setFontScaleState(n);
          persistSettings({ font_scale: n });
        },
        t,
        refreshSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
