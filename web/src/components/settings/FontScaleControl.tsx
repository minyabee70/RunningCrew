'use client';

import { useFontScale } from '@/hooks/useFontScale';

export function FontScaleControl() {
  const { fontScale, increase, decrease, reset } = useFontScale();
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={decrease} className="px-2 py-1 border rounded border-[var(--rc-border)]">
        -
      </button>
      <span>{fontScale}%</span>
      <button type="button" onClick={increase} className="px-2 py-1 border rounded border-[var(--rc-border)]">
        +
      </button>
      <button type="button" onClick={reset} className="text-sm text-[var(--rc-muted)]">
        리셋
      </button>
    </div>
  );
}
