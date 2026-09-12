'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Sparkles, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/inputs/Select';
import { TextInput } from '@/components/ui/inputs/TextInput';
import { apiFetch } from '@/lib/api/client';
import { ROUTES } from '@/utils/routes';
import { ZoneCanvas, type ZoneCanvasHandle } from '@/views/admin/doors/zone-editor/ZoneCanvas';
import { ZonePreviewModal } from '@/views/admin/doors/zone-editor/ZonePreviewModal';
import type {
  DoorRecord,
  DoorZone,
  LaminateOption,
  ZonePoint,
} from '@/views/admin/doors/zone-editor/types';

interface ZoneEditorViewProps {
  doorId: string;
}

function zonesEqual(a: DoorZone[], b: DoorZone[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function normalizeZones(zones: DoorZone[], width: number, height: number): DoorZone[] {
  return zones.map((zone) => ({
    ...zone,
    points: zone.points.map((point) => ({ x: point.x / width, y: point.y / height })),
  }));
}

function denormalizeZones(zones: DoorZone[], width: number, height: number): DoorZone[] {
  return zones.map((zone) => ({
    ...zone,
    points: zone.points.map((point) => ({ x: point.x * width, y: point.y * height })),
  }));
}

export function ZoneEditorView({ doorId }: ZoneEditorViewProps) {
  const canvasHandleRef = useRef<ZoneCanvasHandle>(null);
  const hasEverLoadedRef = useRef(false);
  const rawZonesRef = useRef<DoorZone[] | null>(null);

  const [door, setDoor] = useState<DoorRecord | null>(null);
  const [laminates, setLaminates] = useState<LaminateOption[]>([]);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [zones, setZones] = useState<DoorZone[]>([]);
  const [initialZones, setInitialZones] = useState<DoorZone[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [draftPointCount, setDraftPointCount] = useState(0);
  const [previewZoneId, setPreviewZoneId] = useState<string | null>(null);
  const [previewLaminateId, setPreviewLaminateId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewSnapshot, setPreviewSnapshot] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<DoorRecord>(`/api/doors/${doorId}`),
      apiFetch<{ items: LaminateOption[] }>('/api/laminates?limit=50'),
    ]).then(([doorResponse, laminatesResponse]) => {
      if (doorResponse.success && doorResponse.data) {
        setDoor(doorResponse.data);
        rawZonesRef.current = doorResponse.data.zones;
      }
      if (laminatesResponse.success) setLaminates(laminatesResponse.data?.items ?? []);
    });
  }, [doorId]);

  const baseImage = door?.images.find((image) => image.isPrimary) ?? door?.images[0];

  const hasChanges = useMemo(() => !zonesEqual(zones, initialZones), [zones, initialZones]);

  const previewLaminate = useMemo(
    () => laminates.find((laminate) => laminate._id === previewLaminateId),
    [laminates, previewLaminateId],
  );

  const previewTextureUrl = useMemo(() => {
    if (!previewLaminate) return null;
    const primary = previewLaminate.images.find((image) => image.isPrimary);
    return (primary ?? previewLaminate.images[0])?.url.mid ?? null;
  }, [previewLaminate]);

  const handleImageReady = useCallback((size: { width: number; height: number }) => {
    setImageSize(size);
    if (rawZonesRef.current) {
      const denormalized = denormalizeZones(rawZonesRef.current, size.width, size.height);
      setZones(denormalized);
      setInitialZones(denormalized);
    }
    if (!hasEverLoadedRef.current) {
      hasEverLoadedRef.current = true;
      setTimeout(() => setShowOverlay(false), 120);
    }
  }, []);

  const handleImageError = useCallback(() => {
    setImageFailed(true);
    setShowOverlay(false);
  }, []);

  const [draftPoints, setDraftPoints] = useState<ZonePoint[]>([]);

  const handlePointAdded = useCallback((points: ZonePoint[]) => {
    setDraftPoints(points);
    setDraftPointCount(points.length);
  }, []);

  function startZone() {
    setIsDrawing(true);
    setDraftPoints([]);
    setDraftPointCount(0);
  }

  function cancelZone() {
    setIsDrawing(false);
    setDraftPoints([]);
    setDraftPointCount(0);
  }

  function finishZone() {
    if (draftPointCount < 3) {
      toast.error('A zone needs at least 3 points');
      return;
    }
    // The canvas tracks points internally; we mirror the count here for the UI.
    // Ask the canvas for the latest points via onPointAdded's last call.
    setIsDrawing(false);
    setZones((current) => {
      const zoneId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `zone-${Date.now()}`;
      return [...current, { zoneId, label: `Zone ${current.length + 1}`, points: draftPoints }];
    });
    setDraftPoints([]);
    setDraftPointCount(0);
  }

  function updateZoneLabel(zoneId: string, label: string) {
    setZones((current) =>
      current.map((zone) => (zone.zoneId === zoneId ? { ...zone, label } : zone)),
    );
  }

  function deleteZone(zoneId: string) {
    setZones((current) => current.filter((zone) => zone.zoneId !== zoneId));
    if (previewZoneId === zoneId) setPreviewZoneId(null);
  }

  async function handleSave() {
    if (!imageSize) return;
    setIsSaving(true);
    const response = await apiFetch(`/api/doors/${doorId}/zones`, {
      method: 'PATCH',
      body: JSON.stringify({ zones: normalizeZones(zones, imageSize.width, imageSize.height) }),
    });
    setIsSaving(false);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    setInitialZones(zones);
    toast.success('Zones updated');
  }

  async function openPreview() {
    if (!previewTextureUrl) {
      toast.error('Pick a laminate to preview first');
      return;
    }
    if (zones.length === 0) {
      toast.error('Draw at least one zone first');
      return;
    }
    setIsPreviewOpen(true);
    setIsPreviewLoading(true);
    const snapshot = await canvasHandleRef.current?.captureLaminatedSnapshot(previewTextureUrl);
    setPreviewSnapshot(snapshot ?? null);
    setIsPreviewLoading(false);
  }

  return (
    <div className="bg-background fixed inset-0 z-40 flex flex-col">
      <header className="border-border bg-surface flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.ADMIN_DOORS_ID(doorId) as Route}
            className="text-text-secondary hover:text-text-primary flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="text-border">|</span>
          <span className="text-body-sm text-text-primary font-medium">
            {door?.name ?? 'Loading...'} — Laminate Zones
          </span>
        </div>
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          disabled={isSaving || !hasChanges}
          className="w-fit"
        >
          Save zones
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="border-border bg-surface flex w-72 shrink-0 flex-col gap-4 overflow-y-auto border-r p-4">
          {!isDrawing ? (
            <Button onClick={startZone} className="w-full">
              + New zone
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Button onClick={finishZone} disabled={draftPointCount < 3} className="w-full">
                Finish zone ({draftPointCount} points)
              </Button>
              <Button onClick={cancelZone} variant="secondary" className="w-full">
                Cancel
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Select
              label="Preview laminate"
              isClearable
              value={previewLaminateId}
              onChange={(value) => setPreviewLaminateId(value ?? '')}
              placeholder="Select a laminate..."
              options={laminates.map((laminate) => ({ value: laminate._id, label: laminate.name }))}
            />
            <Button
              onClick={openPreview}
              variant="secondary"
              icon={Sparkles}
              disabled={!previewTextureUrl || zones.length === 0}
              className="w-full"
            >
              Full-screen preview
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-body-sm text-text-secondary font-medium">Zones ({zones.length})</h2>
            {zones.length === 0 && (
              <p className="text-body-sm text-text-secondary">No zones drawn yet.</p>
            )}
            {zones.map((zone) => (
              <div
                key={zone.zoneId}
                className="border-border flex items-center gap-2 rounded-sm border p-2"
              >
                <TextInput
                  value={zone.label ?? ''}
                  onChange={(event) => updateZoneLabel(zone.zoneId, event.target.value)}
                  wrapperClassName="flex-1"
                />
                <button
                  type="button"
                  aria-label={
                    zone.zoneId === previewZoneId ? 'Hide inline preview' : 'Inline preview'
                  }
                  onClick={() =>
                    setPreviewZoneId((current) => (current === zone.zoneId ? null : zone.zoneId))
                  }
                  className="cursor-pointer text-text-secondary hover:text-accent"
                >
                  {zone.zoneId === previewZoneId ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  aria-label="Delete zone"
                  onClick={() => deleteZone(zone.zoneId)}
                  className="cursor-pointer text-error-text hover:opacity-80"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </aside>

        <main className="relative flex flex-1 items-center justify-center overflow-auto p-8">
          {imageFailed ? (
            <p className="text-error-text text-body-sm">
              Could not load the door image. Try re-uploading it.
            </p>
          ) : baseImage ? (
            <ZoneCanvas
              ref={canvasHandleRef}
              doorImageUrl={baseImage.url.full}
              zones={zones}
              previewZoneId={previewZoneId}
              previewTextureUrl={previewTextureUrl}
              isDrawing={isDrawing}
              onImageReady={handleImageReady}
              onImageError={handleImageError}
              onPointAdded={handlePointAdded}
            />
          ) : (
            <p className="text-body-sm text-text-secondary">
              Upload a base door image before drawing zones.
            </p>
          )}
        </main>
      </div>

      {showOverlay && (
        <div className="bg-background absolute inset-0 z-50 flex items-center justify-center">
          <p className="text-body-sm text-text-secondary">Loading zone editor...</p>
        </div>
      )}

      <ZonePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageUrl={previewSnapshot}
        isLoading={isPreviewLoading}
      />
    </div>
  );
}
