import { Grain, GradedImage, MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { FinishCarousel } from '@/views/laminates/FinishCarousel';

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

export const FINISHES = [
  {
    name: 'Matte',
    value: 'matte',
    tagline: 'Soft, low sheen',
    number: '01',
    body: 'A calm, understated finish that absorbs light rather than reflecting it. Its soft appearance helps hide fingerprints and minor smudges, making it ideal for relaxed, everyday spaces.',
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=1000&q=85',
    imageAlt: 'Warm, minimal interior representing a matte surface finish',

    theme: 'matte',
  },
  {
    name: 'Gloss',
    value: 'gloss',
    tagline: 'Bright, mirror shine',
    number: '02',
    body: 'A smooth, light-reflecting finish that brings brightness and depth to a room. Its polished appearance works beautifully in contemporary interiors and is easy to wipe clean.',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1000&q=85',
    imageAlt: 'Elegant contemporary interior representing a glossy surface finish',

    theme: 'gloss',
  },
  {
    name: 'Textured',
    value: 'textured',
    tagline: 'Tactile, wood grain',
    number: '03',
    body: 'A characterful surface with a visible, tactile grain. Its added depth brings wood and stone-inspired designs to life, making it a beautiful choice for statement doors and wardrobes.',
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=1000&q=85',
    imageAlt: 'Natural material-inspired interior representing a textured surface finish',

    theme: 'textured',
  },
];

export type FinishGuideSlide = (typeof FINISHES)[number];

export function FinishGuide({ activeFinish }: { activeFinish?: string }): React.JSX.Element {
  return (
    <section className="relative isolate overflow-hidden bg-background px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <Grain />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="grid gap-6 border-b border-border pb-8 sm:pb-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <MicroLabel className="text-brand">Know your finish</MicroLabel>

            <MaskedHeading
              lines={['Three ways', 'a surface can feel.']}
              className="mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
            />
          </div>

          <div className="lg:justify-self-end lg:pb-1">
            <p className="font-body max-w-md text-sm leading-7 text-text-secondary sm:text-base">
              Every surface changes the way a room looks and feels. Discover the finish that matches
              your style, your space, and your everyday needs.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {FINISHES.map((finish) => (
                <span
                  key={finish.value}
                  className="rounded-full border border-border px-3 py-1.5 font-body text-xs text-text-secondary"
                >
                  {finish.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <FinishCarousel finishes={FINISHES} activeFinish={activeFinish ?? 'all'} />
      </div>
    </section>
  );
}
