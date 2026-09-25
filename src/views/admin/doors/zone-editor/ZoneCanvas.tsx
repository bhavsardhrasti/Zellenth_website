'use client';

import * as fabric from 'fabric';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import type { DoorZone, ZonePoint } from '@/views/admin/doors/zone-editor/types';

const ZONE_FILL = 'rgba(169, 120, 79, 0.2)';
const ZONE_STROKE = '#A9784F';

function lockObject(obj: fabric.FabricObject) {
  obj.set({
    selectable: false,
    evented: false,
    hasControls: false,
    hasBorders: false,
    hoverCursor: 'default',
  });
}

export interface ZoneCanvasHandle {
  /** Flattens the door photo with every zone filled by the given laminate texture, for the preview modal. */
  captureLaminatedSnapshot: (textureUrl: string) => Promise<string | null>;
}

interface ZoneCanvasProps {
  doorImageUrl: string;
  zones: DoorZone[];
  previewZoneId: string | null;
  previewTextureUrl: string | null;
  isDrawing: boolean;
  onImageReady: (size: { width: number; height: number }) => void;
  onImageError: () => void;
  onPointAdded: (points: ZonePoint[]) => void;
  /** Applies previewTextureUrl to every zone at once instead of just previewZoneId — used by the read-only shopper visualizer. */
  previewAllZones?: boolean;
  /** Whether zones with no active preview still render their idle outline/fill (admin editor) or stay invisible (visualizer). */
  showIdleZones?: boolean;
  /** Accessible name for the canvas — the visualizer passes a description of what's being previewed; the admin editor has no equivalent and omits it. */
  ariaLabel?: string;
}

export const ZoneCanvas = forwardRef<ZoneCanvasHandle, ZoneCanvasProps>(function ZoneCanvas(
  {
    doorImageUrl,
    zones,
    previewZoneId,
    previewTextureUrl,
    isDrawing,
    onImageReady,
    onImageError,
    onPointAdded,
    previewAllZones = false,
    showIdleZones = true,
    ariaLabel,
  },
  ref,
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const doorImageElRef = useRef<HTMLImageElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const zonePolygonsRef = useRef<Map<string, fabric.Polygon>>(new Map());
  const draftPointsRef = useRef<ZonePoint[]>([]);
  const draftMarkersRef = useRef<fabric.Object[]>([]);
  const isDrawingRef = useRef(isDrawing);

  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [canvasScale, setCanvasScale] = useState(1);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    isDrawingRef.current = isDrawing;
    if (!isDrawing) {
      draftPointsRef.current = [];
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        draftMarkersRef.current.forEach((marker) => canvas.remove(marker));
        draftMarkersRef.current = [];
        canvas.renderAll();
      }
    }
  }, [isDrawing]);

  // ── Mount the Fabric canvas exactly once. It is never disposed/recreated for the
  // lifetime of this component — image swaps and dimension changes patch it in place.
  // The canvas is kept transparent: it only ever draws zone shapes, never the door
  // photo itself (a real <img> sits behind it — see the render below for why). ──
  useEffect(() => {
    if (!canvasElRef.current) return;

    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: 1,
      height: 1,
      selection: false,
      enableRetinaScaling: false,
    });
    canvas.skipTargetFind = true;
    fabricCanvasRef.current = canvas;

    function handleMouseDown(opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) {
      if (!isDrawingRef.current) return;
      const pointer = canvas.getScenePoint(opt.e);
      const next = [...draftPointsRef.current, { x: pointer.x, y: pointer.y }];
      draftPointsRef.current = next;
      onPointAdded(next);

      draftMarkersRef.current.forEach((marker) => canvas.remove(marker));
      draftMarkersRef.current = [];
      if (next.length > 1) {
        const line = new fabric.Polyline(next, {
          fill: 'transparent',
          stroke: ZONE_STROKE,
          strokeWidth: 2,
          strokeUniform: true,
          strokeDashArray: [6, 4],
        });
        lockObject(line);
        canvas.add(line);
        draftMarkersRef.current.push(line);
      }
      next.forEach((point) => {
        const dot = new fabric.Circle({
          left: point.x - 4,
          top: point.y - 4,
          radius: 4,
          fill: ZONE_STROKE,
        });
        lockObject(dot);
        canvas.add(dot);
        draftMarkersRef.current.push(dot);
      });
      canvas.renderAll();
    }

    canvas.on('mouse:down', handleMouseDown);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once; onPointAdded is stable via parent useCallback
  }, []);

  // ── Patch the canvas dimensions in place whenever the door image URL changes — no
  // remount. The photo itself is rendered by the plain <img> below, not the canvas:
  // Fabric v7.4.0's Image object silently fails to apply its own transform before
  // drawing (confirmed by instrumenting drawImage/getTransform directly), painting the
  // photo at half width. A native <img> sidesteps that renderer entirely. ──
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !doorImageUrl) return;
    let cancelled = false;

    const probe = new Image();
    probe.onload = () => {
      if (cancelled) return;
      const size = { width: probe.naturalWidth, height: probe.naturalHeight };
      canvas.setDimensions(size);
      setImageSize(size);
      setIsCanvasReady(true);
      onImageReady(size);
    };
    probe.onerror = () => {
      if (!cancelled) onImageError();
    };
    probe.src = doorImageUrl;

    return () => {
      cancelled = true;
    };
  }, [doorImageUrl, onImageReady, onImageError]);

  // ── Responsive scale: canvas stays at native pixel size, wrapper scales it visually ──
  useEffect(() => {
    if (!wrapperRef.current || !imageSize) return;

    const updateScale = () => {
      const containerWidth = wrapperRef.current?.clientWidth ?? imageSize.width;
      setCanvasScale(Math.min(1, containerWidth / imageSize.width));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [imageSize]);

  // ── Sync zone polygons declaratively whenever zones/preview state changes ──
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isCanvasReady) return;

    zonePolygonsRef.current.forEach((polygon) => canvas.remove(polygon));
    zonePolygonsRef.current.clear();

    zones.forEach((zone) => {
      const isPreviewing =
        Boolean(previewTextureUrl) && (previewAllZones || zone.zoneId === previewZoneId);

      const addPolygon = (fill: fabric.Polygon['fill']) => {
        const polygon = new fabric.Polygon(zone.points, {
          fill,
          stroke: ZONE_STROKE,
          strokeWidth: 2,
          strokeUniform: true,
        });
        lockObject(polygon);
        canvas.add(polygon);
        zonePolygonsRef.current.set(zone.zoneId, polygon);
      };

      if (isPreviewing && previewTextureUrl) {
        fabric.FabricImage.fromURL(previewTextureUrl)
          .then((img) => {
            const pattern = new fabric.Pattern({ source: img.getElement() as HTMLImageElement });
            addPolygon(pattern);
            const polygon = zonePolygonsRef.current.get(zone.zoneId);
            if (polygon) {
              polygon.globalCompositeOperation = 'multiply';
              canvas.renderAll();
            }
          })
          .catch(() => {
            if (showIdleZones) addPolygon(ZONE_FILL);
          });
      } else if (showIdleZones) {
        addPolygon(ZONE_FILL);
      }
    });

    canvas.renderAll();
  }, [zones, previewZoneId, previewTextureUrl, previewAllZones, showIdleZones, isCanvasReady]);

  useImperativeHandle(ref, () => ({
    captureLaminatedSnapshot: async (textureUrl: string) => {
      const canvas = fabricCanvasRef.current;
      const doorImageEl = doorImageElRef.current;
      if (!canvas || !doorImageEl || !imageSize) return null;

      const temporaryPolygons: fabric.Polygon[] = [];
      try {
        const img = await fabric.FabricImage.fromURL(textureUrl);
        const pattern = new fabric.Pattern({ source: img.getElement() as HTMLImageElement });

        zonePolygonsRef.current.forEach((existing) => canvas.remove(existing));
        zones.forEach((zone) => {
          const polygon = new fabric.Polygon(zone.points, {
            fill: pattern,
            stroke: ZONE_STROKE,
            strokeWidth: 2,
            strokeUniform: true,
          });
          polygon.globalCompositeOperation = 'multiply';
          lockObject(polygon);
          canvas.add(polygon);
          temporaryPolygons.push(polygon);
        });
        canvas.renderAll();

        // Composite the door photo (plain <img>, rendered correctly) with the zone
        // shapes (drawn by Fabric onto the transparent canvas) onto an offscreen canvas.
        const composite = document.createElement('canvas');
        composite.width = imageSize.width;
        composite.height = imageSize.height;
        const ctx = composite.getContext('2d');
        if (!ctx) return null;
        ctx.drawImage(doorImageEl, 0, 0, imageSize.width, imageSize.height);
        ctx.drawImage(canvas.getElement(), 0, 0, imageSize.width, imageSize.height);
        return composite.toDataURL('image/png', 1);
      } catch {
        return null;
      } finally {
        temporaryPolygons.forEach((polygon) => canvas.remove(polygon));
        canvas.renderAll();
      }
    },
  }));

  return (
    <div ref={wrapperRef} className="h-full w-full">
      <div
        className={`relative mx-auto overflow-hidden rounded-sm border border-border ${imageSize ? '' : 'hidden'} ${isDrawing ? 'cursor-crosshair' : ''}`}
        style={
          imageSize
            ? { width: imageSize.width * canvasScale, height: imageSize.height * canvasScale }
            : undefined
        }
      >
        <div
          style={
            imageSize
              ? {
                  width: imageSize.width,
                  height: imageSize.height,
                  transform: `scale(${canvasScale})`,
                  transformOrigin: 'top left',
                }
              : undefined
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- must be a real DOM element Fabric can draw around, not next/image */}
          <img
            ref={doorImageElRef}
            src={doorImageUrl}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
            draggable={false}
          />
          <canvas
            ref={canvasElRef}
            role={ariaLabel ? 'img' : undefined}
            aria-label={ariaLabel}
            className="relative"
          />
        </div>
      </div>
    </div>
  );
});
