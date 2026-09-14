import Link from 'next/link';
import type { Route } from 'next';

import { PageHero } from '@/components/shared/PageHero';
import { FilterPills } from '@/components/shared/FilterPills';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { CardGrid } from '@/components/shared/CardGrid';
import { laminateFinishOptions } from '@/lib/data/nav';
import LaminateCard from '@/views/laminates/LaminateCard';
import { ROUTES } from '@/utils/routes';
import type { LaminateDocument } from '@/lib/db/models/Laminate.model';
import type { PaginatedMeta } from '@/types/api';

export interface LaminatesListViewProps {
  laminates: LaminateDocument[];
  meta: PaginatedMeta;
  activeFinish: string;
}

export default function LaminatesListView({
  laminates,
  meta,
  activeFinish,
}: LaminatesListViewProps) {
  const filterOptions = [
    { label: 'All', value: 'all' },
    ...laminateFinishOptions.map((option) => ({ label: option.label, value: option.value })),
  ];

  return (
    <main className="bg-background min-h-dvh">
      <PageHero
        breadcrumbLabel="Laminates"
        heading="Laminates"
        subtext="Explore our laminate textures, then see how they look on a door."
      />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <FilterPills
          pathname={ROUTES.LAMINATES as Route}
          queryKey="finish"
          options={filterOptions}
          activeValue={activeFinish}
        />

        <p className="font-body text-text-secondary mt-6 text-sm">
          {meta.total} {meta.total === 1 ? 'laminate' : 'laminates'}
        </p>

        {laminates.length === 0 ? (
          <p className="font-body text-text-secondary mt-12 text-center">
            No laminates are available yet. Check back soon.
          </p>
        ) : (
          <AnimatedSection className="mt-6">
            <CardGrid columns={5}>
              {laminates.map((laminate) => (
                <LaminateCard key={laminate.slug} laminate={laminate} />
              ))}
            </CardGrid>
          </AnimatedSection>
        )}

        <PaginationControls meta={meta} activeFinish={activeFinish} />
      </div>
    </main>
  );
}

function PaginationControls({ meta, activeFinish }: { meta: PaginatedMeta; activeFinish: string }) {
  if (meta.totalPages <= 1) {
    return null;
  }

  const finishQuery = activeFinish === 'all' ? {} : { finish: activeFinish };

  return (
    <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Pagination">
      {meta.hasPreviousPage ? (
        <Link
          href={{ pathname: '/laminates', query: { ...finishQuery, page: meta.page - 1 } }}
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
          href={{ pathname: '/laminates', query: { ...finishQuery, page: meta.page + 1 } }}
          className="text-brand font-body text-sm font-medium"
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}
