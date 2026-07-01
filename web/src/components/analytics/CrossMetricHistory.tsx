'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import type { TrendSession } from '@/types/analytics';
import { calcCaloriesPerKm } from '@/utils/metrics';

export function CrossMetricHistory({ sessions }: { sessions: TrendSession[] }) {
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
  );
  if (sorted.length < 2) {
    return <p className="text-sm text-[var(--rc-muted)]">교차 분석에는 2개 이상 세션이 필요합니다.</p>;
  }

  const data = sorted.map((s) => ({
    date: new Date(s.started_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    distance: Number(s.distance_meters) / 1000,
    pace: s.avg_pace_sec_per_km ? s.avg_pace_sec_per_km / 60 : 0,
    calPerKm: calcCaloriesPerKm(s.calories ?? 0, Number(s.distance_meters)),
  }));

  const first = data[0];
  const last = data[data.length - 1];
  const paceChange = first.pace && last.pace ? Math.round(((last.pace - first.pace) / first.pace) * 100) : 0;

  return (
    <div className="space-y-3 p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)]">
      <p className="text-sm">
        첫 세션 대비 페이스 변화: <strong>{paceChange > 0 ? '+' : ''}{paceChange}%</strong>
        {paceChange < 0 ? ' (개선)' : paceChange > 0 ? ' (느려짐)' : ''}
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" />
          <XAxis dataKey="date" tick={{ fill: '#8b949e', fontSize: 11 }} />
          <YAxis yAxisId="left" tick={{ fill: '#8b949e', fontSize: 11 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#8b949e', fontSize: 11 }} />
          <Tooltip contentStyle={{ background: '#1a1f26', border: '1px solid #2d333b' }} />
          <Legend />
          <Bar yAxisId="left" dataKey="distance" fill="#22c55e55" name="거리(km)" />
          <Line yAxisId="right" type="monotone" dataKey="pace" stroke="#3b82f6" name="페이스" dot />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
