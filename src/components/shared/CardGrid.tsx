import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

type GridColumns = 3 | 4 | 5;

const GRID_COLS: Record<GridColumns, string> = {
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
};

interface CardGridProps {
  columns?: GridColumns;
  children: ReactNode;
  className?: string;
}

export function CardGrid({ columns = 4, children, className }: CardGridProps) {
  return <div className={cn('grid gap-6', GRID_COLS[columns], className)}>{children}</div>;
}
