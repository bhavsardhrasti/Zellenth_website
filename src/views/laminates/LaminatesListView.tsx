import Link from 'next/link';

import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { CardGrid } from '@/components/shared/CardGrid';
import LaminateCard from '@/views/laminates/LaminateCard';
import type { LaminateDocument } from '@/lib/db/models/Laminate.model';
import type { PaginatedMeta } from '@/types/api';

export interface LaminatesListViewProps {
  laminates: LaminateDocument[];
  meta: PaginatedMeta;
}

export default function LaminatesListView({ laminates, meta }: LaminatesListViewProps) {
  return (
    <main className="bg-background min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-h1 text-text-primary">Laminates</h1>
        <p className="font-body text-text-secondary mt-2">
          Explore our laminate textures, then see how they look on a door.
        </p>

        {laminates.length === 0 ? (
          <p className="font-body text-text-secondary mt-12 text-center">
            No laminates are available yet. Check back soon.
          </p>
        ) : (
          <AnimatedSection className="mt-10">
            <CardGrid columns={5}>
              {laminates.map((laminate) => (
                <LaminateCard key={laminate.slug} laminate={laminate} />
              ))}
            </CardGrid>
          </AnimatedSection>
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
          href={{ pathname: '/laminates', query: { page: meta.page - 1 } }}
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
          href={{ pathname: '/laminates', query: { page: meta.page + 1 } }}
          className="text-brand font-body text-sm font-medium"
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}
