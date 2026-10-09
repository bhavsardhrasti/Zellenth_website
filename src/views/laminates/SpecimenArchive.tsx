'use client';

import { filterDemoSwatches } from '@/views/laminates/demoSwatches';
import { SwatchGrid } from '@/views/laminates/SwatchGrid';
import type { LaminateDocument } from '@/lib/db/models/Laminate.model';

export interface LaminateSpecimen {
  slug: string;
  name: string;
  code: string;
  colorFamily: string;
  finish: string;
  finishLabel: string;
  grainDirection: string;
  collectionName?: string | undefined;
  size?: string | undefined;
  description?: string | undefined;
  image?: string | undefined;
  thumbnail?: string | undefined;
}

function toSpecimens(laminates: LaminateDocument[]): LaminateSpecimen[] {
  return laminates.map((laminate) => {
    const image = laminate.images.find((item) => item.isPrimary) ?? laminate.images[0];
    return {
      slug: laminate.slug,
      name: laminate.name,
      code: laminate.code,
      colorFamily: laminate.colorFamily,
      finish: laminate.finish,
      finishLabel: laminate.finish.charAt(0).toUpperCase() + laminate.finish.slice(1),
      grainDirection: laminate.grainDirection,
      collectionName: laminate.collectionName,
      size: laminate.size,
      description: laminate.description,
      image: image?.url.mid ?? image?.url.full,
      thumbnail: image?.url.thumbnail,
    };
  });
}

export interface SpecimenArchiveProps {
  laminates: LaminateDocument[];
  activeFinish: string;
  activeColor: string;
  isPreviewCatalog: boolean;
  previewSwatches: LaminateSpecimen[];
}

export function SpecimenArchive({
  laminates,
  activeFinish,
  activeColor,
  isPreviewCatalog,
  previewSwatches,
}: SpecimenArchiveProps): React.JSX.Element {
  const specimens = isPreviewCatalog
    ? filterDemoSwatches(activeFinish, activeColor, previewSwatches)
    : toSpecimens(laminates);

  return <SwatchGrid specimens={specimens} isPreviewCatalog={isPreviewCatalog} />;
}
