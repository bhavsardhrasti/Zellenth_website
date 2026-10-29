import Link from 'next/link';
import type { Route } from 'next';

import { ImageGallery } from '@/components/shared/ImageGallery';
import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { WatchlistButton } from '@/components/shared/WatchlistButton';
import DoorCard from '@/views/doors/DoorCard';
import { LaminateEnquireButton } from '@/views/laminates/LaminateEnquireButton';
import { ROUTES } from '@/utils/routes';
import type { LaminateDocument } from '@/lib/db/models/Laminate.model';
import type { DoorDocument } from '@/lib/db/models/Door.model';

export interface LaminateDetailViewProps {
  laminate: LaminateDocument;
  compatibleDoors: DoorDocument[];
  similarLaminates: LaminateDocument[];
}

function getLaminateDescription(laminate: LaminateDocument): string {
  const tone = laminate.colorFamily.toLowerCase();
  const finishDescription =
    laminate.finish === 'gloss'
      ? 'A smooth, light-catching gloss brings a polished look.'
      : laminate.finish === 'matte'
        ? 'A soft matte surface gives the colour a calm, understated look.'
        : 'A tactile textured surface adds depth and brings out the pattern.';
  const grainDescription =
    laminate.grainDirection === 'no-grain'
      ? ''
      : ` Its ${laminate.grainDirection} grain adds a natural sense of direction.`;
  const usage =
    tone.includes('neutral') || tone.includes('white')
      ? 'It pairs easily with light interiors, clean lines and contemporary spaces.'
      : 'It works well on statement doors and coordinated interior details.';

  return `${finishDescription}${grainDescription} ${usage}`;
}

export function getSwatchColor(colorFamily: string): string {
  const family = colorFamily.toLowerCase();
  if (family.includes('neutral') || family.includes('white')) return '#eeeae0';
  if (family.includes('warm')) return '#9a704f';
  if (family.includes('cool')) return '#56687a';
  if (family.includes('statement')) return '#986256';
  return '#d6d0c5';
}

export function getGrainLabel(grainDirection: string): string {
  return grainDirection === 'no-grain' ? 'None' : grainDirection;
}

export default function LaminateDetailView({
  laminate,
  compatibleDoors,
  similarLaminates,
}: LaminateDetailViewProps): React.JSX.Element {
  const orderedImages = [...laminate.images].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary),
  );
  const visualizableDoor = compatibleDoors.find((door) => door.zones.length > 0);
  const specifications = [
    { label: 'Finish', value: laminate.finish },
    { label: 'Tone', value: laminate.colorFamily },
    { label: 'Grain', value: getGrainLabel(laminate.grainDirection) },
    { label: 'Thickness', value: 'Contact us for details' },
    { label: 'Size', value: laminate.size ?? 'Contact us for details' },
    { label: 'Code', value: laminate.code },
  ];

  return (
    <main className="bg-background min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          items={[
            { label: 'Laminates', href: ROUTES.LAMINATES as Route },
            { label: laminate.name },
          ]}
        />
      </div>
      <div className="mx-auto mt-6 grid max-w-6xl gap-10 lg:grid-cols-2">
        <div>
          <ImageGallery images={orderedImages} aspectClass="aspect-square" />
          {orderedImages.length > 0 ? (
            <p className="font-body text-text-muted mt-2 text-xs">
              Select a thumbnail to view each image. Select the main image to zoom.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <span className="bg-neutral-tint text-text-secondary rounded-pill w-fit px-3 py-1 text-xs font-medium">
            {laminate.finish} · {laminate.colorFamily}
          </span>
          <div className="flex items-center gap-3">
            <span
              aria-label={`${laminate.colorFamily} colour swatch`}
              title={`${laminate.colorFamily} colour`}
              className="border-border h-8 w-8 shrink-0 rounded-sm border"
              style={{ backgroundColor: getSwatchColor(laminate.colorFamily) }}
            />
            <h1 className="font-display text-hero text-text-primary">{laminate.name}</h1>
          </div>
          <p className="font-body text-text-secondary max-w-xl leading-relaxed">
            {laminate.description || getLaminateDescription(laminate)}
          </p>
          <dl className="border-border mt-2 grid grid-cols-2 border-y sm:grid-cols-3">
            {specifications.map((specification) => (
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
          {laminate.collectionName ? (
            <p className="font-body text-text-secondary text-sm">
              Collection: {laminate.collectionName}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {visualizableDoor ? (
              <Link
                href={
                  `${ROUTES.DOORS_VISUALIZE(visualizableDoor.slug)}?laminate=${laminate._id.toString()}` as Route
                }
                className="bg-action hover:bg-action-hover text-action-text shadow-card w-fit cursor-pointer rounded-sm px-6 py-3 font-medium transition-colors"
              >
                Try on a door
              </Link>
            ) : (
              <Link
                href={ROUTES.DOORS as Route}
                className="bg-action hover:bg-action-hover text-action-text shadow-card w-fit cursor-pointer rounded-sm px-6 py-3 font-medium transition-colors"
              >
                Try on a door
              </Link>
            )}
            <LaminateEnquireButton
              laminateId={laminate._id.toString()}
              laminateName={laminate.name}
            />
            <WatchlistButton
              type="laminate"
              slug={laminate.slug}
              name={laminate.name}
              code={laminate.code}
              imageUrl={orderedImages[0]?.url.thumbnail}
              variant="inline"
            />
          </div>
          <p className="font-body text-text-muted text-xs">
            Ask our team for care, durability and warranty details for this finish.
          </p>
        </div>
      </div>

      {compatibleDoors.length > 0 ? (
        <section className="mx-auto mt-16 max-w-6xl">
          <h2 className="font-display text-h2 text-text-primary">Pairs well with</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {compatibleDoors.slice(0, 4).map((door) => (
              <DoorCard key={door.slug} door={door} />
            ))}
          </div>
        </section>
      ) : null}

      {similarLaminates.length > 0 ? (
        <section className="mx-auto mt-16 max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-h2 text-text-primary">Similar laminates</h2>
            <Link
              href={ROUTES.LAMINATES as Route}
              className="font-body text-brand text-sm underline underline-offset-4"
            >
              Browse all laminates
            </Link>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {similarLaminates.slice(0, 4).map((similarLaminate) => {
              const image =
                similarLaminate.images.find((item) => item.isPrimary) ?? similarLaminate.images[0];
              return (
                <li key={similarLaminate.slug}>
                  <Link
                    href={ROUTES.LAMINATES_ID(similarLaminate.slug) as Route}
                    className="group block"
                  >
                    <div className="bg-neutral-tint relative aspect-square overflow-hidden">
                      <ImageWrapper
                        src={image?.url.mid ?? image?.url.full}
                        alt={image?.altText ?? `${similarLaminate.name} laminate`}
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="transition-transform duration-300 group-hover:scale-105"
                        emptyLabel="No image yet"
                      />
                    </div>
                    <div className="border-border group-hover:border-brand mt-3 border-t pt-3">
                      <h3 className="font-display text-text-primary text-lg">
                        {similarLaminate.name}
                      </h3>
                      <p className="font-body text-text-secondary text-xs capitalize">
                        {similarLaminate.finish} · {similarLaminate.colorFamily}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
