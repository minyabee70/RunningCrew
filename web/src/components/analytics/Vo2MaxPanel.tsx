'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { buildVo2Timeline, estimateVo2MaxFromPace, vo2MaxCategory } from '@/utils/vo2max';
import { estimateAgeFromHeightWeight } from '@/utils/biometrics';

export function Vo2MaxPanel({
  sessions,
  heightCm,
  weightKg,
  currentPace,
}: {
  sessions: Array<{ id: string; started_at: string; avg_pace_sec_per_km: number | null }>;
  heightCm: number;
  weightKg: number;
  currentPace: number | null;
}) {
  const age = estimateAgeFromHeightWeight(heightCm, weightKg);
  const currentVo2 = currentPace ? estimateVo2MaxFromPace(currentPace, age) : 0;
  const timeline = buildVo2Timeline(sessions, age);

  return (
    <div className="p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)] space-y-3">
      <div className="flex items-baseline gap-3">
        <h3 className="font-semibold">VO2max 추정</h3>
        {currentVo2 > 0 && (
          <span className="text-2xl font-bold text-[var(--rc-accent)]">{currentVo2}</span>
        )}
        {currentVo2 > 0 && (
          <span className="text-sm text-[var(--rc-muted)]">{vo2MaxCategory(currentVo2, age)}</span>
        )}
      </div>
      {timeline.length >= 2 ? (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" />
            <XAxis dataKey="date" tick={{ fill: '#8b949e', fontSize: 11 }} />
            <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ background: '#1a1f26', border: '1px solid #2d333b' }} />
            <Line type="monotone" dataKey="vo2" stroke="#8b5cf6" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-xs text-[var(--rc-muted)]">추이를 보려면 완료된 세션이 더 필요합니다.</p>
      )}
    </div>
  );
}
