import type { Metadata } from 'next';

import { PageHeader } from '@/components/shared/PageHeader';
import { LaminateFormView } from '@/views/admin/laminates/LaminateFormView';
import { LaminateImageUploadPanel } from '@/views/admin/laminates/LaminateImageUploadPanel';

export const metadata: Metadata = {
  title: 'Edit Laminate | Admin | Zellenth',
};

interface AdminLaminateEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminLaminateEditPage({ params }: AdminLaminateEditPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit Laminate" />
      <LaminateFormView laminateId={id} />
      <LaminateImageUploadPanel laminateId={id} />
    </div>
  );
}
