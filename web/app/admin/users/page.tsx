'use client';

import { useEffect, useState } from 'react';
import { useSettings } from '@/context/SettingsProvider';
import { apiFetch } from '@/services/api';

interface AdminUser {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  subscription_status: string;
  trial_started_at: string | null;
  effectiveTier?: string;
  trialDaysLeft?: number;
}

export default function AdminUsersPage() {
  const { apiToken, role } = useSettings();
  const [users, setUsers] = useState<AdminUser[]>([]);

  const load = () => {
    if (!apiToken) return;
    apiFetch<AdminUser[]>('/api/admin/users', { token: apiToken }).then(setUsers).catch(console.error);
  };

  useEffect(() => {
    load();
  }, [apiToken]);

  if (role !== 'creator' && role !== 'admin') {
    return <p className="text-[var(--rc-danger)]">접근 권한이 없습니다.</p>;
  }

  const updateSub = async (userId: string, status: string) => {
    await apiFetch(`/api/admin/users/${userId}/subscription`, {
      method: 'PATCH',
      token: apiToken,
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">사용자 관리</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-[var(--rc-border)] rounded-xl overflow-hidden">
          <thead className="bg-[var(--rc-surface)]">
            <tr>
              <th className="text-left p-3">이메일</th>
              <th className="text-left p-3">역할</th>
              <th className="text-left p-3">구독</th>
              <th className="text-left p-3">체험</th>
              <th className="text-left p-3">액션</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-[var(--rc-border)]">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.subscription_status}</td>
                <td className="p-3">D-{u.trialDaysLeft ?? '-'}</td>
                <td className="p-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateSub(u.id, 'active')}
                    className="px-2 py-1 text-xs rounded bg-[var(--rc-success)]/20 text-[var(--rc-success)]"
                  >
                    active
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSub(u.id, 'free')}
                    className="px-2 py-1 text-xs rounded border border-[var(--rc-border)]"
                  >
                    free
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSub(u.id, 'trial')}
                    className="px-2 py-1 text-xs rounded border border-[var(--rc-border)]"
                  >
                    trial
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
