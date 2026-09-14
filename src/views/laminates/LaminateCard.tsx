import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';

import { WatchlistButton } from '@/components/shared/WatchlistButton';
import { ROUTES } from '@/utils/routes';
import type { LaminateDocument } from '@/lib/db/models/Laminate.model';

export interface LaminateCardProps {
  laminate: Pick<LaminateDocument, 'slug' | 'name' | 'code' | 'colorFamily' | 'images'>;
}

export default function LaminateCard({ laminate }: LaminateCardProps) {
  const primaryImage = laminate.images.find((image) => image.isPrimary) ?? laminate.images[0];

  return (
    <Link
      href={ROUTES.LAMINATES_ID(laminate.slug) as Route}
      className="bg-surface shadow-card hover:shadow-elevated group block overflow-hidden rounded-md transition-all duration-300 hover:-translate-y-1"
    >
      <div className="bg-neutral-tint relative aspect-square overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url.thumbnail}
            alt={primaryImage.altText}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-text-secondary font-body flex h-full items-center justify-center text-xs">
            No image yet
          </div>
        )}
        <WatchlistButton
          type="laminate"
          slug={laminate.slug}
          name={laminate.name}
          code={laminate.code}
          imageUrl={primaryImage?.url.thumbnail}
        />
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        <span className="text-brand text-badge font-medium tracking-wider uppercase">
          {laminate.colorFamily}
        </span>
        <h3 className="font-display text-text-primary text-sm">{laminate.name}</h3>
        <span className="font-body text-text-secondary text-xs">{laminate.code}</span>
        <span className="bg-border group-hover:bg-brand mt-1 h-px w-6 transition-all duration-300 group-hover:w-full" />
      </div>
    </Link>
  );
}
