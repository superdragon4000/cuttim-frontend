import {cn} from '@/shared/lib/cn';
import type {ButtonHTMLAttributes} from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'ghost' | 'outline';
};

export function Button({className, variant = 'solid', ...props}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition active:scale-[0.98]',
        variant === 'solid' &&
          'bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90',
        variant === 'ghost' &&
          'bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-2)]',
        variant === 'outline' &&
          'border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-2)]',
        className,
      )}
      {...props}
    />
  );
}
