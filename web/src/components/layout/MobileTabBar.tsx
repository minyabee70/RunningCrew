'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Activity, TrendingUp, Settings } from 'lucide-react';
import { useSettings } from '@/context/SettingsProvider';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', icon: LayoutDashboard, key: 'nav.dashboard' },
  { href: '/sessions', icon: Activity, key: 'nav.sessions' },
  { href: '/history', icon: TrendingUp, key: 'nav.history' },
  { href: '/settings', icon: Settings, key: 'nav.settings' },
];

export function MobileTabBar() {
  const pathname = usePathname() ?? '';
  const { t } = useSettings();

  return (
    <nav className="md:hidden flex border-t border-[var(--rc-border)] bg-[var(--rc-surface)] safe-area-pb">
      {tabs.map(({ href, icon: Icon, key }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center py-2 text-xs gap-0.5',
              active ? 'text-[var(--rc-accent)]' : 'text-[var(--rc-muted)]'
            )}
          >
            <Icon size={20} />
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
}
