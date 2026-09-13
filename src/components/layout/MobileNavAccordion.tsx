import Link from 'next/link';
import type { Route } from 'next';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/cn';
import type { NavDropdownItem } from '@/components/layout/NavDropdown';

interface MobileNavAccordionProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  viewAllLabel: string;
  viewAllHref: Route | { pathname: string };
  items: NavDropdownItem[];
  onNavigate: () => void;
}

export function MobileNavAccordion({
  label,
  isOpen,
  onToggle,
  viewAllLabel,
  viewAllHref,
  items,
  onNavigate,
}: MobileNavAccordionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(isOpen ? (contentRef.current?.scrollHeight ?? 0) : 0);
  }, [isOpen, items]);

  return (
    <div className="border-border border-b">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="font-body text-text-primary flex w-full cursor-pointer items-center justify-between py-3 text-sm font-medium"
      >
        {label}
        <ChevronDown
          aria-hidden
          className={cn('h-4 w-4 transition-transform duration-300', isOpen && 'rotate-180')}
        />
      </button>

      <div
        style={{ height }}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
      >
        <div
          ref={contentRef}
          className={cn(
            'flex flex-col gap-1 pb-3 pl-2 transition-opacity duration-200',
            isOpen ? 'opacity-100 delay-100' : 'opacity-0',
          )}
        >
          <Link
            href={viewAllHref}
            onClick={onNavigate}
            className="text-text-primary hover:bg-neutral-tint rounded-sm px-3 py-2 text-sm font-medium"
          >
            {viewAllLabel}
          </Link>
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className="text-text-secondary hover:bg-neutral-tint hover:text-text-primary rounded-sm px-3 py-2 text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
