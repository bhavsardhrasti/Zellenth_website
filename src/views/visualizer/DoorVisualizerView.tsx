'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/inputs/Select';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { apiFetch } from '@/lib/api/client';
import { useWatchlist } from '@/hooks/useWatchlist';
import { ROUTES } from '@/utils/routes';
import { ZoneCanvas, type ZoneCanvasHandle } from '@/views/admin/doors/zone-editor/ZoneCanvas';
import { ZonePreviewModal } from '@/views/admin/doors/zone-editor/ZonePreviewModal';
import type { DoorZone } from '@/lib/db/models/Door.model';

export interface VisualizerDoor {
  id: string;
  name: string;
  slug: string;
  code: string;
  images: { url: { full: string }; isPrimary: boolean }[];
  zones: DoorZone[];
}

export interface VisualizerLaminate {
  id: string;
  name: string;
  slug: string;
  code: string;
  images: { url: { mid: string }; isPrimary: boolean }[];
}

export interface DoorVisualizerViewProps {
  door: VisualizerDoor;
  laminates: VisualizerLaminate[];
  initialLaminateId?: string | undefined;
}

export default function DoorVisualizerView({
  door,
  laminates,
  initialLaminateId,
}: DoorVisualizerViewProps) {
  const canvasHandleRef = useRef<ZoneCanvasHandle>(null);

  const [laminateId, setLaminateId] = useState(initialLaminateId ?? '');
  const [imageFailed, setImageFailed] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [zones, setZones] = useState<DoorZone[]>([]);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);
  const { isSaved, toggle } = useWatchlist();

  const baseImage = door.images.find((image) => image.isPrimary) ?? door.images[0];

  const selectedLaminate = useMemo(
    () => laminates.find((laminate) => laminate.id === laminateId),
    [laminates, laminateId],
  );

  const textureUrl = useMemo(() => {
    if (!selectedLaminate) return null;
    const primary = selectedLaminate.images.find((image) => image.isPrimary);
    return (primary ?? selectedLaminate.images[0])?.url.mid ?? null;
  }, [selectedLaminate]);

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

  async function openFullScreenPreview() {
    if (!textureUrl) return;
    setIsPreviewOpen(true);
    setIsPreviewLoading(true);
    const result = await canvasHandleRef.current?.captureLaminatedSnapshot(textureUrl);
    setSnapshot(result ?? null);
    setIsPreviewLoading(false);
  }

  const doorRef = {
    slug: door.slug,
    name: door.name,
    code: door.code,
    imageUrl: baseImage?.url.full,
  };
  const laminateRef = selectedLaminate
    ? {
        slug: selectedLaminate.slug,
        name: selectedLaminate.name,
        code: selectedLaminate.code,
        imageUrl: (
          selectedLaminate.images.find((image) => image.isPrimary) ?? selectedLaminate.images[0]
        )?.url.mid,
      }
    : undefined;

  const combinationSaved = laminateRef ? isSaved(doorRef, laminateRef) : false;

  async function handleAddToWatchlist() {
    if (!laminateRef || !textureUrl) return;

    if (combinationSaved) {
      toggle({ door: doorRef, laminate: laminateRef });
      return;
    }

    setIsAddingToWatchlist(true);
    try {
      const snapshotDataUrl = await canvasHandleRef.current?.captureLaminatedSnapshot(textureUrl);
      let comboSnapshotUrl: string | undefined;
      if (snapshotDataUrl) {
        const response = await apiFetch<{ url: string }>('/api/watchlist/snapshot', {
          method: 'POST',
          body: JSON.stringify({ dataUrl: snapshotDataUrl }),
        });
        if (response.success && response.data) {
          comboSnapshotUrl = response.data.url;
        }
      }
      toggle({ door: doorRef, laminate: laminateRef, comboSnapshotUrl });
      toast.success('Added to watchlist');
    } catch {
      toast.error('Could not add to watchlist. Please try again.');
    } finally {
      setIsAddingToWatchlist(false);
    }
  }

  return (
    <main className="bg-background min-h-dvh px-6 py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link
          href={ROUTES.DOORS_ID(door.slug) as Route}
          className="text-text-secondary hover:text-text-primary flex w-fit items-center gap-1 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {door.name}
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-h2 text-text-primary">Visualize {door.name}</h1>
            <p className="font-body text-text-secondary text-sm">
              Pick a laminate to see how it looks on this door.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <Select
              label="Laminate"
              placeholder="Select a laminate..."
              isClearable
              wrapperClassName="w-64"
              value={laminateId}
              onChange={(value) => setLaminateId(value ?? '')}
              options={laminates.map((laminate) => ({
                value: laminate.id,
                label: laminate.name,
              }))}
            />
            <Button
              variant="secondary"
              icon={Sparkles}
              disabled={!textureUrl}
              onClick={openFullScreenPreview}
              className="whitespace-nowrap"
            >
              Full-screen
            </Button>
            <Button
              icon={Heart}
              disabled={!selectedLaminate || isAddingToWatchlist}
              isLoading={isAddingToWatchlist}
              onClick={handleAddToWatchlist}
              className="whitespace-nowrap"
            >
              {combinationSaved ? 'Saved to Watchlist' : 'Add to Watchlist'}
            </Button>
          </div>
        </div>

        <div className="bg-surface shadow-card rounded-md flex items-center justify-center p-6">
          {imageFailed ? (
            <p className="text-error-text text-body-sm">Could not load the door image.</p>
          ) : baseImage ? (
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
            />
          ) : (
            <p className="text-body-sm text-text-secondary">No image available for this door.</p>
          )}
        </div>
      </div>

      <ZonePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageUrl={snapshot}
        isLoading={isPreviewLoading}
      />

      <WhatsAppButton />
    </main>
  );
}
