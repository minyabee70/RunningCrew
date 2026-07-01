export function ProgressMeter({
  label,
  value,
  max,
  unit = '',
}: {
  label: string;
  value: number;
  max: number;
  unit?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--rc-muted)]">{label}</span>
        <span>
          {value.toFixed(1)}
          {unit} / {max}
          {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-black/30 overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--rc-accent)] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-[var(--rc-muted)]">{pct}%</p>
    </div>
  );
}
