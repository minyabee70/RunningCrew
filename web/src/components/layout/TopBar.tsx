'use client';

import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { useSettings } from '@/context/SettingsProvider';
import { TrialBanner } from '@/components/auth/PremiumLockCard';
import { Badge } from '@/components/ui/Badge';
import { LanguageSelector } from '@/components/settings/LanguageSelector';
import { ThemeSelector } from '@/components/settings/ThemeSelector';

export function TopBar({ onOpenCommand }: { onOpenCommand: () => void }) {
  const { effectiveTier, subscription_status, trialDaysLeft, t } = useSettings();

  return (
    <>
      <TrialBanner />
      <header className="flex items-center gap-3 px-4 py-3 border-b border-[var(--rc-border)] bg-[var(--rc-surface)] md:px-6">
        <Link href="/" className="md:hidden font-bold text-[var(--rc-accent)]">
          RunningCrew
        </Link>
        <button
          type="button"
          onClick={onOpenCommand}
          className="flex-1 max-w-md flex items-center gap-2 px-3 py-2 rounded-[var(--rc-radius)] border border-[var(--rc-border)] bg-[var(--rc-bg)] text-sm text-[var(--rc-muted)] hover:border-[var(--rc-accent)]/50"
        >
          <Search size={16} />
          <span>{t('cmd.search')}</span>
          <kbd className="ml-auto hidden sm:inline text-xs px-1.5 py-0.5 rounded border border-[var(--rc-border)]">
            ⌘K
          </kbd>
        </button>
        <div className="hidden lg:flex items-center gap-2">
          <LanguageSelector />
          <ThemeSelector />
        </div>
        <div className="flex items-center gap-2">
          {subscription_status === 'trial' && trialDaysLeft > 0 && (
            <Badge label={t('trial.remaining', { days: trialDaysLeft })} />
          )}
          <Badge label={effectiveTier} />
          <div className="w-8 h-8 rounded-full bg-[var(--rc-accent)]/20 flex items-center justify-center">
            <User size={16} className="text-[var(--rc-accent)]" />
          </div>
        </div>
      </header>
    </>
  );
}
