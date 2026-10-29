import Link from 'next/link';
import type { Route } from 'next';

import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ImageGallery } from '@/components/shared/ImageGallery';
import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { getGrainLabel, getSwatchColor } from '@/views/laminates/LaminateDetailView';
import type { LaminateSpecimen } from '@/views/laminates/SpecimenArchive';
import { ROUTES } from '@/utils/routes';

interface PreviewLaminateDetailViewProps {
  specimen: LaminateSpecimen;
  similarSpecimens: LaminateSpecimen[];
}

export function PreviewLaminateDetailView({
  specimen,
  similarSpecimens,
}: PreviewLaminateDetailViewProps): React.JSX.Element {
  const previewDescription =
    specimen.finishLabel.toLowerCase() === 'gloss' &&
    specimen.colorFamily.toLowerCase() === 'neutral'
      ? 'A crisp neutral tone with a smooth gloss surface that catches the light. Its clean, polished look suits contemporary doors and bright interiors.'
      : `${specimen.finishLabel} finish in a ${specimen.colorFamily.toLowerCase()} tone. A considered option for interior doors and coordinated spaces.`;

  return (
    <main className="bg-background min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          items={[
            { label: 'Laminates', href: ROUTES.LAMINATES as Route },
            { label: specimen.name },
          ]}
        />
      </div>
      <div className="mx-auto mt-6 grid max-w-6xl gap-10 lg:grid-cols-2">
        <ImageGallery
          images={
            specimen.image
              ? [
                  {
                    url: {
                      full: specimen.image,
                      mid: specimen.image,
                      thumbnail: specimen.thumbnail ?? specimen.image,
                    },
                    altText: `${specimen.name} finish concept preview`,
                  },
                ]
              : []
          }
          aspectClass="aspect-square"
          emptyLabel="Finish concept image coming soon"
        />
        <div className="flex flex-col items-start gap-4">
          <span className="bg-neutral-tint text-text-secondary rounded-pill w-fit px-3 py-1 text-xs font-medium">
            {specimen.finishLabel} · {specimen.colorFamily}
          </span>
          <div className="flex items-center gap-3">
            <span
              aria-label={`${specimen.colorFamily} colour swatch`}
              className="border-border h-8 w-8 shrink-0 rounded-sm border"
              style={{ backgroundColor: getSwatchColor(specimen.colorFamily) }}
            />
            <h1 className="font-display text-hero text-text-primary">{specimen.name}</h1>
          </div>
          <p className="font-body text-text-secondary leading-relaxed">{previewDescription}</p>
          <dl className="border-border grid w-full grid-cols-2 border-y sm:grid-cols-3">
            {[
              { label: 'Finish', value: specimen.finishLabel },
              { label: 'Tone', value: specimen.colorFamily },
              { label: 'Grain', value: getGrainLabel(specimen.grainDirection) },
              { label: 'Thickness', value: 'Confirm availability' },
              { label: 'Size', value: 'Confirm availability' },
              { label: 'Code', value: specimen.code },
            ].map((specification) => (
              <div
                key={specification.label}
                className="border-border flex flex-col gap-1 border-b py-3 pr-3 last:border-b-0 sm:[&:nth-last-child(-n+3)]:border-b-0"
              >
                <dt className="font-body text-text-muted text-xs uppercase tracking-wide">
                  {specification.label}
                </dt>
                <dd className="font-body text-text-primary text-sm capitalize">
                  {specification.value}
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href={ROUTES.DOORS as Route}
            className="bg-action hover:bg-action-hover text-action-text shadow-card w-fit rounded-sm px-6 py-3 font-medium transition-colors"
          >
            Try on a door
          </Link>
        </div>
      </div>
      {similarSpecimens.length > 0 ? (
        <section className="mx-auto mt-16 max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-h2 text-text-primary">Similar finishes</h2>
            <Link
              href={ROUTES.LAMINATES as Route}
              className="font-body text-brand text-sm underline underline-offset-4"
            >
              Browse all finishes
            </Link>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {similarSpecimens.slice(0, 4).map((similar) => (
              <li key={similar.code}>
                <Link href={ROUTES.LAMINATES_ID(similar.slug) as Route} className="group block">
                  <div className="bg-neutral-tint relative aspect-square overflow-hidden">
                    <ImageWrapper
                      src={similar.image}
                      alt={`${similar.name} finish concept preview`}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="border-border group-hover:border-brand mt-3 border-t pt-3">
                    <h3 className="font-display text-text-primary text-lg">{similar.name}</h3>
                    <p className="font-body text-text-secondary text-xs">
                      {similar.finishLabel} · {similar.colorFamily}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
