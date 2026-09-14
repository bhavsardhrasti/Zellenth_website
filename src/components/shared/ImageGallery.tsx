'use client';

import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import { useState } from 'react';

import { ImageLightbox } from '@/components/shared/ImageLightbox';
import { cn } from '@/utils/cn';

interface GalleryImage {
  url: { full: string; mid?: string; thumbnail?: string };
  altText: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  aspectClass?: string;
  emptyLabel?: string;
}

export function ImageGallery({
  images,
  aspectClass = 'aspect-[4/5]',
  emptyLabel = 'No image yet',
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const activeImage = images[activeIndex];

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'bg-neutral-tint shadow-card text-text-secondary font-body flex items-center justify-center rounded-md text-sm',
          aspectClass,
        )}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setIsLightboxOpen(true)}
        aria-label="Open full-size image"
        className={cn(
          'bg-neutral-tint shadow-card group relative w-full cursor-zoom-in overflow-hidden rounded-md',
          aspectClass,
        )}
      >
        {activeImage ? (
          <Image
            src={activeImage.url.full}
            alt={activeImage.altText}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        ) : null}
        <div className="bg-text-primary/60 text-surface absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn aria-hidden className="h-3.5 w-3.5" />
          Zoom
        </div>
      </button>

      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.url.full}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 transition-colors',
                index === activeIndex ? 'border-brand' : 'border-transparent hover:border-border',
              )}
            >
              <Image
                src={image.url.thumbnail ?? image.url.full}
                alt={image.altText}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={images.map((image) => ({ url: image.url.full, altText: image.altText }))}
        activeIndex={activeIndex}
        onNavigate={setActiveIndex}
      />
    </div>
  );
}
