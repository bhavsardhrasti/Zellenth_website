import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';

import { Grain, GradedImage, MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { ROUTES } from '@/utils/routes';
import { cn } from '@/utils/cn';

// Verified live Unsplash photography, used as editorial backdrop only. Real
// laminate swatches are never graded — the grade is reserved for these hero
// and section photographs, exactly as on the homepage.
const HERO_PHOTO = 'https://images.unsplash.com/photo-1559006863-03e0799b836a?w=1800&q=80';

// The hero's crop strip — three details that share a top edge, the first
// unfurled taller than its neighbours (the grammar of ScrollChoreographyHero).
const HERO_CROPS = [
  {
    src: 'https://images.unsplash.com/photo-1611600700192-d87eaeed4f81?w=600&q=80',
    label: 'Grain & sheen',
    height: 'h-44 sm:h-56',
  },
  {
    src: 'https://images.unsplash.com/photo-1617307074423-6344f18d357f?w=600&q=80',
    label: 'Edge detail',
    height: 'h-32 sm:h-40',
  },
  {
    src: 'https://images.unsplash.com/photo-1772696860271-c53a0e799d31?w=600&q=80',
    label: 'In the room',
    height: 'h-32 sm:h-40',
  },
];

export function LaminatesHero({
  isPreviewCatalog,
}: {
  isPreviewCatalog: boolean;
}): React.JSX.Element {
  return (
    <section className="bg-action relative isolate overflow-hidden text-white">
      <GradedImage
        src={HERO_PHOTO}
        accent="#8f552d"
        priority
        sizes="100vw"
        imgClassName="scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
      <Grain />
      <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-between gap-12 px-4 pt-10 pb-8 sm:gap-16 sm:px-6 sm:pt-14 sm:pb-10">
        <div className="flex items-center justify-between">
          <MicroLabel className="text-white/80">Home / Laminates</MicroLabel>
          <MicroLabel className="hidden text-white/80 sm:block">The sample board</MicroLabel>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <MaskedHeading
              lines={['Surfaces with', 'a point of view.']}
              as="h1"
              immediate
              className="text-5xl sm:text-6xl lg:text-8xl"
            />
            <p className="font-body mt-6 max-w-lg text-base leading-relaxed text-white/80">
              {isPreviewCatalog
                ? 'Explore a set of finish concepts, then ask our team to confirm current availability and request a physical sample.'
                : 'Wood grains, stone looks and solid colours  each laminate is photographed flat so you can judge the real tone, then tried on an actual Zellenth door before you commit.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={{ pathname: ROUTES.LAMINATES, hash: 'board' }}
                scroll={false}
                className="bg-surface text-text-primary hover:bg-surface-warm px-6 py-3 text-sm font-medium transition-colors"
              >
                Browse the board
              </Link>
              <Link
                href={ROUTES.DOORS as Route}
                className="border border-white/40 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10"
              >
                Try on a door
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3">
            {HERO_CROPS.map((crop) => (
              <figure key={crop.label} className="w-24 shrink-0 sm:w-32">
                <div className={cn('relative overflow-hidden', crop.height)}>
                  <Image src={crop.src} alt="" fill sizes="128px" className="object-cover" />
                  <span aria-hidden className="absolute inset-0 bg-black/15" />
                </div>
                <figcaption className="mt-2">
                  <MicroLabel className="text-white/70">{crop.label}</MicroLabel>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LaminatesTrustRow({
  total,
  isPreviewCatalog,
}: {
  total: number;
  isPreviewCatalog: boolean;
}): React.JSX.Element {
  const trustPoints = [
    {
      value: String(total),
      label: isPreviewCatalog ? 'Finish previews' : 'Finishes to explore',
    },
    { value: '03', label: 'Surface finishes' },
    { value: 'Live', label: 'Door visualizer' },
  ];

  return (
    <section
      aria-label="Laminates at a glance"
      className="bg-surface border-border border-b px-4 sm:px-6"
    >
      <dl className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-border">
        {trustPoints.map((point) => (
          <div key={point.label} className="py-5 text-center sm:py-6">
            <dt className="font-display text-text-primary text-2xl tabular-nums sm:text-3xl">
              {point.value}
            </dt>
            <dd className="mt-1">
              <MicroLabel className="text-text-secondary">{point.label}</MicroLabel>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const FINISHES = [
  {
    name: 'Matte',
    value: 'matte',
    tagline: 'Soft, low sheen',
    body: 'A quiet, non-reflective face that soaks up light instead of bouncing it. Fingerprints and smudges barely show, so it stays clean-looking in busy rooms.',
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=900&q=80',
    facts: [
      ['Sheen', 'Low'],
      ['Best for', 'Bedrooms, studies'],
      ['Care', 'Wipe with a dry cloth'],
    ],
  },
  {
    name: 'Gloss',
    value: 'gloss',
    tagline: 'Bright, mirror shine',
    body: 'A smooth, reflective face that throws light back into the room and makes colours read deeper. It wipes clean in seconds and suits doors you want to feel polished.',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=900&q=80',
    facts: [
      ['Sheen', 'High'],
      ['Best for', 'Living rooms, lobbies'],
      ['Care', 'Buff with a soft cloth'],
    ],
  },
  {
    name: 'Textured',
    value: 'textured',
    tagline: 'Tactile, wood grain',
    body: 'A grain-embossed surface you can feel as well as see. The raised grain runs with the sheet, giving wood and stone looks real depth up close.',
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=900&q=80',
    facts: [
      ['Sheen', 'Low, matte'],
      ['Best for', 'Main doors, wardrobes'],
      ['Care', 'Dust, avoid abrasives'],
    ],
  },
];

export function FinishGuide({ activeFinish }: { activeFinish?: string }): React.JSX.Element {
  return (
    <section className="bg-action relative isolate overflow-hidden px-4 py-14 text-white sm:px-6 sm:py-20">
      <Grain />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MicroLabel className="text-white/60">Know your finish</MicroLabel>
            <MaskedHeading
              lines={['Three ways', 'a surface can feel.']}
              className="mt-4 text-4xl sm:text-6xl"
            />
          </div>
          <p className="font-body max-w-xs text-sm leading-relaxed text-white/70">
            Sheen, reflection and texture change how a colour reads in a room. Pick the surface that
            suits the space, then narrow by tone below.
          </p>
        </div>

        <div className="mt-12 grid gap-10 border-t border-white/20 pt-8 md:grid-cols-3 md:gap-8">
          {FINISHES.map((finish, i) => {
            const isActive = finish.value === activeFinish;
            return (
              <Link
                key={finish.name}
                href={{
                  pathname: ROUTES.LAMINATES,
                  query: { finish: finish.value },
                  hash: 'board',
                }}
                scroll={false}
                aria-current={isActive ? 'page' : undefined}
                className="group flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={finish.image}
                    alt={`${finish.name} laminate surface`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
                  />
                  <MicroLabel className="absolute top-4 left-4 tabular-nums text-white/85">
                    {String(i + 1).padStart(2, '0')}
                  </MicroLabel>
                  <MicroLabel
                    className={cn(
                      'absolute top-4 right-4 px-2.5 py-1.5 backdrop-blur-sm transition-colors',
                      isActive ? 'bg-accent-2 text-white' : 'bg-white/15 text-white/90',
                    )}
                  >
                    {isActive ? 'Viewing' : finish.tagline}
                  </MicroLabel>
                  <div className="absolute right-4 bottom-4 left-4">
                    <h3 className="font-display flex items-center gap-2 text-3xl">
                      {finish.name}
                      <span
                        aria-hidden
                        className={cn(
                          'transition-all duration-300',
                          isActive
                            ? 'opacity-100'
                            : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                        )}
                      >
                        →
                      </span>
                    </h3>
                    <MicroLabel className="mt-1.5 block text-white/65">
                      {isActive
                        ? 'Showing this finish'
                        : `See ${finish.name.toLowerCase()} finishes`}
                    </MicroLabel>
                  </div>
                </div>

                <p className="font-body mt-5 text-sm leading-relaxed text-white/70">
                  {finish.body}
                </p>

                {/* A small spec block so the difference between the three
                    types is readable as facts, not just adjectives. */}
                <dl className="mt-5 border-t border-white/15">
                  {finish.facts.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between gap-4 border-b border-white/10 py-2.5"
                    >
                      <dt>
                        <MicroLabel className="text-white/45">{label}</MicroLabel>
                      </dt>
                      <dd className="font-body text-sm text-white/85">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
