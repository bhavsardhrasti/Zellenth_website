import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="border-border rounded-md flex flex-col items-center gap-2 border border-dashed px-6 py-16 text-center">
      <p className="font-display text-h2 text-text-primary">{title}</p>
      {description && <p className="text-body text-text-secondary max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
