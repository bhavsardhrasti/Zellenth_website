'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { MobileNavAccordion } from '@/components/layout/MobileNavAccordion';
import type { NavDropdownItem } from '@/components/layout/NavDropdown';
import { ROUTES } from '@/utils/routes';
import { cn } from '@/utils/cn';

type DropdownKey = 'doors' | 'laminates';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  openSection: DropdownKey | null;
  onToggleSection: (key: DropdownKey) => void;
  doorItems: NavDropdownItem[];
  laminateItems: NavDropdownItem[];
  onEnquireClick: () => void;
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  openSection,
  onToggleSection,
  doorItems,
  laminateItems,
  onEnquireClick,
}: MobileNavDrawerProps) {
  const [hasOpened, setHasOpened] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) setHasOpened(true);
  }

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!hasOpened || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div
        aria-hidden={!isOpen}
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ease-in-out sm:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          'bg-surface shadow-elevated fixed top-0 right-0 z-50 flex h-dvh w-full max-w-xs flex-col overflow-y-auto transition-transform duration-300 ease-in-out sm:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="border-border flex items-center justify-between border-b px-6 py-4">
          <span className="font-display text-text-primary text-lg">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="text-text-primary cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-2">
          <MobileNavAccordion
            label="Doors"
            isOpen={openSection === 'doors'}
            onToggle={() => onToggleSection('doors')}
            viewAllLabel="All Doors"
            viewAllHref={ROUTES.DOORS as Route}
            items={doorItems}
            onNavigate={onClose}
          />

          <MobileNavAccordion
            label="Laminates"
            isOpen={openSection === 'laminates'}
            onToggle={() => onToggleSection('laminates')}
            viewAllLabel="All Laminates"
            viewAllHref={ROUTES.LAMINATES as Route}
            items={laminateItems}
            onNavigate={onClose}
          />

          <div className="border-border flex flex-col border-b">
            <Link
              href={ROUTES.ABOUT as Route}
              onClick={onClose}
              className="font-body text-text-primary py-3 text-sm font-medium"
            >
              About
            </Link>
            <Link
              href={ROUTES.CONTACT as Route}
              onClick={onClose}
              className="font-body text-text-primary py-3 text-sm font-medium"
            >
              Contact
            </Link>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Link
              href={ROUTES.DOORS as Route}
              onClick={onClose}
              className="bg-action hover:bg-action-hover text-action-text flex w-fit items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors"
            >
              <Sparkles aria-hidden className="h-3.5 w-3.5" />
              Try the Visualizer
            </Link>
            <Button variant="secondary" onClick={onEnquireClick} className="w-fit">
              Enquire
            </Button>
          </div>
        </nav>
      </div>
    </>,
    document.body,
  );
}
