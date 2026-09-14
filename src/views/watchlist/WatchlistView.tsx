'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { useState } from 'react';
import { Heart, X } from 'lucide-react';

import { PageHero } from '@/components/shared/PageHero';
import { QuoteRequestModal } from '@/components/shared/QuoteRequestModal';
import { useWatchlist, type WatchlistItem } from '@/hooks/useWatchlist';
import { ROUTES } from '@/utils/routes';

function itemHref(item: WatchlistItem): Route | null {
  if (item.door && item.laminate) return null;
  if (item.door) return ROUTES.DOORS_ID(item.door.slug) as Route;
  if (item.laminate) return ROUTES.LAMINATES_ID(item.laminate.slug) as Route;
  return null;
}

function itemImage(item: WatchlistItem): string | undefined {
  return item.comboSnapshotUrl ?? item.door?.imageUrl ?? item.laminate?.imageUrl;
}

function itemTitle(item: WatchlistItem): string {
  if (item.door && item.laminate) return `${item.door.name} in ${item.laminate.name}`;
  return item.door?.name ?? item.laminate?.name ?? '';
}

function itemTypeLabel(item: WatchlistItem): string {
  if (item.door && item.laminate) return 'Combo';
  if (item.door) return 'Door';
  return 'Laminate';
}

function ItemCard({ item, onRemove }: { item: WatchlistItem; onRemove: () => void }) {
  const href = itemHref(item);
  const imageUrl = itemImage(item);

  const content = (
    <>
      <div className="bg-neutral-tint relative aspect-square overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={itemTitle(item)}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-text-secondary font-body flex h-full items-center justify-center text-xs">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <span className="text-brand text-badge font-medium tracking-wider uppercase">
          {itemTypeLabel(item)}
        </span>
        <h3 className="font-display text-text-primary text-sm">{itemTitle(item)}</h3>
        {item.door?.code || item.laminate?.code ? (
          <span className="font-body text-text-secondary text-xs">
            {[item.door?.code, item.laminate?.code].filter(Boolean).join(' · ')}
          </span>
        ) : null}
      </div>
    </>
  );

  return (
    <div className="bg-surface shadow-card group relative overflow-hidden rounded-md">
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${itemTitle(item)} from watchlist`}
        className="absolute top-2 right-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/85 text-text-secondary backdrop-blur-sm transition-colors hover:text-error-text"
      >
        <X aria-hidden className="h-4 w-4" />
      </button>
      {href ? (
        <Link href={href} className="block">
          {content}
        </Link>
      ) : (
        <div>{content}</div>
      )}
    </div>
  );
}

export default function WatchlistView() {
  const { items, hasLoaded, remove, clear } = useWatchlist();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <main className="bg-background min-h-dvh">
      <PageHero
        breadcrumbLabel="Watchlist"
        heading="Your Watchlist"
        subtext="Doors and laminates you've saved. Nothing here is shared — it stays on this device."
      />

      <div className="mx-auto max-w-6xl px-6 py-10">
        {!hasLoaded ? null : items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="bg-neutral-tint text-text-secondary flex h-14 w-14 items-center justify-center rounded-full">
              <Heart aria-hidden className="h-6 w-6" />
            </span>
            <p className="font-body text-text-secondary">
              You haven&apos;t saved anything yet. Tap the heart icon on any door or laminate, or
              build a combo in the visualizer, to add it here.
            </p>
            <div className="mt-2 flex gap-3">
              <Link
                href={ROUTES.DOORS as Route}
                className="bg-action hover:bg-action-hover text-action-text shadow-card rounded-sm px-6 py-3 font-medium transition-colors"
              >
                Browse Doors
              </Link>
              <Link
                href={ROUTES.LAMINATES as Route}
                className="bg-surface border-border hover:bg-neutral-tint text-text-primary rounded-sm border px-6 py-3 font-medium transition-colors"
              >
                Browse Laminates
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-body text-text-secondary text-sm">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved
              </p>
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(true)}
                className="bg-action hover:bg-action-hover text-action-text shadow-card cursor-pointer rounded-sm px-6 py-3 font-medium transition-colors"
              >
                Request a Quote
              </button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <ItemCard key={item.key} item={item} onRemove={() => remove(item.key)} />
              ))}
            </div>
          </>
        )}
      </div>

      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        items={items}
        onSubmitted={clear}
      />
    </main>
  );
}
