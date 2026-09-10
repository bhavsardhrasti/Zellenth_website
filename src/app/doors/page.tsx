import type { Metadata } from 'next';

import DoorsListView from '@/views/doors/DoorsListView';
import { listDoors } from '@/lib/services/door.service';
import { listDoorCategories } from '@/lib/services/door-category.service';
import { doorQuerySchema } from '@/schemas/door.schema';

export const metadata: Metadata = {
  title: 'Doors | Zellenth',
  description: 'Browse our full range of doors and try any laminate on them in real time.',
};

export const revalidate = 60;

interface DoorsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function DoorsPage({ searchParams }: DoorsPageProps) {
  const { page } = await searchParams;
  const query = doorQuerySchema.parse({ page, limit: 24, isActive: true });

  const [{ items: doors, meta }, { items: categories }] = await Promise.all([
    listDoors(query),
    listDoorCategories({ page: 1, limit: 100 }),
  ]);

  const categoryNames = Object.fromEntries(
    categories.map((category) => [category._id.toString(), category.name]),
  );

  return <DoorsListView doors={doors} categoryNames={categoryNames} meta={meta} />;
}
