'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType } from 'embla-carousel';
import { useEffect, useState, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface CarouselProps {
  children: ReactNode[];
  basis?: string;
  label: string;
}

interface ScrollState {
  prev: boolean;
  next: boolean;
  selectedIndex: number;
  slideCount: number;
}

function readScrollState(api: EmblaCarouselType): ScrollState {
  return {
    prev: api.canScrollPrev(),
    next: api.canScrollNext(),
    selectedIndex: api.selectedScrollSnap(),
    slideCount: api.scrollSnapList().length,
  };
}

export function Carousel({
  children,
  basis = 'basis-[85%] sm:basis-1/2 lg:basis-1/4',
  label,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true });
  const [scrollState, setScrollState] = useState<ScrollState>({
    prev: false,
    next: false,
    selectedIndex: 0,
    slideCount: children.length,
  });
  const [lastApi, setLastApi] = useState<EmblaCarouselType | null>(null);

  if (emblaApi && emblaApi !== lastApi) {
    setLastApi(emblaApi);
    setScrollState(readScrollState(emblaApi));
  }

  useEffect(() => {
    if (!emblaApi) return;

    function handleUpdate() {
      setScrollState(readScrollState(emblaApi!));
    }

    emblaApi.on('select', handleUpdate);
    emblaApi.on('reInit', handleUpdate);
    return () => {
      emblaApi.off('select', handleUpdate);
      emblaApi.off('reInit', handleUpdate);
    };
  }, [emblaApi]);

  const { prev: canScrollPrev, next: canScrollNext, selectedIndex, slideCount } = scrollState;

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="-ml-4 flex sm:-ml-6">
          {children.map((child, index) => (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${children.length}`}
              className={cn('min-w-0 shrink-0 grow-0 pl-4 sm:pl-6', basis)}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        Showing item {selectedIndex + 1} of {slideCount}
      </span>

      <button
        type="button"
        aria-label={`Previous ${label}`}
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canScrollPrev}
        className="bg-surface border-border shadow-card text-text-primary hover:bg-neutral-tint absolute top-1/2 -left-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-0 sm:-left-4 sm:h-10 sm:w-10"
      >
        <ChevronLeft aria-hidden className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label={`Next ${label}`}
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canScrollNext}
        className="bg-surface border-border shadow-card text-text-primary hover:bg-neutral-tint absolute top-1/2 -right-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-0 sm:-right-4 sm:h-10 sm:w-10"
      >
        <ChevronRight aria-hidden className="h-5 w-5" />
      </button>
    </div>
  );
}
