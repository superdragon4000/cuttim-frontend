import {cn} from '@/shared/lib/cn';

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.12)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
