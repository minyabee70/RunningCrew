import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'ghost' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary: 'bg-[var(--rc-accent)] text-white hover:opacity-90',
  ghost: 'bg-transparent text-[var(--rc-text)] hover:bg-white/5',
  outline: 'border border-[var(--rc-border)] bg-transparent hover:bg-white/5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--rc-radius)] px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
