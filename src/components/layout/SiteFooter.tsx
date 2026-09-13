import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';

import { ROUTES } from '@/utils/routes';

export function SiteFooter() {
  return (
    <footer className="border-border bg-surface border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-3">
          <Image
            src="/assets/logo/zellenth-logo-v2.webp"
            alt="Zellenth"
            width={136}
            height={40}
            className="h-8 w-auto shrink-0 self-start object-contain"
          />
          <p className="font-body text-text-secondary max-w-xs text-sm">
            Any laminate. Any door. See it before you order it: grain, sheen, and shadow, rendered
            in real time.
          </p>
        </div>

        <div className="flex gap-16">
          <div className="flex flex-col gap-3">
            <span className="text-badge text-text-secondary font-medium tracking-wider uppercase">
              Explore
            </span>
            <Link href={ROUTES.DOORS as Route} className="font-body text-text-secondary text-sm">
              Doors
            </Link>
            <Link
              href={ROUTES.LAMINATES as Route}
              className="font-body text-text-secondary text-sm"
            >
              Laminates
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-badge text-text-secondary font-medium tracking-wider uppercase">
              Company
            </span>
            <Link href={ROUTES.ABOUT as Route} className="font-body text-text-secondary text-sm">
              About
            </Link>
            <Link href={ROUTES.CONTACT as Route} className="font-body text-text-secondary text-sm">
              Contact
            </Link>
            <Link href={ROUTES.FAQ as Route} className="font-body text-text-secondary text-sm">
              FAQ
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-badge text-text-secondary font-medium tracking-wider uppercase">
              Legal
            </span>
            <Link href={ROUTES.PRIVACY as Route} className="font-body text-text-secondary text-sm">
              Privacy Policy
            </Link>
            <Link href={ROUTES.TERMS as Route} className="font-body text-text-secondary text-sm">
              Terms of Service
            </Link>
            <Link href={ROUTES.COOKIES as Route} className="font-body text-text-secondary text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>

      <div className="border-border border-t px-6 py-4">
        <p className="font-body text-text-secondary mx-auto max-w-6xl text-xs">
          © {new Date().getFullYear()} Zellenth. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
