'use client';

import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  locked?: boolean;
}

export function DetailTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-[var(--rc-border)] overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-2.5 text-sm whitespace-nowrap -mb-px border-b-2 transition-colors',
            active === tab.id
              ? 'border-[var(--rc-accent)] text-[var(--rc-accent)] font-medium'
              : 'border-transparent text-[var(--rc-muted)] hover:text-[var(--rc-text)]'
          )}
        >
          {tab.label}
          {tab.locked && ' 🔒'}
        </button>
      ))}
    </div>
  );
}
