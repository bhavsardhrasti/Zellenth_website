import Link from 'next/link';
import type { Route } from 'next';

import { PageHero } from '@/components/shared/PageHero';
import { FilterPills } from '@/components/shared/FilterPills';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { CardGrid } from '@/components/shared/CardGrid';
import DoorCard from '@/views/doors/DoorCard';
import { ROUTES } from '@/utils/routes';
import type { DoorDocument } from '@/lib/db/models/Door.model';
import type { PaginatedMeta } from '@/types/api';

export interface DoorsListViewProps {
  doors: DoorDocument[];
  categoryNames: Record<string, string>;
  meta: PaginatedMeta;
  categories: { slug: string; name: string }[];
  activeCategory: string;
}

export default function DoorsListView({
  doors,
  categoryNames,
  meta,
  categories,
  activeCategory,
}: DoorsListViewProps) {
  const filterOptions = [
    { label: 'All', value: 'all' },
    ...categories.map((category) => ({ label: category.name, value: category.slug })),
  ];

  return (
    <main className="bg-background min-h-dvh">
      <PageHero
        breadcrumbLabel="Doors"
        heading="Doors"
        subtext="Browse our full range of doors, then try any laminate on the one you like."
      />

      <div className="mx-auto max-w-6xl px-6 py-10">
        {categories.length > 0 ? (
          <FilterPills
            pathname={ROUTES.DOORS as Route}
            queryKey="category"
            options={filterOptions}
            activeValue={activeCategory}
          />
        ) : null}

        <p className="font-body text-text-secondary mt-6 text-sm">
          {meta.total} {meta.total === 1 ? 'door' : 'doors'}
        </p>

        {doors.length === 0 ? (
          <p className="font-body text-text-secondary mt-12 text-center">
            No doors are available yet. Check back soon.
          </p>
        ) : (
          <AnimatedSection className="mt-6">
            <CardGrid columns={4}>
              {doors.map((door) => (
                <DoorCard
                  key={door.slug}
                  door={door}
                  categoryName={categoryNames[door.categoryId.toString()]}
                />
              ))}
            </CardGrid>
          </AnimatedSection>
        )}

        <PaginationControls meta={meta} activeCategory={activeCategory} />
      </div>
    </main>
  );
}

function PaginationControls({
  meta,
  activeCategory,
}: {
  meta: PaginatedMeta;
  activeCategory: string;
}) {
  if (meta.totalPages <= 1) {
    return null;
  }

  const categoryQuery = activeCategory === 'all' ? {} : { category: activeCategory };

  return (
    <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Pagination">
      {meta.hasPreviousPage ? (
        <Link
          href={{ pathname: '/doors', query: { ...categoryQuery, page: meta.page - 1 } }}
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
          href={{ pathname: '/doors', query: { ...categoryQuery, page: meta.page + 1 } }}
          className="text-brand font-body text-sm font-medium"
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}
