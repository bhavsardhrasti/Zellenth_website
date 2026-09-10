import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-display text-h1 text-text-primary">{title}</h1>
        {description && <p className="text-body-sm text-text-secondary mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
