'use client';

import { animate, motion, useInView, useReducedMotion, type Variants } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { pillars, stats } from '@/lib/data/why-choose';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// "500+" -> counts 0..500 then keeps the "+" suffix.
function CountUp({ value }: { value: string }) {
  const target = Number.parseInt(value, 10);
  const suffix = value.replace(/^\d+/, '');
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduced, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {reduced ? target : display}
      {suffix}
    </span>
  );
}

// Light warm band — the CTA after it is the only dark band before the
// footer, so the two never run together.
export function WhyChooseUs() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-surface-warm">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="text-brand text-badge font-medium tracking-wider uppercase">
              Why choose us
            </span>
            <h2 className="font-display text-h2 text-text-primary mt-3">
              Manufactured in-house, built for real conditions
            </h2>
            <p className="font-body text-text-secondary mt-4 max-w-md">
              We&apos;re not a reseller. Every door that leaves our Ahmedabad factory is made,
              treated, and finished by our own team.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md bg-border lg:col-span-7">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-surface flex flex-col gap-1 p-6 sm:p-8">
                <span className="font-display text-brand text-4xl sm:text-5xl">
                  <CountUp value={stat.value} />
                </span>
                <span className="font-body text-text-secondary text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {pillars.map((pillar) => (
            <motion.div key={pillar.title} variants={item} className="border-border border-t pt-5">
              <pillar.icon aria-hidden className="text-brand h-6 w-6" strokeWidth={1.5} />
              <h3 className="font-display text-text-primary mt-4 text-lg">{pillar.title}</h3>
              <p className="font-body text-text-secondary mt-2 text-sm">{pillar.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
