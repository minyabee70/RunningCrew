import { Card, CardContent } from './Card';
import { cn } from '@/lib/utils';

export function StatCard({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  className?: string;
}) {
  return (
    <Card className={cn('', className)}>
      <CardContent>
        <p className="text-sm text-[var(--rc-muted)]">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {sub && <p className="text-xs text-[var(--rc-muted)] mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}
