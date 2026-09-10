import type { Metadata } from 'next';

import { LaminatesAdminGridView } from '@/views/admin/laminates/LaminatesAdminGridView';

export const metadata: Metadata = {
  title: 'Laminates | Admin | Zellenth',
};

export default function AdminLaminatesPage() {
  return <LaminatesAdminGridView />;
}
