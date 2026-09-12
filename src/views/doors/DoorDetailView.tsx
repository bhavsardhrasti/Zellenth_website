import Image from 'next/image';

import LaminateCard from '@/views/laminates/LaminateCard';
import type { DoorDocument } from '@/lib/db/models/Door.model';
import type { LaminateDocument } from '@/lib/db/models/Laminate.model';

export interface DoorDetailViewProps {
  door: DoorDocument;
  categoryName?: string | undefined;
  compatibleLaminates: LaminateDocument[];
}

export default function DoorDetailView({
  door,
  categoryName,
  compatibleLaminates,
}: DoorDetailViewProps) {
  const primaryImage = door.images.find((image) => image.isPrimary) ?? door.images[0];

  return (
    <main className="bg-background min-h-dvh px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        <div className="bg-neutral-tint shadow-card relative aspect-[4/5] overflow-hidden rounded-md">
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
          {categoryName ? (
            <span className="bg-neutral-tint text-text-secondary rounded-pill w-fit px-3 py-1 text-xs font-medium">
              {categoryName}
            </span>
          ) : null}
          <h1 className="font-display text-hero text-text-primary">{door.name}</h1>
          <span className="font-body text-text-secondary text-sm">{door.code}</span>
          {door.description ? (
            <p className="font-body text-text-secondary">{door.description}</p>
          ) : null}
          {door.dimensions ? (
            <p className="font-body text-text-secondary text-sm">
              {door.dimensions.width} x {door.dimensions.height} {door.dimensions.unit}
            </p>
          ) : null}
          <button className="bg-accent hover:bg-accent-hover shadow-card cursor-pointer rounded-sm px-6 py-3 font-medium text-white transition-colors">
            Try Laminates
          </button>
        </div>
      </div>

      {compatibleLaminates.length > 0 ? (
        <section className="mx-auto mt-16 max-w-6xl">
          <h2 className="font-display text-h2 text-text-primary">Compatible Laminates</h2>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
            {compatibleLaminates.map((laminate) => (
              <div key={laminate.slug} className="w-48 flex-shrink-0">
                <LaminateCard laminate={laminate} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
