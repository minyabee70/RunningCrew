'use client';

import { useState } from 'react';
import type { MapColorMetric } from '@/utils/routeColorScale';
import ColoredRouteMap from './ColoredRouteMap';
import { MetricColorSelector, RouteMapLegend } from './RouteMapLegend';
import { SessionChartsPanel } from './SessionChartsPanel';
import { MetricAnalysisCard, buildSessionMetricCards } from './MetricAnalysisCard';
import { MetricOverlayChart } from './MetricOverlayChart';
import { CrossMetricAnalysis } from './CrossMetricAnalysis';
import { AiAnalysisMarkdown } from './AiAnalysisMarkdown';
import { WorkoutComparer } from './WorkoutComparer';
import { Vo2MaxPanel } from './Vo2MaxPanel';
import { HRVRecoveryPanel } from './HRVRecoveryPanel';
import { RunningRouteHeatmap } from './RunningRouteHeatmap';
import { PremiumLockCard } from '@/components/auth/PremiumLockCard';
import { useSettings } from '@/context/SettingsProvider';
import { useSessionAnalytics } from '@/hooks/useSessionAnalytics';
import { apiFetch } from '@/services/api';
import type { RunningSession } from '@/types';

type Tab = 'basic' | 'precision' | 'advanced';

interface SessionAnalysisViewProps {
  sessionId: string;
  previousSession?: RunningSession | null;
  canPrecision: boolean;
  canAdvanced: boolean;
}

export function SessionAnalysisView({
  sessionId,
  previousSession,
  canPrecision,
  canAdvanced,
}: SessionAnalysisViewProps) {
  const { apiToken, t, heightCm, weightKg } = useSettings();
  const { session, metrics, runningScore, loading } = useSessionAnalytics(sessionId, apiToken);
  const [tab, setTab] = useState<Tab>('basic');
  const [mapMetric, setMapMetric] = useState<MapColorMetric>('speed');
  const [analysis, setAnalysis] = useState<{ summary: string } | null>(null);

  const loadAnalysis = async () => {
    try {
      const data = await apiFetch<{ summary: string }>(`/api/sessions/${sessionId}/analysis`, {
        token: apiToken,
      });
      setAnalysis(data);
    } catch {
      setAnalysis(null);
    }
  };

  const requestAnalysis = async () => {
    const result = await apiFetch<{ summary: string }>(`/api/sessions/${sessionId}/analyze`, {
      method: 'POST',
      token: apiToken,
    });
    setAnalysis(result);
  };

  if (loading || !session) return <p className="text-[var(--rc-muted)]">로딩 중...</p>;

  const tabs: { key: Tab; label: string; locked: boolean }[] = [
    { key: 'basic', label: t('session.basic'), locked: false },
    { key: 'precision', label: t('session.precision'), locked: !canPrecision },
    { key: 'advanced', label: t('session.advanced'), locked: !canAdvanced },
  ];

  const metricCards = buildSessionMetricCards(session, runningScore, heightCm, weightKg);
  const points = metrics?.points ?? [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-[var(--rc-border)]">
        {tabs.map(({ key, label, locked }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setTab(key);
              if (key === 'advanced' && canAdvanced) loadAnalysis();
            }}
            className={`px-4 py-2 text-sm -mb-px border-b-2 ${
              tab === key ? 'border-[var(--rc-accent)] text-[var(--rc-accent)]' : 'border-transparent text-[var(--rc-muted)]'
            }`}
          >
            {label} {locked && '🔒'}
          </button>
        ))}
      </div>

      {tab === 'basic' && (
        <div className="space-y-4">
          <MetricColorSelector value={mapMetric} onChange={setMapMetric} />
          <RouteMapLegend metric={mapMetric} />
          {points.length > 0 && <ColoredRouteMap points={points} metric={mapMetric} />}
          <SessionChartsPanel points={points} />
          <div className="grid md:grid-cols-2 gap-3">
            {metricCards.map((c) => (
              <MetricAnalysisCard key={c.title} {...c} />
            ))}
          </div>
          {points.length > 0 && <MetricOverlayChart points={points} />}
        </div>
      )}

      {tab === 'precision' &&
        (canPrecision ? (
          <div className="space-y-4">
            <WorkoutComparer current={session} previous={previousSession ?? null} />
            <RunningRouteHeatmap points={points} />
            <CrossMetricAnalysis
              points={points}
              calories={session.calories}
              distanceM={Number(session.distance_meters)}
            />
            <HRVRecoveryPanel
              heartRateAvg={session.heart_rate_avg}
              heightCm={heightCm}
              weightKg={weightKg}
              durationSeconds={session.duration_seconds}
            />
          </div>
        ) : (
          <PremiumLockCard feature={t('session.precision')} />
        ))}

      {tab === 'advanced' &&
        (canAdvanced ? (
          <div className="space-y-4">
            <Vo2MaxPanel
              sessions={[]}
              heightCm={heightCm}
              weightKg={weightKg}
              currentPace={session.avg_pace_sec_per_km}
            />
            {!analysis && (
              <button
                type="button"
                onClick={requestAnalysis}
                className="px-4 py-2 rounded-lg bg-[var(--rc-accent)] text-white text-sm"
              >
                AI 분석 요청
              </button>
            )}
            {analysis && <AiAnalysisMarkdown summary={analysis.summary} />}
          </div>
        ) : (
          <PremiumLockCard feature={t('session.advanced')} />
        ))}
    </div>
  );
}
