import Link from 'next/link';
import type { Route } from 'next';

import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { WatchlistButton } from '@/components/shared/WatchlistButton';
import { ROUTES } from '@/utils/routes';
import type { LaminateDocument } from '@/lib/db/models/Laminate.model';

export interface LaminateCardProps {
  laminate: Pick<LaminateDocument, 'slug' | 'name' | 'code' | 'colorFamily' | 'images'>;
}

export default function LaminateCard({ laminate }: LaminateCardProps) {
  const primaryImage = laminate.images.find((image) => image.isPrimary) ?? laminate.images[0];

  return (
    <Link href={ROUTES.LAMINATES_ID(laminate.slug) as Route} className="group block">
      <div className="bg-neutral-tint relative aspect-square overflow-hidden">
        <ImageWrapper
          src={primaryImage?.url.thumbnail}
          alt={primaryImage?.altText ?? laminate.name}
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="transition-transform duration-300 group-hover:scale-105"
          emptyLabel="No image yet"
        />
        <WatchlistButton
          type="laminate"
          slug={laminate.slug}
          name={laminate.name}
          code={laminate.code}
          imageUrl={primaryImage?.url.thumbnail}
        />
      </div>
      <div className="border-border group-hover:border-brand mt-3 flex flex-col gap-1 border-t pt-3 transition-colors duration-300">
        <span className="text-brand font-body text-[11px] font-medium tracking-[0.14em] uppercase">
          {laminate.colorFamily}
        </span>
        <h3 className="font-display text-text-primary text-sm leading-tight">{laminate.name}</h3>
        <span className="font-body text-text-secondary text-[11px] tracking-[0.14em] uppercase">
          {laminate.code}
        </span>
      </div>
    </Link>
  );
}
