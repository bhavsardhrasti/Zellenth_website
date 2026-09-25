'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { ROUTES } from '@/utils/routes';
import type { CategoryShowcase } from '@/views/home/HomeView';

// An index-and-preview layout, not an expanding rail: a plain numbered list
// on the left (the kind of thing a magazine contents page or a spec sheet
// uses), a single image pane on the right that crossfades to whichever row
// is hovered. Nothing resizes or reflows — only the image and the row's own
// text state change, which keeps it calm rather than doing an accordion
// dance. Every row is its own link, so touch just taps straight through.
export function CategoryGrid({ categories }: { categories: CategoryShowcase[] }) {
  const [active, setActive] = useState(0);
  const activeCategory = categories[active];

  return (
    <AnimatedSection className="bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-h2 text-text-primary text-center">Shop by Category</h2>
        <p className="font-body text-text-secondary mt-2 text-center">
          Find the right door for every room.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-12 sm:gap-10">
          <div className="border-border sm:col-span-5 sm:border-t">
            {categories.map((category, i) => {
              const isActive = i === active;
              return (
                <Link
                  key={category.slug}
                  href={{ pathname: ROUTES.DOORS, query: { category: category.slug } }}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group border-border flex items-center gap-4 border-b py-5 sm:border-b-0 sm:[&:not(:last-child)]:border-b"
                >
                  <span
                    className="font-body text-badge tabular-nums transition-colors"
                    style={{ color: isActive ? 'var(--color-brand)' : 'var(--color-text-secondary)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="font-display flex-1 text-xl transition-colors sm:text-2xl"
                    style={{ color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
                  >
                    {category.name}
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="text-brand h-5 w-5 shrink-0 transition-all duration-300"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateX(0)' : 'translateX(-6px)',
                    }}
                  />
                </Link>
              );
            })}
          </div>

          <Link
            href={{ pathname: ROUTES.DOORS, query: { category: activeCategory?.slug } }}
            className="relative aspect-[4/3] overflow-hidden rounded-md sm:col-span-7"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <ImageWrapper
                  src={activeCategory?.image?.url.thumbnail}
                  alt={activeCategory?.image?.altText ?? activeCategory?.name ?? ''}
                  sizes="(min-width: 640px) 55vw, 90vw"
                  emptyLabel=""
                />
              </motion.div>
            </AnimatePresence>
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
            />
            <span className="absolute bottom-4 left-4 font-display text-lg text-white">
              {activeCategory?.name}
            </span>
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
