'use client';

import * as React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from 'motion/react';

import { cn } from '@/utils/cn';

const SPRING_TRANSITION_CONFIG = {
  type: 'spring',
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
} as const;

const filterVariants: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)' },
  visible: { opacity: 1, filter: 'blur(0px)' },
};

// Interlocking 2-column stagger: each cell spans two rows and is offset by
// one, so the four images zig-zag instead of sitting in a flat grid.
const areaClasses = [
  'col-start-2 col-end-3 row-start-1 row-end-3',
  'col-start-1 col-end-2 row-start-2 row-end-4',
  'col-start-1 col-end-2 row-start-4 row-end-6',
  'col-start-2 col-end-3 row-start-3 row-end-5',
];

export const ContainerStagger = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ transition, ...props }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        initial={reduced ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true }}
        transition={{
          staggerChildren: transition?.staggerChildren ?? 0.2,
          delayChildren: transition?.delayChildren ?? 0.2,
          duration: 0.3,
          ...transition,
        }}
        {...props}
      />
    );
  },
);
ContainerStagger.displayName = 'ContainerStagger';

export const ContainerAnimated = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ transition, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={filterVariants}
      transition={{ ...SPRING_TRANSITION_CONFIG, duration: 0.3, ...transition }}
      {...props}
    />
  ),
);
ContainerAnimated.displayName = 'ContainerAnimated';

export const GalleryGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid grid-cols-2 grid-rows-[50px_150px_50px_150px_50px] gap-4', className)}
      {...props}
    />
  ),
);
GalleryGrid.displayName = 'GalleryGrid';

interface GalleryGridCellProps extends HTMLMotionProps<'div'> {
  index: number;
}

export const GalleryGridCell = React.forwardRef<HTMLDivElement, GalleryGridCellProps>(
  ({ className, index, ...props }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.2 }}
        className={cn(
          'relative overflow-hidden rounded-md shadow-xl',
          areaClasses[index],
          className,
        )}
        {...props}
      />
    );
  },
);
GalleryGridCell.displayName = 'GalleryGridCell';
