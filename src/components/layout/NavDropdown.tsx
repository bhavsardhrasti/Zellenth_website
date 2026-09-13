import Link from 'next/link';
import type { Route } from 'next';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/utils/cn';

export interface NavDropdownItem {
  label: string;
  href: Route | { pathname: string; query?: Record<string, string> };
}

interface NavDropdownProps {
  label: string;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  viewAllLabel: string;
  viewAllHref: Route | { pathname: string };
  items: NavDropdownItem[];
}

export function NavDropdown({
  label,
  isActive,
  isOpen,
  onToggle,
  onClose,
  viewAllLabel,
  viewAllHref,
  items,
}: NavDropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          'font-body flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors',
          isActive ? 'text-brand' : 'text-text-secondary hover:text-text-primary',
        )}
      >
        {label}
        <ChevronDown
          aria-hidden
          className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen ? (
        <div className="bg-surface border-border shadow-elevated absolute top-full left-0 mt-2 w-56 rounded-md border p-2">
          <Link
            href={viewAllHref}
            onClick={onClose}
            className="text-text-primary hover:bg-neutral-tint block rounded-sm px-3 py-2 text-sm font-medium"
          >
            {viewAllLabel}
          </Link>
          <div className="border-border my-1 border-t" />
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="text-text-secondary hover:bg-neutral-tint hover:text-text-primary block rounded-sm px-3 py-2 text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
