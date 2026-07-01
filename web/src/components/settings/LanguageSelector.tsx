'use client';

import { useSettings } from '@/context/SettingsProvider';

export function LanguageSelector() {
  const { language, setLanguage } = useSettings();
  return (
    <div className="flex gap-2">
      {(['ko', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLanguage(l)}
          className={`px-3 py-1 rounded border ${language === l ? 'bg-[var(--rc-accent)]' : 'border-[var(--rc-border)]'}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
