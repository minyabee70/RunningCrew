'use client';

import { SessionProvider } from 'next-auth/react';
import { SettingsProvider } from '@/context/SettingsProvider';
import { AppShell } from '@/components/layout/AppShell';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SettingsProvider>
        <AppShell>{children}</AppShell>
      </SettingsProvider>
    </SessionProvider>
  );
}
