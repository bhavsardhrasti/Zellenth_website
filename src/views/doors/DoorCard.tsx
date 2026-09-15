import Link from 'next/link';
import type { Route } from 'next';

import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { WatchlistButton } from '@/components/shared/WatchlistButton';
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
      className="bg-surface shadow-card hover:shadow-elevated group block overflow-hidden rounded-md transition-all duration-300 hover:-translate-y-1"
    >
      <div className="bg-neutral-tint relative aspect-[4/5] overflow-hidden">
        <ImageWrapper
          src={primaryImage?.url.mid}
          alt={primaryImage?.altText ?? door.name}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="transition-transform duration-300 group-hover:scale-105"
          emptyLabel="No image yet"
        />
        <WatchlistButton
          type="door"
          slug={door.slug}
          name={door.name}
          code={door.code}
          imageUrl={primaryImage?.url.thumbnail}
        />
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        {categoryName ? (
          <span className="text-brand text-badge font-medium tracking-wider uppercase">
            {categoryName}
          </span>
        ) : null}
        <h3 className="font-display text-text-primary text-lg">{door.name}</h3>
        <span className="font-body text-text-secondary text-sm">{door.code}</span>
        <span className="bg-border group-hover:bg-brand mt-1 h-px w-8 transition-all duration-300 group-hover:w-full" />
      </div>
    </Link>
  );
}
