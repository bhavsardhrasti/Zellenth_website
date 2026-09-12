'use client';

import { signOut } from 'next-auth/react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/cn';
import { ROUTES } from '@/utils/routes';

interface UserMenuProps {
  name: string;
  email: string;
}

function getInitials(name: string): string {
  return (
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'A'
  );
}

export function UserMenu({ name, email }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const initials = getInitials(name);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  async function handleLogout() {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: ROUTES.LOGIN });
  }

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'border-border flex cursor-pointer items-center gap-2.5 rounded-md border px-2.5 py-1.5 transition-colors',
          isOpen ? 'border-brand bg-neutral-tint' : 'hover:bg-neutral-tint',
        )}
      >
        <span className="bg-brand flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
          {initials}
        </span>
        <span className="text-body-sm text-text-primary hidden max-w-[140px] truncate font-medium sm:block">
          {name}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            'text-text-secondary h-3.5 w-3.5 transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <div className="border-border bg-surface shadow-elevated rounded-md absolute top-full right-0 z-50 mt-2 w-56 overflow-hidden border">
          <div className="border-border flex items-center gap-3 border-b px-4 py-3.5">
            <span className="bg-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="text-body-sm text-text-primary truncate font-semibold">{name}</p>
              <p className="text-badge text-text-secondary truncate">{email}</p>
            </div>
          </div>

          <div className="border-border border-t px-2 py-1.5">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-body-sm text-error-text hover:bg-error-bg flex w-full cursor-pointer items-center gap-3 rounded-sm px-3 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut aria-hidden className="h-3.5 w-3.5 shrink-0" />
              {isLoggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
