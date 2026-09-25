'use client';

import Link from 'next/link';
import type { Route } from 'next';

import { HeroCarousel, type HeroCarouselItem } from '@/components/ui/hero-carousel';
import { ROUTES } from '@/utils/routes';

// Verified live Unsplash photos — each checked with a HEAD request before
// use, not guessed. Standing in for real catalogue photography; swap when
// available. Deliberately no fabricated product codes/dimensions paired
// with these stock photos — that would misrepresent them as specific real
// products. Accent hues stay inside the existing brand/ember family
// (theme.css --color-brand / --color-accent-2), not a rainbow of new hues.
const LOOKS: HeroCarouselItem[] = [
  {
    title: 'Main\nDoors',
    image: 'https://images.unsplash.com/photo-1760085160766-ed473efe941e?w=1200&q=80',
    credit: 'ENTRY COLLECTION',
    meta: ['AHMEDABAD MADE', 'CUSTOM SIZE', 'ANY LAMINATE'],
    accent: '#8f552d',
  },
  {
    title: 'Wardrobe\nShutters',
    image: 'https://images.unsplash.com/photo-1736506159893-22cca29b8018?w=1200&q=80',
    credit: 'STORAGE COLLECTION',
    meta: ['WALNUT FINISH', 'FACTORY DIRECT', 'BUILT TO ORDER'],
    accent: '#6b4226',
  },
  {
    title: 'Sliding\nDoors',
    image: 'https://images.unsplash.com/photo-1617307074423-6344f18d357f?w=1200&q=80',
    credit: 'SLIDING COLLECTION',
    meta: ['SPACE SAVING', 'SMOOTH TRACK', 'ANY FINISH'],
    accent: '#b3462c',
  },
  {
    title: 'Laminate\nLibrary',
    image: 'https://images.unsplash.com/photo-1611600700192-d87eaeed4f81?w=1200&q=80',
    credit: 'FINISH LIBRARY',
    meta: ['80+ FINISHES', 'MATTE & GLOSS', 'SEE IT ON YOUR DOOR'],
    accent: '#a6792e',
  },
  {
    title: 'Grand\nEntrances',
    image: 'https://images.unsplash.com/photo-1786058784400-40f24a65a47c?w=1200&q=80',
    credit: 'ENTRY COLLECTION',
    meta: ['STATEMENT DOORS', 'TERMITE RESISTANT', 'FACTORY DIRECT'],
    accent: '#5a4d3e',
  },
  {
    title: 'Finished\nInteriors',
    image: 'https://images.unsplash.com/photo-1772696860271-c53a0e799d31?w=1200&q=80',
    credit: 'THE RESULT',
    meta: ['REAL INSTALLS', 'MOISTURE RESISTANT', 'BUILT FOR GUJARAT'],
    accent: '#c1502f',
  },
];

export function CarouselHero() {
  return (
    <section className="relative h-[92dvh] min-h-[560px] w-full">
      <HeroCarousel
        items={LOOKS}
        defaultIndex={0}
        brand="ZELLENTH"
        autoplay
        autoplayDelay={5000}
        overlay={
          // Rendered inside the carousel's own stage element (via the
          // `overlay` prop) so hovering it correctly pauses autoplay,
          // instead of a sibling layer the stage's hit-testing can't see.
          <div className="pointer-events-none absolute right-6 bottom-20 left-6 z-10 flex justify-center sm:right-10 sm:bottom-24 sm:left-auto sm:justify-end">
            <Link
              href={ROUTES.DOORS as Route}
              className="bg-action hover:bg-action-hover text-action-text shadow-elevated pointer-events-auto rounded-sm px-6 py-3 font-medium transition-colors"
            >
              Try the Visualizer
            </Link>
          </div>
        }
      />
    </section>
  );
}
