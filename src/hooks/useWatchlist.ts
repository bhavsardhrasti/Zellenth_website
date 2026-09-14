'use client';

import { useCallback, useSyncExternalStore } from 'react';

export interface WatchlistRef {
  slug: string;
  name: string;
  code?: string | undefined;
  imageUrl?: string | undefined;
}

export interface WatchlistItem {
  key: string;
  door?: WatchlistRef | undefined;
  laminate?: WatchlistRef | undefined;
  comboSnapshotUrl?: string | undefined;
  addedAt: number;
}

const STORAGE_KEY = 'zellenth_watchlist';
const CHANGE_EVENT = 'zellenth_watchlist_change';

function buildKey(door?: WatchlistRef, laminate?: WatchlistRef): string {
  return `${door?.slug ?? '-'}::${laminate?.slug ?? '-'}`;
}

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
    (door?: WatchlistRef, laminate?: WatchlistRef) => {
      const key = buildKey(door, laminate);
      return items.some((item) => item.key === key);
    },
    [items],
  );

  const toggle = useCallback(
    (entry: {
      door?: WatchlistRef | undefined;
      laminate?: WatchlistRef | undefined;
      comboSnapshotUrl?: string | undefined;
    }) => {
      const key = buildKey(entry.door, entry.laminate);
      const exists = items.some((item) => item.key === key);
      const next = exists
        ? items.filter((item) => item.key !== key)
        : [...items, { ...entry, key, addedAt: Date.now() }];
      writeItems(next);
    },
    [items],
  );

  const remove = useCallback(
    (key: string) => {
      writeItems(items.filter((item) => item.key !== key));
    },
    [items],
  );

  const clear = useCallback(() => {
    writeItems([]);
  }, []);

  return { items, hasLoaded, isSaved, toggle, remove, clear };
}
