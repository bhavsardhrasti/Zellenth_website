'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType } from 'embla-carousel';
import { useEffect, useState, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface CarouselProps {
  children: ReactNode[];
  basis?: string;
}

interface ScrollState {
  prev: boolean;
  next: boolean;
}

function readScrollState(api: EmblaCarouselType): ScrollState {
  return { prev: api.canScrollPrev(), next: api.canScrollNext() };
}

export function Carousel({
  children,
  basis = 'basis-[85%] sm:basis-1/2 lg:basis-1/4',
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true });
  const [scrollState, setScrollState] = useState<ScrollState>({ prev: false, next: false });
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

  const { prev: canScrollPrev, next: canScrollNext } = scrollState;

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="-ml-4 flex sm:-ml-6">
          {children.map((child, index) => (
            <div key={index} className={cn('min-w-0 shrink-0 grow-0 pl-4 sm:pl-6', basis)}>
              {child}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canScrollPrev}
        className="bg-surface border-border shadow-card text-text-primary hover:bg-neutral-tint absolute top-1/2 -left-4 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-0 sm:flex"
      >
        <ChevronLeft aria-hidden className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Next"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canScrollNext}
        className="bg-surface border-border shadow-card text-text-primary hover:bg-neutral-tint absolute top-1/2 -right-4 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-0 sm:flex"
      >
        <ChevronRight aria-hidden className="h-5 w-5" />
      </button>
    </div>
  );
}
