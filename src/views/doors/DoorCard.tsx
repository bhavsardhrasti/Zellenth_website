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
    <Link href={ROUTES.DOORS_ID(door.slug) as Route} className="group block">
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
      <div className="border-border group-hover:border-brand mt-3 flex flex-col gap-1 border-t pt-3 transition-colors duration-300">
        {categoryName ? (
          <span className="text-brand font-body text-[11px] font-medium tracking-[0.14em] uppercase">
            {categoryName}
          </span>
        ) : null}
        <h3 className="font-display text-text-primary text-lg leading-tight">{door.name}</h3>
        <span className="font-body text-text-secondary text-[11px] tracking-[0.14em] uppercase">
          {door.code}
        </span>
      </div>
    </Link>
  );
}
