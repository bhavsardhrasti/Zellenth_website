'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { Heart, Menu, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { EnquiryModal } from '@/components/shared/EnquiryModal';
import { NavDropdown } from '@/components/layout/NavDropdown';
import { MobileNavDrawer } from '@/components/layout/MobileNavDrawer';
import { useWatchlist } from '@/hooks/useWatchlist';
import { laminateFinishOptions } from '@/lib/data/nav';
import { ROUTES } from '@/utils/routes';
import { cn } from '@/utils/cn';

interface SiteHeaderProps {
  doorCategories: { slug: string; name: string }[];
}

type DropdownKey = 'doors' | 'laminates';

function WatchlistNavLink({ className }: { className: string }): React.JSX.Element {
  const { items, hasLoaded } = useWatchlist();

  return (
    <Link
      href={ROUTES.WATCHLIST as Route}
      aria-label="Watchlist"
      className={cn('relative flex h-9 w-9 items-center justify-center', className)}
    >
      <Heart aria-hidden className="h-5 w-5" />
      {hasLoaded && items.length > 0 ? (
        <span className="bg-accent-2 text-surface absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold">
          {items.length}
        </span>
      ) : null}
    </Link>
  );
}

export function SiteHeader({ doorCategories }: SiteHeaderProps): React.JSX.Element {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<DropdownKey | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect((): (() => void) => {
    function handleClickOutside(event: MouseEvent): void {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return (): void => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect((): (() => void) => {
    return (): void => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  function clearCloseTimeout(): void {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function openDropdownOnHover(key: DropdownKey): void {
    clearCloseTimeout();
    setOpenDropdown(key);
  }

  function closeDropdownOnHover(): void {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  }

  const isDoorsActive = pathname === ROUTES.DOORS || pathname.startsWith(`${ROUTES.DOORS}/`);
  const isLaminatesActive =
    pathname === ROUTES.LAMINATES || pathname.startsWith(`${ROUTES.LAMINATES}/`);
  const isAboutActive = pathname === ROUTES.ABOUT;
  const isContactActive = pathname === ROUTES.CONTACT;

  function toggleDropdown(key: DropdownKey): void {
    clearCloseTimeout();
    setOpenDropdown((current) => (current === key ? null : key));
  }

  function toggleMobileSection(key: DropdownKey): void {
    setOpenMobileSection((current) => (current === key ? null : key));
  }

  function closeMobileMenu(): void {
    setIsMenuOpen(false);
    setOpenMobileSection(null);
  }

  return (
    <header className="border-border/60 bg-surface/70 sticky top-0 z-30 border-b backdrop-blur-md supports-[backdrop-filter]:bg-surface/60">
      <div
        ref={navRef}
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <Link href={ROUTES.HOME as Route} className="flex items-center gap-2">
          <Image
            src="/assets/logo/zellenth-logo-v2.webp"
            alt="Zellenth"
            width={136}
            height={40}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          <NavDropdown
            label="Doors"
            isActive={isDoorsActive}
            isOpen={openDropdown === 'doors'}
            onToggle={() => toggleDropdown('doors')}
            onClose={() => setOpenDropdown(null)}
            onOpenHover={() => openDropdownOnHover('doors')}
            onCloseHover={closeDropdownOnHover}
            viewAllLabel="All Doors"
            viewAllHref={ROUTES.DOORS as Route}
            items={doorCategories.map((category) => ({
              label: category.name,
              href: { pathname: ROUTES.DOORS, query: { category: category.slug } },
            }))}
          />

          <NavDropdown
            label="Laminates"
            isActive={isLaminatesActive}
            isOpen={openDropdown === 'laminates'}
            onToggle={() => toggleDropdown('laminates')}
            onClose={() => setOpenDropdown(null)}
            onOpenHover={() => openDropdownOnHover('laminates')}
            onCloseHover={closeDropdownOnHover}
            viewAllLabel="All Laminates"
            viewAllHref={ROUTES.LAMINATES as Route}
            items={laminateFinishOptions.map((option) => ({
              label: option.label,
              href: {
                pathname: ROUTES.LAMINATES,
                query: { finish: option.value },
                hash: 'board',
              },
            }))}
          />

          <Link
            href={ROUTES.ABOUT as Route}
            className={cn(
              'font-body text-sm font-medium transition-colors',
              isAboutActive ? 'text-brand' : 'text-text-secondary hover:text-text-primary',
            )}
          >
            About
          </Link>

          <Link
            href={ROUTES.CONTACT as Route}
            className={cn(
              'font-body text-sm font-medium transition-colors',
              isContactActive ? 'text-brand' : 'text-text-secondary hover:text-text-primary',
            )}
          >
            Contact
          </Link>
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <WatchlistNavLink className="text-text-secondary hover:text-accent-2 transition-colors" />
          <Button variant="secondary" onClick={() => setIsEnquiryOpen(true)}>
            Enquire
          </Button>
          <Link href={ROUTES.DOORS as Route}>
            <Button icon={Sparkles}>Try the Visualizer</Button>
          </Link>
        </div>

        <div className="flex items-center gap-1 sm:hidden">
          <WatchlistNavLink className="text-text-primary" />
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(true)}
            className="text-text-primary cursor-pointer"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <MobileNavDrawer
        isOpen={isMenuOpen}
        onClose={closeMobileMenu}
        openSection={openMobileSection}
        onToggleSection={toggleMobileSection}
        doorItems={doorCategories.map((category) => ({
          label: category.name,
          href: { pathname: ROUTES.DOORS, query: { category: category.slug } },
        }))}
        laminateItems={laminateFinishOptions.map((option) => ({
          label: option.label,
          href: {
            pathname: ROUTES.LAMINATES,
            query: { finish: option.value },
            hash: 'board',
          },
        }))}
        onEnquireClick={() => {
          closeMobileMenu();
          setIsEnquiryOpen(true);
        }}
      />

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        source="general"
      />
    </header>
  );
}
