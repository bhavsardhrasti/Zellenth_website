import type { ApiResponse } from '@/types/api';

export class ApiClientError extends Error {
  status: number;
  issues?: string | undefined;

  constructor(message: string, status: number, issues?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.issues = issues;
  }
}

export async function apiFetch<T>(input: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.body && !(init.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...init?.headers,
    },
  });

  const body = (await response.json()) as ApiResponse<T>;
  return body;
}

export async function apiFetchOrThrow<T>(input: string, init?: RequestInit): Promise<T> {
  const body = await apiFetch<T>(input, init);
  if (!body.success) {
    throw new ApiClientError(body.message, 400, body.error);
  }
  return body.data as T;
}
