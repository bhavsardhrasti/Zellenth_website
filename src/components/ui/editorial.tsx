'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef, type ElementType, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

// Shared vocabulary lifted from the homepage hero carousel: film grain,
// uppercase tracked micro-labels, masked line reveals, and photography
// graded to a brand hue. Sharp corners, hairlines, no cards or shadows.

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Grain({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay',
        className,
      )}
      style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }}
    />
  );
}

export function MicroLabel({ children, className }: { children: ReactNode; className?: string }) {
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
}

// Each line slides up out of its own overflow mask, staggered — the same
// reveal the hero uses for its slide titles, triggered on scroll into view.
export function MaskedHeading({ lines, as: Tag = 'h2', className, delay = 0 }: MaskedHeadingProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // Observe the heading itself: the lines are translated out of their own
  // overflow mask, so they can never count as "in view" on their own.
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <Tag ref={ref} className={cn('font-display leading-[0.92] tracking-[-0.02em]', className)}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={reduced ? false : { y: '110%' }}
            animate={inView || reduced ? { y: 0 } : { y: '110%' }}
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
  className?: string;
  imgClassName?: string;
}

// Editorial/stock photography only — never use on real product photos, the
// grade would misrepresent a door or laminate's actual colour.
export function GradedImage({ src, alt = '', accent, className, imgClassName }: GradedImageProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <img src={src} alt={alt} className={cn('h-full w-full object-cover', imgClassName)} />
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
