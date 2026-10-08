'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { useTapToPreview } from '@/hooks/useTapToPreview';
import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { ROUTES } from '@/utils/routes';
import type { CategoryShowcase } from '@/views/home/HomeView';

// Light index on the hero's grammar: large display names with counters on
// the left, one sharp-cornered preview on the right that crossfades. Hover
// or focus previews, every row is a link. No rounded cards or arrows-in-
// circles.
export function CategoryGrid({ categories: allCategories }: { categories: CategoryShowcase[] }) {
  // A category with no door has no image to preview and nothing to browse.
  const categories = allCategories.filter((category) => category.image);
  const [active, setActive] = useState(0);
  const previewProps = useTapToPreview(setActive);
  const activeCategory = categories[active];
  const total = String(categories.length).padStart(2, '0');

  if (categories.length === 0) return null;

  return (
    <section className="bg-background px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <MicroLabel className="text-brand">Shop by category</MicroLabel>
        <MaskedHeading
          lines={['A door for', 'every room.']}
          className="text-text-primary mt-4 text-4xl sm:text-6xl"
        />

        <div className="mt-14 grid gap-10 border-border border-t pt-10 lg:grid-cols-12 lg:gap-14">
          <ul className="lg:col-span-6">
            {categories.map((category, i) => {
              const isActive = i === active;
              return (
                <li key={category.slug} className="border-border border-b">
                  <Link
                    href={{ pathname: ROUTES.DOORS, query: { category: category.slug } }}
                    {...previewProps(i)}
                    className="text-text-primary flex items-baseline gap-5 py-5 transition-opacity duration-300"
                    style={{ opacity: isActive ? 1 : 0.45 }}
                  >
                    <MicroLabel className="w-8 shrink-0 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </MicroLabel>
                    <span className="font-display flex-1 text-3xl leading-none sm:text-4xl">
                      {category.name}
                    </span>
                    <MicroLabel className="hidden w-14 shrink-0 text-right sm:block">
                      {isActive ? 'Shop →' : ''}
                    </MicroLabel>
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href={{ pathname: ROUTES.DOORS, query: { category: activeCategory?.slug } }}
            className="bg-neutral-tint relative aspect-[4/3] overflow-hidden lg:col-span-6"
            aria-label={`Shop ${activeCategory?.name ?? 'doors'}`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <ImageWrapper
                  src={activeCategory?.image?.url.mid}
                  alt={activeCategory?.image?.altText ?? activeCategory?.name ?? ''}
                  sizes="(min-width: 1024px) 50vw, 90vw"
                  emptyLabel=""
                />
              </motion.div>
            </AnimatePresence>
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            />
            <MicroLabel className="absolute bottom-4 left-4 tabular-nums text-white/85">
              {String(active + 1).padStart(2, '0')} / {total}
            </MicroLabel>
            <MicroLabel className="absolute right-4 bottom-4 bg-white px-3 py-2 text-black">
              Shop {activeCategory?.name} →
            </MicroLabel>
          </Link>
        </div>
      </div>
    </section>
  );
}
