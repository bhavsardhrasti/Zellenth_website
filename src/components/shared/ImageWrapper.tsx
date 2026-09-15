'use client';

import Image, { type ImageProps } from 'next/image';
import { ImageOff } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/cn';

export interface ImageWrapperProps extends Omit<
  ImageProps,
  'src' | 'alt' | 'onLoad' | 'onError' | 'placeholder' | 'fill'
> {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  emptyLabel?: string;
  errorLabel?: string;
}

/**
 * Drop-in replacement for next/image's <Image fill /> that owns the loading
 * shimmer, missing-image and broken-image states. The parent element must
 * still establish `position: relative` (and typically a fixed aspect ratio),
 * exactly as with a bare <Image fill />.
 */
export function ImageWrapper({
  src,
  alt,
  className,
  fill = true,
  emptyLabel = 'No image',
  errorLabel = 'Image unavailable',
  ...props
}: ImageWrapperProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  if (!src) {
    return (
      <div className="text-text-secondary font-body absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-xs">
        <ImageOff aria-hidden className="h-5 w-5" />
        {emptyLabel}
      </div>
    );
  }

  return (
    <>
      {status !== 'error' && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          className={cn(
            'object-cover transition-opacity duration-300',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            className,
          )}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          {...props}
        />
      )}

      {status === 'loading' && (
        <div className="bg-neutral-tint absolute inset-0 animate-pulse" aria-hidden />
      )}

      {status === 'error' && (
        <div className="text-text-secondary font-body absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-xs">
          <ImageOff aria-hidden className="h-5 w-5" />
          {errorLabel}
        </div>
      )}
    </>
  );
}
