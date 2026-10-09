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

  // The rail of colour families is built from the whole finish, not the current
  // filter, so a visitor can always hop sideways between colours.
  const { items: allInFinish } = await listLaminates(
    laminateQuerySchema.parse({ page: 1, limit: 100, isActive: true, finish }),
  );
  const colorFamilies = Array.from(
    new Set(allInFinish.map((laminate) => laminate.colorFamily).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  // A representative swatch per family, drawn from the whole finish — the tone
  // rail shows the real texture, not a flat colour chip, and never borrows a
  // photo from a family that is not in the archive.
  const colorSwatches: Record<string, string | undefined> = {};
  for (const laminate of allInFinish) {
    if (!laminate.colorFamily || colorSwatches[laminate.colorFamily]) continue;
    const image = laminate.images.find((item) => item.isPrimary) ?? laminate.images[0];
    colorSwatches[laminate.colorFamily] = image?.url.mid ?? image?.url.full;
  }

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
      colorFamilies={colorFamilies}
      activeColor={color ?? 'all'}
      colorSwatches={colorSwatches}
      previewDoorImages={previewDoorImages}
    />
  );
}
