'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { EnrichedRoutePoint } from '@/types/analytics';

interface SessionChartsPanelProps {
  points: EnrichedRoutePoint[];
}

export function SessionChartsPanel({ points }: SessionChartsPanelProps) {
  const chartData = points.map((p) => ({
    dist: Math.round(p.distance_m),
    pace: p.pace_sec_per_km ? p.pace_sec_per_km / 60 : null,
    elevation: p.altitude ?? null,
    speed: p.speed_kmh ?? null,
  }));

  if (chartData.length < 2) {
    return <p className="text-sm text-[var(--rc-muted)]">차트 데이터가 부족합니다.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ChartCard title="페이스 (분/km)">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" />
            <XAxis dataKey="dist" tick={{ fill: '#8b949e', fontSize: 11 }} unit="m" />
            <YAxis reversed tick={{ fill: '#8b949e', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#1a1f26', border: '1px solid #2d333b' }} />
            <Line type="monotone" dataKey="pace" stroke="#3b82f6" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="누적 거리">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" />
            <XAxis dataKey="dist" tick={{ fill: '#8b949e', fontSize: 11 }} />
            <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#1a1f26', border: '1px solid #2d333b' }} />
            <Area type="monotone" dataKey="dist" stroke="#22c55e" fill="#22c55e33" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
      {chartData.some((d) => d.elevation != null) && (
        <ChartCard title="고도">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" />
              <XAxis dataKey="dist" tick={{ fill: '#8b949e', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} />
              <Area type="monotone" dataKey="elevation" stroke="#a16207" fill="#a1620733" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)]">
      <p className="text-sm mb-2 font-medium">{title}</p>
      {children}
    </div>
  );
}
