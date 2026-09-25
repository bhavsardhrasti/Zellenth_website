import Link from 'next/link';
import type { Route } from 'next';

import { ImageGallery } from '@/components/shared/ImageGallery';
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
}

export default function LaminateDetailView({ laminate, compatibleDoors }: LaminateDetailViewProps) {
  const orderedImages = [...laminate.images].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary),
  );
  const visualizableDoor = compatibleDoors.find((door) => door.zones.length > 0);

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
        <ImageGallery images={orderedImages} aspectClass="aspect-square" />

        <div className="flex flex-col gap-4">
          <span className="bg-neutral-tint text-text-secondary rounded-pill w-fit px-3 py-1 text-xs font-medium">
            {laminate.finish} · {laminate.colorFamily}
          </span>
          <h1 className="font-display text-hero text-text-primary">{laminate.name}</h1>
          <span className="font-body text-text-secondary text-sm">{laminate.code}</span>
          {laminate.collectionName ? (
            <span className="font-body text-text-secondary text-sm">
              Collection: {laminate.collectionName}
            </span>
          ) : null}
          {laminate.description ? (
            <p className="font-body text-text-secondary">{laminate.description}</p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {visualizableDoor ? (
              <Link
                href={
                  `${ROUTES.DOORS_VISUALIZE(visualizableDoor.slug)}?laminate=${laminate._id.toString()}` as Route
                }
                className="bg-action hover:bg-action-hover text-action-text shadow-card w-fit cursor-pointer rounded-sm px-6 py-3 font-medium transition-colors"
              >
                See on Door
              </Link>
            ) : null}
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
        </div>
      </div>

      {compatibleDoors.length > 0 ? (
        <section className="mx-auto mt-16 max-w-6xl">
          <h2 className="font-display text-h2 text-text-primary">Try On Doors</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {compatibleDoors.map((door) => (
              <DoorCard key={door.slug} door={door} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
