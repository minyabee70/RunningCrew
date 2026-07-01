'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSettings } from '@/context/SettingsProvider';
import { apiFetch } from '@/services/api';
import type { RunningSession } from '@/types';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressMeter } from '@/components/ui/ProgressMeter';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { MiniRouteSvg } from '@/components/analytics/MiniRouteSvg';
import { calculateRunningScore } from '@/utils/runningScore';
import { formatPace } from '@/utils/date';

const WEEK_GOAL_KM = 50;

export default function DashboardPage() {
  const { apiToken, userId, t } = useSettings();
  const [sessions, setSessions] = useState<RunningSession[]>([]);

  useEffect(() => {
    if (!apiToken || !userId) return;
    apiFetch<RunningSession[]>(`/api/users/${userId}/sessions?limit=12`, { token: apiToken })
      .then(setSessions)
      .catch(console.error);
  }, [apiToken, userId]);

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekSessions = sessions.filter((s) => new Date(s.started_at).getTime() >= weekAgo);
  const weekKm = weekSessions.reduce((a, s) => a + Number(s.distance_meters), 0) / 1000;
  const totalKm = sessions.reduce((a, s) => a + Number(s.distance_meters), 0) / 1000;
  const paces = sessions.map((s) => s.avg_pace_sec_per_km).filter((p): p is number => !!p && p > 0);
  const avgPace = paces.length ? paces.reduce((a, b) => a + b, 0) / paces.length : null;
  const latestScore = sessions[0] ? calculateRunningScore(sessions[0]).score : '-';

  if (sessions.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('nav.dashboard')}</h1>
        <EmptyState
          title={t('empty.title')}
          description={t('empty.desc')}
          steps={[t('empty.step1'), t('empty.step2'), t('empty.step3')]}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.dashboard')}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('dashboard.totalDistance')} value={`${totalKm.toFixed(1)} km`} />
        <StatCard label={t('dashboard.weekDistance')} value={`${weekKm.toFixed(1)} km`} />
        <StatCard label={t('dashboard.avgPace')} value={formatPace(avgPace)} />
        <StatCard label={t('dashboard.runningScore')} value={String(latestScore)} />
      </div>

      <Card>
        <CardContent>
          <ProgressMeter label={t('dashboard.weekGoal')} value={weekKm} max={WEEK_GOAL_KM} unit="km" />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-3">{t('dashboard.recentSessions')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.slice(0, 6).map((s) => (
            <Link key={s.id} href={`/sessions/${s.id}`}>
              <Card className="hover:border-[var(--rc-accent)]/50 transition-colors h-full">
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">
                      {new Date(s.started_at).toLocaleDateString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <Badge status={s.status} />
                  </div>
                  <MiniRouteSvg points={s.route_points?.slice(0, 50) ?? []} />
                  <p className="text-sm text-[var(--rc-muted)]">
                    {(Number(s.distance_meters) / 1000).toFixed(2)} km · {formatPace(s.avg_pace_sec_per_km)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
