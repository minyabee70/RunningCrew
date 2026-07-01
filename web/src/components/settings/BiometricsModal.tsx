'use client';

import { useState } from 'react';
import { useSettings } from '@/context/SettingsProvider';
import { apiFetch } from '@/services/api';

export function BiometricsModal() {
  const { heightCm, weightKg, userId, apiToken, refreshSettings } = useSettings();
  const [height, setHeight] = useState(String(heightCm));
  const [weight, setWeight] = useState(String(weightKg));
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch(`/api/users/${userId}/biometrics`, {
        method: 'PATCH',
        token: apiToken,
        body: JSON.stringify({ height_cm: Number(height), weight_kg: Number(weight) }),
      });
      await refreshSettings();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <p className="text-sm text-[var(--rc-muted)]">
        키 {heightCm}cm · 몸무게 {weightKg}kg
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg border border-[var(--rc-border)] text-sm"
      >
        편집
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[var(--rc-surface)] border border-[var(--rc-border)] rounded-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-semibold">생체 정보</h3>
            <label className="flex flex-col gap-1 text-sm">
              키 (cm)
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="bg-[var(--rc-bg)] border border-[var(--rc-border)] rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              몸무게 (kg)
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-[var(--rc-bg)] border border-[var(--rc-border)] rounded px-2 py-1"
              />
            </label>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setOpen(false)} className="px-3 py-1 border rounded border-[var(--rc-border)]">
                취소
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="px-3 py-1 rounded bg-[var(--rc-accent)] text-white"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
