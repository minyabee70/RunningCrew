'use client';

import type { MapColorMetric } from '@/utils/routeColorScale';
import { METRIC_COLOR_LEVELS } from '@/utils/routeColorScale';

const METRIC_LABELS: Record<MapColorMetric, string> = {
  speed: '속도',
  heart_rate: '심박',
  cadence: '케이던스',
  vertical_oscillation: '진폭',
  pace: '페이스',
  elevation: '고도',
};

interface MetricColorSelectorProps {
  value: MapColorMetric;
  onChange: (m: MapColorMetric) => void;
}

export function MetricColorSelector({ value, onChange }: MetricColorSelectorProps) {
  const metrics = Object.keys(METRIC_LABELS) as MapColorMetric[];
  return (
    <div className="flex gap-2 flex-wrap">
      {metrics.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`px-2 py-1 text-xs rounded border ${
            value === m ? 'bg-[var(--rc-accent)]/30 border-[var(--rc-accent)]' : 'border-[var(--rc-border)]'
          }`}
        >
          {METRIC_LABELS[m]}
        </button>
      ))}
    </div>
  );
}

export function RouteMapLegend({ metric }: { metric: MapColorMetric }) {
  const levels = METRIC_COLOR_LEVELS[metric];
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {levels.map((l) => (
        <span key={l.label} className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ background: l.color }} />
          {l.label}
        </span>
      ))}
    </div>
  );
}
