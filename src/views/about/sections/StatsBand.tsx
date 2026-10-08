'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { MicroLabel } from '@/components/ui/editorial';
import type { Stat } from '@/lib/data/why-choose';

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
export function StatsBand({ stats }: { stats: Stat[] }) {
  return (
    <section className="bg-surface border-border border-y">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <MicroLabel className="text-brand">By the numbers</MicroLabel>
        <div className="border-border mt-10 grid grid-cols-2 border-t lg:grid-cols-4 lg:divide-x lg:divide-border">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-border flex flex-col gap-2 border-b py-8 lg:border-b-0 lg:px-6 lg:first:pl-0"
            >
              <span className="font-display text-brand text-5xl leading-none sm:text-6xl">
                <CountUp value={stat.value} />
              </span>
              <MicroLabel className="text-text-secondary">{stat.label}</MicroLabel>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
