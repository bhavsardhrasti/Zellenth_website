import type { Metadata } from 'next';

import LaminatesListView from '@/views/laminates/LaminatesListView';
import { listLaminates } from '@/lib/services/laminate.service';
import { laminateQuerySchema } from '@/schemas/laminate.schema';

export const metadata: Metadata = {
  title: 'Laminates | Zellenth',
  description: 'Explore our laminate textures and see how they look on any door.',
};

export const revalidate = 60;

interface LaminatesPageProps {
  searchParams: Promise<{ page?: string; finish?: string }>;
}

export default async function LaminatesPage({ searchParams }: LaminatesPageProps) {
  const { page, finish } = await searchParams;
  const query = laminateQuerySchema.parse({ page, limit: 25, isActive: true, finish });

  const { items: laminates, meta } = await listLaminates(query);

  return <LaminatesListView laminates={laminates} meta={meta} />;
}
