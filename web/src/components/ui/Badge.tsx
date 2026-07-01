import { cn } from '@/lib/utils';

type SessionStatus = 'active' | 'completed' | 'cancelled' | string;

const statusStyles: Record<string, string> = {
  active: 'bg-[var(--rc-accent)]/20 text-[var(--rc-accent)]',
  completed: 'bg-[var(--rc-success)]/20 text-[var(--rc-success)]',
  cancelled: 'bg-[var(--rc-muted)]/20 text-[var(--rc-muted)]',
};

export function Badge({
  status,
  label,
  className,
}: {
  status?: SessionStatus;
  label?: string;
  className?: string;
}) {
  const text = label ?? status ?? '';
  const style = status ? statusStyles[status] ?? statusStyles.cancelled : 'bg-white/10 text-[var(--rc-muted)]';
  return (
    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', style, className)}>
      {text}
    </span>
  );
}
