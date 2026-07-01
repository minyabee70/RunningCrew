'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, LayoutGrid, List } from 'lucide-react';
import { useSettings } from '@/context/SettingsProvider';
import { apiFetch } from '@/services/api';
import type { RunningSession } from '@/types';
import { ChipFilter } from '@/components/ui/ChipFilter';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDuration, formatPace } from '@/utils/date';

export default function SessionsPage() {
  const { apiToken, userId, t } = useSettings();
  const [sessions, setSessions] = useState<RunningSession[]>([]);
  const [filter, setFilter] = useState('');
  const [view, setView] = useState<'card' | 'list'>('card');

  useEffect(() => {
    if (!apiToken || !userId) return;
    const q = filter ? `?status=${filter}` : '';
    apiFetch<RunningSession[]>(`/api/users/${userId}/sessions${q}`, { token: apiToken })
      .then(setSessions)
      .catch(console.error);
  }, [apiToken, userId, filter]);

  const filterOptions = [
    { id: '', label: t('filter.all') },
    { id: 'active', label: t('filter.active') },
    { id: 'completed', label: t('filter.completed') },
    { id: 'cancelled', label: t('filter.cancelled') },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t('nav.sessions')}</h1>
        <div className="flex gap-1 border border-[var(--rc-border)] rounded-[var(--rc-radius)] p-0.5">
          <button
            type="button"
            onClick={() => setView('card')}
            className={`p-1.5 rounded ${view === 'card' ? 'bg-[var(--rc-accent)]/20 text-[var(--rc-accent)]' : 'text-[var(--rc-muted)]'}`}
            aria-label="card view"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            className={`p-1.5 rounded ${view === 'list' ? 'bg-[var(--rc-accent)]/20 text-[var(--rc-accent)]' : 'text-[var(--rc-muted)]'}`}
            aria-label="list view"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <ChipFilter options={filterOptions} value={filter} onChange={setFilter} />

      {view === 'card' ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {sessions.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex justify-between items-center gap-4">
                <div>
                  <p className="font-medium">{new Date(s.started_at).toLocaleString('ko-KR')}</p>
                  <p className="text-sm text-[var(--rc-muted)] mt-1">
                    {(Number(s.distance_meters) / 1000).toFixed(2)} km · {formatDuration(s.duration_seconds)}
                  </p>
                  <p className="text-xs text-[var(--rc-muted)]">{formatPace(s.avg_pace_sec_per_km)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge status={s.status} />
                  <Link href={`/sessions/${s.id}`}>
                    <Button variant="outline" className="text-xs py-1 px-2">
                      {t('sessions.viewDetail')}
                      <ChevronRight size={14} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--rc-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--rc-surface)] text-[var(--rc-muted)]">
              <tr>
                <th className="text-left p-3">{t('sessions.sortLatest')}</th>
                <th className="text-left p-3 hidden sm:table-cell">거리</th>
                <th className="text-left p-3 hidden md:table-cell">페이스</th>
                <th className="text-left p-3">상태</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-t border-[var(--rc-border)] hover:bg-white/5">
                  <td className="p-3">{new Date(s.started_at).toLocaleDateString('ko-KR')}</td>
                  <td className="p-3 hidden sm:table-cell">{(Number(s.distance_meters) / 1000).toFixed(2)} km</td>
                  <td className="p-3 hidden md:table-cell">{formatPace(s.avg_pace_sec_per_km)}</td>
                  <td className="p-3">
                    <Badge status={s.status} />
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/sessions/${s.id}`} className="text-[var(--rc-accent)] text-xs">
                      →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
