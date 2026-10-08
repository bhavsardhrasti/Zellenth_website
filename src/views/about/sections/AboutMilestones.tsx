'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';

import { MicroLabel } from '@/components/ui/editorial';
import { aboutMilestones } from '@/lib/data/about';

export function AboutMilestones() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="bg-background px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <MicroLabel className="text-brand">Our story</MicroLabel>
        <h2 className="font-display text-text-primary mt-4 text-4xl leading-[0.95] tracking-[-0.02em] sm:text-6xl">
          Twelve years on the factory floor.
        </h2>

        <div ref={ref} className="relative mt-14 pl-6 sm:pl-0">
          <div
            aria-hidden
            className="bg-border absolute top-2 bottom-2 left-0 w-px sm:left-[7.5rem]"
          >
            <motion.div
              className="bg-brand absolute inset-x-0 top-0 h-full origin-top"
              initial={reduced ? { scaleY: 1 } : { scaleY: 0 }}
              animate={inView || reduced ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <ol className="divide-border divide-y">
            {aboutMilestones.map((milestone) => (
              <li
                key={milestone.year}
                className="relative grid gap-2 py-7 sm:grid-cols-12 sm:items-baseline sm:gap-6"
              >
                <MicroLabel className="text-brand tabular-nums sm:col-span-2">
                  {milestone.year}
                </MicroLabel>
                <span
                  aria-hidden
                  className="bg-brand absolute -left-[1.125rem] top-8 h-1.5 w-1.5 -translate-y-1/2 rounded-full sm:left-[7.31rem]"
                />
                <h3 className="font-display text-text-primary text-2xl leading-tight sm:col-span-4">
                  {milestone.title}
                </h3>
                <p className="font-body text-text-secondary text-sm sm:col-span-6">
                  {milestone.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
