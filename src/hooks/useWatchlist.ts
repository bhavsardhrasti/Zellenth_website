'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type WatchlistType = 'door' | 'laminate';

export interface WatchlistItem {
  type: WatchlistType;
  slug: string;
  name: string;
  code?: string | undefined;
  imageUrl?: string | undefined;
  addedAt: number;
}

const STORAGE_KEY = 'zellenth_watchlist';
const CHANGE_EVENT = 'zellenth_watchlist_change';

let cachedRaw: string | null = null;
let cachedItems: WatchlistItem[] = [];

function readItems(): WatchlistItem[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return [];
  }
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cachedItems = Array.isArray(parsed) ? parsed : [];
  } catch {
    cachedItems = [];
  }
  return cachedItems;
}

function writeItems(items: WatchlistItem[]) {
  cachedRaw = JSON.stringify(items);
  cachedItems = items;
  try {
    window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — fail silently
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function noopSubscribe() {
  return () => {};
}

const EMPTY_ITEMS: WatchlistItem[] = [];

function getServerSnapshot(): WatchlistItem[] {
  return EMPTY_ITEMS;
}

export function useWatchlist() {
  const items = useSyncExternalStore(subscribe, readItems, getServerSnapshot);
  const hasLoaded = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const isSaved = useCallback(
    (type: WatchlistType, slug: string) =>
      items.some((item) => item.type === type && item.slug === slug),
    [items],
  );

  const toggle = useCallback(
    (item: Omit<WatchlistItem, 'addedAt'>) => {
      const exists = items.some((i) => i.type === item.type && i.slug === item.slug);
      const next = exists
        ? items.filter((i) => !(i.type === item.type && i.slug === item.slug))
        : [...items, { ...item, addedAt: Date.now() }];
      writeItems(next);
    },
    [items],
  );

  const remove = useCallback(
    (type: WatchlistType, slug: string) => {
      writeItems(items.filter((i) => !(i.type === type && i.slug === slug)));
    },
    [items],
  );

  return { items, hasLoaded, isSaved, toggle, remove };
}
