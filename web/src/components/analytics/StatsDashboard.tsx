'use client';

import type { TrendSession } from '@/types/analytics';
import { formatDuration } from '@/utils/date';

export function StatsDashboard({ sessions }: { sessions: TrendSession[] }) {
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const weekSessions = sessions.filter((s) => new Date(s.started_at).getTime() >= weekAgo);
  const weekDistance = weekSessions.reduce((a, s) => a + Number(s.distance_meters), 0);
  const totalDuration = sessions.reduce((a, s) => a + (s.duration_seconds ?? 0), 0);
  const weekGoalKm = 20;
  const weekProgress = Math.min(100, Math.round((weekDistance / 1000 / weekGoalKm) * 100));

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card label="주간 거리" value={`${(weekDistance / 1000).toFixed(1)} km`} sub={`목표 ${weekGoalKm}km · ${weekProgress}%`} />
      <Card label="주간 세션" value={String(weekSessions.length)} />
      <Card label="총 세션" value={String(sessions.length)} />
      <Card label="총 운동 시간" value={formatDuration(totalDuration)} />
    </div>
  );
}

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)]">
      <p className="text-xs text-[var(--rc-muted)]">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      {sub && <p className="text-xs text-[var(--rc-muted)] mt-1">{sub}</p>}
    </div>
  );
}
