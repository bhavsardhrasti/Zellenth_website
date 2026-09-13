import type { Metadata } from 'next';

import LaminateDetailView from '@/views/laminates/LaminateDetailView';
import { getLaminateBySlug, getCompatibleDoorsForLaminate } from '@/lib/services/laminate.service';

export const revalidate = 60;

interface LaminatePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LaminatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const laminate = await getLaminateBySlug(slug);
  return {
    title: `${laminate.name} | Zellenth`,
    description: laminate.description ?? `View the ${laminate.name} laminate and try it on a door.`,
  };
}

export default async function LaminatePage({ params }: LaminatePageProps) {
  const { slug } = await params;
  const laminate = await getLaminateBySlug(slug);

  const { items: compatibleDoors } = await getCompatibleDoorsForLaminate(laminate._id.toString(), {
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  return <LaminateDetailView laminate={laminate} compatibleDoors={compatibleDoors} />;
}
