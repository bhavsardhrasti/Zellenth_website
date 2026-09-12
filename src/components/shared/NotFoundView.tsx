import Link from 'next/link';
import type { Route } from 'next';

import { ROUTES } from '@/utils/routes';

interface NotFoundViewProps {
  title?: string;
  description?: string;
  homeHref?: Route;
  homeLabel?: string;
}

export function NotFoundView({
  title = "This page doesn't exist",
  description = "The page you're looking for may have moved or been removed.",
  homeHref = ROUTES.HOME as Route,
  homeLabel = 'Back to home',
}: NotFoundViewProps) {
  return (
    <main className="bg-background flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="font-display text-hero text-brand">404</span>
      <h1 className="font-display text-h1 text-text-primary">{title}</h1>
      <p className="text-body text-text-secondary max-w-md">{description}</p>
      <Link
        href={homeHref}
        className="bg-action hover:bg-action-hover text-action-text rounded-sm text-button mt-4 px-4 py-2 font-medium transition-colors"
      >
        {homeLabel}
      </Link>
    </main>
  );
}
