import type { Route } from 'next';

import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

interface PageHeroProps {
  breadcrumbLabel: string;
  breadcrumbHref?: Route;
  heading: string;
  subtext?: string;
}

export function PageHero({ breadcrumbLabel, breadcrumbHref, heading, subtext }: PageHeroProps) {
  return (
    <section className="bg-surface-warm border-border border-b px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          items={[
            breadcrumbHref
              ? { label: breadcrumbLabel, href: breadcrumbHref }
              : { label: breadcrumbLabel },
          ]}
        />
        <h1 className="font-display text-hero text-text-primary mt-4">{heading}</h1>
        {subtext ? <p className="font-body text-text-secondary mt-3 max-w-2xl">{subtext}</p> : null}
      </div>
    </section>
  );
}
