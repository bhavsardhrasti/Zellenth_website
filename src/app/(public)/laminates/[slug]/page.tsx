import type { Metadata } from 'next';

import LaminateDetailView from '@/views/laminates/LaminateDetailView';
import { PreviewLaminateDetailView } from '@/views/laminates/PreviewLaminateDetailView';
import {
  getLaminateBySlug,
  getCompatibleDoorsForLaminate,
  listLaminates,
} from '@/lib/services/laminate.service';
import { NotFoundError } from '@/lib/errors';
import { withDoorImages } from '@/views/laminates/demoSwatches';
import { laminateQuerySchema } from '@/schemas/laminate.schema';

export const revalidate = 60;

interface LaminatePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LaminatePageProps): Promise<Metadata> {
  const { slug } = await params;
  let laminate;
  try {
    laminate = await getLaminateBySlug(slug);
  } catch (error) {
    if (!(error instanceof NotFoundError)) throw error;
    const preview = withDoorImages([]).find((swatch) => swatch.slug === slug);
    if (!preview) throw error;
    return {
      title: `${preview.name} | Zellenth`,
      description: `View the ${preview.name} finish concept and try it on a door.`,
    };
  }

  return {
    title: `${laminate.name} | Zellenth`,
    description: laminate.description ?? `View the ${laminate.name} laminate and try it on a door.`,
  };
}

export default async function LaminatePage({
  params,
}: LaminatePageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  let laminate;
  try {
    laminate = await getLaminateBySlug(slug);
  } catch (error) {
    if (!(error instanceof NotFoundError)) throw error;
    const preview = withDoorImages([]).find((swatch) => swatch.slug === slug);
    if (!preview) throw error;
    const similarSpecimens = withDoorImages([])
      .filter(
        (swatch) =>
          swatch.slug !== preview.slug &&
          (swatch.colorFamily === preview.colorFamily || swatch.finish === preview.finish),
      )
      .sort((a, b) => {
        const aMatchesTone = a.colorFamily === preview.colorFamily ? 1 : 0;
        const bMatchesTone = b.colorFamily === preview.colorFamily ? 1 : 0;
        return bMatchesTone - aMatchesTone;
      })
      .slice(0, 4);
    return <PreviewLaminateDetailView specimen={preview} similarSpecimens={similarSpecimens} />;
  }

  const [doorResult, toneResult, finishResult] = await Promise.all([
    getCompatibleDoorsForLaminate(laminate._id.toString(), {
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
    listLaminates(
      laminateQuerySchema.parse({
        page: 1,
        limit: 4,
        isActive: true,
        colorFamily: laminate.colorFamily,
        sortBy: 'name',
        sortOrder: 'asc',
      }),
      { excludeIds: [laminate._id] },
    ),
    listLaminates(
      laminateQuerySchema.parse({
        page: 1,
        limit: 4,
        isActive: true,
        finish: laminate.finish,
        sortBy: 'name',
        sortOrder: 'asc',
      }),
      { excludeIds: [laminate._id] },
    ),
  ]);
  const similarLaminates = Array.from(
    new Map([...toneResult.items, ...finishResult.items].map((item) => [item.slug, item])).values(),
  ).slice(0, 4);

  return (
    <LaminateDetailView
      laminate={laminate}
      compatibleDoors={doorResult.items}
      similarLaminates={similarLaminates}
    />
  );
}
