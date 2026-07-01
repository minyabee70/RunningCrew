'use client';

import { useEffect, useState } from 'react';
import { useSettings } from '@/context/SettingsProvider';
import { apiFetch } from '@/services/api';

export default function AdminStatsPage() {
  const { apiToken, role } = useSettings();
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    if (!apiToken || (role !== 'creator' && role !== 'admin')) return;
    apiFetch<Record<string, number>>('/api/admin/stats', { token: apiToken })
      .then(setStats)
      .catch(console.error);
  }, [apiToken, role]);

  if (role !== 'creator' && role !== 'admin') {
    return <p>접근 권한이 없습니다.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">플랫폼 통계</h1>
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="총 사용자" value={stats.totalUsers} />
          <Stat label="총 세션" value={stats.totalSessions} />
          <Stat label="체험 중" value={stats.trialUsers} />
          <Stat label="유료 구독" value={stats.activeSubscribers} />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)]">
      <p className="text-sm text-[var(--rc-muted)]">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
