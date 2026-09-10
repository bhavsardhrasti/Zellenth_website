'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';

import { Button } from '@/components/ui/Button';
import type { PaginatedMeta } from '@/types/api';

interface PaginationProps {
  meta: PaginatedMeta;
}

export function Pagination({ meta }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (meta.totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}` as Route);
  }

  return (
    <nav className="mt-6 flex items-center justify-center gap-4" aria-label="Pagination">
      <Button
        variant="secondary"
        disabled={!meta.hasPreviousPage}
        onClick={() => goToPage(meta.page - 1)}
      >
        Previous
      </Button>
      <span className="text-body-sm text-text-secondary">
        Page {meta.page} of {meta.totalPages}
      </span>
      <Button
        variant="secondary"
        disabled={!meta.hasNextPage}
        onClick={() => goToPage(meta.page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
