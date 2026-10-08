import Link from 'next/link';
import type { Route } from 'next';

import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { WatchlistButton } from '@/components/shared/WatchlistButton';
import { MicroLabel } from '@/components/ui/editorial';
import { laminateFinishOptions } from '@/lib/data/nav';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/utils/routes';
import { CtaBanner } from '@/views/home/sections/CtaBanner';
import { FinishGuide, LaminatesHero, SampleNotes } from '@/views/laminates/LaminatesSections';
import type { LaminateDocument } from '@/lib/db/models/Laminate.model';
import type { PaginatedMeta } from '@/types/api';

export interface LaminatesListViewProps {
  laminates: LaminateDocument[];
  meta: PaginatedMeta;
  activeFinish: string;
}

// A sample board: finishes run down a sticky side index (a scrolling strip on
// phones) and the swatches sit beside it as square chips with a spec caption.
export default function LaminatesListView({
  laminates,
  meta,
  activeFinish,
}: LaminatesListViewProps): React.JSX.Element {
  const filters = [{ label: 'All', value: 'all' }].concat(
    laminateFinishOptions.map((option) => ({ label: option.label, value: option.value })),
  );
  const offset = (meta.page - 1) * 25;

  return (
    <main>
      <LaminatesHero total={meta.total} />
      <FinishGuide />

      <section id="board" className="bg-surface-warm scroll-mt-16 px-4 pb-14 sm:px-6 sm:pb-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[200px_1fr] lg:gap-12">
          <nav aria-label="Filter by finish" className="lg:sticky lg:top-24 lg:self-start">
            <MicroLabel className="text-brand block pt-10">
              The board · {String(meta.total).padStart(2, '0')}
            </MicroLabel>
            <ul className="border-border mt-4 flex gap-6 overflow-x-auto border-y py-3 whitespace-nowrap lg:flex-col lg:gap-0 lg:border-y-0 lg:py-0">
              {filters.map((filter) => {
                const isActive = filter.value === activeFinish;
                return (
                  <li key={filter.value} className="border-border shrink-0 lg:border-b">
                    <Link
                      href={{
                        pathname: ROUTES.LAMINATES,
                        query: filter.value === 'all' ? {} : { finish: filter.value },
                      }}
                      scroll={false}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'font-body block text-xs font-medium tracking-[0.14em] uppercase underline-offset-[10px] transition-colors lg:py-4',
                        isActive
                          ? 'text-text-primary underline decoration-2 lg:no-underline'
                          : 'text-text-secondary hover:text-text-primary',
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className={cn(
                            'bg-brand hidden h-px transition-all duration-300 lg:block',
                            isActive ? 'w-6' : 'w-0',
                          )}
                        />
                        {filter.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="lg:pt-10">
            {laminates.length === 0 ? (
              <p className="font-body text-text-secondary py-20 text-center">
                No laminates in this finish yet. Check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
                {laminates.map((laminate, i) => (
                  <SwatchChip key={laminate.slug} laminate={laminate} index={offset + i + 1} />
                ))}
              </div>
            )}
            <PaginationControls meta={meta} activeFinish={activeFinish} />
          </div>
        </div>
      </section>

      <SampleNotes />
      <CtaBanner />
    </main>
  );
}

function SwatchChip({
  laminate,
  index,
}: {
  laminate: LaminateDocument;
  index: number;
}): React.JSX.Element {
  const image = laminate.images.find((item) => item.isPrimary) ?? laminate.images[0];
  const spec = [laminate.finish, laminate.size, laminate.grainDirection]
    .filter(Boolean)
    .join(' · ');
  return (
    <article className="group flex h-full flex-col">
      <div className="bg-neutral-tint relative aspect-square shrink-0 overflow-hidden">
        <Link
          href={ROUTES.LAMINATES_ID(laminate.slug) as Route}
          aria-label={laminate.name}
          className="absolute inset-0"
        >
          <ImageWrapper
            src={image?.url.mid}
            alt={image?.altText ?? laminate.name}
            sizes="(min-width: 1024px) 28vw, (min-width: 768px) 30vw, 50vw"
            className="transition-transform duration-700 ease-out group-hover:scale-110"
            emptyLabel="No image yet"
          />
          <MicroLabel className="absolute top-3 left-3 text-white/90 tabular-nums mix-blend-difference">
            {String(index).padStart(2, '0')}
          </MicroLabel>
        </Link>
        <WatchlistButton
          type="laminate"
          slug={laminate.slug}
          name={laminate.name}
          code={laminate.code}
          imageUrl={image?.url.thumbnail}
        />
      </div>
      <div className="border-border mt-3 flex-1 border-t pt-3">
        <MicroLabel className="text-brand">{laminate.colorFamily}</MicroLabel>
        <h2 className="font-display text-text-primary mt-1 line-clamp-2 min-h-[2lh] text-xl leading-tight">
          {laminate.name}
        </h2>
        <MicroLabel className="text-text-secondary mt-1 block">{laminate.code}</MicroLabel>
        {spec ? (
          <p className="font-body text-text-secondary mt-2 text-xs leading-relaxed capitalize">
            {spec}
          </p>
        ) : null}
      </div>
      <Link
        href={ROUTES.LAMINATES_ID(laminate.slug) as Route}
        className="font-body text-text-primary mt-4 text-xs font-medium tracking-[0.14em] uppercase underline underline-offset-8 transition-opacity hover:opacity-60"
      >
        View swatch →
      </Link>
    </article>
  );
}

function PaginationControls({
  meta,
  activeFinish,
}: {
  meta: PaginatedMeta;
  activeFinish: string;
}): React.JSX.Element | null {
  if (meta.totalPages <= 1) {
    return null;
  }

  const finishQuery = activeFinish === 'all' ? {} : { finish: activeFinish };
  const linkClass =
    'font-body text-text-primary text-xs font-medium tracking-[0.14em] uppercase underline underline-offset-8';

  return (
    <nav
      className="border-border mt-14 flex items-center justify-between border-t pt-6"
      aria-label="Pagination"
    >
      {meta.hasPreviousPage ? (
        <Link
          href={{
            pathname: ROUTES.LAMINATES,
            query: { ...finishQuery, page: meta.page - 1 },
            hash: 'board',
          }}
          className={linkClass}
        >
          ← Previous
        </Link>
      ) : (
        <span />
      )}
      <MicroLabel className="text-text-secondary tabular-nums">
        {meta.page} / {meta.totalPages}
      </MicroLabel>
      {meta.hasNextPage ? (
        <Link
          href={{
            pathname: ROUTES.LAMINATES,
            query: { ...finishQuery, page: meta.page + 1 },
            hash: 'board',
          }}
          className={linkClass}
        >
          Next →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
