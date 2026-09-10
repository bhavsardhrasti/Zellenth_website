import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';

import { ROUTES } from '@/utils/routes';
import type { DoorDocument } from '@/lib/db/models/Door.model';

export interface DoorCardProps {
  door: Pick<DoorDocument, 'slug' | 'name' | 'code' | 'images'>;
  categoryName?: string | undefined;
}

export default function DoorCard({ door, categoryName }: DoorCardProps) {
  const primaryImage = door.images.find((image) => image.isPrimary) ?? door.images[0];

  return (
    <Link
      href={ROUTES.DOORS_ID(door.slug) as Route}
      className="bg-surface shadow-card hover:shadow-elevated group block overflow-hidden rounded-md transition-shadow"
    >
      <div className="bg-neutral-tint relative aspect-[4/5] overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url.mid}
            alt={primaryImage.altText}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-text-secondary font-body flex h-full items-center justify-center text-sm">
            No image yet
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        {categoryName ? (
          <span className="bg-neutral-tint text-text-secondary rounded-pill w-fit px-2 py-0.5 text-xs font-medium">
            {categoryName}
          </span>
        ) : null}
        <h3 className="font-display text-text-primary text-lg">{door.name}</h3>
        <span className="font-body text-text-secondary text-sm">{door.code}</span>
      </div>
    </Link>
  );
}
