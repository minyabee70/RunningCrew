import type { PeriodFilter } from '@/types/analytics';

export function periodToFromDate(period: PeriodFilter): string | undefined {
  if (period === 'all') return undefined;
  const d = new Date();
  if (period === '3months') d.setMonth(d.getMonth() - 3);
  else if (period === '1month') d.setMonth(d.getMonth() - 1);
  else if (period === '2weeks') d.setDate(d.getDate() - 14);
  return d.toISOString();
}

export function formatPace(secPerKm: number | null | undefined): string {
  if (!secPerKm || secPerKm <= 0) return '-';
  const m = Math.floor(secPerKm / 60);
  const s = Math.floor(secPerKm % 60);
  return `${m}:${String(s).padStart(2, '0')}/km`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}s`;
}
