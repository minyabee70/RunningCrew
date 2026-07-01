import type { EnrichedRoutePoint } from '@/types/analytics';

export type MapColorMetric =
  | 'speed'
  | 'heart_rate'
  | 'cadence'
  | 'vertical_oscillation'
  | 'pace'
  | 'elevation';

export interface ColorLevel {
  min: number;
  max: number;
  color: string;
  label: string;
}

export const METRIC_COLOR_LEVELS: Record<MapColorMetric, ColorLevel[]> = {
  speed: [
    { min: 12, max: Infinity, color: '#22c55e', label: '매우 빠름' },
    { min: 10, max: 12, color: '#84cc16', label: '빠름' },
    { min: 8, max: 10, color: '#eab308', label: '보통' },
    { min: 6, max: 8, color: '#f97316', label: '느림' },
    { min: -Infinity, max: 6, color: '#ef4444', label: '매우 느림' },
  ],
  heart_rate: [
    { min: -Infinity, max: 120, color: '#06b6d4', label: '저강도' },
    { min: 120, max: 140, color: '#22c55e', label: '유산소' },
    { min: 140, max: 160, color: '#eab308', label: '중강도' },
    { min: 160, max: 170, color: '#f97316', label: '고강도' },
    { min: 170, max: Infinity, color: '#ef4444', label: '최대' },
  ],
  cadence: [
    { min: 175, max: 185, color: '#22c55e', label: '최적' },
    { min: 165, max: 175, color: '#84cc16', label: '양호' },
    { min: 155, max: 165, color: '#eab308', label: '보통' },
    { min: -Infinity, max: 155, color: '#a855f7', label: '낮음' },
    { min: 185, max: Infinity, color: '#f97316', label: '높음' },
  ],
  vertical_oscillation: [
    { min: -Infinity, max: 6, color: '#22c55e', label: '양호' },
    { min: 6, max: 8, color: '#84cc16', label: '보통' },
    { min: 8, max: 10, color: '#eab308', label: '주의' },
    { min: 10, max: 12, color: '#f97316', label: '높음' },
    { min: 12, max: Infinity, color: '#ef4444', label: '매우 높음' },
  ],
  pace: [
    { min: -Infinity, max: 300, color: '#22c55e', label: '매우 빠름' },
    { min: 300, max: 360, color: '#84cc16', label: '빠름' },
    { min: 360, max: 420, color: '#eab308', label: '보통' },
    { min: 420, max: 480, color: '#f97316', label: '느림' },
    { min: 480, max: Infinity, color: '#ef4444', label: '매우 느림' },
  ],
  elevation: [
    { min: -Infinity, max: 50, color: '#3b82f6', label: '저지대' },
    { min: 50, max: 100, color: '#06b6d4', label: '낮음' },
    { min: 100, max: 200, color: '#84cc16', label: '중간' },
    { min: 200, max: 400, color: '#a16207', label: '높음' },
    { min: 400, max: Infinity, color: '#78350f', label: '고지대' },
  ],
};

export function getColorForValue(metric: MapColorMetric, value: number): string {
  const levels = METRIC_COLOR_LEVELS[metric];
  for (const level of levels) {
    if (value >= level.min && value < level.max) return level.color;
  }
  return '#6b7280';
}

export function getMetricValue(
  point: Record<string, unknown>,
  metric: MapColorMetric
): number | null {
  switch (metric) {
    case 'speed':
      return (point.speed_kmh as number) ?? null;
    case 'heart_rate':
      return (point.heart_rate as number) ?? null;
    case 'cadence':
      return (point.cadence as number) ?? null;
    case 'vertical_oscillation':
      return (point.vertical_oscillation as number) ?? null;
    case 'pace':
      return (point.pace_sec_per_km as number) ?? null;
    case 'elevation':
      return (point.altitude as number) ?? null;
    default:
      return null;
  }
}

export function buildColoredSegments(
  points: EnrichedRoutePoint[],
  metric: MapColorMetric
): { positions: [number, number][]; color: string }[] {
  const segments: { positions: [number, number][]; color: string }[] = [];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const val = getMetricValue(curr, metric);
    const color = val != null ? getColorForValue(metric, val) : '#6b7280';
    segments.push({
      positions: [
        [prev.lat, prev.lng],
        [curr.lat, curr.lng],
      ],
      color,
    });
  }
  return segments;
}
