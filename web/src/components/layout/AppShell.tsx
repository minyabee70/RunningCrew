'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSettings } from '@/context/SettingsProvider';
import { apiFetch } from '@/services/api';
import type { RunningSession } from '@/types';
import { SidebarNav } from './SidebarNav';
import { TopBar } from './TopBar';
import { MobileTabBar } from './MobileTabBar';
import { CommandPalette, useCommandPalette } from './CommandPalette';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const { apiToken, userId } = useSettings();
  const { open, setOpen } = useCommandPalette();
  const [weekKm, setWeekKm] = useState(0);

  useEffect(() => {
    if (!apiToken || !userId) return;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    apiFetch<RunningSession[]>(
      `/api/users/${userId}/sessions?status=completed&from=${weekAgo.toISOString()}`,
      { token: apiToken }
    )
      .then((list) => {
        const km = list.reduce((a, s) => a + Number(s.distance_meters), 0) / 1000;
        setWeekKm(km);
      })
      .catch(() => setWeekKm(0));
  }, [apiToken, userId]);

  if (pathname === '/login' || pathname === '/privacy' || pathname === '/terms') {
    return <>{children}</>;
  }

  return (
    <div id="running-crew-root" className="min-h-screen flex flex-col bg-[var(--rc-bg)]">
      <TopBar onOpenCommand={() => setOpen(true)} />
      <div className="flex flex-1 min-h-0">
        <SidebarNav weekKm={weekKm} />
        <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">{children}</main>
      </div>
      <MobileTabBar />
      <CommandPalette open={open} onOpenChange={setOpen} />
    </div>
  );
}
