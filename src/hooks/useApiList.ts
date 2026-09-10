'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { apiFetch } from '@/lib/api/client';
import type { PaginatedMeta } from '@/types/api';

interface UseApiListResult<T> {
  items: T[];
  meta: PaginatedMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApiList<T>(endpoint: string): UseApiListResult<T> {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const [items, setItems] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag must flip synchronously when the query changes, before the fetch resolves
    setIsLoading(true);
    setError(null);

    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    apiFetch<{ items: T[]; meta: PaginatedMeta }>(url)
      .then((response) => {
        if (cancelled) return;
        if (!response.success) {
          setError(response.message);
          return;
        }
        setItems(response.data?.items ?? []);
        setMeta(response.data?.meta ?? null);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load data. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [endpoint, queryString, reloadToken]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  return { items, meta, isLoading, error, refetch };
}
