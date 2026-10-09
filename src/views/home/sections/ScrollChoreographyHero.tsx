'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';

import { Grain, GradedImage, MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { ROUTES } from '@/utils/routes';

// Verified live Unsplash photos — checked with a HEAD request earlier.
const BACKDROP = 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=1800&q=80';

const CROPS = [
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

// Same grammar as the hero: one graded full-bleed photograph, a masked
// display headline, uppercase facts on the right, and a strip of crops that
// share a top edge — the first one unfurled taller than its neighbours.
export function ScrollChoreographyHero(): React.JSX.Element {
  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      <GradedImage src={BACKDROP} accent="#8f552d" imgClassName="scale-110" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70" />
      <Grain />

      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-between px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex items-start justify-between gap-6">
          <MicroLabel className="text-white/80">The Finish</MicroLabel>
          <MicroLabel className="hidden text-white/80 sm:block">Ahmedabad Made</MicroLabel>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <MaskedHeading
              lines={['Every detail,', 'considered.']}
              immediate
              className="text-5xl sm:text-7xl"
            />
            <p className="font-body mt-6 max-w-sm text-sm text-white/75">
              From the grain of the laminate to the line of the frame — what &quot;finished&quot;
              actually means at Zellenth.
            </p>
            <Link
              href={ROUTES.DOORS as Route}
              className="font-body mt-6 inline-block text-xs font-medium tracking-[0.14em] uppercase underline underline-offset-8 transition-opacity hover:opacity-70"
            >
              See it in your space →
            </Link>
          </div>

          <div className="flex items-start gap-3">
            {CROPS.map((crop) => (
              <figure key={crop.label} className="w-28 shrink-0 sm:w-36">
                <div className={`relative overflow-hidden ${crop.height}`}>
                  <Image src={crop.src} alt="" fill sizes="144px" className="object-cover" />
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
