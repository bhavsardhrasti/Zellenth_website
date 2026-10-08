import { GradedImage, Grain, MaskedHeading, MicroLabel } from '@/components/ui/editorial';

const HERO_PHOTO = 'https://images.unsplash.com/photo-1559006863-03e0799b836a?w=1800&q=80';

export function LaminatesHero({ total }: { total: number }): React.JSX.Element {
  const stats = [
    { value: String(total).padStart(2, '0'), label: 'Finishes in stock' },
    { value: '03', label: 'Surface types' },
    { value: 'Real', label: 'Swatch previews' },
    { value: 'Free', label: 'Sample advice' },
  ];
  return (
    <section className="bg-action relative isolate overflow-hidden text-white">
      <GradedImage src={HERO_PHOTO} accent="#8f552d" priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
      <Grain />
      <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-between gap-12 px-4 pt-10 pb-8 sm:gap-16 sm:px-6 sm:pt-14 sm:pb-10">
        <div className="flex items-center justify-between">
          <MicroLabel className="text-white/80">Home / Laminates</MicroLabel>
          <MicroLabel className="text-white/80">The sample board</MicroLabel>
        </div>
        <div>
          <MaskedHeading
            lines={['Surfaces with', 'a point of view.']}
            as="h1"
            className="text-5xl sm:text-6xl lg:text-8xl"
          />
          <p className="font-body mt-6 max-w-lg text-base leading-relaxed text-white/80">
            Wood grains, stone looks and solid colours — each laminate is photographed flat so you
            can judge the real tone, then tried on an actual Zellenth door before you commit.
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

const FINISHES = [
  {
    name: 'Matte',
    body: 'Soft, low-sheen surface that hides fingerprints and sits quietly in a bedroom or study.',
  },
  {
    name: 'Gloss',
    body: 'A reflective, high-shine face that brightens a room and wipes clean in seconds.',
  },
  {
    name: 'Textured',
    body: 'A tactile, grain-embossed surface that feels as much like timber as it looks.',
  },
];

export function FinishGuide(): React.JSX.Element {
  return (
    <section className="bg-background px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <MicroLabel className="text-brand">Know your finish</MicroLabel>
        <MaskedHeading
          lines={['Three ways', 'a surface can feel.']}
          className="text-text-primary mt-4 text-4xl sm:text-6xl"
        />
        <dl className="border-border mt-12 grid gap-10 border-t pt-8 md:grid-cols-3 md:gap-8">
          {FINISHES.map((finish, i) => (
            <div key={finish.name}>
              <MicroLabel className="text-brand tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </MicroLabel>
              <dt className="font-display text-text-primary mt-3 text-2xl">{finish.name}</dt>
              <dd className="font-body text-text-secondary mt-3 text-sm leading-relaxed">
                {finish.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const NOTES = [
  [
    'Screens differ',
    'Colour on a phone or monitor can shift slightly. Visit us or ask for a physical sample before a large order.',
  ],
  [
    'Grain direction',
    'Each laminate lists its grain direction, so vertical and horizontal runs line up the way you expect.',
  ],
  [
    'Try before you decide',
    'Every swatch links straight to the visualizer, where you can see it on a real door.',
  ],
] as const;

export function SampleNotes(): React.JSX.Element {
  return (
    <section className="bg-surface-warm px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <MicroLabel className="text-brand">Good to know</MicroLabel>
        <div className="border-border mt-6 grid border-t md:grid-cols-3">
          {NOTES.map(([title, body]) => (
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
