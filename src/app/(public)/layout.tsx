export const dynamic = 'force-dynamic';
import { Suspense, type ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { PaletteDemoToggle } from '@/components/shared/PaletteDemoToggle';
import { SmoothScroll } from '@/components/shared/SmoothScroll';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { listDoorCategories } from '@/lib/services/door-category.service';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const { items: categories } = await listDoorCategories({ page: 1, limit: 20 });
  const doorCategories = categories
    .filter((category) => category.isActive)
    .map((category) => ({ slug: category.slug, name: category.name }));

  return (
    <div className="flex min-h-dvh flex-col">
      <SmoothScroll />
      <SiteHeader doorCategories={doorCategories} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <WhatsAppButton />
      <Suspense fallback={null}>
        <PaletteDemoToggle />
      </Suspense>
    </div>
  );
}
