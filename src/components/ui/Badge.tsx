import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

type BadgeVariant = 'success' | 'error' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-success-bg text-success-text',
  error: 'bg-error-bg text-error-text',
  neutral: 'bg-neutral-tint text-text-secondary',
};

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'text-badge rounded-pill inline-flex items-center px-2.5 py-1 font-medium',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
