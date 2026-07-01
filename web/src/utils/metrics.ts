import type { MetricPoint } from '@/types/analytics';

export function calcPaceConsistency(segmentPaces: number[]): number {
  const valid = segmentPaces.filter((p) => p > 0 && p < 1200);
  if (valid.length < 2) return 50;
  const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
  const variance = valid.reduce((s, p) => s + (p - mean) ** 2, 0) / valid.length;
  const cv = Math.sqrt(variance) / mean;
  return Math.max(0, Math.min(100, Math.round(100 - cv * 200)));
}

export function calcElevationPaceImpact(paces: number[], altitudes: number[]): number {
  if (paces.length < 3 || altitudes.length < 3) return 0;
  let uphillPace = 0;
  let flatPace = 0;
  let uphillN = 0;
  let flatN = 0;
  for (let i = 1; i < paces.length; i++) {
    const delta = (altitudes[i] ?? 0) - (altitudes[i - 1] ?? 0);
    if (paces[i] <= 0) continue;
    if (delta > 1) {
      uphillPace += paces[i];
      uphillN++;
    } else if (Math.abs(delta) <= 1) {
      flatPace += paces[i];
      flatN++;
    }
  }
  if (uphillN === 0 || flatN === 0) return 0;
  return Math.round(((uphillPace / uphillN - flatPace / flatN) / (flatPace / flatN)) * 100);
}

export function calcCaloriesPerKm(calories: number, distanceM: number): number {
  if (distanceM <= 0) return 0;
  return Math.round((calories / distanceM) * 1000);
}

export function normalizeMetrics(data: MetricPoint[], keys: (keyof MetricPoint)[]): MetricPoint[] {
  const ranges: Record<string, { min: number; max: number }> = {};
  for (const key of keys) {
    const vals = data.map((d) => Number(d[key] ?? 0)).filter((v) => v > 0);
    if (vals.length === 0) {
      ranges[key as string] = { min: 0, max: 1 };
      continue;
    }
    ranges[key as string] = { min: Math.min(...vals), max: Math.max(...vals) };
  }
  return data.map((d) => {
    const out = { ...d } as MetricPoint;
    for (const key of keys) {
      const v = Number(d[key] ?? 0);
      const { min, max } = ranges[key as string];
      const norm = max === min ? 50 : ((v - min) / (max - min)) * 100;
      (out as unknown as Record<string, unknown>)[`${String(key)}_norm`] = norm;
    }
    return out;
  });
}

export function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length);
}
