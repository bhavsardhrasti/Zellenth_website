'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';

import { trustBadges } from '@/lib/data/trust-badges';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// A spec-sheet style strip rather than a generic icon-in-a-circle feature
// grid — thin dividers instead of cards, since these are manufacturing
// facts (not marketing "features") and read better as a certification bar.
export function TrustBadgeRow() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-surface-warm border-border border-y">
      <motion.div
        initial={reduced ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={container}
        className="divide-border/70 mx-auto flex max-w-6xl snap-x snap-mandatory gap-0 overflow-x-auto px-6 py-8 sm:grid sm:grid-cols-5 sm:divide-x sm:overflow-visible sm:px-0"
      >
        {trustBadges.map((badge) => (
          <motion.div
            key={badge.title}
            variants={item}
            className="flex w-[70vw] shrink-0 snap-start flex-col gap-2 pr-6 sm:w-auto sm:px-6 sm:first:pl-0 sm:last:pr-0"
          >
            <badge.icon aria-hidden className="text-brand h-5 w-5" strokeWidth={1.5} />
            <span className="font-body text-text-primary text-sm font-medium">{badge.title}</span>
            <span className="font-body text-text-secondary text-xs leading-relaxed">
              {badge.description}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
