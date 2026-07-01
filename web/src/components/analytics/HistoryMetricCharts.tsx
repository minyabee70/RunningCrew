'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { TrendSession } from '@/types/analytics';
import { formatPace } from '@/utils/date';

export function HistoryMetricCharts({ sessions }: { sessions: TrendSession[] }) {
  const data = [...sessions]
    .sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime())
    .map((s) => ({
      date: new Date(s.started_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      distance: Number(s.distance_meters) / 1000,
      pace: s.avg_pace_sec_per_km ? s.avg_pace_sec_per_km / 60 : 0,
    }));

  if (data.length < 2) {
    return <p className="text-sm text-[var(--rc-muted)]">비교하려면 2개 이상의 세션이 필요합니다.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Chart title="거리 추이 (km)">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" />
          <XAxis dataKey="date" tick={{ fill: '#8b949e', fontSize: 11 }} />
          <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} />
          <Tooltip contentStyle={{ background: '#1a1f26', border: '1px solid #2d333b' }} />
          <Line type="monotone" dataKey="distance" stroke="#22c55e" strokeWidth={2} />
        </LineChart>
      </Chart>
      <Chart title="평균 페이스 (분/km)">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" />
          <XAxis dataKey="date" tick={{ fill: '#8b949e', fontSize: 11 }} />
          <YAxis reversed tick={{ fill: '#8b949e', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: '#1a1f26', border: '1px solid #2d333b' }}
            formatter={(v: number) => formatPace(v * 60)}
          />
          <Line type="monotone" dataKey="pace" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </Chart>
    </div>
  );
}

function Chart({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)]">
      <p className="text-sm font-medium mb-2">{title}</p>
      <ResponsiveContainer width="100%" height={180}>{children}</ResponsiveContainer>
    </div>
  );
}
