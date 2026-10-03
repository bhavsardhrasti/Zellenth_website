'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { Grain, MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { ROUTES } from '@/utils/routes';

export interface FeaturedDoor {
  slug: string;
  name: string;
  code: string;
  category: string | undefined;
  image: string | undefined;
}

const CARD_FULL = 400;
const CARD_REST = 250;

// The hero's filmstrip, applied to the catalogue: cards share one top edge,
// the focused door unfurls to full height, and a blurred, brand-graded copy
// of it becomes the ambient backdrop. The cards themselves are the real,
// ungraded product photos — only the glow behind them takes the hue.
export function FeaturedDoors({ doors }: { doors: FeaturedDoor[] }) {
  const [active, setActive] = useState(0);
  const current = doors[active];
  if (!current) return null;

  return (
    <section className="bg-action relative isolate overflow-hidden px-6 py-20 text-white">
      <AnimatePresence initial={false}>
        {current.image ? (
          <motion.div
            key={current.slug}
            aria-hidden
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={current.image}
              alt=""
              className="h-full w-full scale-125 object-cover opacity-40 blur-3xl"
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: '#8f552d', mixBlendMode: 'color' }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="from-action/60 to-action absolute inset-0 -z-10 bg-gradient-to-b via-transparent" />
      <Grain />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <MicroLabel className="text-white/60">Featured doors</MicroLabel>
            <MaskedHeading
              lines={['Latest from', 'the factory.']}
              className="mt-4 text-4xl sm:text-6xl"
            />
          </div>
          <Link
            href={ROUTES.DOORS as Route}
            className="font-body shrink-0 text-xs font-medium tracking-[0.14em] uppercase underline underline-offset-8 transition-opacity hover:opacity-60"
          >
            View all →
          </Link>
        </div>

        <div className="mt-12 flex items-start gap-3 overflow-x-auto pb-2 sm:gap-4">
          {doors.map((door, i) => {
            const isActive = i === active;
            return (
              <motion.div
                key={door.slug}
                className="w-36 shrink-0 sm:w-44"
                animate={{ height: isActive ? CARD_FULL : CARD_REST }}
                transition={{ type: 'spring', stiffness: 260, damping: 34, mass: 0.9 }}
              >
                <Link
                  href={ROUTES.DOORS_ID(door.slug) as Route}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="relative block h-full w-full overflow-hidden bg-white/5"
                  aria-label={door.name}
                >
                  {door.image ? (
                    <img src={door.image} alt="" className="h-full w-full object-cover" />
                  ) : null}
                  <MicroLabel className="absolute top-3 left-3 text-white/85 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </MicroLabel>
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-black transition-opacity duration-500"
                    style={{ opacity: isActive ? 0 : 0.18 }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-white/20 pt-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {current.category ? (
                <MicroLabel className="text-white/60">{current.category}</MicroLabel>
              ) : null}
              <h3 className="font-display mt-1 text-3xl leading-tight sm:text-4xl">
                {current.name}
              </h3>
              <MicroLabel className="mt-1 block text-white/60">{current.code}</MicroLabel>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-3">
            <Link
              href={ROUTES.DOORS_ID(current.slug) as Route}
              className="bg-surface text-text-primary hover:bg-surface-warm px-6 py-3 text-sm font-medium transition-colors"
            >
              View door
            </Link>
            <Link
              href={ROUTES.DOORS_VISUALIZE(current.slug) as Route}
              className="border border-white/40 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10"
            >
              Try laminates
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
