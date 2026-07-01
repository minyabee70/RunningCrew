export function estimateVo2MaxFromPace(paceSecPerKm: number, age = 30): number {
  if (paceSecPerKm <= 0) return 0;
  const speedKmh = 3600 / paceSecPerKm;
  const vo2 = 15.3 * (speedKmh / 3.6);
  const ageAdj = Math.max(0, (35 - age) * 0.1);
  return Math.round((vo2 + ageAdj) * 10) / 10;
}

export function vo2MaxCategory(vo2: number, age = 30): string {
  const thresholds = age < 30 ? [38, 44, 50] : age < 40 ? [35, 41, 47] : [32, 38, 44];
  if (vo2 < thresholds[0]) return '개선 필요';
  if (vo2 < thresholds[1]) return '보통';
  if (vo2 < thresholds[2]) return '양호';
  return '우수';
}

export interface Vo2TimelinePoint {
  date: string;
  vo2: number;
  sessionId: string;
}

export function buildVo2Timeline(
  sessions: Array<{ id: string; started_at: string; avg_pace_sec_per_km: number | null }>,
  age = 30
): Vo2TimelinePoint[] {
  return sessions
    .filter((s) => s.avg_pace_sec_per_km && s.avg_pace_sec_per_km > 0)
    .map((s) => ({
      date: new Date(s.started_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      vo2: estimateVo2MaxFromPace(s.avg_pace_sec_per_km!, age),
      sessionId: s.id,
    }));
}
