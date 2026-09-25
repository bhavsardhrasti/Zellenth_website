'use client';

import { Sparkles } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';

import { ZoneCanvas, type ZoneCanvasHandle } from '@/views/admin/doors/zone-editor/ZoneCanvas';
import { ROUTES } from '@/utils/routes';
import type { VisualizerDoor, VisualizerLaminate } from '@/views/visualizer/DoorVisualizerView';

export interface InteractiveHeroProps {
  /** A door with at least one drawn zone — the hero is meaningless without one. */
  door: VisualizerDoor;
  laminates: VisualizerLaminate[];
}

export function InteractiveHero({ door, laminates }: InteractiveHeroProps) {
  const canvasHandleRef = useRef<ZoneCanvasHandle>(null);
  const [laminateId, setLaminateId] = useState(laminates[0]?.id ?? '');
  const [imageFailed, setImageFailed] = useState(false);
  const [zones, setZones] = useState(door.zones);

  const selectedLaminate = useMemo(
    () => laminates.find((laminate) => laminate.id === laminateId),
    [laminates, laminateId],
  );

  const textureUrl = useMemo(() => {
    if (!selectedLaminate) return null;
    const primary = selectedLaminate.images.find((image) => image.isPrimary);
    return (primary ?? selectedLaminate.images[0])?.url.mid ?? null;
  }, [selectedLaminate]);

  const baseImage = door.images.find((image) => image.isPrimary) ?? door.images[0];

  const handleImageReady = useCallback(
    (size: { width: number; height: number }) => {
      setZones(
        door.zones.map((zone) => ({
          ...zone,
          points: zone.points.map((point) => ({
            x: point.x * size.width,
            y: point.y * size.height,
          })),
        })),
      );
    },
    [door.zones],
  );
  const handleImageError = useCallback(() => setImageFailed(true), []);
  const handlePointAdded = useCallback(() => {}, []);

  return (
    <section className="bg-surface-warm relative overflow-hidden">
      {/* Ambient wash so the canvas sits in real atmosphere rather than a
          plain boxed panel on flat background — same technique used to fix
          the "empty" complaint on the scroll showcase. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 65% at 78% 30%, color-mix(in srgb, var(--color-brand) 16%, transparent), transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="lg:col-span-5">
          <span className="text-brand text-badge inline-flex items-center gap-1.5 font-medium tracking-wider uppercase">
            <Sparkles aria-hidden className="h-3.5 w-3.5" />
            Live preview, no signup
          </span>
          <h1 className="font-display text-hero text-text-primary mt-3">
            See your door, finished, before you order it
          </h1>
          <p className="font-body text-text-secondary mt-5 max-w-sm text-sm sm:text-base">
            Pick a laminate below and watch it apply in real time. This is the same visualizer
            behind every door in our catalogue.
          </p>

          <div className="mt-8">
            <span className="font-body text-text-secondary text-body-sm font-medium">
              {selectedLaminate?.name ?? 'Choose a laminate'}
            </span>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {laminates.map((laminate) => {
                const primary =
                  laminate.images.find((image) => image.isPrimary) ?? laminate.images[0];
                const isActive = laminate.id === laminateId;
                return (
                  <button
                    key={laminate.slug}
                    type="button"
                    onClick={() => setLaminateId(laminate.id)}
                    aria-pressed={isActive}
                    aria-label={laminate.name}
                    title={laminate.name}
                    className={`h-12 w-12 overflow-hidden rounded-full border-2 bg-cover bg-center shadow-sm transition-all ${
                      isActive
                        ? 'border-brand scale-110 shadow-md'
                        : 'border-surface hover:border-text-secondary hover:scale-105'
                    }`}
                    style={{ backgroundImage: primary ? `url(${primary.url.mid})` : undefined }}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={ROUTES.DOORS_VISUALIZE(door.slug) as Route}
              className="bg-action hover:bg-action-hover text-action-text shadow-card rounded-sm px-6 py-3 font-medium transition-colors"
            >
              Open Full Visualizer
            </Link>
            <Link
              href={ROUTES.DOORS as Route}
              className="bg-surface border-border hover:bg-neutral-tint text-text-primary rounded-sm border px-6 py-3 font-medium transition-colors"
            >
              Browse All Doors
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative flex min-h-[70vh] items-center justify-center lg:min-h-[75vh]">
            {/* Soft grounding shadow beneath the door so it reads as an
                object in space, not a flat cutout floating on a gradient. */}
            <div
              aria-hidden
              className="bg-shadow-tint/20 absolute bottom-[6%] h-10 w-[70%] rounded-full blur-2xl"
            />
            {imageFailed ? (
              <p className="text-error-text text-body-sm">Could not load the door image.</p>
            ) : baseImage ? (
              <div className="shadow-elevated relative max-h-full overflow-hidden rounded-md">
                <ZoneCanvas
                  ref={canvasHandleRef}
                  doorImageUrl={baseImage.url.full}
                  zones={zones}
                  previewZoneId={null}
                  previewTextureUrl={textureUrl}
                  previewAllZones
                  showIdleZones={false}
                  isDrawing={false}
                  onImageReady={handleImageReady}
                  onImageError={handleImageError}
                  onPointAdded={handlePointAdded}
                  ariaLabel={
                    selectedLaminate
                      ? `Preview of ${door.name} in ${selectedLaminate.name} laminate`
                      : door.name
                  }
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
