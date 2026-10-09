'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /**
   * Use for content already in the initial viewport (e.g. a page hero right
   * below the breadcrumb). Animates in on mount instead of waiting on a
   * scroll-triggered IntersectionObserver, which must never be the only way
   * above-the-fold content becomes visible.
   */
  immediate?: boolean;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  duration = 0.5,
  immediate = false,
}: AnimatedSectionProps): React.JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration, delay, ease: 'easeOut' as const };

  if (immediate) {
    return (
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
