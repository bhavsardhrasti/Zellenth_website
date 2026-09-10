import type { Metadata } from 'next';

import { PageHeader } from '@/components/shared/PageHeader';
import { LaminateFormView } from '@/views/admin/laminates/LaminateFormView';

export const metadata: Metadata = {
  title: 'New Laminate | Admin | Zellenth',
};

export default function AdminNewLaminatePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New Laminate" />
      <LaminateFormView />
    </div>
  );
}
