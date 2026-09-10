import type { Metadata } from 'next';

import { PageHeader } from '@/components/shared/PageHeader';
import { DoorFormView } from '@/views/admin/doors/DoorFormView';
import { DoorImageUploadPanel } from '@/views/admin/doors/DoorImageUploadPanel';
import { DoorExclusionsEditor } from '@/views/admin/doors/DoorExclusionsEditor';

export const metadata: Metadata = {
  title: 'Edit Door | Admin | Zellenth',
};

interface AdminDoorEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminDoorEditPage({ params }: AdminDoorEditPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit Door" />
      <DoorFormView doorId={id} />
      <DoorImageUploadPanel doorId={id} />
      <DoorExclusionsEditor doorId={id} />
    </div>
  );
}
