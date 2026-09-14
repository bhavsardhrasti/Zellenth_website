'use client';

import { Heart } from 'lucide-react';
import type { MouseEvent } from 'react';

import { useWatchlist, type WatchlistType } from '@/hooks/useWatchlist';
import { cn } from '@/utils/cn';

interface WatchlistButtonProps {
  type: WatchlistType;
  slug: string;
  name: string;
  code?: string | undefined;
  imageUrl?: string | undefined;
  variant?: 'overlay' | 'inline';
  className?: string;
}

export function WatchlistButton({
  type,
  slug,
  name,
  code,
  imageUrl,
  variant = 'overlay',
  className,
}: WatchlistButtonProps) {
  const { isSaved, toggle } = useWatchlist();
  const saved = isSaved(type, slug);

  function handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggle({ type, slug, name, code, imageUrl });
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        className={cn(
          'font-body inline-flex w-fit cursor-pointer items-center gap-2 rounded-sm border px-6 py-3 font-medium transition-colors',
          saved
            ? 'bg-accent-2-tint border-accent-2 text-accent-2'
            : 'bg-surface border-border text-text-primary hover:bg-neutral-tint',
          className,
        )}
      >
        <Heart aria-hidden className={cn('h-4 w-4', saved && 'fill-current')} />
        {saved ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? `Remove ${name} from watchlist` : `Save ${name} to watchlist`}
      aria-pressed={saved}
      className={cn(
        'absolute top-2 right-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/85 text-text-secondary backdrop-blur-sm transition-colors hover:text-accent-2',
        saved && 'text-accent-2',
        className,
      )}
    >
      <Heart aria-hidden className={cn('h-4 w-4', saved && 'fill-current')} />
    </button>
  );
}
