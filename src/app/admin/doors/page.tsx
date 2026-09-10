import type { Metadata } from 'next';

import { DoorsAdminGridView } from '@/views/admin/doors/DoorsAdminGridView';

export const metadata: Metadata = {
  title: 'Doors | Admin | Zellenth',
};

export default function AdminDoorsPage() {
  return <DoorsAdminGridView />;
}
