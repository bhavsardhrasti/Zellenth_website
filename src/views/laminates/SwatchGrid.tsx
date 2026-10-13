'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { WatchlistButton } from '@/components/shared/WatchlistButton';
import { MicroLabel } from '@/components/ui/editorial';
import { ROUTES } from '@/utils/routes';
import type { LaminateSpecimen } from '@/views/laminates/SpecimenArchive';

interface SwatchGridProps {
  specimens: LaminateSpecimen[];
  isPreviewCatalog: boolean;
}

export function SwatchGrid({ specimens, isPreviewCatalog }: SwatchGridProps): React.JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const grainLabel = (direction: string): string =>
    direction === 'no-grain' ? 'No grain' : `${direction} grain`;

  return (
    <section className="bg-background px-4 pt-4 pb-16 sm:px-6 sm:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="border-border flex flex-wrap items-end justify-between gap-6 border-b pb-6">
          <div>
            <MicroLabel className="text-brand">
              {isPreviewCatalog ? 'Design previews · not live stock' : 'The specimen archive'}
            </MicroLabel>
            <h2 className="font-display text-text-primary mt-4 text-4xl sm:text-6xl">
              {isPreviewCatalog ? 'Find your finish.' : 'Every finish, on record.'}
            </h2>
          </div>
          <p className="font-body text-text-secondary max-w-xs text-sm leading-relaxed">
            {isPreviewCatalog
              ? `${specimens.length} visual previews to explore. Ask us to confirm availability and request a physical sample.`
              : `${specimens.length} ${specimens.length === 1 ? 'swatch' : 'swatches'} in the live catalogue. Save a favourite or try a finish on a door.`}
          </p>
        </div>

        {specimens.length > 0 ? (
          <motion.ul
            layout
            className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-10"
          >
            <AnimatePresence mode="popLayout">
              {specimens.map((specimen, index) => (
                <motion.li
                  key={specimen.slug}
                  layout
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: index * 0.025 }}
                  className="group min-w-0"
                >
                  <article>
                    <div className="bg-neutral-ti relative aspect-square overflow-hidden">
                      <ImageWrapper
                        src={specimen.image}
                        alt={
                          isPreviewCatalog
                            ? `${specimen.name} finish concept image`
                            : `${specimen.name} ${specimen.finishLabel.toLowerCase()} laminate`
                        }
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        className="transition-transform duration-700 group-hover:scale-105"
                        emptyLabel="Swatch photography coming soon"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20 group-focus-within:bg-black/20"
                      />
                      <WatchlistButton
                        type="laminate"
                        slug={specimen.slug}
                        name={specimen.name}
                        code={specimen.code}
                        imageUrl={specimen.thumbnail ?? specimen.image}
                      />
                      <Link
                        href={ROUTES.DOORS as Route}
                        className="absolute inset-x-3 bottom-3 bg-surface px-3 py-2.5 text-center text-xs font-medium text-text-primary opacity-100 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:pointer-events-none sm:translate-y-2 sm:opacity-0 sm:group-hover:pointer-events-auto sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:pointer-events-auto sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100"
                      >
                        Try on a door
                      </Link>
                    </div>

                    <div className="border-border group-hover:border-brand mt-3 border-t pt-3 transition-colors">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-display text-text-primary truncate text-lg leading-tight">
                          {specimen.name}
                        </h3>
                        <MicroLabel className="text-text-muted shrink-0">
                          {specimen.code}
                        </MicroLabel>
                      </div>
                      <div className="font-body text-text-secondary mt-1 flex flex-wrap gap-x-2 text-xs capitalize">
                        <span>{specimen.finishLabel}</span>
                        <span aria-hidden>·</span>
                        <span>{grainLabel(specimen.grainDirection)}</span>
                      </div>
                      <MicroLabel className="text-brand mt-2 block">
                        {specimen.colorFamily}
                      </MicroLabel>
                    </div>
                  </article>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="py-16 text-center">
            <p className="font-display text-text-primary text-2xl">
              No finishes match these filters.
            </p>
            <Link
              href={ROUTES.LAMINATES as Route}
              className="text-brand mt-4 inline-block text-sm underline underline-offset-4"
            >
              Clear filters
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
