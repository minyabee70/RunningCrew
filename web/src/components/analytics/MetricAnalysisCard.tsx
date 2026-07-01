'use client';

import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import type { RunningScoreResult } from '@/types/analytics';
import { paceStatus } from '@/utils/biometrics';
import { formatPace } from '@/utils/date';

const STATUS_COLORS = {
  excellent: 'bg-green-500/20 text-green-400',
  good: 'bg-blue-500/20 text-blue-400',
  needs_review: 'bg-yellow-500/20 text-yellow-400',
  critical: 'bg-red-500/20 text-red-400',
};

interface MetricAnalysisCardProps {
  title: string;
  value: string;
  status: keyof typeof STATUS_COLORS;
  critique: string;
  chartData?: Array<{ x: number; y: number }>;
}

export function MetricAnalysisCard({ title, value, status, critique, chartData }: MetricAnalysisCardProps) {
  return (
    <div className="p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)] space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[status]}`}>{status}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {chartData && chartData.length > 1 && (
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={chartData}>
            <Tooltip contentStyle={{ background: '#1a1f26', border: '1px solid #2d333b' }} />
            <Area type="monotone" dataKey="y" stroke="#3b82f6" fill="#3b82f633" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}
      <p className="text-xs text-[var(--rc-muted)]">{critique}</p>
    </div>
  );
}

export function buildSessionMetricCards(
  session: {
    avg_pace_sec_per_km: number | null;
    distance_meters: number;
    calories: number;
    duration_seconds: number;
  },
  runningScore: RunningScoreResult | null,
  heightCm: number,
  weightKg: number
): MetricAnalysisCardProps[] {
  const pace = session.avg_pace_sec_per_km;
  const paceSt = pace ? paceStatus(pace, heightCm, weightKg) : 'needs_review';
  return [
    {
      title: '평균 페이스',
      value: formatPace(pace),
      status: paceSt,
      critique: paceSt === 'excellent' ? '목표 페이스 대비 우수합니다.' : '페이스 안정화를 연습해 보세요.',
    },
    {
      title: '러닝 점수',
      value: runningScore ? `${runningScore.score} (${runningScore.grade})` : '-',
      status: runningScore && runningScore.score >= 75 ? 'excellent' : 'good',
      critique: runningScore?.critiques[0] ?? '데이터 분석 중',
    },
    {
      title: '거리',
      value: `${(Number(session.distance_meters) / 1000).toFixed(2)} km`,
      status: Number(session.distance_meters) >= 5000 ? 'excellent' : 'good',
      critique: `총 ${Math.floor(session.duration_seconds / 60)}분 동안 달렸습니다.`,
    },
    {
      title: '칼로리',
      value: `${session.calories} kcal`,
      status: 'good',
      critique: '칼로리 소모는 거리와 페이스에 비례합니다.',
    },
  ];
}
