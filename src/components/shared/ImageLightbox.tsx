'use client';

import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useRef } from 'react';
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch';

import { ModalWrapper } from '@/components/ui/modals/ModalWrapper';

interface LightboxImage {
  url: string;
  altText: string;
}

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: LightboxImage[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export function ImageLightbox({
  isOpen,
  onClose,
  images,
  activeIndex,
  onNavigate,
}: ImageLightboxProps) {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const activeImage = images[activeIndex];

  function goPrev() {
    onNavigate((activeIndex - 1 + images.length) % images.length);
  }

  function goNext() {
    onNavigate((activeIndex + 1) % images.length);
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      hideTitle
      hideCloseButton
      className="!bg-transparent flex h-screen w-screen max-w-none flex-col !p-0 shadow-none"
    >
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-md bg-black/90">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-full bg-black/40 p-1.5 text-white/70 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => transformRef.current?.zoomOut()}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={() => transformRef.current?.zoomIn()}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4.5 w-4.5" />
          </button>
          <div className="mx-1 h-5 w-px bg-white/20" />
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        ) : null}

        <div className="flex flex-1 items-center justify-center">
          {activeImage ? (
            <TransformWrapper
              key={activeIndex}
              ref={transformRef}
              initialScale={1}
              minScale={1}
              maxScale={4}
              centerOnInit
            >
              <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- lightbox needs raw sizing control, not Next's fill layout */}
                <img
                  src={activeImage.url}
                  alt={activeImage.altText}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                  draggable={false}
                />
              </TransformComponent>
            </TransformWrapper>
          ) : null}
        </div>
      </div>
    </ModalWrapper>
  );
}
