'use client';
import { MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { aboutValues } from '@/lib/data/about';

export function AboutValues() {
  return (
    <section className="bg-surface-warm px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <MicroLabel className="text-brand">Our approach</MicroLabel>
        <MaskedHeading
          lines={['What we stand for.']}
          className="text-text-primary mt-4 text-4xl sm:text-6xl"
        />
        <p className="font-body text-text-secondary mt-6 max-w-md">
          Three commitments guide everything that leaves the factory floor.
        </p>
        <ol className="border-border divide-border mt-14 divide-y border-t border-b">
          {aboutValues.map((value, index) => (
            <li
              key={value.title}
              className="group grid gap-2 py-8 sm:grid-cols-11 sm:items-baseline sm:gap-6"
            >
              <h3 className="font-display text-text-primary flex items-baseline gap-3 text-2xl leading-tight sm:col-span-6">
                <MicroLabel className="text-brand tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </MicroLabel>
                <value.icon aria-hidden className="text-brand h-5 w-5 shrink-0 self-center" />
                {value.title}
              </h3>
              <p className="font-body text-text-secondary text-sm sm:col-span-5">
                {value.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
