'use client';

import type { RunningSession } from '@/types';
import { formatPace, formatDuration } from '@/utils/date';

export function WorkoutComparer({
  current,
  previous,
}: {
  current: RunningSession;
  previous: RunningSession | null;
}) {
  if (!previous) {
    return (
      <p className="text-sm text-[var(--rc-muted)] p-4 rounded-xl border border-[var(--rc-border)]">
        비교할 이전 세션이 없습니다.
      </p>
    );
  }

  const distDelta = Number(current.distance_meters) - Number(previous.distance_meters);
  const paceDelta =
    (current.avg_pace_sec_per_km ?? 0) - (previous.avg_pace_sec_per_km ?? 0);
  const durDelta = current.duration_seconds - previous.duration_seconds;

  return (
    <div className="p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)] space-y-3">
      <h3 className="font-semibold">이전 세션 대비</h3>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <Compare label="거리" current={`${(Number(current.distance_meters) / 1000).toFixed(2)}km`} delta={`${distDelta >= 0 ? '+' : ''}${(distDelta / 1000).toFixed(2)}km`} positive={distDelta >= 0} />
        <Compare label="페이스" current={formatPace(current.avg_pace_sec_per_km)} delta={`${paceDelta >= 0 ? '+' : ''}${Math.round(paceDelta)}s`} positive={paceDelta <= 0} />
        <Compare label="시간" current={formatDuration(current.duration_seconds)} delta={`${durDelta >= 0 ? '+' : ''}${Math.round(durDelta / 60)}m`} positive={durDelta >= 0} />
      </div>
    </div>
  );
}

function Compare({
  label,
  current,
  delta,
  positive,
}: {
  label: string;
  current: string;
  delta: string;
  positive: boolean;
}) {
  return (
    <div className="p-2 rounded-lg bg-black/20">
      <p className="text-[var(--rc-muted)] text-xs">{label}</p>
      <p className="font-semibold">{current}</p>
      <p className={`text-xs ${positive ? 'text-green-400' : 'text-orange-400'}`}>{delta}</p>
    </div>
  );
}
