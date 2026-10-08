'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { Grain, MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { useTapToPreview } from '@/hooks/useTapToPreview';
import { ROUTES } from '@/utils/routes';

export interface LaminateSample {
  slug: string;
  name: string;
  code: string;
  colorFamily: string;
  image: string | undefined;
}

// A physical sample fan-deck: strips hang from a single pivot edge and splay
// apart; the one you point at swings straight and lifts clear of the others.
// Real textures stay ungraded so finishes are shown true.
export function LaminateWall({ samples }: { samples: LaminateSample[] }) {
  const [active, setActive] = useState(Math.floor(samples.length / 2));
  const previewProps = useTapToPreview(setActive);
  const current = samples[active];
  if (!current) return null;
  const mid = (samples.length - 1) / 2;

  return (
    <section className="bg-action relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20 text-white">
      <Grain />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <MicroLabel className="text-white/60">Laminate library</MicroLabel>
            <MaskedHeading
              lines={['Every finish,', 'on your door.']}
              className="mt-4 text-4xl sm:text-6xl"
            />
          </div>
          <Link
            href={ROUTES.LAMINATES as Route}
            className="font-body shrink-0 text-xs font-medium tracking-[0.14em] uppercase underline underline-offset-8 transition-opacity hover:opacity-60"
          >
            View all →
          </Link>
        </div>

        <div className="relative mt-14 flex h-[420px] justify-center overflow-hidden pt-4">
          <div aria-hidden className="absolute top-4 right-0 left-0 h-px bg-white/25" />
          {samples.map((sample, i) => {
            const isActive = i === active;
            const angle = isActive ? 0 : (i - mid) * 5.5;
            return (
              <motion.div
                key={sample.slug}
                className={`-ml-12 first:ml-0 w-24 shrink-0 origin-top sm:-ml-10 sm:w-28 ${i >= 5 ? 'hidden sm:block' : ''}`}
                style={{ zIndex: isActive ? 20 : 10 - Math.abs(i - active) }}
                animate={{ rotate: angle, y: isActive ? 12 : 0 }}
                transition={{ type: 'spring', stiffness: 170, damping: 20 }}
              >
                <Link
                  href={ROUTES.LAMINATES_ID(sample.slug) as Route}
                  {...previewProps(i)}
                  aria-label={sample.name}
                  className="relative block h-[360px] w-full overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                >
                  {sample.image ? (
                    <Image src={sample.image} alt="" fill sizes="112px" className="object-cover" />
                  ) : null}
                  <span
                    aria-hidden
                    className="bg-action absolute top-3 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full ring-1 ring-white/30"
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-white/20 pt-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MicroLabel className="text-white/60">{current.colorFamily}</MicroLabel>
              <h3 className="font-display mt-1 text-3xl leading-tight sm:text-4xl">
                {current.name}
              </h3>
              <MicroLabel className="mt-1 block text-white/60">{current.code}</MicroLabel>
            </motion.div>
          </AnimatePresence>
          <Link
            href={ROUTES.LAMINATES_ID(current.slug) as Route}
            className="bg-surface text-text-primary hover:bg-surface-warm px-6 py-3 text-sm font-medium transition-colors"
          >
            View finish
          </Link>
        </div>
      </div>
    </section>
  );
}
