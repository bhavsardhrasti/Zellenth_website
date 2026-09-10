'use client';

import { useCallback, useState } from 'react';

import type { ApiResponse } from '@/types/api';

interface UseApiMutationResult<TInput, TOutput> {
  mutate: (input: TInput) => Promise<ApiResponse<TOutput>>;
  isLoading: boolean;
  error: string | null;
}

export function useApiMutation<TInput, TOutput>(
  fn: (input: TInput) => Promise<ApiResponse<TOutput>>,
): UseApiMutationResult<TInput, TOutput> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (input: TInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fn(input);
        if (!response.success) {
          setError(response.message);
        }
        return response;
      } catch {
        const message = 'Something went wrong. Please try again.';
        setError(message);
        return { success: false, message } as ApiResponse<TOutput>;
      } finally {
        setIsLoading(false);
      }
    },
    [fn],
  );

  return { mutate, isLoading, error };
}
