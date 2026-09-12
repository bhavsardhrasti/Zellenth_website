import type { Metadata } from 'next';
import type { Route } from 'next';
import { redirect } from 'next/navigation';

import DoorVisualizerView from '@/views/visualizer/DoorVisualizerView';
import { getDoorBySlug, getCompatibleLaminates } from '@/lib/services/door.service';
import { ROUTES } from '@/utils/routes';

export const revalidate = 60;

interface DoorVisualizePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ laminate?: string }>;
}

export async function generateMetadata({ params }: DoorVisualizePageProps): Promise<Metadata> {
  const { slug } = await params;
  const door = await getDoorBySlug(slug);
  return {
    title: `Visualize ${door.name} | Zellenth`,
    description: `Try any laminate on the ${door.name} door in real time.`,
  };
}

export default async function DoorVisualizePage({ params, searchParams }: DoorVisualizePageProps) {
  const { slug } = await params;
  const { laminate } = await searchParams;
  const door = await getDoorBySlug(slug);

  if (door.zones.length === 0) {
    redirect(ROUTES.DOORS_ID(door.slug) as Route);
  }

  const { items: laminates } = await getCompatibleLaminates(door._id.toString(), {
    page: 1,
    limit: 50,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const visualizerDoor = {
    name: door.name,
    slug: door.slug,
    images: door.images,
    zones: door.zones,
  };

  const visualizerLaminates = laminates.map((item) => ({
    id: item._id.toString(),
    name: item.name,
    images: item.images,
  }));

  return (
    <DoorVisualizerView
      door={visualizerDoor}
      laminates={visualizerLaminates}
      initialLaminateId={laminate}
    />
  );
}
