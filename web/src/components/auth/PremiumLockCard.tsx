'use client';

import { useState } from 'react';
import { useSettings } from '@/context/SettingsProvider';

export function PremiumLockCard({ feature }: { feature?: string }) {
  const { t } = useSettings();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="relative rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)] p-8 text-center">
        <div className="absolute inset-0 backdrop-blur-sm bg-black/40 rounded-xl flex flex-col items-center justify-center gap-3">
          <p className="text-lg font-semibold">{t('premium.title')}</p>
          <p className="text-sm text-[var(--rc-muted)] max-w-xs">{t('premium.desc')}</p>
          {feature && <p className="text-xs text-[var(--rc-accent)]">{feature}</p>}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="mt-2 px-4 py-2 rounded-lg bg-[var(--rc-accent)] text-white text-sm"
          >
            {t('premium.cta')}
          </button>
        </div>
        <div className="opacity-30 h-32" />
      </div>
      {showModal && <SubscriptionModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export function SubscriptionModal({ onClose }: { onClose: () => void }) {
  const { t } = useSettings();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[var(--rc-surface)] border border-[var(--rc-border)] rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">{t('subscription.title')}</h2>
        <p className="text-[var(--rc-muted)] mb-6">{t('subscription.desc')}</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-lg border border-[var(--rc-border)]"
        >
          {t('subscription.close')}
        </button>
      </div>
    </div>
  );
}

export function TrialBanner() {
  const { trialDaysLeft, effectiveTier, subscription_status, t } = useSettings();
  if (effectiveTier === 'admin') return null;
  if (subscription_status === 'active') return null;

  const isTrial = subscription_status === 'trial' && trialDaysLeft > 0;
  return (
    <div
      className={`text-center text-sm py-1.5 px-3 ${
        isTrial ? 'bg-[var(--rc-accent)]/20 text-[var(--rc-accent)]' : 'bg-[var(--rc-warning)]/20 text-[var(--rc-warning)]'
      }`}
    >
      {isTrial ? t('trial.remaining', { days: trialDaysLeft }) : t('trial.expired')}
    </div>
  );
}
