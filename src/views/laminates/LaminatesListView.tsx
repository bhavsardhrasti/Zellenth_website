import Link from 'next/link';

import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Grain, MicroLabel } from '@/components/ui/editorial';
import { laminateFinishOptions } from '@/lib/data/nav';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/utils/routes';
import { CtaBanner } from '@/views/home/sections/CtaBanner';
import { ColorFamilyShowcase } from '@/views/laminates/ColorFamilyShowcase';
import { DoorPreviewStrip } from '@/views/laminates/DoorPreviewStrip';
import { FinishGuide, LaminatesHero, LaminatesTrustRow } from '@/views/laminates/LaminatesSections';
import { SampleNotes } from '@/views/laminates/SampleNotes';
import { ProjectInspiration } from '@/views/laminates/ProjectInspiration';
import { SpecimenArchive } from '@/views/laminates/SpecimenArchive';
import { DEMO_SWATCHES, filterDemoSwatches, withDoorImages } from '@/views/laminates/demoSwatches';
import type { LaminateSpecimen } from '@/views/laminates/SpecimenArchive';
import type { LaminateDocument } from '@/lib/db/models/Laminate.model';
import type { PaginatedMeta } from '@/types/api';

export interface LaminatesListViewProps {
  laminates: LaminateDocument[];
  meta: PaginatedMeta;
  activeFinish: string;
  colorFamilies: string[];
  activeColor: string;
  /** One real swatch URL per colour family, drawn from the whole finish. */
  colorSwatches: Record<string, string | undefined>;
  previewDoorImages: { src: string; alt: string }[];
}

// The laminates page reads as a materials archive: a full-bleed hero, a photo
// guide to the three surface types, finish previews, inspiration and a swatch
// grid. Filters are real links, so every state is shareable without client
// filter state.
export default function LaminatesListView({
  laminates,
  meta,
  activeFinish,
  colorFamilies,
  activeColor,
  colorSwatches,
  previewDoorImages,
}: LaminatesListViewProps): React.JSX.Element {
  const isPreviewCatalog = meta.total === 0;
  const previewSwatches: LaminateSpecimen[] = withDoorImages(previewDoorImages);
  const archiveFamilies = isPreviewCatalog
    ? Array.from(new Set(previewSwatches.map((swatch) => swatch.colorFamily))).sort((a, b) =>
        a.localeCompare(b),
      )
    : colorFamilies;
  const archiveSwatches = isPreviewCatalog
    ? Object.fromEntries(
        archiveFamilies.map((family) => [
          family,
          previewSwatches.find((swatch) => swatch.colorFamily === family)?.image,
        ]),
      )
    : colorSwatches;
  const displayedTotal = isPreviewCatalog
    ? filterDemoSwatches(activeFinish, activeColor).length
    : meta.total;
  const displayedMeta = isPreviewCatalog ? { ...meta, total: displayedTotal, totalPages: 1 } : meta;
  const previewImages = Array.from(
    new Set(
      previewSwatches.map((swatch) => swatch.image).filter((image): image is string => !!image),
    ),
  ).slice(0, 3);

  return (
    <main>
      <AnimatedSection immediate duration={0.4}>
        <LaminatesHero isPreviewCatalog={isPreviewCatalog} />
      </AnimatedSection>
      <AnimatedSection duration={0.4} delay={0.04}>
        <LaminatesTrustRow
          total={isPreviewCatalog ? DEMO_SWATCHES.length : meta.total}
          isPreviewCatalog={isPreviewCatalog}
        />
      </AnimatedSection>

      <AnimatedSection duration={0.4}>
        <FinishGuide activeFinish={activeFinish} />
      </AnimatedSection>

      <AnimatedSection duration={0.4}>
        <ColorFamilyShowcase
          colorFamilies={archiveFamilies}
          activeColor={activeColor}
          swatches={archiveSwatches}
        />
      </AnimatedSection>

      <AnimatedSection duration={0.4}>
        <DoorPreviewStrip images={previewImages} />
      </AnimatedSection>

      <AnimatedSection duration={0.4}>
        <ProjectInspiration />
      </AnimatedSection>

      {/* The board — a dark, sticky filter rail so the controls stay in reach
          while the specimen index scrolls beneath them. */}
      <AnimatedSection duration={0.4}>
        <section id="board" className="bg-surface-warm scroll-mt-16 px-4 pt-8 sm:px-6">
          <div className="bg-action relative isolate overflow-hidden text-white sm:sticky sm:top-16 sm:z-30">
            <Grain />
            <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6">
              <FilterRail
                activeFinish={activeFinish}
                activeColor={activeColor}
                colorFamilies={archiveFamilies}
                meta={displayedMeta}
              />
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection duration={0.4}>
        <SpecimenArchive
          laminates={laminates}
          activeFinish={activeFinish}
          activeColor={activeColor}
          isPreviewCatalog={isPreviewCatalog}
          previewSwatches={previewSwatches}
        />
      </AnimatedSection>

      <AnimatedSection duration={0.4}>
        <SampleNotes />
      </AnimatedSection>
      <AnimatedSection duration={0.4}>
        <CtaBanner />
      </AnimatedSection>
    </main>
  );
}

interface FilterRailProps {
  activeFinish: string;
  activeColor: string;
  colorFamilies: string[];
  meta: PaginatedMeta;
}

// Two stacked rails: finish (drives the whole page) and colour family (refines
// the specimen index). Both are plain links with the current one marked.
function FilterRail({
  activeFinish,
  activeColor,
  colorFamilies,
  meta,
}: FilterRailProps): React.JSX.Element {
  const finishFilters = [{ label: 'All', value: 'all' }].concat(
    laminateFinishOptions.map((option) => ({ label: option.label, value: option.value })),
  );

  const colorFilters = [{ label: 'Any colour', value: 'all' }].concat(
    colorFamilies.map((family) => ({ label: family, value: family })),
  );

  const href = (
    finish: string,
    color: string,
  ): { pathname: string; query: Record<string, string>; hash: string } => {
    const query: Record<string, string> = {};
    if (finish !== 'all') query.finish = finish;
    if (color !== 'all') query.color = color;
    return { pathname: ROUTES.LAMINATES, query, hash: 'board' };
  };

  const chipClass = (isActive: boolean): string =>
    cn(
      'font-body block border px-4 py-2 text-xs font-medium tracking-[0.14em] uppercase transition-colors',
      isActive
        ? 'bg-surface text-text-primary border-surface'
        : 'border-white/25 text-white/75 hover:border-white/60 hover:text-white',
    );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <MicroLabel className="text-white/60">Filter the archive</MicroLabel>
        <MicroLabel className="text-white/60 tabular-nums">
          {meta.total} {meta.total === 1 ? 'finish' : 'finishes'}
          {activeFinish !== 'all' ? ` · ${activeFinish}` : ''}
          {activeColor !== 'all' ? ` · ${activeColor}` : ''}
          {meta.totalPages > 1 ? ` · page ${meta.page} of ${meta.totalPages}` : ''}
        </MicroLabel>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <MicroLabel className="w-16 shrink-0 text-white/45">Finish</MicroLabel>
        <ul className="flex flex-wrap gap-2">
          {finishFilters.map((filter) => {
            const isActive = filter.value === activeFinish;
            return (
              <li key={filter.value}>
                <Link
                  href={href(filter.value, activeColor)}
                  scroll={false}
                  aria-current={isActive ? 'page' : undefined}
                  className={chipClass(isActive)}
                >
                  {filter.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {colorFamilies.length > 1 ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <MicroLabel className="w-16 shrink-0 text-white/45">Colour</MicroLabel>
          <ul className="flex flex-wrap gap-2">
            {colorFilters.map((filter) => {
              const isActive = filter.value === activeColor;
              return (
                <li key={filter.value}>
                  <Link
                    href={href(activeFinish, filter.value)}
                    scroll={false}
                    aria-current={isActive ? 'page' : undefined}
                    className={chipClass(isActive)}
                  >
                    {filter.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
