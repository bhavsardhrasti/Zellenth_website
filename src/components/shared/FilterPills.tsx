import Link from 'next/link';
import type { Route } from 'next';

import { cn } from '@/utils/cn';

interface FilterPillOption {
  label: string;
  value: string;
}

interface FilterPillsProps {
  pathname: Route;
  queryKey: string;
  options: FilterPillOption[];
  activeValue: string;
}

export function FilterPills({ pathname, queryKey, options, activeValue }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter">
      {options.map((option) => {
        const isActive = option.value === activeValue;
        const query: Record<string, string> =
          option.value === 'all' ? {} : { [queryKey]: option.value };

        return (
          <Link
            key={option.value}
            href={{ pathname, query }}
            aria-pressed={isActive}
            className={cn(
              'font-body shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-action text-action-text'
                : 'bg-surface border-border text-text-secondary hover:bg-neutral-tint hover:text-text-primary border',
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
