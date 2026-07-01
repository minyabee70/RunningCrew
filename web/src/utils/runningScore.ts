import type { RunningSession } from '@/types';
import type { RunningScoreResult } from '@/types/analytics';
import { calcPaceConsistency, calcCaloriesPerKm } from './metrics';
import { getHrZones } from './biometrics';

export function calculateRunningScore(
  session: RunningSession,
  opts?: { heightCm?: number; weightKg?: number }
): RunningScoreResult {
  const paces = session.route_points
    .map((_, i, arr) => {
      if (i === 0) return 0;
      const prev = arr[i - 1];
      const curr = arr[i];
      const dt = (new Date(curr.recorded_at).getTime() - new Date(prev.recorded_at).getTime()) / 1000;
      if (dt <= 0) return 0;
      const dist = Math.hypot(curr.lat - prev.lat, curr.lng - prev.lng) * 111000;
      return (dt / dist) * 1000;
    })
    .filter((p) => p > 0 && p < 1200);

  const consistency = calcPaceConsistency(paces);
  const distanceKm = Number(session.distance_meters) / 1000;
  const distanceScore = Math.min(100, Math.round((distanceKm / 5) * 100));
  const avgPace = Number(session.avg_pace_sec_per_km ?? 420);
  const paceScore = Math.max(0, Math.min(100, Math.round(120 - (avgPace - 300) / 3)));
  const calEff = calcCaloriesPerKm(session.calories, Number(session.distance_meters));
  const calScore = calEff > 0 ? Math.max(0, Math.min(100, 100 - (calEff - 60))) : 50;

  const score = Math.round(consistency * 0.4 + distanceScore * 0.3 + paceScore * 0.2 + calScore * 0.1);
  const grade =
    score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : score >= 50 ? 'D' : 'F';

  const metricStatuses: RunningScoreResult['metricStatuses'] = {
    pace_consistency: consistency >= 80 ? 'excellent' : consistency >= 60 ? 'good' : 'needs_review',
    distance: distanceScore >= 80 ? 'excellent' : distanceScore >= 50 ? 'good' : 'needs_review',
    pace: paceScore >= 75 ? 'excellent' : paceScore >= 55 ? 'good' : 'needs_review',
    calories: calScore >= 70 ? 'good' : 'needs_review',
  };

  const critiques: string[] = [];
  if (consistency < 60) critiques.push('페이스 변동이 큽니다. 후반 페이스 유지에 집중해 보세요.');
  if (distanceKm < 3) critiques.push('거리가 짧습니다. 점진적으로 거리를 늘려 보세요.');
  if (session.heart_rate_avg && opts?.weightKg) {
    const zones = getHrZones(opts.heightCm ?? 175, opts.weightKg);
    if (session.heart_rate_avg > zones.hard) critiques.push('평균 심박이 높습니다. 회복 러닝을 고려하세요.');
  }
  if (critiques.length === 0) critiques.push('전반적으로 균형 잡힌 러닝입니다.');

  return { score, grade, metricStatuses, critiques };
}
