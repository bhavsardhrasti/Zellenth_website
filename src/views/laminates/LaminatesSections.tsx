import Image from 'next/image';
import Link from 'next/link';

import { Grain, GradedImage, MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { ROUTES } from '@/utils/routes';
import { cn } from '@/utils/cn';

// Verified live Unsplash photography, used as editorial backdrop only. Real
// laminate swatches are never graded — the grade is reserved for these hero
// and section photographs, exactly as on the homepage.
const HERO_PHOTO = 'https://images.unsplash.com/photo-1559006863-03e0799b836a?w=1800&q=80';

// The hero's crop strip — three details that share a top edge, the first
// unfurled taller than its neighbours (the grammar of ScrollChoreographyHero).

export function LaminatesHero({
  total,
  isPreviewCatalog,
}: {
  total: number;
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
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/20 pt-6 sm:gap-10">
              <div>
                <dt className="font-display text-4xl tabular-nums sm:text-5xl">{total}</dt>
                <dd className="mt-1">
                  <MicroLabel className="text-white/65">
                    {isPreviewCatalog ? 'Finish previews' : 'Finishes to explore'}
                  </MicroLabel>
                </dd>
              </div>
              <div>
                <dt className="font-display text-5xl tabular-nums sm:text-5xl">03</dt>
                <dd className="mt-1">
                  <MicroLabel className="text-white/65">Surface finishes</MicroLabel>
                </dd>
              </div>
              <div>
                <dt className="font-display text-5xl tabular-nums sm:text-5xl">Live</dt>
                <dd className="mt-1">
                  <MicroLabel className="text-white/65">Door visualizer</MicroLabel>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
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
    <section className="bg-surface-warm relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
      <Grain />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MicroLabel className="text-brand">Know your finish</MicroLabel>
            <MaskedHeading
              lines={['Three ways', 'a surface can feel.']}
              className="mt-4 text-4xl sm:text-6xl"
            />
          </div>
          <p className="font-body max-w-xs text-sm leading-relaxed text-text-secondary">
            Sheen, reflection and texture change how a colour reads in a room. Pick the surface that
            suits the space, then narrow by tone below.
          </p>
        </div>

        <div className="mt-12 grid gap-10 border-t border-border pt-8 md:grid-cols-3 md:gap-8">
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

                <p className="font-body mt-5 flex-1 text-sm leading-relaxed text-text-secondary">
                  {finish.body}
                </p>

                {/* A small spec block so the difference between the three
                    types is readable as facts, not just adjectives. */}
                <dl className="mt-5 border-t border-border">
                  {finish.facts.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between gap-4 border-b border-border py-2.5"
                    >
                      <dt>
                        <MicroLabel className="text-brand">{label}</MicroLabel>
                      </dt>
                      <dd className="font-body text-sm text-text-secondary">{value}</dd>
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
