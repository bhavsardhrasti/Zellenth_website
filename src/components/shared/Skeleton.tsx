import { cn } from '@/utils/cn';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('bg-neutral-tint animate-pulse rounded-sm', className)} />;
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  );
}
