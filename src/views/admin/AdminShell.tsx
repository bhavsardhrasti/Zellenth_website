'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { useEffect, useState, type ReactNode } from 'react';
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  DoorClosed,
  Inbox,
  Layers,
  Menu,
  Palette,
  X,
} from 'lucide-react';

import { ROUTES } from '@/utils/routes';
import { cn } from '@/utils/cn';
import { UserMenu } from '@/views/admin/UserMenu';

const NAV_ITEMS = [
  { label: 'Door Categories', href: ROUTES.ADMIN_DOOR_CATEGORIES, icon: Boxes },
  { label: 'Laminate Categories', href: ROUTES.ADMIN_LAMINATE_CATEGORIES, icon: Palette },
  { label: 'Doors', href: ROUTES.ADMIN_DOORS, icon: DoorClosed },
  { label: 'Laminates', href: ROUTES.ADMIN_LAMINATES, icon: Layers },
  { label: 'Enquiries', href: ROUTES.ADMIN_ENQUIRIES, icon: Inbox },
];

interface AdminShellProps {
  children: ReactNode;
  userName: string;
  userEmail: string;
}

export function AdminShell({ children, userName, userEmail }: AdminShellProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the mobile drawer whenever the route changes
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <div className="bg-background flex h-dvh">
      {isMobileOpen && (
        <div
          aria-hidden
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={cn(
          'border-border bg-surface fixed inset-y-0 left-0 z-40 flex shrink-0 flex-col border-r px-4 py-6 transition-all duration-300',
          'lg:static lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'w-20' : 'w-64',
        )}
      >
        <div className="flex items-center justify-between px-2">
          <div className={cn(isCollapsed && 'lg:hidden')}>
            <Image
              src="/assets/logo/zellenth-logo-v2.webp"
              alt="Zellenth"
              width={816}
              height={241}
              priority
              className="h-8 w-auto"
            />
            <span className="text-badge text-text-secondary mt-1 block">Admin</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="text-text-secondary cursor-pointer lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href as Route}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  'text-body-sm rounded-sm flex items-center gap-3 px-3 py-2 font-medium transition-colors',
                  isActive ? 'bg-brand text-white' : 'text-text-primary hover:bg-neutral-tint',
                )}
              >
                <Icon aria-hidden className="h-4.5 w-4.5 shrink-0" />
                <span className={cn(isCollapsed && 'lg:hidden')}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setIsCollapsed((current) => !current)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="bg-surface border-border text-text-secondary shadow-card absolute top-16 -right-3 hidden h-6 w-6 cursor-pointer items-center justify-center rounded-full border lg:flex"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-border bg-surface shadow-card flex h-16 shrink-0 items-center justify-between gap-3 border-b px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
            className="text-text-primary cursor-pointer lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Image
            src="/assets/logo/zellenth-logo-v2.webp"
            alt="Zellenth"
            width={816}
            height={241}
            className="h-6 w-auto lg:hidden"
          />
          <span className="hidden flex-1 lg:block" />
          <UserMenu name={userName} email={userEmail} />
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
