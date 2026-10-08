'use client';

import { GradedImage, MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { processSteps } from '@/lib/data/how-it-works';

// Verified live Unsplash photos, one per step, graded to the brand hues.
const STEP_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1760085160766-ed473efe941e?w=800&q=80',
    accent: '#8f552d',
  },
  {
    src: 'https://images.unsplash.com/photo-1611600700192-d87eaeed4f81?w=800&q=80',
    accent: '#a6792e',
  },
  {
    src: 'https://images.unsplash.com/photo-1772696860271-c53a0e799d31?w=800&q=80',
    accent: '#c1502f',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-surface-warm px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <MicroLabel className="text-brand">How it works</MicroLabel>
        <MaskedHeading
          lines={['From browsing to a', 'finished quote.']}
          className="text-text-primary mt-4 text-4xl sm:text-6xl"
        />

        <ol className="border-border mt-14 grid gap-10 border-t pt-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
          {processSteps.map((step, index) => {
            const image = STEP_IMAGES[index];
            return (
              <li
                key={step.step}
                className="group flex flex-col sm:px-6 sm:first:pl-0 sm:last:pr-0"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {image ? (
                    <GradedImage
                      src={image.src}
                      accent={image.accent}
                      sizes="(min-width: 640px) 33vw, 100vw"
                      imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                  ) : null}
                  <span className="font-display absolute top-3 left-4 text-5xl leading-none text-white/90 tabular-nums">
                    {String(step.step).padStart(2, '0')}
                  </span>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-text-primary text-2xl leading-tight">
                    {step.title}
                  </h3>
                  <MicroLabel className="text-text-secondary shrink-0 tabular-nums">
                    {step.step} / {processSteps.length}
                  </MicroLabel>
                </div>
                <p className="font-body text-text-secondary mt-2 max-w-xs text-sm">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
