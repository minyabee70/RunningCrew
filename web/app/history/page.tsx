'use client';

import { HistoryAnalysisView } from '@/components/analytics/HistoryAnalysisView';
import { useSettings } from '@/context/SettingsProvider';

export default function HistoryPage() {
  const { t } = useSettings();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('nav.history')}</h1>
      <HistoryAnalysisView />
    </div>
  );
}
