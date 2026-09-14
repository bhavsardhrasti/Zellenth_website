import Link from 'next/link';
import type { Route } from 'next';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: Route;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li className="flex items-center gap-1.5">
          <Link
            href={'/' as Route}
            className="font-body text-text-secondary hover:text-text-primary text-xs font-medium tracking-wide uppercase transition-colors"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRight aria-hidden className="text-text-muted h-3 w-3" />
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="font-body text-text-secondary hover:text-text-primary text-xs font-medium tracking-wide uppercase transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-body text-brand text-xs font-medium tracking-wide uppercase">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
