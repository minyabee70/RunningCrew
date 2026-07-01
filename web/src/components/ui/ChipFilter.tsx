'use client';

import { cn } from '@/lib/utils';

export interface ChipOption {
  id: string;
  label: string;
}

export function ChipFilter({
  options,
  value,
  onChange,
}: {
  options: ChipOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm border transition-colors',
            value === opt.id
              ? 'bg-[var(--rc-accent)] border-[var(--rc-accent)] text-white'
              : 'border-[var(--rc-border)] text-[var(--rc-muted)] hover:border-[var(--rc-accent)]/50'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
