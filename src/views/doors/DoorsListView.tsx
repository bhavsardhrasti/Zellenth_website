import Link from 'next/link';
import type { Route } from 'next';

import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { WatchlistButton } from '@/components/shared/WatchlistButton';
import { GradedImage, Grain, MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { CtaBanner } from '@/views/home/sections/CtaBanner';
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
}: DoorsListViewProps) {
  const filters = [{ label: 'All', value: 'all' }].concat(
    categories.map((category) => ({ label: category.name, value: category.slug })),
  );
  const offset = (meta.page - 1) * 24;

  return (
    <main>
      <DoorsHero total={meta.total} categoryCount={categories.length} />
      <ProcessBand />
      <div className="bg-action relative isolate overflow-hidden text-white">
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

function PaginationControls({
  meta,
  activeCategory,
}: {
  meta: PaginatedMeta;
  activeCategory: string;
}) {
  if (meta.totalPages <= 1) {
    return null;
  }

  const categoryQuery = activeCategory === 'all' ? {} : { category: activeCategory };
  const linkClass =
    'font-body text-xs font-medium tracking-[0.14em] uppercase underline underline-offset-8';

  return (
    <nav
      className="mt-16 flex items-center justify-between border-t border-white/20 pt-6"
      aria-label="Pagination"
    >
      {meta.hasPreviousPage ? (
        <Link
          href={{ pathname: ROUTES.DOORS, query: { ...categoryQuery, page: meta.page - 1 } }}
          className={linkClass}
        >
          ← Previous
        </Link>
      ) : (
        <span />
      )}
      <MicroLabel className="text-white/60 tabular-nums">
        {meta.page} / {meta.totalPages}
      </MicroLabel>
      {meta.hasNextPage ? (
        <Link
          href={{ pathname: ROUTES.DOORS, query: { ...categoryQuery, page: meta.page + 1 } }}
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

const HERO_PHOTO = 'https://images.unsplash.com/photo-1634822930432-0594057fdff2?w=1800&q=80';

function DoorsHero({ total, categoryCount }: { total: number; categoryCount: number }) {
  const stats = [
    { value: String(total).padStart(2, '0'), label: 'Door designs' },
    { value: String(categoryCount).padStart(2, '0'), label: 'Categories' },
    { value: 'Any', label: 'Laminate, live try-on' },
    { value: 'Free', label: 'Quote, no login' },
  ];
  return (
    <section className="relative isolate overflow-hidden bg-action text-white">
      <GradedImage src={HERO_PHOTO} accent="#8f552d" priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
      <Grain />
      <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-between gap-12 px-4 pt-10 pb-8 sm:gap-16 sm:px-6 sm:pt-14 sm:pb-10">
        <div className="flex items-center justify-between">
          <MicroLabel className="text-white/80">Home / Doors</MicroLabel>
          <MicroLabel className="text-white/80">Made in Ahmedabad</MicroLabel>
        </div>
        <div>
          <MaskedHeading
            lines={['Doors made', 'to be dressed.']}
            as="h1"
            className="text-5xl sm:text-6xl lg:text-8xl"
          />
          <p className="font-body mt-6 max-w-lg text-base leading-relaxed text-white/80">
            Every Zellenth door is built as a clean canvas. Choose the shape that suits your room,
            then try any laminate finish on it before you decide — grain, colour and sheen, shown on
            the door itself.
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-px border-t border-white/30 pt-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="pr-4 pb-4">
                <dt className="font-display text-4xl tabular-nums sm:text-5xl">{stat.value}</dt>
                <dd className="mt-1">
                  <MicroLabel className="text-white/70">{stat.label}</MicroLabel>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: 'Choose the door',
    body: 'Flush, panel, sliding, wardrobe or main door — start with the construction and proportions that fit the opening.',
  },
  {
    title: 'Dress it in laminate',
    body: 'Open the visualizer and try any finish on the real door, panel by panel, before a single sheet is cut.',
  },
  {
    title: 'Get a quote',
    body: 'Save your favourite combinations and send them to our team. We reply with sizes, finish advice and pricing.',
  },
];

function ProcessBand() {
  return (
    <section className="bg-background px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <MicroLabel className="text-brand">How to choose</MicroLabel>
        <MaskedHeading
          lines={['Pick it, dress it,', 'see it first.']}
          className="text-text-primary mt-4 text-4xl sm:text-6xl"
        />
        <ol className="border-border mt-12 grid gap-10 border-t pt-8 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <MicroLabel className="text-brand tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </MicroLabel>
              <h3 className="font-display text-text-primary mt-3 text-2xl">{step.title}</h3>
              <p className="font-body text-text-secondary mt-3 text-sm leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const ASSURANCES = [
  [
    'Made to measure',
    'Every door is produced to your opening — standard sizes shown are a starting point.',
  ],
  [
    'Honest finishes',
    'Laminate previews use our real swatches, so what you try is what we deliver.',
  ],
  ['Local support', 'Our Ahmedabad team handles advice, delivery and fitting guidance.'],
] as const;

function Assurances() {
  return (
    <section className="bg-background px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <MicroLabel className="text-brand">Before you order</MicroLabel>
        <div className="border-border mt-6 grid gap-0 border-t md:grid-cols-3">
          {ASSURANCES.map(([title, body]) => (
            <div
              key={title}
              className="border-border border-b py-8 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            >
              <h3 className="font-display text-text-primary text-2xl">{title}</h3>
              <p className="font-body text-text-secondary mt-3 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
