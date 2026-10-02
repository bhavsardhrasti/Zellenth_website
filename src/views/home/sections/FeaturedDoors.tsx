import Link from 'next/link';
import type { Route } from 'next';
import { ArrowUpRight } from 'lucide-react';

import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { ImageWrapper } from '@/components/shared/ImageWrapper';
import DoorCard from '@/views/doors/DoorCard';
import { ROUTES } from '@/utils/routes';
import type { DoorDocument } from '@/lib/db/models/Door.model';

interface FeaturedDoorsProps {
  doors: DoorDocument[];
  categoryNames: Record<string, string>;
}

// One lead door shown large with a direct "try it" action, the next four as
// regular cards beside it — so the newest door gets real presence instead of
// every door being an identical tile in a scroller.
export function FeaturedDoors({ doors, categoryNames }: FeaturedDoorsProps) {
  const [lead, ...rest] = doors;
  if (!lead) return null;

  const leadImage = lead.images.find((image) => image.isPrimary) ?? lead.images[0];
  const leadCategory = categoryNames[lead.categoryId.toString()];

  return (
    <AnimatedSection className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-h2 text-text-primary">Featured Doors</h2>
            <p className="font-body text-text-secondary mt-2">
              Our latest additions to the catalogue.
            </p>
          </div>
          <Link href={ROUTES.DOORS as Route} className="text-brand font-body text-sm font-medium">
            View all
          </Link>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-12 lg:gap-6">
          <Link
            href={ROUTES.DOORS_ID(lead.slug) as Route}
            className="group relative block aspect-[4/5] overflow-hidden rounded-md lg:col-span-5 lg:aspect-auto lg:min-h-[560px]"
          >
            <ImageWrapper
              src={leadImage?.url.full}
              alt={leadImage?.altText ?? lead.name}
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="transition-transform duration-700 group-hover:scale-105"
              emptyLabel="No image yet"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <div>
                {leadCategory ? (
                  <span className="text-xs font-semibold tracking-[0.25em] text-white/75 uppercase">
                    {leadCategory}
                  </span>
                ) : null}
                <h3 className="font-display mt-1 text-2xl text-white">{lead.name}</h3>
                <span className="font-body text-sm text-white/70">{lead.code}</span>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition-colors group-hover:bg-white/25">
                <ArrowUpRight aria-hidden className="h-5 w-5 text-white" />
              </span>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-7">
            {rest.slice(0, 4).map((door) => (
              <DoorCard
                key={door.slug}
                door={{ slug: door.slug, name: door.name, code: door.code, images: door.images }}
                categoryName={categoryNames[door.categoryId.toString()]}
              />
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
