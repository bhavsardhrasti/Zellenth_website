import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight } from 'lucide-react';

import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { WatchlistButton } from '@/components/shared/WatchlistButton';
import { ROUTES } from '@/utils/routes';
import type { LaminateDocument } from '@/lib/db/models/Laminate.model';

// A swatch wall, not a card grid: the texture is the whole tile, with name
// and finish revealed on hover (always visible on touch via the caption
// strip) — the way you'd actually browse physical laminate samples.
export function LaminateWall({ laminates }: { laminates: LaminateDocument[] }) {
  return (
    <AnimatedSection className="bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-h2 text-text-primary">Explore Laminates</h2>
            <p className="font-body text-text-secondary mt-2">
              Textures and finishes ready to try on any door.
            </p>
          </div>
          <Link
            href={ROUTES.LAMINATES as Route}
            className="text-brand font-body text-sm font-medium"
          >
            View all
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {laminates.map((laminate) => {
            const image = laminate.images.find((item) => item.isPrimary) ?? laminate.images[0];
            return (
              <Link
                key={laminate.slug}
                href={ROUTES.LAMINATES_ID(laminate.slug) as Route}
                className="group relative block aspect-square overflow-hidden rounded-md"
              >
                <ImageWrapper
                  src={image?.url.thumbnail}
                  alt={image?.altText ?? laminate.name}
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="transition-transform duration-500 group-hover:scale-110"
                  emptyLabel="No image yet"
                />
                <WatchlistButton
                  type="laminate"
                  slug={laminate.slug}
                  name={laminate.name}
                  code={laminate.code}
                  imageUrl={image?.url.thumbnail}
                />
                <div className="absolute inset-x-0 bottom-0 translate-y-1 bg-gradient-to-t from-black/70 to-transparent px-3 pt-8 pb-3 opacity-100 transition-all duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:opacity-100">
                  <span className="block text-[10px] font-semibold tracking-[0.2em] text-white/70 uppercase">
                    {laminate.colorFamily}
                  </span>
                  <span className="font-display block text-sm text-white">{laminate.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href={ROUTES.LAMINATES as Route}
            className="text-text-primary hover:text-brand font-body inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            See every finish
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
