'use client';
import Link from 'next/link';
import type { Route } from 'next';
import { ChevronRight } from 'lucide-react';

import { GradedImage, Grain, MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { facilityFacts } from '@/lib/data/about';
const WORKSHOP = 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=1800&q=80';

export function AboutStory() {
  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      <GradedImage src={WORKSHOP} accent="#8f552d" imgClassName="scale-110" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70" />
      <Grain />
      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-between px-6 py-12 sm:py-16">
        <div className="flex items-start justify-between gap-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li className="flex items-center gap-1.5">
                <Link
                  href={'/' as Route}
                  className="font-body text-xs font-medium tracking-wide text-white/60 uppercase transition-colors hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight aria-hidden className="h-3 w-3 text-white/40" />
                <span className="font-body text-brand text-xs font-medium tracking-wide uppercase text-white/40">
                  About
                </span>
              </li>
            </ol>
          </nav>
          <MicroLabel className="hidden text-white/80 sm:block">Vatva GIDC · Ahmedabad</MicroLabel>
        </div>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <MaskedHeading
              lines={['Doors, made where', 'you can see them.']}
              className="text-5xl sm:text-7xl"
            />
            <p className="font-body mt-6 max-w-sm text-sm text-white/75">
              We manufacture main doors, wardrobe shutters, and laminate finishes out of our own
              facility in Ahmedabad and let you preview any combination before you order.
            </p>
          </div>
          <dl className="flex flex-wrap items-start gap-x-10 gap-y-4">
            {facilityFacts.map((fact) => (
              <div key={fact.label} className="min-w-[6rem]">
                <dt>
                  <MicroLabel className="text-white/60">{fact.label}</MicroLabel>
                </dt>
                <dd className="font-display mt-1 text-lg leading-tight">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
