'use client';

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';

import { ROUTES } from '@/utils/routes';

// Verified live Unsplash photos (door/interior/architecture) — checked with a
// HEAD request before use, not guessed from memory. Swap for real catalogue
// photography once available; see HomeView for where this is mounted.
const IMAGES = [
  { src: 'https://images.unsplash.com/photo-1634822930432-0594057fdff2?w=800&q=80', alt: 'Modern wooden door' },
  { src: 'https://images.unsplash.com/photo-1559006863-03e0799b836a?w=800&q=80', alt: 'Wood grain door detail' },
  { src: 'https://images.unsplash.com/photo-1537199322506-85bfd51c0601?w=800&q=80', alt: 'Minimalist interior' },
  { src: 'https://images.unsplash.com/photo-1659720879327-827462ca3942?w=800&q=80', alt: 'Contemporary door design' },
  { src: 'https://images.unsplash.com/photo-1624210473530-62ac2173fcf8?w=800&q=80', alt: 'Warm wood interior' },
  { src: 'https://images.unsplash.com/photo-1769275673585-07062cdeb158?w=800&q=80', alt: 'Door and entryway' },
  { src: 'https://images.unsplash.com/photo-1768666821325-dc4c35fb1629?w=800&q=80', alt: 'Wooden panel detail' },
  { src: 'https://images.unsplash.com/photo-1759262151165-3330c14fd982?w=800&q=80', alt: 'Modern home entrance' },
] as const;

// Calculate a sweeping 3D arch around the center point for both mobile and desktop
const generatePanoramicCards = () => {
  const total = IMAGES.length;
  const centerIndex = (total - 1) / 2;

  return IMAGES.map((item, i) => {
    const offset = i - centerIndex;
    const absOffset = Math.abs(offset);
    const zIndex = Math.round(10 - absOffset);

    return {
      item,
      z: zIndex,
      desktop: {
        stacked: { x: offset * 2, y: offset * -2, rotateZ: offset * 2.5, rotateY: 0, scale: 1 },
        panoramic: {
          x: offset * 18,
          y: absOffset * 3,
          rotateZ: offset * 1.5,
          rotateY: offset * -12,
          scale: 1 - absOffset * 0.05,
        },
        size: { w: '22vw', h: '32vh', ml: '-11vw', mt: '-16vh' },
      },
      mobile: {
        stacked: { x: offset * 1.5, y: offset * -1.5, rotateZ: offset * 3, rotateY: 0, scale: 1 },
        panoramic: {
          x: offset * 16,
          y: absOffset * 5,
          rotateZ: offset * 2,
          rotateY: offset * -15,
          scale: 1 - absOffset * 0.04,
        },
        size: { w: '46vw', h: '30vh', ml: '-23vw', mt: '-15vh' },
      },
    };
  });
};

const CARDS = generatePanoramicCards();

// Higher damping, zero bounce — avoids scroll jitter
const PROGRESS_SPRING = { stiffness: 80, damping: 25, mass: 0.5, restDelta: 0.001 };
const PARALLAX_SPRING = { stiffness: 50, damping: 25, mass: 0.5 };

function usePointerTilt(active: boolean, enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tiltX = useSpring(rawX, PARALLAX_SPRING);
  const tiltY = useSpring(rawY, PARALLAX_SPRING);

  useEffect(() => {
    if (!enabled || !active) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientY / window.innerHeight - 0.5) * -10);
      rawY.set((e.clientX / window.innerWidth - 0.5) * 10);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [active, enabled, rawX, rawY]);

  return { tiltX, tiltY };
}

type CardLayout = ReturnType<typeof generatePanoramicCards>[number];

function GalleryCard({
  card,
  progress,
  isMobile,
}: {
  card: CardLayout;
  progress: ReturnType<typeof useTransform<number, number>>;
  isMobile: boolean;
}) {
  const { item, desktop, mobile, z } = card;
  const activeLayout = isMobile ? mobile : desktop;
  const { stacked, panoramic, size } = activeLayout;

  // Custom S-curve easing
  const ease = useTransform(progress, (p: number) =>
    p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2,
  );

  const xRaw = useTransform(ease, [0, 1], [stacked.x, panoramic.x]);
  const yRaw = useTransform(ease, [0, 1], [stacked.y, panoramic.y]);
  const x = useTransform(xRaw, (v) => `${v}vw`);
  const y = useTransform(yRaw, (v) => `${v}vh`);

  const rotateZ = useTransform(ease, [0, 1], [stacked.rotateZ, panoramic.rotateZ]);
  const rotateY = useTransform(ease, [0, 1], [stacked.rotateY, panoramic.rotateY]);
  const scale = useTransform(ease, [0, 1], [0.75, panoramic.scale]);

  return (
    <div className="pointer-events-none absolute top-1/2 left-1/2" style={{ zIndex: z }}>
      <motion.div
        className="will-change-transform pointer-events-auto cursor-pointer rounded-md shadow-2xl shadow-black/10"
        style={{
          width: size.w,
          height: size.h,
          marginLeft: size.ml,
          marginTop: size.mt,
          x,
          y,
          rotateZ,
          rotateY,
          scale,
          transformOrigin: 'center center -50px',
        }}
      >
        <div className="group ring-border/60 relative h-full w-full overflow-hidden rounded-md bg-white p-2 pb-6 ring-1 transition-all duration-500 max-md:p-1 max-md:pb-3">
          <div className="bg-neutral-tint relative h-full w-full overflow-hidden rounded-sm">
            <div className="pointer-events-none absolute inset-0 z-10 bg-black/10 transition-colors duration-500 group-hover:bg-transparent" />
            <img
              src={item.src}
              alt={item.alt}
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PanoramicSpreadHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, PROGRESS_SPRING);
  const progress = useTransform(smoothProgress, [0.15, 0.85], [0, 1]);

  const [spread, setSpread] = useState(false);
  useMotionValueEvent(progress, 'change', (p) => setSpread(p > 0.95));

  const { tiltX, tiltY } = usePointerTilt(spread, !reduce);

  const textY = useTransform(progress, [0.2, 1], ['10vh', '-22vh']);
  const textScale = useTransform(progress, [0.2, 1], [0.85, 1]);
  const textOpacity = useTransform(progress, [0.4, 0.9], [0, 1]);

  // Reduced-motion fallback: a static, non-scroll-jacked hero. The 400vh
  // scroll-driven spread is a deliberate MOTION_INTENSITY 7 choice; it must
  // still collapse to something readable for prefers-reduced-motion.
  if (reduce) {
    return (
      <section className="bg-background flex flex-col items-center gap-8 px-6 pt-16 pb-10 text-center sm:pt-24">
        <span className="text-brand text-badge font-medium tracking-wider uppercase">
          Doors &amp; Decors
        </span>
        <h1 className="font-display text-hero text-text-primary max-w-2xl">
          Crafted for life, finished the way you choose
        </h1>
        <p className="font-body text-text-secondary max-w-lg">
          Ahmedabad-manufactured doors, finished with any laminate you choose and rendered on your
          screen before you order.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {IMAGES.slice(0, 4).map((image) => (
            <div key={image.src} className="bg-neutral-tint aspect-[3/4] overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element -- external Unsplash placeholder, not an optimizable local asset */}
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <Link
          href={ROUTES.DOORS as Route}
          className="bg-action hover:bg-action-hover text-action-text shadow-card rounded-sm px-6 py-3 font-medium transition-colors"
        >
          Try the Visualizer
        </Link>
      </section>
    );
  }

  return (
    <section
      ref={wrapRef}
      className="bg-background text-text-primary relative h-[400vh] w-full"
    >
      <div
        className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
        >
          {CARDS.map((card, i) => (
            <GalleryCard key={i} card={card} progress={progress} isMobile={isMobile} />
          ))}
        </motion.div>

        <motion.div
          className="pointer-events-none absolute z-[5] flex flex-col items-center px-6 text-center"
          style={{ y: textY, scale: textScale, opacity: textOpacity }}
        >
          <span className="text-brand mb-4 text-xs font-semibold tracking-[0.4em] uppercase md:text-[0.9vw]">
            Doors &amp; Decors
          </span>
          <h1 className="font-display text-5xl leading-none tracking-tight md:text-[5.5vw]">
            Crafted for life.
          </h1>
          <p className="text-text-secondary mt-6 max-w-[45ch] text-sm leading-relaxed font-light md:text-[1.1vw]">
            Ahmedabad-manufactured doors, finished with any laminate you choose and rendered on
            your screen before you order.
          </p>
          <Link
            href={ROUTES.DOORS as Route}
            className="bg-action hover:bg-action-hover text-action-text shadow-card pointer-events-auto mt-8 rounded-sm px-6 py-3 font-medium transition-colors"
          >
            Try the Visualizer
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
