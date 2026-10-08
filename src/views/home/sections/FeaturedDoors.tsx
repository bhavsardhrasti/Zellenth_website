'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { Grain, MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { useTapToPreview } from '@/hooks/useTapToPreview';
import { ROUTES } from '@/utils/routes';

export interface FeaturedDoor {
  slug: string;
  name: string;
  code: string;
  category: string | undefined;
  image: string | undefined;
}

const SPRING = { type: 'spring', stiffness: 260, damping: 34, mass: 0.9 } as const;

// The hero's carousel, applied to the catalogue: the focused door is tall and
// centred, its neighbours sit smaller on the same top edge, and a blurred,
// brand-graded copy of the focused door glows behind. Swipe, tap a
// neighbour, or use the arrows; a mouse hover also focuses. The cards are the
// real, ungraded product photos — only the glow behind them takes the hue.
export function FeaturedDoors({ doors }: { doors: FeaturedDoor[] }): React.JSX.Element | null {
  const [active, setActive] = useState(0);
  // Mouse hover only highlights a door; it never moves the carousel.
  const [hovered, setHovered] = useState<number | null>(null);
  const [width, setWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const didDrag = useRef(false);
  const previewProps = useTapToPreview(setHovered);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(([entry]): void => {
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const count = doors.length;
  const narrow = width > 0 && width < 640;
  const gap = narrow ? 12 : 16;
  // On wide screens shrink the cards so the whole set fits without clipping.
  const fitW = (width - gap * (count - 1)) / count;
  const cardW = narrow ? Math.min(210, width * 0.52) : Math.max(120, Math.min(176, fitW));
  const fullH = narrow ? 340 : 400;
  const restH = narrow ? 230 : 250;
  const step = cardW + gap;
  const fits = !narrow && width > 0 && count * step - gap <= width + 0.5;
  const startX = (width - (count * step - gap)) / 2;

  // The carousel loops: every card sits at its shortest circular distance
  // from the focused one, so "next" on the last door wraps to the first.
  const offsetOf = (index: number): number => {
    let d = (((index - active) % count) + count) % count;
    if (d > count / 2) d -= count;
    return d;
  };
  const go = (delta: number): void => setActive((a) => (((a + delta) % count) + count) % count);
  const focused = hovered ?? active;
  const current = doors[focused];
  if (!current) return null;

  return (
    <section className="bg-action relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20 text-white">
      <AnimatePresence initial={false}>
        {current.image ? (
          <motion.div
            key={current.slug}
            aria-hidden
            className="absolute inset-0 -z-10 max-sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={current.image}
              alt=""
              fill
              sizes="50vw"
              quality={40}
              className="scale-125 object-cover opacity-40 blur-3xl"
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
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label="Previous door"
              onClick={() => go(-1)}
              className="flex h-11 w-11 items-center justify-center border border-white/30 transition-colors hover:bg-white/10"
            >
              <ChevronLeft aria-hidden className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next door"
              onClick={() => go(1)}
              className="flex h-11 w-11 items-center justify-center border border-white/30 transition-colors hover:bg-white/10"
            >
              <ChevronRight aria-hidden className="h-5 w-5" />
            </button>
          </div>
        </div>

        <motion.div
          ref={trackRef}
          className="relative mt-12 overflow-hidden"
          style={{ height: fullH, touchAction: 'pan-y' }}
          onPointerLeave={() => setHovered(null)}
          onPanStart={() => {
            didDrag.current = true;
          }}
          onPanEnd={(_, info) => {
            if (info.offset.x < -40 || info.velocity.x < -400) go(1);
            else if (info.offset.x > 40 || info.velocity.x > 400) go(-1);
            window.setTimeout(() => {
              didDrag.current = false;
            }, 0);
          }}
        >
          {doors.map((door, i) => {
            const isActive = i === focused;
            const offset = offsetOf(i);
            const preview = previewProps(i);
            const offscreen = !fits && Math.abs(offset) * step > width / 2 + cardW;
            return (
              <motion.div
                key={door.slug}
                className="absolute top-0 left-0"
                style={{ width: cardW, pointerEvents: offscreen ? 'none' : 'auto' }}
                initial={false}
                animate={{
                  x: fits ? startX + i * step : width / 2 - cardW / 2 + offset * step,
                  height: isActive ? fullH : restH,
                  opacity: offscreen ? 0 : 1,
                }}
                transition={SPRING}
              >
                <Link
                  href={ROUTES.DOORS_ID(door.slug) as Route}
                  {...preview}
                  onClick={(event) => {
                    if (didDrag.current) {
                      event.preventDefault();
                      return;
                    }
                    preview.onClick(event);
                    if (event.defaultPrevented) {
                      setActive(i);
                      setHovered(null);
                    }
                  }}
                  draggable={false}
                  className="relative block h-full w-full overflow-hidden bg-white/5"
                  aria-label={door.name}
                >
                  {door.image ? (
                    <Image
                      src={door.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 176px, 210px"
                      draggable={false}
                      className="object-cover"
                    />
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
        </motion.div>

        <div className="mt-8 border-t border-white/20 pt-6">
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

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              href={ROUTES.DOORS_ID(current.slug) as Route}
              className="bg-surface text-text-primary hover:bg-surface-warm px-4 py-3 text-center text-sm font-medium transition-colors"
            >
              View door
            </Link>
            <Link
              href={ROUTES.DOORS_VISUALIZE(current.slug) as Route}
              className="border border-white/40 px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-white/10"
            >
              Try laminates
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
