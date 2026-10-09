import Link from 'next/link';
import type { Route } from 'next';

import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { WatchlistButton } from '@/components/shared/WatchlistButton';
import { Grain, MicroLabel } from '@/components/ui/editorial';
import { CtaBanner } from '@/views/home/sections/CtaBanner';
import {
  Assurances,
  DoorsHero,
  PaginationControls,
  ProcessBand,
} from '@/views/doors/DoorsListSections';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/utils/routes';
import type { DoorDocument } from '@/lib/db/models/Door.model';
import type { PaginatedMeta } from '@/types/api';

export interface DoorsListViewProps {
  doors: DoorDocument[];
  categoryNames: Record<string, string>;
  meta: PaginatedMeta;
  categories: { slug: string; name: string }[];
  activeCategory: string;
}

export default function DoorsListView({
  doors,
  categoryNames,
  meta,
  categories,
  activeCategory,
}: DoorsListViewProps): React.JSX.Element {
  const filters = [{ label: 'All', value: 'all' }].concat(
    categories.map((category) => ({ label: category.name, value: category.slug })),
  );
  const offset = (meta.page - 1) * 24;

  return (
    <main>
      <DoorsHero total={meta.total} categoryCount={categories.length} />
      <ProcessBand />
      <div
        id="collection"
        className="bg-action relative isolate scroll-mt-16 overflow-hidden text-white"
      >
        <div className="from-action/60 to-action absolute inset-0 -z-10 bg-gradient-to-b via-transparent" />
        <Grain />
        <MicroLabel className="relative mx-auto block max-w-6xl px-4 pt-10 pb-5 sm:px-6 sm:pt-14 text-white/60">
          The collection · {String(meta.total).padStart(2, '0')}{' '}
          {meta.total === 1 ? 'design' : 'designs'}
        </MicroLabel>
        {categories.length > 0 ? (
          <nav
            aria-label="Filter by category"
            className="bg-action/90 sticky top-16 z-20 border-y border-white/20 backdrop-blur"
          >
            <ul className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 py-3 sm:gap-7 sm:px-6 sm:py-4 whitespace-nowrap">
              {filters.map((filter) => {
                const isActive = filter.value === activeCategory;
                return (
                  <li key={filter.value} className="shrink-0">
                    <Link
                      href={{
                        pathname: ROUTES.DOORS,
                        query: filter.value === 'all' ? {} : { category: filter.value },
                      }}
                      scroll={false}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'font-body text-xs font-medium tracking-[0.14em] uppercase underline-offset-[10px] transition-colors',
                        isActive ? 'underline decoration-2' : 'text-white/60 hover:text-white',
                      )}
                    >
                      {filter.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          {doors.length === 0 ? (
            <p className="font-body py-20 text-center text-white/70">
              No doors in this category yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {doors.map((door, i) => {
                const image = door.images.find((item) => item.isPrimary) ?? door.images[0];
                const categoryName = categoryNames[door.categoryId.toString()];
                return (
                  <article key={door.slug} className="group flex h-full flex-col">
                    <div className="relative aspect-[3/4] shrink-0 overflow-hidden bg-white/5">
                      <Link
                        href={ROUTES.DOORS_ID(door.slug) as Route}
                        aria-label={door.name}
                        className="absolute inset-0"
                      >
                        <ImageWrapper
                          src={image?.url.mid}
                          alt={image?.altText ?? door.name}
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                          className="transition-transform duration-700 ease-out group-hover:scale-110"
                          emptyLabel="No image yet"
                        />
                        <MicroLabel className="absolute top-3 left-3 text-white/85 tabular-nums">
                          {String(offset + i + 1).padStart(2, '0')}
                        </MicroLabel>
                      </Link>
                      <WatchlistButton
                        type="door"
                        slug={door.slug}
                        name={door.name}
                        code={door.code}
                        imageUrl={image?.url.thumbnail}
                      />
                    </div>
                    <div className="mt-4">
                      {categoryName ? (
                        <MicroLabel className="text-white/60">{categoryName}</MicroLabel>
                      ) : null}
                      <h2 className="font-display mt-1 line-clamp-2 min-h-[2lh] text-2xl leading-tight">
                        {door.name}
                      </h2>
                      <MicroLabel className="mt-1 block text-white/60">
                        {[
                          door.code,
                          door.dimensions
                            ? `${door.dimensions.width} × ${door.dimensions.height} ${door.dimensions.unit}`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </MicroLabel>
                      {door.description ? (
                        <p className="font-body mt-3 line-clamp-2 text-sm leading-relaxed text-white/70">
                          {door.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-5 grid shrink-0 grid-cols-2 gap-2">
                      <Link
                        href={ROUTES.DOORS_ID(door.slug) as Route}
                        className="bg-surface text-text-primary hover:bg-surface-warm px-2 py-3 text-center text-sm font-medium transition-colors"
                      >
                        View door
                      </Link>
                      <Link
                        href={ROUTES.DOORS_VISUALIZE(door.slug) as Route}
                        className="border border-white/40 px-2 py-3 text-center text-sm font-medium transition-colors hover:bg-white/10"
                      >
                        Try laminates
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <PaginationControls meta={meta} activeCategory={activeCategory} />
        </div>
      </div>
      <Assurances />
      <CtaBanner />
    </main>
  );
}
