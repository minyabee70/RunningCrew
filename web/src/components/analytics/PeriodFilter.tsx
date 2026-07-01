'use client';

import type { PeriodFilter } from '@/types/analytics';
import { useSettings } from '@/context/SettingsProvider';
import { ChipFilter } from '@/components/ui/ChipFilter';

const PERIODS: PeriodFilter[] = ['all', '3months', '1month', '2weeks'];

export function PeriodFilterBar({
  value,
  onChange,
}: {
  value: PeriodFilter;
  onChange: (p: PeriodFilter) => void;
}) {
  const { t } = useSettings();
  const options = PERIODS.map((p) => ({ id: p, label: t(`period.${p}`) }));
  return <ChipFilter options={options} value={value} onChange={(v) => onChange(v as PeriodFilter)} />;
}
