import { NextResponse } from 'next/server';

import type { ApiResponse, PaginatedMeta } from '@/types/api';

export function ok<T>(data: T, message = 'Success'): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, message, data });
}

export function created<T>(data: T, message = 'Created'): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, message, data }, { status: 201 });
}

export function paginated<T>(
  data: T[],
  meta: PaginatedMeta,
  message = 'Success',
): NextResponse<ApiResponse<{ items: T[]; meta: PaginatedMeta }>> {
  return NextResponse.json({ success: true, message, data: { items: data, meta } });
}

export function fail(
  message: string,
  status = 400,
  error?: string,
): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ success: false, message, ...(error ? { error } : {}) }, { status });
}

export function buildPaginatedMeta(total: number, page: number, limit: number): PaginatedMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
