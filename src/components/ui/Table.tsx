import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="border-border shadow-card rounded-md overflow-x-auto border">
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-neutral-tint">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-border divide-y">{children}</tbody>;
}

export function TableRow({ children }: { children: ReactNode }) {
  return <tr className="hover:bg-neutral-tint/50">{children}</tr>;
}

export function TableHeadCell({
  children,
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn('text-body-sm text-text-secondary px-4 py-3 font-medium', className)}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('text-body text-text-primary px-4 py-3', className)} {...props}>
      {children}
    </td>
  );
}
