'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/services/api';
import type { RunningSession } from '@/types';
import type { SessionMetricsResponse } from '@/types/analytics';
import { calculateRunningScore } from '@/utils/runningScore';

export function useSessionAnalytics(sessionId: string | undefined, apiToken: string) {
  const [session, setSession] = useState<RunningSession | null>(null);
  const [metrics, setMetrics] = useState<SessionMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !apiToken) return;
    setLoading(true);
    Promise.all([
      apiFetch<RunningSession>(`/api/sessions/${sessionId}`, { token: apiToken }),
      apiFetch<SessionMetricsResponse>(`/api/sessions/${sessionId}/metrics`, { token: apiToken }),
    ])
      .then(([s, m]) => {
        setSession(s);
        setMetrics(m);
        setError(null);
      })
      .catch((e) => setError(e.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  }, [sessionId, apiToken]);

  const runningScore = session ? calculateRunningScore(session) : null;

  return { session, metrics, runningScore, loading, error };
}
