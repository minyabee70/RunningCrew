'use client';

import type { EnrichedRoutePoint } from '@/types/analytics';
import { getColorForValue, type MapColorMetric } from '@/utils/routeColorScale';

export function RunningRouteHeatmap({
  points,
  metric = 'pace',
  width = 320,
  height = 120,
}: {
  points: EnrichedRoutePoint[];
  metric?: MapColorMetric;
  width?: number;
  height?: number;
}) {
  if (points.length < 2) return null;

  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng || 1)) * (width - 20) + 10;
  const toY = (lat: number) => height - (((lat - minLat) / (maxLat - minLat || 1)) * (height - 20) + 10);

  const segments = [];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const val =
      metric === 'pace'
        ? (curr.pace_sec_per_km ?? 420)
        : metric === 'speed'
          ? (curr.speed_kmh ?? 8)
          : (curr.heart_rate ?? 140);
    segments.push(
      <line
        key={i}
        x1={toX(prev.lng)}
        y1={toY(prev.lat)}
        x2={toX(curr.lng)}
        y2={toY(curr.lat)}
        stroke={getColorForValue(metric, val)}
        strokeWidth={4}
        strokeLinecap="round"
      />
    );
  }

  return (
    <div className="p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)]">
      <p className="text-sm font-medium mb-2">경로 스트레스 히트맵</p>
      <svg width={width} height={height} className="w-full max-w-md">
        <rect width={width} height={height} fill="#0f1419" rx={8} />
        {segments}
      </svg>
    </div>
  );
}
