import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';

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
  const primaryImage = laminate.images.find((image) => image.isPrimary) ?? laminate.images[0];
  const visualizableDoor = compatibleDoors.find((door) => door.zones.length > 0);

  return (
    <main className="bg-background min-h-dvh px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        <div className="bg-neutral-tint shadow-card relative aspect-square overflow-hidden rounded-md">
          {primaryImage ? (
            <Image
              src={primaryImage.url.full}
              alt={primaryImage.altText}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="text-text-secondary font-body flex h-full items-center justify-center text-sm">
              No image yet
            </div>
          )}
        </div>

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
