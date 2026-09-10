import type { Metadata } from 'next';

import { PageHeader } from '@/components/shared/PageHeader';
import { DoorFormView } from '@/views/admin/doors/DoorFormView';

export const metadata: Metadata = {
  title: 'New Door | Admin | Zellenth',
};

export default function AdminNewDoorPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New Door" />
      <DoorFormView />
    </div>
  );
}
