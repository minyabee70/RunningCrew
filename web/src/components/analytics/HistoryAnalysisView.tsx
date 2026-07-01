'use client';

import { useEffect, useState } from 'react';
import { useSettings } from '@/context/SettingsProvider';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { apiFetch } from '@/services/api';
import type { PeriodFilter, TrendsResponse } from '@/types/analytics';
import { periodToFromDate } from '@/utils/date';
import { PeriodFilterBar } from './PeriodFilter';
import { PeriodTrendPanel } from './PeriodTrendPanel';
import { HistoryMetricCharts } from './HistoryMetricCharts';
import { CrossMetricHistory } from './CrossMetricHistory';
import { StatsDashboard } from './StatsDashboard';
import { Vo2MaxPanel } from './Vo2MaxPanel';
import { PremiumLockCard } from '@/components/auth/PremiumLockCard';

type Tab = 'basic' | 'advanced';

export function HistoryAnalysisView() {
  const { apiToken, userId, t, heightCm, weightKg } = useSettings();
  const [tab, setTab] = useState<Tab>('basic');
  const [period, setPeriod] = useState<PeriodFilter>('all');
  const [trends, setTrends] = useState<TrendsResponse | null>(null);
  const canAdvanced = useFeatureAccess('history_advanced');

  useEffect(() => {
    if (!apiToken || !userId) return;
    const from = periodToFromDate(period);
    const qs = from ? `?from=${encodeURIComponent(from)}` : '';
    apiFetch<TrendsResponse>(`/api/users/${userId}/analytics/trends${qs}`, { token: apiToken })
      .then(setTrends)
      .catch(console.error);
  }, [apiToken, userId, period]);

  const sessions = trends?.sessions ?? [];

  return (
    <div className="space-y-4">
      <PeriodFilterBar value={period} onChange={setPeriod} />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab('basic')}
          className={`px-4 py-2 rounded-lg text-sm ${tab === 'basic' ? 'bg-[var(--rc-accent)]' : 'border border-[var(--rc-border)]'}`}
        >
          {t('history.basic')}
        </button>
        <button
          type="button"
          onClick={() => setTab('advanced')}
          className={`px-4 py-2 rounded-lg text-sm ${tab === 'advanced' ? 'bg-[var(--rc-accent)]' : 'border border-[var(--rc-border)]'}`}
        >
          {t('history.advanced')} {!canAdvanced && '🔒'}
        </button>
      </div>

      {tab === 'basic' && trends && (
        <div className="space-y-4">
          <StatsDashboard sessions={sessions} />
          <PeriodTrendPanel sessions={sessions} />
          <HistoryMetricCharts sessions={sessions} />
        </div>
      )}

      {tab === 'advanced' &&
        (canAdvanced ? (
          <div className="space-y-4">
            <CrossMetricHistory sessions={sessions} />
            <Vo2MaxPanel
              sessions={sessions}
              heightCm={heightCm}
              weightKg={weightKg}
              currentPace={sessions[0]?.avg_pace_sec_per_km ?? null}
            />
          </div>
        ) : (
          <PremiumLockCard feature={t('history.advanced')} />
        ))}
    </div>
  );
}
