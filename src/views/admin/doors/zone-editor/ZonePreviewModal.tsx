'use client';

import { RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useRef } from 'react';
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch';

import { ModalWrapper } from '@/components/ui/modals/ModalWrapper';

interface ZonePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  isLoading: boolean;
}

export function ZonePreviewModal({ isOpen, onClose, imageUrl, isLoading }: ZonePreviewModalProps) {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      hideTitle
      className="!bg-transparent flex h-screen w-screen max-w-none flex-col !p-0 shadow-none"
    >
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-md bg-black/90">
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-black/40 p-1.5 text-white/70 backdrop-blur-sm">
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
          <button
            type="button"
            onClick={() => transformRef.current?.resetTransform()}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Reset zoom"
          >
            <RotateCcw className="h-4 w-4" />
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

        <div className="flex flex-1 items-center justify-center">
          {isLoading ? (
            <p className="text-body-sm text-white/70">Generating preview...</p>
          ) : imageUrl ? (
            <TransformWrapper
              ref={transformRef}
              initialScale={1}
              minScale={1}
              maxScale={4}
              centerOnInit
            >
              <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- data URL snapshot, not an optimizable static asset */}
                <img
                  src={imageUrl}
                  alt="Door with laminate applied"
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                  draggable={false}
                />
              </TransformComponent>
            </TransformWrapper>
          ) : (
            <p className="text-body-sm text-white/70">No preview available.</p>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}
