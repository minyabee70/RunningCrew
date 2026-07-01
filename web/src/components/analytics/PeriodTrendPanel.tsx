'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { TrendSession } from '@/types/analytics';
import type { RunningSession } from '@/types';
import { calculateRunningScore } from '@/utils/runningScore';

export function PeriodTrendPanel({ sessions }: { sessions: TrendSession[] }) {
  if (sessions.length === 0) {
    return <p className="text-sm text-[var(--rc-muted)]">선택 기간에 세션이 없습니다.</p>;
  }

  const scored = sessions.map((s) => {
    const mock = {
      id: s.id,
      user_id: '',
      status: 'completed',
      started_at: s.started_at,
      ended_at: null,
      distance_meters: s.distance_meters,
      duration_seconds: s.duration_seconds ?? 0,
      avg_pace_sec_per_km: s.avg_pace_sec_per_km,
      route_points: [],
      calories: s.calories ?? 0,
    } as RunningSession;
    const rs = calculateRunningScore(mock);
    return {
      date: new Date(s.started_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      score: rs.score,
      pace: s.avg_pace_sec_per_km ? s.avg_pace_sec_per_km / 60 : 0,
    };
  });

  const first = scored[0];
  const last = scored[scored.length - 1];
  const scoreDelta = last.score - first.score;
  const trend = scoreDelta > 3 ? 'improved' : scoreDelta < -3 ? 'declined' : 'plateau';

  return (
    <div className="space-y-4 p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <Stat label="세션 수" value={String(sessions.length)} />
        <Stat label="평균 점수" value={String(Math.round(scored.reduce((a, b) => a + b.score, 0) / scored.length))} />
        <Stat label="점수 변화" value={`${scoreDelta > 0 ? '+' : ''}${scoreDelta}`} />
        <Stat label="트렌드" value={trend === 'improved' ? '향상' : trend === 'declined' ? '하락' : '유지'} />
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={scored}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" />
          <XAxis dataKey="date" tick={{ fill: '#8b949e', fontSize: 11 }} />
          <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} />
          <Tooltip contentStyle={{ background: '#1a1f26', border: '1px solid #2d333b' }} />
          <Area type="monotone" dataKey="score" stroke="#3b82f6" fill="#3b82f633" name="러닝 점수" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[var(--rc-muted)] text-xs">{label}</p>
      <p className="font-semibold text-lg">{value}</p>
    </div>
  );
}
