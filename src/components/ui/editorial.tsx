'use client';

import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

// Shared vocabulary lifted from the homepage hero carousel: film grain,
// uppercase tracked micro-labels, masked line reveals, and photography
// graded to a brand hue. Sharp corners, hairlines, no cards or shadows.

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Grain({ className }: { className?: string }): React.JSX.Element {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay max-sm:hidden',
        className,
      )}
      style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }}
    />
  );
}

export function MicroLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <span
      className={cn('font-body text-[11px] font-medium tracking-[0.14em] uppercase', className)}
    >
      {children}
    </span>
  );
}

interface MaskedHeadingProps {
  lines: string[];
  as?: ElementType;
  className?: string;
  delay?: number;
  /**
   * Reveal on mount instead of waiting on a scroll-triggered
   * IntersectionObserver. Pass this for any heading already in the initial
   * viewport (page heroes, banners): a scroll observer is never a safe way to
   * reveal above-the-fold content, and inertia scrolling (Lenis) can stop the
   * observer firing at all, leaving the line parked outside its overflow mask.
   */
  immediate?: boolean;
}

// Each line slides up out of its own overflow mask, staggered — the same
// reveal the hero uses for its slide titles. Off-screen headings wait for the
// observer; immediate headings animate straight away so they can never be left
// hidden. Either way the mask is cleared once the animation has had its chance,
// so a missed observer degrades to "visible", not "blank".
export function MaskedHeading({
  lines,
  as: Tag = 'h2',
  className,
  delay = 0,
  immediate = false,
}: MaskedHeadingProps): React.JSX.Element {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  // Two-phase mount: the first client paint still shows the resting state (so
  // the server HTML and the hydration match, and content is readable without
  // JS), and only after mount do we arm the mask. From then on the reveal is
  // driven by the observer, with `immediate` skipping the wait entirely. A
  // heading therefore degrades to plainly visible, never to blank.
  const [armed, setArmed] = useState(false);

  useEffect((): (() => void) => {
    const frameId = window.requestAnimationFrame(() => setArmed(true));
    return (): void => window.cancelAnimationFrame(frameId);
  }, []);

  const shown = reduced || immediate || inView;

  return (
    <Tag ref={ref} className={cn('font-display leading-[0.92] tracking-[-0.02em]', className)}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={false}
            animate={shown || !armed ? { y: 0 } : { y: '110%' }}
            transition={{ duration: 0.7, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

interface GradedImageProps {
  src: string;
  alt?: string;
  accent: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}

// Editorial/stock photography only — never use on real product photos, the
// grade would misrepresent a door or laminate's actual colour.
export function GradedImage({
  src,
  alt = '',
  accent,
  sizes = '100vw',
  priority = false,
  className,
  imgClassName,
}: GradedImageProps): React.JSX.Element {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-cover', imgClassName)}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: accent, mixBlendMode: 'color' }}
      />
      <div
        className="absolute inset-0 opacity-55"
        style={{ backgroundColor: accent, mixBlendMode: 'multiply' }}
      />
    </div>
  );
}
