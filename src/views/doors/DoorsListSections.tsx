import Link from 'next/link';

import { GradedImage, Grain, MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import type { PaginatedMeta } from '@/types/api';
import { ROUTES } from '@/utils/routes';

export function PaginationControls({
  meta,
  activeCategory,
}: {
  meta: PaginatedMeta;
  activeCategory: string;
}): React.JSX.Element | null {
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
          href={{
            pathname: ROUTES.DOORS,
            query: { ...categoryQuery, page: meta.page - 1 },
            hash: 'collection',
          }}
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
          href={{
            pathname: ROUTES.DOORS,
            query: { ...categoryQuery, page: meta.page + 1 },
            hash: 'collection',
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

const HERO_PHOTO = 'https://images.unsplash.com/photo-1634822930432-0594057fdff2?w=1800&q=80';

export function DoorsHero({
  total,
  categoryCount,
}: {
  total: number;
  categoryCount: number;
}): React.JSX.Element {
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
            immediate
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

export function ProcessBand(): React.JSX.Element {
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

export function Assurances(): React.JSX.Element {
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
