import Link from 'next/link';

import DoorCard from '@/views/doors/DoorCard';
import type { DoorDocument } from '@/lib/db/models/Door.model';
import type { PaginatedMeta } from '@/types/api';

export interface DoorsListViewProps {
  doors: DoorDocument[];
  categoryNames: Record<string, string>;
  meta: PaginatedMeta;
}

export default function DoorsListView({ doors, categoryNames, meta }: DoorsListViewProps) {
  return (
    <main className="bg-background min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-h1 text-text-primary">Doors</h1>
        <p className="font-body text-text-secondary mt-2">
          Browse our full range of doors, then try any laminate on the one you like.
        </p>

        {doors.length === 0 ? (
          <p className="font-body text-text-secondary mt-12 text-center">
            No doors are available yet — check back soon.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {doors.map((door) => (
              <DoorCard
                key={door.slug}
                door={door}
                categoryName={categoryNames[door.categoryId.toString()]}
              />
            ))}
          </div>
        )}

        <PaginationControls meta={meta} />
      </div>
    </main>
  );
}

function PaginationControls({ meta }: { meta: PaginatedMeta }) {
  if (meta.totalPages <= 1) {
    return null;
  }

  return (
    <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Pagination">
      {meta.hasPreviousPage ? (
        <Link
          href={{ pathname: '/doors', query: { page: meta.page - 1 } }}
          className="text-brand font-body text-sm font-medium"
        >
          Previous
        </Link>
      ) : null}
      <span className="font-body text-text-secondary text-sm">
        Page {meta.page} of {meta.totalPages}
      </span>
      {meta.hasNextPage ? (
        <Link
          href={{ pathname: '/doors', query: { page: meta.page + 1 } }}
          className="text-brand font-body text-sm font-medium"
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}
