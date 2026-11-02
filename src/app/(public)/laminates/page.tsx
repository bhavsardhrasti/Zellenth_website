export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

import LaminatesListView from '@/views/laminates/LaminatesListView';
import { listLaminates } from '@/lib/services/laminate.service';
import { laminateQuerySchema } from '@/schemas/laminate.schema';
import { listDoors } from '@/lib/services/door.service';
import { doorQuerySchema } from '@/schemas/door.schema';

export const metadata: Metadata = {
  title: 'Laminates | Zellenth',
  description: 'Explore our laminate textures and see how they look on any door.',
};

export const revalidate = 60;

interface LaminatesPageProps {
  searchParams: Promise<{ page?: string; finish?: string; color?: string }>;
}

export default async function LaminatesPage({
  searchParams,
}: LaminatesPageProps): Promise<React.JSX.Element> {
  const { page, finish, color } = await searchParams;

  // The swatch grid is built from the whole finish, not the current filter, so
  // a visitor always sees the archive's real texture range.

  const query = laminateQuerySchema.parse({
    page,
    limit: 24,
    isActive: true,
    finish,
    colorFamily: color,
  });
  const { items: laminates, meta } = await listLaminates(query);
  const { items: doors } = await listDoors(
    doorQuerySchema.parse({ page: 1, limit: 12, isActive: true }),
  );
  const previewDoorImages = doors
    .map((door) => {
      const image = door.images.find((item) => item.isPrimary) ?? door.images[0];
      return image ? { src: image.url.mid, alt: door.name } : null;
    })
    .filter((image): image is { src: string; alt: string } => image !== null);

  return (
    <LaminatesListView
      laminates={laminates}
      meta={meta}
      activeFinish={finish ?? 'all'}
      activeColor={color ?? 'all'}
      previewDoorImages={previewDoorImages}
    />
  );
}
