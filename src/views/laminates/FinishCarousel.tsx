'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';

import { cn } from '@/utils/cn';
import type { FinishGuideSlide } from '@/views/laminates/LaminatesSections';

interface FinishCarouselProps {
  finishes: FinishGuideSlide[];
  activeFinish: string;
}

export function FinishCarousel({ finishes, activeFinish }: FinishCarouselProps): React.JSX.Element {
  const initialIndex = Math.max(
    0,
    finishes.findIndex((finish) => finish.value === activeFinish),
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const reduceMotion = useReducedMotion();
  const finish = finishes[activeIndex]!;
  const isSelected = finish.value === activeFinish;

  const changeFinish = (direction: number): void => {
    setActiveIndex(
      (currentIndex) => (currentIndex + direction + finishes.length) % finishes.length,
    );
  };

  const router = useRouter();
  const goToBoard = (): void => {
    document.getElementById('board')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    router.replace(`/laminates?finish=${encodeURIComponent(finish.value)}#board`, {
      scroll: false,
    });
  };

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm sm:mt-10">
      <div className="grid min-h-96 lg:grid-cols-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`image-${finish.value}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
            className="bg-border relative min-h-72 overflow-hidden sm:min-h-96"
          >
            <Image
              src={finish.image}
              alt={finish.imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority={activeIndex === initialIndex}
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
            <span className="absolute top-5 left-5 rounded-full border border-white/40 bg-black/20 px-4 py-2 font-body text-xs tracking-[0.14em] text-white backdrop-blur-sm">
              {finish.number} / 03
            </span>
            <span className="absolute bottom-5 left-5 font-display text-4xl text-white sm:text-5xl">
              {finish.name}
            </span>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`text-${finish.value}`}
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -24 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
            >
              <p className="font-body text-brand text-xs font-medium tracking-[0.16em] uppercase">
                {finish.tagline}
              </p>
              <h3 className="font-display text-text-primary mt-3 text-3xl sm:text-4xl">
                {finish.name} finish
              </h3>
              <p className="font-body text-text-secondary mt-4 text-sm leading-7 sm:text-base">
                {finish.body}
              </p>
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={goToBoard}
            aria-current={isSelected ? 'page' : undefined}
            className={cn(
              'mt-6 inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-md px-5',
              'font-body text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
              isSelected
                ? 'bg-brand text-white'
                : 'border border-border text-text-primary hover:border-brand hover:bg-brand hover:text-white',
            )}
          >
            {isSelected ? `Viewing ${finish.name} finishes` : `Explore ${finish.name} finishes`}
            <span aria-hidden="true">→</span>
          </button>

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <div className="flex items-center gap-2" aria-label="Choose a surface finish">
              {finishes.map((item, index) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${item.name} finish`}
                  aria-pressed={index === activeIndex}
                  className={cn(
                    'h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                    index === activeIndex ? 'w-8 bg-brand' : 'w-2.5 bg-border hover:bg-brand/50',
                  )}
                />
              ))}
              <span className="font-body text-text-muted ml-2 text-xs tabular-nums">
                {finish.number} / 03
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => changeFinish(-1)}
                aria-label="Show previous finish"
                className="flex size-10 items-center justify-center rounded-full border border-border text-text-primary transition-colors hover:border-brand hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                onClick={() => changeFinish(1)}
                aria-label="Show next finish"
                className="flex size-10 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
