'use client';

import { useSettings } from '@/context/SettingsProvider';
import { THEME_IDS, THEME_LABELS } from '@/utils/theme';

export function ThemeSelector() {
  const { uiTheme, setUiTheme } = useSettings();
  return (
    <div className="flex flex-wrap gap-2">
      {THEME_IDS.map((th) => (
        <button
          key={th}
          type="button"
          onClick={() => setUiTheme(th)}
          className={`px-3 py-1 rounded border text-sm ${uiTheme === th ? 'bg-[var(--rc-accent)]' : 'border-[var(--rc-border)]'}`}
        >
          {THEME_LABELS[th]}
        </button>
      ))}
    </div>
  );
}
