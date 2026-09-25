'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { PageHeader } from '@/components/shared/PageHeader';
import { Select } from '@/components/ui/inputs/Select';
import { apiFetch } from '@/lib/api/client';

interface LaminateOption {
  id: string;
  name: string;
  textureUrl: string;
}

const CANVAS_SIZE = 480;
const LIGHT_Z = 0.85;

/**
 * Draws a synthetic "carved relief" heightmap: a raised rosette medallion
 * inside a raised border frame, both with blurred (beveled) edges. Purely
 * generated geometry, no client artwork involved, so it doubles as a safe
 * stand-in until real ArtCAM heightmap exports arrive.
 */
function drawSyntheticHeightmap(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  ctx.filter = 'blur(6px)';
  ctx.fillStyle = '#ffffff';

  const frameInset = size * 0.08;
  const frameThickness = size * 0.05;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = frameThickness;
  ctx.strokeRect(
    frameInset + frameThickness / 2,
    frameInset + frameThickness / 2,
    size - frameInset * 2 - frameThickness,
    size - frameInset * 2 - frameThickness,
  );

  const cx = size / 2;
  const cy = size / 2;
  const petalCount = 8;
  const petalRadius = size * 0.16;
  const orbitRadius = size * 0.12;
  for (let i = 0; i < petalCount; i += 1) {
    const angle = (i / petalCount) * Math.PI * 2;
    const px = cx + Math.cos(angle) * orbitRadius;
    const py = cy + Math.sin(angle) * orbitRadius;
    ctx.beginPath();
    ctx.ellipse(px, py, petalRadius * 0.55, petalRadius, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.09, 0, Math.PI * 2);
  ctx.fill();

  ctx.filter = 'none';
}

const BUILTIN_WOOD_ID = 'builtin-wood';

type DesignId = 'synthetic' | 'd004';
const REAL_DESIGN_SIZE = { width: 286, height: 636 };
// Local-only client artwork (git-ignored). Missing files just show an error message.
const REAL_DESIGN_RENDER_URL = '/relief-demo-local/d004-render.png';
const REAL_DESIGN_SHADING_URL = '/relief-demo-local/d004-shading.png';

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${url}`));
    image.src = url;
  });
}

/** Procedural wood-grain texture so the demo works offline / without catalogue photos. */
function createProceduralWood(size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#b98a58';
  ctx.fillRect(0, 0, size, size);

  for (let x = 0; x < size; x += 1) {
    const wobble = Math.sin(x * 0.045) * 6 + Math.sin(x * 0.013) * 14;
    const tone = Math.sin(x * 0.32 + wobble * 0.15) * 0.5 + Math.sin(x * 0.07) * 0.5;
    const alpha = 0.05 + Math.abs(tone) * 0.16;
    ctx.fillStyle = tone > 0 ? `rgba(70, 40, 15, ${alpha})` : `rgba(235, 200, 150, ${alpha})`;
    ctx.fillRect(x, 0, 1, size);
  }
  for (let i = 0; i < 900; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.fillStyle = `rgba(60, 35, 12, ${Math.random() * 0.12})`;
    ctx.fillRect(x, y, 1, 6 + Math.random() * 30);
  }
  return canvas;
}

function computeShadingFromHeightmap(
  heightData: ImageData,
  size: number,
  lightAngleDeg: number,
): ImageData {
  const lightRad = (lightAngleDeg * Math.PI) / 180;
  const lightX = Math.cos(lightRad);
  const lightY = Math.sin(lightRad);
  const lightLen = Math.hypot(lightX, lightY, LIGHT_Z);
  const lx = lightX / lightLen;
  const ly = lightY / lightLen;
  const lz = LIGHT_Z / lightLen;
  const flatDot = lz; // dot(normal=(0,0,1), light) on a flat surface

  const src = heightData.data;
  const shading = new ImageData(size, size);
  const out = shading.data;
  const strength = 2.2;

  const heightAt = (x: number, y: number) => {
    const cx = Math.min(size - 1, Math.max(0, x));
    const cy = Math.min(size - 1, Math.max(0, y));
    return (src[(cy * size + cx) * 4] ?? 0) / 255;
  };

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (heightAt(x + 1, y) - heightAt(x - 1, y)) * strength;
      const dy = (heightAt(x, y + 1) - heightAt(x, y - 1)) * strength;
      const nLen = Math.hypot(dx, dy, 1);
      const nx = -dx / nLen;
      const ny = -dy / nLen;
      const nz = 1 / nLen;

      const dot = nx * lx + ny * ly + nz * lz;
      const delta = (dot - flatDot) * 255;
      const gray = Math.min(255, Math.max(0, 128 + delta));

      const i = (y * size + x) * 4;
      out[i] = gray;
      out[i + 1] = gray;
      out[i + 2] = gray;
      out[i + 3] = 255;
    }
  }

  return shading;
}

export function ReliefDemoView() {
  const heightmapRef = useRef<HTMLCanvasElement>(null);
  const shadingRef = useRef<HTMLCanvasElement>(null);
  const resultRef = useRef<HTMLCanvasElement>(null);
  const heightDataRef = useRef<ImageData | null>(null);
  const laminateImageRef = useRef<CanvasImageSource | null>(null);

  const [lightAngle, setLightAngle] = useState(135);
  const [laminates, setLaminates] = useState<LaminateOption[]>([]);
  const [selectedLaminateId, setSelectedLaminateId] = useState<string>(BUILTIN_WOOD_ID);
  const [design, setDesign] = useState<DesignId>('synthetic');
  const realShadingRef = useRef<HTMLImageElement | null>(null);
  const isReal = design === 'd004';
  const canvasWidth = isReal ? REAL_DESIGN_SIZE.width : CANVAS_SIZE;
  const canvasHeight = isReal ? REAL_DESIGN_SIZE.height : CANVAS_SIZE;
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoadingLaminates, setIsLoadingLaminates] = useState(true);

  useEffect(() => {
    apiFetch<{ items: { _id: string; name: string; images: { url: { mid: string }; isPrimary: boolean }[] }[] }>(
      '/api/laminates?limit=12',
    )
      .then((response) => {
        if (!response.success || !response.data) return;
        const options = response.data.items
          .map((item) => {
            const primary = item.images.find((image) => image.isPrimary) ?? item.images[0];
            return primary ? { id: item._id, name: item.name, textureUrl: primary.url.mid } : null;
          })
          .filter((option): option is LaminateOption => Boolean(option));
        setLaminates(options);
      })
      .finally(() => setIsLoadingLaminates(false));
  }, []);

  const renderShadingAndResult = useCallback((angle: number) => {
    const heightData = heightDataRef.current;
    const shadingCanvas = shadingRef.current;
    const resultCanvas = resultRef.current;
    if (!heightData || !shadingCanvas || !resultCanvas) return;

    const width = resultCanvas.width;
    const height = resultCanvas.height;

    const realShading = realShadingRef.current;
    if (realShading && width === REAL_DESIGN_SIZE.width) {
      shadingCanvas.getContext('2d')?.drawImage(realShading, 0, 0);
    } else {
      const shading = computeShadingFromHeightmap(heightData, CANVAS_SIZE, angle);
      shadingCanvas.getContext('2d')?.putImageData(shading, 0, 0);
    }

    const resultCtx = resultCanvas.getContext('2d');
    if (!resultCtx) return;
    resultCtx.clearRect(0, 0, width, height);

    const laminateImage = laminateImageRef.current;
    if (laminateImage) {
      const pattern = resultCtx.createPattern(laminateImage, 'repeat');
      if (pattern) {
        resultCtx.fillStyle = pattern;
        resultCtx.fillRect(0, 0, width, height);
      }
    } else {
      resultCtx.fillStyle = '#c9a876';
      resultCtx.fillRect(0, 0, width, height);
    }

    resultCtx.globalCompositeOperation = 'overlay';
    resultCtx.drawImage(shadingCanvas, 0, 0);
    resultCtx.globalCompositeOperation = 'source-over';
  }, []);

  useEffect(() => {
    const heightmapCanvas = heightmapRef.current;
    if (!heightmapCanvas) return;
    const ctx = heightmapCanvas.getContext('2d');
    if (!ctx) return;

    drawSyntheticHeightmap(ctx, CANVAS_SIZE);
    heightDataRef.current = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    renderShadingAndResult(lightAngle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time heightmap generation on mount
  }, []);

  useEffect(() => {
    if (design === 'synthetic') {
      realShadingRef.current = null;
      const ctx = heightmapRef.current?.getContext('2d');
      if (ctx) {
        drawSyntheticHeightmap(ctx, CANVAS_SIZE);
        heightDataRef.current = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      }
      renderShadingAndResult(lightAngle);
      return;
    }
    Promise.all([loadImage(REAL_DESIGN_RENDER_URL), loadImage(REAL_DESIGN_SHADING_URL)])
      .then(([render, shading]) => {
        realShadingRef.current = shading;
        heightmapRef.current?.getContext('2d')?.drawImage(render, 0, 0);
        renderShadingAndResult(lightAngle);
      })
      .catch(() => {
        setLoadError('Real design files not found in public/relief-demo-local/. Showing the synthetic design.');
        setDesign('synthetic');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when the design selection changes
  }, [design]);

  useEffect(() => {
    setLoadError(null);
    if (selectedLaminateId === BUILTIN_WOOD_ID) {
      laminateImageRef.current = createProceduralWood(256);
      renderShadingAndResult(lightAngle);
      return;
    }

    const selected = laminates.find((laminate) => laminate.id === selectedLaminateId);
    if (!selected) return;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      laminateImageRef.current = image;
      renderShadingAndResult(lightAngle);
    };
    image.onerror = () => {
      setLoadError(`Could not load the texture for "${selected.name}". Showing the previous texture.`);
    };
    image.src = selected.textureUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when the laminate selection changes
  }, [selectedLaminateId, laminates]);

  useEffect(() => {
    renderShadingAndResult(lightAngle);
  }, [lightAngle, renderShadingAndResult]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Relief Rendering Demo"
        description="Proof-of-concept: deriving lighting from a grayscale heightmap and blending it over a laminate texture with overlay compositing. Heightmap here is synthetic (a generated rosette + frame), standing in until real ArtCAM heightmap exports arrive."
      />

      <div className="bg-surface shadow-card flex flex-col gap-4 rounded-md p-5">
        <div className="flex flex-wrap items-end gap-4">
          <Select
            label="Laminate texture"
            placeholder={isLoadingLaminates ? 'Loading...' : 'Select a laminate...'}
            isDisabled={isLoadingLaminates}
            value={selectedLaminateId}
            onChange={(value) => setSelectedLaminateId(value ?? '')}
            options={[
              { value: BUILTIN_WOOD_ID, label: 'Built-in wood (offline sample)' },
              ...laminates.map((laminate) => ({ value: laminate.id, label: laminate.name })),
            ]}
            wrapperClassName="w-64"
          />
          <Select
            label="Design"
            value={design}
            onChange={(value) => setDesign(value === 'd004' ? 'd004' : 'synthetic')}
            options={[
              { value: 'synthetic', label: 'Synthetic heightmap' },
              { value: 'd004', label: 'Real design D004 (local preview)' },
            ]}
            wrapperClassName="w-64"
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="light-angle" className="font-body text-text-secondary text-sm">
              Light angle: {isReal ? 'fixed (baked into render)' : `${lightAngle}°`}
            </label>
            <input
              id="light-angle"
              type="range"
              disabled={isReal}
              min={0}
              max={359}
              value={lightAngle}
              onChange={(event) => setLightAngle(Number(event.target.value))}
              className="w-64"
            />
          </div>
        </div>

        {loadError ? <p className="font-body text-sm text-red-600">{loadError}</p> : null}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="font-body text-text-secondary text-sm font-medium">
              {isReal ? '1. Real design D004 (ArtCAM render)' : '1. Heightmap (synthetic)'}
            </span>
            <canvas
              ref={heightmapRef}
              width={canvasWidth}
              height={canvasHeight}
              className="border-border w-full rounded-sm border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-body text-text-secondary text-sm font-medium">
              2. Derived shading (normal map + light)
            </span>
            <canvas
              ref={shadingRef}
              width={canvasWidth}
              height={canvasHeight}
              className="border-border w-full rounded-sm border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-body text-text-secondary text-sm font-medium">
              3. Laminate + shading (overlay blend)
            </span>
            <canvas
              ref={resultRef}
              width={canvasWidth}
              height={canvasHeight}
              className="border-border w-full rounded-sm border"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
