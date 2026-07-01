'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Activity, TrendingUp, Settings, Shield } from 'lucide-react';
import { useSettings } from '@/context/SettingsProvider';
import { ProgressMeter } from '@/components/ui/ProgressMeter';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: LayoutDashboard, key: 'nav.dashboard' },
  { href: '/sessions', icon: Activity, key: 'nav.sessions' },
  { href: '/history', icon: TrendingUp, key: 'nav.history' },
  { href: '/settings', icon: Settings, key: 'nav.settings' },
];

export function SidebarNav({ weekKm = 0, weekGoalKm = 50 }: { weekKm?: number; weekGoalKm?: number }) {
  const pathname = usePathname();
  const { t, role } = useSettings();
  const isAdmin = role === 'creator' || role === 'admin';

  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-[var(--rc-border)] bg-[var(--rc-surface)] p-4 gap-1 min-h-full">
      <Link href="/" className="text-lg font-bold mb-4 px-2 hover:text-[var(--rc-accent)]">
        RunningCrew
      </Link>
      {navItems.map(({ href, icon: Icon, key }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-[var(--rc-radius)] text-sm transition-colors',
              active
                ? 'bg-[var(--rc-accent)]/20 text-[var(--rc-accent)]'
                : 'text-[var(--rc-muted)] hover:bg-white/5 hover:text-[var(--rc-text)]'
            )}
          >
            <Icon size={18} />
            {t(key)}
          </Link>
        );
      })}
      {isAdmin && (
        <>
          <Link
            href="/admin/users"
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-[var(--rc-radius)] text-sm',
              pathname.startsWith('/admin')
                ? 'bg-[var(--rc-accent)]/20 text-[var(--rc-accent)]'
                : 'text-[var(--rc-muted)] hover:bg-white/5'
            )}
          >
            <Shield size={18} />
            {t('nav.admin')}
          </Link>
        </>
      )}
      <div className="mt-auto pt-4 border-t border-[var(--rc-border)]">
        <ProgressMeter label={t('dashboard.weekGoal')} value={weekKm} max={weekGoalKm} unit="km" />
      </div>
    </aside>
  );
}
