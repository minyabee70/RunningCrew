'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import type { EnrichedRoutePoint } from '@/types/analytics';
import { normalizeMetrics } from '@/utils/metrics';

const METRICS = [
  { key: 'pace_sec_per_km', label: '페이스', color: '#3b82f6' },
  { key: 'speed_kmh', label: '속도', color: '#22c55e' },
  { key: 'altitude', label: '고도', color: '#a16207' },
] as const;

export function MetricOverlayChart({ points }: { points: EnrichedRoutePoint[] }) {
  const [selected, setSelected] = useState<string[]>(['pace_sec_per_km', 'speed_kmh']);

  const raw = points.map((p) => ({
    distance_m: p.distance_m,
    pace_sec_per_km: p.pace_sec_per_km ?? 0,
    speed_kmh: p.speed_kmh ?? 0,
    altitude: p.altitude ?? 0,
  }));
  const normalized = normalizeMetrics(raw, ['pace_sec_per_km', 'speed_kmh', 'altitude']);

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? (prev.length > 1 ? prev.filter((k) => k !== key) : prev) : [...prev, key]
    );
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)]">
      <div className="flex gap-2 flex-wrap">
        {METRICS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => toggle(m.key)}
            className={`px-2 py-1 text-xs rounded border ${
              selected.includes(m.key) ? 'bg-[var(--rc-accent)]/30' : 'border-[var(--rc-border)]'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={normalized}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" />
          <XAxis dataKey="distance_m" tick={{ fill: '#8b949e', fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fill: '#8b949e', fontSize: 11 }} />
          <Tooltip contentStyle={{ background: '#1a1f26', border: '1px solid #2d333b' }} />
          <Legend />
          {selected.map((key) => {
            const m = METRICS.find((x) => x.key === key);
            return (
              <Area
                key={key}
                type="monotone"
                dataKey={`${key}_norm`}
                name={m?.label ?? key}
                stroke={m?.color}
                fill={`${m?.color}33`}
                dot={false}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
