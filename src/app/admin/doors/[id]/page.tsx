import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { Shapes } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/Button';
import { DoorFormView } from '@/views/admin/doors/DoorFormView';
import { DoorImageUploadPanel } from '@/views/admin/doors/DoorImageUploadPanel';
import { DoorExclusionsEditor } from '@/views/admin/doors/DoorExclusionsEditor';
import { ROUTES } from '@/utils/routes';

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
      <PageHeader
        title="Edit Door"
        action={
          <Link href={ROUTES.ADMIN_DOORS_ZONES(id) as Route}>
            <Button icon={Shapes} variant="secondary">
              Edit Laminate Zones
            </Button>
          </Link>
        }
      />
      <DoorFormView doorId={id} />
      <DoorImageUploadPanel doorId={id} />
      <DoorExclusionsEditor doorId={id} />
    </div>
  );
}
