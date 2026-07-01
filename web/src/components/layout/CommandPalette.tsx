'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { LayoutDashboard, Activity, TrendingUp, Settings, Sparkles } from 'lucide-react';
import { useSettings } from '@/context/SettingsProvider';
import { apiFetch } from '@/services/api';
import type { RunningSession } from '@/types';

const pages = [
  { href: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/sessions', labelKey: 'nav.sessions', icon: Activity },
  { href: '/history', labelKey: 'nav.history', icon: TrendingUp },
  { href: '/settings', labelKey: 'nav.settings', icon: Settings },
];

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const { apiToken, userId, t } = useSettings();
  const [sessions, setSessions] = useState<RunningSession[]>([]);

  useEffect(() => {
    if (!open || !apiToken || !userId) return;
    apiFetch<RunningSession[]>(`/api/users/${userId}/sessions?limit=30`, { token: apiToken })
      .then(setSessions)
      .catch(() => setSessions([]));
  }, [open, apiToken, userId]);

  const go = useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [router, onOpenChange]
  );

  const runAnalysis = async (sessionId: string) => {
    if (!apiToken) return;
    onOpenChange(false);
    try {
      await apiFetch(`/api/sessions/${sessionId}/analyze`, { method: 'POST', token: apiToken });
    } catch {
      /* cached or error — navigate anyway */
    }
    router.push(`/sessions/${sessionId}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={() => onOpenChange(false)} />
      <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-full max-w-lg px-4">
        <Command
          className="rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)] shadow-2xl overflow-hidden"
          label={t('cmd.title')}
        >
          <Command.Input
            placeholder={t('cmd.placeholder')}
            className="w-full px-4 py-3 bg-transparent border-b border-[var(--rc-border)] outline-none text-sm"
          />
          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-[var(--rc-muted)]">
              {t('cmd.empty')}
            </Command.Empty>
            <Command.Group heading={t('cmd.pages')}>
              {pages.map(({ href, labelKey, icon: Icon }) => (
                <Command.Item
                  key={href}
                  value={t(labelKey)}
                  onSelect={() => go(href)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-[var(--rc-accent)]/20"
                >
                  <Icon size={16} />
                  {t(labelKey)}
                </Command.Item>
              ))}
            </Command.Group>
            {sessions.length > 0 && (
              <Command.Group heading={t('cmd.sessions')}>
                {sessions.map((s) => {
                  const label = `${new Date(s.started_at).toLocaleDateString('ko-KR')} · ${(Number(s.distance_meters) / 1000).toFixed(1)}km`;
                  return (
                    <Command.Item
                      key={s.id}
                      value={label}
                      onSelect={() => go(`/sessions/${s.id}`)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-[var(--rc-accent)]/20"
                    >
                      <span>{label}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          runAnalysis(s.id);
                        }}
                        className="text-xs text-[var(--rc-accent)] flex items-center gap-1"
                      >
                        <Sparkles size={12} />
                        AI
                      </button>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return { open, setOpen };
}
