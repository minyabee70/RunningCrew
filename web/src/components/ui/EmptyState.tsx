import { Card, CardContent } from './Card';

export function EmptyState({
  title,
  description,
  steps,
  action,
}: {
  title: string;
  description: string;
  steps?: string[];
  action?: React.ReactNode;
}) {
  return (
    <Card className="text-center py-12">
      <CardContent className="max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-[var(--rc-muted)] text-sm">{description}</p>
        {steps && steps.length > 0 && (
          <ol className="text-left text-sm space-y-2 mt-4">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--rc-accent)]/20 text-[var(--rc-accent)] flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}
        {action && <div className="pt-2">{action}</div>}
      </CardContent>
    </Card>
  );
}
