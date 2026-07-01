'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSettings } from '@/context/SettingsProvider';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useSessionAnalytics } from '@/hooks/useSessionAnalytics';
import { apiFetch } from '@/services/api';
import type { RunningSession } from '@/types';
import type { MapColorMetric } from '@/utils/routeColorScale';
import { DetailTabs } from '@/components/layout/DetailTabs';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { PremiumLockCard } from '@/components/auth/PremiumLockCard';
import ColoredRouteMap from '@/components/analytics/ColoredRouteMap';
import { MetricColorSelector, RouteMapLegend } from '@/components/analytics/RouteMapLegend';
import { SessionChartsPanel } from '@/components/analytics/SessionChartsPanel';
import { MetricAnalysisCard, buildSessionMetricCards } from '@/components/analytics/MetricAnalysisCard';
import { MetricOverlayChart } from '@/components/analytics/MetricOverlayChart';
import { CrossMetricAnalysis } from '@/components/analytics/CrossMetricAnalysis';
import { RunningRouteHeatmap } from '@/components/analytics/RunningRouteHeatmap';
import { Vo2MaxPanel } from '@/components/analytics/Vo2MaxPanel';
import { HRVRecoveryPanel } from '@/components/analytics/HRVRecoveryPanel';
import { WorkoutComparer } from '@/components/analytics/WorkoutComparer';
import { AiAnalysisMarkdown } from '@/components/analytics/AiAnalysisMarkdown';
import { formatPace, formatDuration } from '@/utils/date';

type TabId = 'overview' | 'charts' | 'cross' | 'deep' | 'ai';

export default function SessionDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const { apiToken, userId, t, heightCm, weightKg } = useSettings();
  const { session, metrics, runningScore, loading } = useSessionAnalytics(id, apiToken);
  const [previousSession, setPreviousSession] = useState<RunningSession | null>(null);
  const [tab, setTab] = useState<TabId>('overview');
  const [mapMetric, setMapMetric] = useState<MapColorMetric>('speed');
  const [analysis, setAnalysis] = useState<{ summary: string } | null>(null);

  const canPrecision = useFeatureAccess('analysis_precision');
  const canAdvanced = useFeatureAccess('analysis_advanced');

  useEffect(() => {
    if (!apiToken || !userId || !session) return;
    apiFetch<RunningSession[]>(`/api/users/${userId}/sessions?status=completed&limit=5`, {
      token: apiToken,
    })
      .then((list) => {
        const idx = list.findIndex((s) => s.id === session.id);
        setPreviousSession(idx >= 0 && idx < list.length - 1 ? list[idx + 1] : list[1] ?? null);
      })
      .catch(() => setPreviousSession(null));
  }, [apiToken, userId, session]);

  useEffect(() => {
    if (tab !== 'ai' || !canAdvanced || !apiToken || !id) return;
    apiFetch<{ summary: string }>(`/api/sessions/${id}/analysis`, { token: apiToken })
      .then(setAnalysis)
      .catch(() => setAnalysis(null));
  }, [tab, canAdvanced, apiToken, id]);

  const requestAnalysis = async () => {
    if (!apiToken || !id) return;
    const result = await apiFetch<{ summary: string }>(`/api/sessions/${id}/analyze`, {
      method: 'POST',
      token: apiToken,
    });
    setAnalysis(result);
  };

  if (loading || !session) return <p className="text-[var(--rc-muted)]">로딩 중...</p>;

  const points = metrics?.points ?? [];
  const metricCards = buildSessionMetricCards(session, runningScore, heightCm, weightKg);

  const tabs = [
    { id: 'overview' as const, label: t('tab.overview') },
    { id: 'charts' as const, label: t('tab.charts') },
    { id: 'cross' as const, label: t('tab.cross'), locked: !canPrecision },
    { id: 'deep' as const, label: t('tab.deep'), locked: !canPrecision },
    { id: 'ai' as const, label: t('tab.ai'), locked: !canAdvanced },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">
          {new Date(session.started_at).toLocaleDateString('ko-KR')} 러닝
        </h1>
        <p className="text-sm text-[var(--rc-muted)] mt-1">{session.status}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="거리" value={`${(Number(session.distance_meters) / 1000).toFixed(2)} km`} />
        <StatCard label="시간" value={formatDuration(session.duration_seconds)} />
        <StatCard label="페이스" value={formatPace(session.avg_pace_sec_per_km)} />
        <StatCard label="칼로리" value={`${session.calories} kcal`} />
      </div>

      <DetailTabs tabs={tabs} active={tab} onChange={(v) => setTab(v as TabId)} />

      {tab === 'overview' && (
        <div className="space-y-4">
          <MetricColorSelector value={mapMetric} onChange={setMapMetric} />
          <RouteMapLegend metric={mapMetric} />
          {points.length > 0 && <ColoredRouteMap points={points} metric={mapMetric} />}
        </div>
      )}

      {tab === 'charts' && (
        <div className="space-y-4">
          <SessionChartsPanel points={points} />
          <div className="grid md:grid-cols-2 gap-3">
            {metricCards.map((c) => (
              <MetricAnalysisCard key={c.title} {...c} />
            ))}
          </div>
        </div>
      )}

      {tab === 'cross' &&
        (canPrecision ? (
          <div className="space-y-4">
            <WorkoutComparer current={session} previous={previousSession} />
            <MetricOverlayChart points={points} />
            <CrossMetricAnalysis
              points={points}
              calories={session.calories}
              distanceM={Number(session.distance_meters)}
            />
          </div>
        ) : (
          <PremiumLockCard feature={t('tab.cross')} />
        ))}

      {tab === 'deep' &&
        (canPrecision ? (
          <div className="space-y-4">
            <RunningRouteHeatmap points={points} />
            <Vo2MaxPanel
              sessions={[]}
              heightCm={heightCm}
              weightKg={weightKg}
              currentPace={session.avg_pace_sec_per_km}
            />
            <HRVRecoveryPanel
              heartRateAvg={session.heart_rate_avg}
              heightCm={heightCm}
              weightKg={weightKg}
              durationSeconds={session.duration_seconds}
            />
          </div>
        ) : (
          <PremiumLockCard feature={t('tab.deep')} />
        ))}

      {tab === 'ai' &&
        (canAdvanced ? (
          <div className="space-y-4">
            {!analysis && (
              <Button onClick={requestAnalysis}>{t('cta.requestAnalysis')}</Button>
            )}
            {analysis && <AiAnalysisMarkdown summary={analysis.summary} />}
          </div>
        ) : (
          <PremiumLockCard feature={t('tab.ai')} />
        ))}
    </div>
  );
}
