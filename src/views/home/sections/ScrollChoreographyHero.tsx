'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { motion, useReducedMotion, type Variants } from 'motion/react';

import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { ROUTES } from '@/utils/routes';

// Verified live Unsplash photos — checked with a HEAD request before use.
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=1200&q=80', // modern front door
  laminate: 'https://images.unsplash.com/photo-1611600700192-d87eaeed4f81?w=800&q=80', // laminate wood texture
  detail: 'https://images.unsplash.com/photo-1617307074423-6344f18d357f?w=800&q=80', // door detail
  interior: 'https://images.unsplash.com/photo-1772696860271-c53a0e799d31?w=800&q=80', // minimalist interior
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const cell: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

// A showcase/lookbook moment further down the homepage, not the page hero —
// the carousel above owns the h1 and the primary CTA intent. Built as a
// gapless editorial bento grid rather than a scroll-jacked convergence, so
// every cell is doing work instead of leaving dead space at rest.
export function ScrollChoreographyHero() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-background px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection immediate className="max-w-lg">
          <span className="text-brand text-badge font-medium tracking-wider uppercase">
            The Finish
          </span>
          <h2 className="font-display text-h1 text-text-primary mt-3">Every detail, considered</h2>
          <p className="font-body text-text-secondary mt-4">
            From the grain of the laminate to the line of the frame — a look at what &quot;finished&quot;
            actually means at Zellenth.
          </p>
        </AnimatedSection>

        <motion.div
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:grid-rows-2 sm:gap-4 lg:h-[56vh] lg:min-h-[400px]"
        >
          <motion.figure
            variants={cell}
            className="group relative col-span-2 row-span-2 overflow-hidden rounded-md sm:col-start-1 sm:row-start-1 sm:row-span-2 sm:col-span-1"
          >
            <img
              src={IMAGES.hero}
              alt="Zellenth door, finished with a client's chosen laminate"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent px-5 pt-16 pb-5">
              <span className="text-xs font-semibold tracking-[0.3em] text-white/80 uppercase">
                The Result
              </span>
              <p className="mt-1 font-display text-lg text-white">Real installs, real finish</p>
            </figcaption>
          </motion.figure>

          <motion.figure
            variants={cell}
            className="group relative overflow-hidden rounded-md sm:col-start-2 sm:row-start-1"
          >
            <img
              src={IMAGES.laminate}
              alt="Close-up laminate wood grain texture"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <figcaption className="absolute right-3 bottom-3 rounded-sm bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Grain &amp; sheen
            </figcaption>
          </motion.figure>

          <motion.figure
            variants={cell}
            className="group relative overflow-hidden rounded-md sm:col-start-3 sm:row-start-1"
          >
            <img
              src={IMAGES.detail}
              alt="Close-up of a finished door edge and hardware"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <figcaption className="absolute right-3 bottom-3 rounded-sm bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Edge detail
            </figcaption>
          </motion.figure>

          <motion.div variants={cell} className="col-span-2 sm:col-start-2 sm:col-span-2 sm:row-start-2">
            <Link
              href={ROUTES.DOORS as Route}
              className="bg-surface-warm hover:bg-neutral-tint group relative flex h-full flex-col justify-between overflow-hidden rounded-md p-5 transition-colors"
            >
              <img
                src={IMAGES.interior}
                alt="Minimalist interior with a finished Zellenth door"
                className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"
              />
              <span className="relative mt-auto font-body text-sm font-medium text-white">
                See it in your space →
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
