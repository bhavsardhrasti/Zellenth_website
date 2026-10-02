'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

export interface TimelineStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface VerticalTimelineProps {
  eyebrow: string;
  title: string;
  description?: string;
  steps: TimelineStep[];
}

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Heading column on the left, an ordered list on the right threaded by a
// vertical line that draws down as the steps reveal — a real sequence, so
// the numbers and the line carry order information rather than decoration.
export function VerticalTimeline({ eyebrow, title, description, steps }: VerticalTimelineProps) {
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="timeline-title" className="bg-background px-6 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
        <div>
          <span className="text-brand text-badge font-medium tracking-wider uppercase">
            {eyebrow}
          </span>
          <h2 id="timeline-title" className="font-display text-h2 text-text-primary mt-3">
            {title}
          </h2>
          {description ? (
            <p className="font-body text-text-secondary mt-4 max-w-md">{description}</p>
          ) : null}
        </div>

        <motion.ol
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={list}
          className="relative space-y-5 pl-10"
        >
          <motion.span
            aria-hidden
            className="bg-brand absolute top-2 bottom-2 left-3.5 w-px origin-top"
            variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 1.1 } } }}
          />
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              variants={stepVariants}
              className="bg-surface border-border shadow-card relative rounded-md border p-5"
            >
              <span className="bg-brand text-action-text ring-background font-body absolute top-5 -left-[2.35rem] grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ring-4">
                {index + 1}
              </span>
              <div className="flex items-start gap-4">
                <step.icon
                  aria-hidden
                  className="text-brand mt-0.5 h-5 w-5 shrink-0"
                  strokeWidth={1.5}
                />
                <div>
                  <h3 className="font-display text-text-primary text-lg">{step.title}</h3>
                  <p className="font-body text-text-secondary mt-1.5 text-sm">{step.description}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
