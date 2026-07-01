const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function createSession(userId: string, token: string) {
  const res = await fetch(`${API_URL}/api/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
  return res.json();
}

export async function appendPoints(sessionId: string, token: string, points: unknown[]) {
  await fetch(`${API_URL}/api/sessions/${sessionId}/points`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ points }),
  });
}

export async function updateMetrics(
  sessionId: string,
  token: string,
  metrics: { distance_meters: number; duration_seconds: number }
) {
  await fetch(`${API_URL}/api/sessions/${sessionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(metrics),
  });
}

export async function completeSession(sessionId: string, token: string) {
  await fetch(`${API_URL}/api/sessions/${sessionId}/complete`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
}
