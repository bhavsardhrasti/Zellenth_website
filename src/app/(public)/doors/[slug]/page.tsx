import type { Metadata } from 'next';

import DoorDetailView from '@/views/doors/DoorDetailView';
import { getDoorBySlug, getCompatibleLaminates } from '@/lib/services/door.service';
import { getDoorCategoryById } from '@/lib/services/door-category.service';

export const revalidate = 60;

interface DoorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DoorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const door = await getDoorBySlug(slug);
  return {
    title: `${door.name} | Zellenth`,
    description: door.description ?? `View the ${door.name} door and try any laminate on it.`,
  };
}

export default async function DoorPage({ params }: DoorPageProps) {
  const { slug } = await params;
  const door = await getDoorBySlug(slug);

  const [category, { items: compatibleLaminates }] = await Promise.all([
    getDoorCategoryById(door.categoryId.toString()),
    getCompatibleLaminates(door._id.toString(), {
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
  ]);

  return (
    <DoorDetailView
      door={door}
      categoryName={category.name}
      compatibleLaminates={compatibleLaminates}
    />
  );
}
