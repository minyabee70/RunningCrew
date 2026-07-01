'use client';

import { getHrZones } from '@/utils/biometrics';

export function HRVRecoveryPanel({
  heartRateAvg,
  heightCm,
  weightKg,
  durationSeconds,
}: {
  heartRateAvg: number | null | undefined;
  heightCm: number;
  weightKg: number;
  durationSeconds: number;
}) {
  const zones = getHrZones(heightCm, weightKg);
  const hr = heartRateAvg ?? 0;
  const intensity = hr > zones.hard ? 'high' : hr > zones.tempo ? 'moderate' : 'low';
  const recoveryHours = intensity === 'high' ? 48 : intensity === 'moderate' ? 24 : 12;
  const readiness = intensity === 'high' ? 55 : intensity === 'moderate' ? 75 : 90;

  return (
    <div className="p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)] space-y-3">
      <h3 className="font-semibold">회복 · Readiness</h3>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-[var(--rc-muted)] text-xs">평균 심박</p>
          <p className="font-semibold">{hr > 0 ? `${hr} bpm` : 'N/A'}</p>
        </div>
        <div>
          <p className="text-[var(--rc-muted)] text-xs">권장 회복</p>
          <p className="font-semibold">{recoveryHours}h</p>
        </div>
        <div>
          <p className="text-[var(--rc-muted)] text-xs">Readiness</p>
          <p className="font-semibold">{readiness}%</p>
        </div>
      </div>
      <div className="h-2 rounded-full bg-black/30 overflow-hidden">
        <div className="h-full bg-[var(--rc-accent)]" style={{ width: `${readiness}%` }} />
      </div>
      <p className="text-xs text-[var(--rc-muted)]">
        {durationSeconds > 3600
          ? '장시간 러닝 후 충분한 회복을 권장합니다.'
          : '현재 강도 기준 회복 상태는 양호합니다.'}
      </p>
    </div>
  );
}
