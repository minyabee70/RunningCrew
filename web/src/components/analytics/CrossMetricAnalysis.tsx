'use client';

import { useState } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { EnrichedRoutePoint } from '@/types/analytics';
import { calcCaloriesPerKm, calcElevationPaceImpact, calcPaceConsistency } from '@/utils/metrics';

type CrossMode = 'pace-distance' | 'pace-elevation' | 'calories-efficiency' | 'pace-consistency';

const MODES: { id: CrossMode; label: string }[] = [
  { id: 'pace-distance', label: '페이스·거리' },
  { id: 'pace-elevation', label: '페이스·고도' },
  { id: 'calories-efficiency', label: '칼로리 효율' },
  { id: 'pace-consistency', label: '페이스 일관성' },
];

export function CrossMetricAnalysis({
  points,
  calories,
  distanceM,
}: {
  points: EnrichedRoutePoint[];
  calories: number;
  distanceM: number;
}) {
  const [mode, setMode] = useState<CrossMode>('pace-distance');

  const segmentData = points
    .filter((_, i) => i % Math.max(1, Math.floor(points.length / 30)) === 0)
    .map((p) => ({
      dist: Math.round(p.distance_m),
      pace: p.pace_sec_per_km ? p.pace_sec_per_km / 60 : 0,
      elevation: p.altitude ?? 0,
    }));

  const paces = points.map((p) => p.pace_sec_per_km ?? 0).filter((p) => p > 0);
  const consistency = calcPaceConsistency(paces);
  const elevImpact = calcElevationPaceImpact(
    points.map((p) => p.pace_sec_per_km ?? 0),
    points.map((p) => p.altitude ?? 0)
  );
  const calPerKm = calcCaloriesPerKm(calories, distanceM);

  return (
    <div className="space-y-4 p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)]">
      <div className="flex gap-2 flex-wrap">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`px-2 py-1 text-xs rounded border ${
              mode === m.id ? 'bg-[var(--rc-accent)]/30' : 'border-[var(--rc-border)]'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <Kpi label="페이스 일관성" value={`${consistency}%`} />
        <Kpi label="오르막 페이스 영향" value={`${elevImpact}%`} />
        <Kpi label="km당 칼로리" value={`${calPerKm} kcal`} />
      </div>
      <ResponsiveContainer width="100%" height={240}>
        {mode === 'calories-efficiency' ? (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" />
            <XAxis dataKey="dist" name="거리(m)" tick={{ fill: '#8b949e', fontSize: 11 }} />
            <YAxis dataKey="pace" name="페이스" tick={{ fill: '#8b949e', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#1a1f26', border: '1px solid #2d333b' }} />
            <Scatter data={segmentData} fill="#3b82f6" />
          </ScatterChart>
        ) : (
          <ComposedChart data={segmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" />
            <XAxis dataKey="dist" tick={{ fill: '#8b949e', fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fill: '#8b949e', fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#8b949e', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#1a1f26', border: '1px solid #2d333b' }} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="pace" stroke="#3b82f6" dot={false} name="페이스" />
            {mode === 'pace-distance' && (
              <Bar yAxisId="right" dataKey="dist" fill="#22c55e55" name="거리" />
            )}
            {mode === 'pace-elevation' && (
              <Area yAxisId="right" type="monotone" dataKey="elevation" fill="#a1620733" stroke="#a16207" name="고도" />
            )}
            {mode === 'pace-consistency' && (
              <Bar yAxisId="right" dataKey="pace" fill="#8b5cf655" name="구간 페이스" />
            )}
          </ComposedChart>
        )}
      </ResponsiveContainer>
      <p className="text-xs text-[var(--rc-muted)]">
        규칙 기반 교차분석 — DB 메트릭만 사용 (Gemini 미호출)
      </p>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 rounded-lg bg-black/20">
      <p className="text-[var(--rc-muted)] text-xs">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
