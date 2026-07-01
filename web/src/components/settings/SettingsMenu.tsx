'use client';

import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';
import { FontScaleControl } from './FontScaleControl';
import { BiometricsModal } from './BiometricsModal';
import { useSettings } from '@/context/SettingsProvider';

export function SettingsMenu() {
  const {
    effectiveTier,
    trialDaysLeft,
    subscription_status,
    t,
  } = useSettings();

  return (
    <div className="space-y-6">
      <section className="space-y-2 pb-4 border-b border-[var(--rc-border)]">
        <h2 className="font-semibold">{t('settings.subscription')}</h2>
        <p className="text-sm text-[var(--rc-muted)]">
          {effectiveTier} · {subscription_status}
          {subscription_status === 'trial' && ` · D-${trialDaysLeft}`}
        </p>
      </section>
      <section className="space-y-3 pb-4 border-b border-[var(--rc-border)]">
        <h2 className="font-semibold">{t('settings.language')}</h2>
        <LanguageSelector />
      </section>
      <section className="space-y-3 pb-4 border-b border-[var(--rc-border)]">
        <h2 className="font-semibold">{t('settings.theme')}</h2>
        <ThemeSelector />
      </section>
      <section className="space-y-3 pb-4 border-b border-[var(--rc-border)]">
        <h2 className="font-semibold">{t('settings.font')}</h2>
        <FontScaleControl />
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">{t('settings.biometrics')}</h2>
        <BiometricsModal />
      </section>
    </div>
  );
}
