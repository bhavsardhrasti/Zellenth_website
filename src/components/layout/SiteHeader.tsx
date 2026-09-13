'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { Menu, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { EnquiryModal } from '@/components/shared/EnquiryModal';
import { NavDropdown } from '@/components/layout/NavDropdown';
import { MobileNavDrawer } from '@/components/layout/MobileNavDrawer';
import { laminateFinishOptions } from '@/lib/data/nav';
import { ROUTES } from '@/utils/routes';
import { cn } from '@/utils/cn';

interface SiteHeaderProps {
  doorCategories: { slug: string; name: string }[];
}

type DropdownKey = 'doors' | 'laminates';

export function SiteHeader({ doorCategories }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<DropdownKey | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDoorsActive = pathname === ROUTES.DOORS || pathname.startsWith(`${ROUTES.DOORS}/`);
  const isLaminatesActive =
    pathname === ROUTES.LAMINATES || pathname.startsWith(`${ROUTES.LAMINATES}/`);
  const isAboutActive = pathname === ROUTES.ABOUT;
  const isContactActive = pathname === ROUTES.CONTACT;

  function toggleDropdown(key: DropdownKey) {
    setOpenDropdown((current) => (current === key ? null : key));
  }

  function toggleMobileSection(key: DropdownKey) {
    setOpenMobileSection((current) => (current === key ? null : key));
  }

  function closeMobileMenu() {
    setIsMenuOpen(false);
    setOpenMobileSection(null);
  }

  return (
    <header className="border-border bg-surface/95 sticky top-0 z-30 border-b backdrop-blur-sm">
      <div ref={navRef} className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
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
            viewAllLabel="All Laminates"
            viewAllHref={ROUTES.LAMINATES as Route}
            items={laminateFinishOptions.map((option) => ({
              label: option.label,
              href: { pathname: ROUTES.LAMINATES, query: { finish: option.value } },
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
          <Button variant="secondary" onClick={() => setIsEnquiryOpen(true)}>
            Enquire
          </Button>
          <Link href={ROUTES.DOORS as Route}>
            <Button icon={Sparkles}>Try the Visualizer</Button>
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setIsMenuOpen(true)}
          className="text-text-primary cursor-pointer sm:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
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
          href: { pathname: ROUTES.LAMINATES, query: { finish: option.value } },
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
