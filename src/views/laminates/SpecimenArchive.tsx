'use client';

import { filterDemoSwatches } from '@/views/laminates/demoSwatches';
import { SwatchGrid } from '@/views/laminates/SwatchGrid';

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

export interface SpecimenArchiveProps {
  specimens: LaminateSpecimen[];
  activeFinish: string;
  activeColor: string;
  isPreviewCatalog: boolean;
  previewSwatches: LaminateSpecimen[];
}

export function SpecimenArchive({
  specimens: laminateSpecimens,
  activeFinish,
  activeColor,
  isPreviewCatalog,
  previewSwatches,
}: SpecimenArchiveProps): React.JSX.Element {
  const specimens = isPreviewCatalog
    ? filterDemoSwatches(activeFinish, activeColor, previewSwatches)
    : laminateSpecimens;

  return <SwatchGrid specimens={specimens} isPreviewCatalog={isPreviewCatalog} />;
}
