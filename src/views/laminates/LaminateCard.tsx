import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';

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
      className="bg-surface shadow-card hover:shadow-elevated group block overflow-hidden rounded-md transition-shadow"
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
      </div>
      <div className="flex flex-col gap-1 p-3">
        <h3 className="font-display text-text-primary text-sm">{laminate.name}</h3>
        <span className="font-body text-text-secondary text-xs">
          {laminate.code} · {laminate.colorFamily}
        </span>
      </div>
    </Link>
  );
}
