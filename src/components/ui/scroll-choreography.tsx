'use client';

import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useRef, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface ScrollChoreographyProps {
  className?: string;
  images: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  /**
   * Rendered inside the same sticky viewport as the images (not after it),
   * so overlay text/CTAs stay pinned and layered on top for the whole
   * 300vh scroll instead of appearing once the animation has scrolled past.
   * Given the smoothed scroll progress (0-1) so overlay content can time
   * itself against the choreography (e.g. fade in only once the hero image
   * has expanded, instead of colliding with the busy 4-image grid early on).
   */
  children?: (progress: MotionValue<number>) => ReactNode;
}

export function ScrollChoreography({ className, images, children }: ScrollChoreographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 50,
    mass: 1.2,
    restDelta: 0.001,
  });

  const xLeft = '-24vw';
  const xRight = '24vw';
  const yTop = '-17vh';
  const yBottom = '17vh';

  // Phase 1: 0-0.3 (diagonal swap), Phase 2: gathering to center (staggered
  // per image so they converge one after another instead of in lockstep —
  // moving in perfect unison read as the images "colliding" rather than
  // assembling), Phase 3: 0.7-0.9 (top-right expands to full screen).
  const tlX = useTransform(smoothProgress, [0, 0.3, 0.32, 0.58, 1], [xLeft, xLeft, xLeft, '0vw', '0vw']);
  const tlY = useTransform(smoothProgress, [0, 0.3, 0.32, 0.58, 1], [yTop, yBottom, yBottom, '0vh', '0vh']);
  const tlScale = useTransform(smoothProgress, [0.32, 0.58], [1, 0.82]);

  const brX = useTransform(smoothProgress, [0, 0.3, 0.38, 0.64, 1], [xRight, xRight, xRight, '0vw', '0vw']);
  const brY = useTransform(smoothProgress, [0, 0.3, 0.38, 0.64, 1], [yBottom, yTop, yTop, '0vh', '0vh']);
  const brScale = useTransform(smoothProgress, [0.38, 0.64], [1, 0.82]);

  const blX = useTransform(smoothProgress, [0, 0.3, 0.35, 0.61, 1], [xLeft, xLeft, xLeft, '0vw', '0vw']);
  const blY = useTransform(smoothProgress, [0, 0.3, 0.35, 0.61, 1], [yBottom, yBottom, yBottom, '0vh', '0vh']);
  const blScale = useTransform(smoothProgress, [0.35, 0.61], [1, 0.82]);

  const trX = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [xRight, xRight, xRight, '0vw', '0vw']);
  const trY = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [yTop, yTop, yTop, '0vh', '0vh']);

  const heroWidth = useTransform(smoothProgress, [0.65, 0.7, 0.9, 1], ['40vw', '40vw', '100vw', '100vw']);
  const heroHeight = useTransform(smoothProgress, [0.65, 0.7, 0.9, 1], ['28vh', '28vh', '100vh', '100vh']);
  const heroRadiusRaw = useTransform(smoothProgress, [0.85, 0.96], [20, 0]);
  const heroRadius = useTransform(heroRadiusRaw, (v) => `${v}px`);

  const underImagesOpacity = useTransform(smoothProgress, [0.62, 0.72], [1, 0]);

  const baseImageClasses =
    'absolute left-1/2 top-1/2 w-[40vw] h-[28vh] overflow-hidden -translate-x-1/2 -translate-y-1/2 bg-neutral-tint shadow-2xl will-change-transform rounded-xl ring-1 ring-black/5';

  return (
    <div ref={containerRef} className={cn('relative h-[300vh] w-full', className)}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Fills the cross-shaped gap between the four corner images instead
            of leaving it flat and empty — a soft radial wash in the brand
            hue, plus a static wordmark so the composition has a focal point
            from the very first frame, before any scroll has happened. */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <div
            className="absolute h-[70vh] w-[70vh] rounded-full opacity-60 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, color-mix(in srgb, var(--color-brand) 18%, transparent), transparent 70%)',
            }}
          />
          <span className="font-display text-text-primary/[0.14] text-[14vw] leading-none select-none">
            Z
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            style={{ x: tlX, y: tlY, opacity: underImagesOpacity, scale: tlScale }}
            className={cn(baseImageClasses, 'z-10')}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- external Unsplash placeholder */}
            <img src={images.topLeft} alt="" className="h-full w-full object-cover" />
          </motion.div>

          <motion.div
            style={{ x: brX, y: brY, opacity: underImagesOpacity, scale: brScale }}
            className={cn(baseImageClasses, 'z-20')}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- external Unsplash placeholder */}
            <img src={images.bottomRight} alt="" className="h-full w-full object-cover" />
          </motion.div>

          <motion.div
            style={{ x: blX, y: blY, opacity: underImagesOpacity, scale: blScale }}
            className={cn(baseImageClasses, 'z-30')}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- external Unsplash placeholder */}
            <img src={images.bottomLeft} alt="" className="h-full w-full object-cover" />
          </motion.div>

          <motion.div
            style={{ x: trX, y: trY, width: heroWidth, height: heroHeight, borderRadius: heroRadius }}
            className="ring-black/5 bg-neutral-tint shadow-2xl will-change-transform absolute top-1/2 left-1/2 z-40 origin-center -translate-x-1/2 -translate-y-1/2 overflow-hidden ring-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- external Unsplash placeholder */}
            <img
              src={images.topRight}
              alt="Zellenth door, finished with your choice of laminate"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>

        {children?.(smoothProgress)}
      </div>
    </div>
  );
}

export default ScrollChoreography;
