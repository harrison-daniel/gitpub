import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-amber-100 dark:bg-neutral-700',
        className,
      )}
      {...props}
    />
  );
}
