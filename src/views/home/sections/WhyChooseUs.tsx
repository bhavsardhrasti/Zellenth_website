'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { pillars, stats } from '@/lib/data/why-choose';

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

// Light editorial spread: oversized counted figures divided by hairlines,
// then the pillars as numbered rows — no tiles, icons or cards.
export function WhyChooseUs() {
  return (
    <section className="bg-surface-warm px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <MicroLabel className="text-brand">Why choose us</MicroLabel>
        <MaskedHeading
          lines={['Made in-house,', 'built for Gujarat.']}
          className="text-text-primary mt-4 text-4xl sm:text-6xl"
        />
        <p className="font-body text-text-secondary mt-6 max-w-md">
          We&apos;re not a reseller. Every door that leaves our Ahmedabad factory is made, treated,
          and finished by our own team.
        </p>

        <div className="border-border mt-14 grid grid-cols-2 border-t lg:grid-cols-4 lg:divide-x lg:divide-border">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-border flex flex-col gap-2 border-b px-0 py-8 lg:border-b-0 lg:px-6 lg:first:pl-0"
            >
              <span className="font-display text-brand text-5xl leading-none sm:text-6xl">
                <CountUp value={stat.value} />
              </span>
              <MicroLabel className="text-text-secondary">{stat.label}</MicroLabel>
            </div>
          ))}
        </div>

        <ol className="border-border divide-border mt-4 divide-y border-y">
          {pillars.map((pillar, index) => (
            <li
              key={pillar.title}
              className="grid gap-2 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6"
            >
              <MicroLabel className="text-brand tabular-nums sm:col-span-1">
                {String(index + 1).padStart(2, '0')}
              </MicroLabel>
              <h3 className="font-display text-text-primary text-2xl leading-tight sm:col-span-5">
                {pillar.title}
              </h3>
              <p className="font-body text-text-secondary text-sm sm:col-span-6">{pillar.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
