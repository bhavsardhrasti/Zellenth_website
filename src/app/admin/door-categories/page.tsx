import type { Metadata } from 'next';

import { CategoryManagerView } from '@/views/admin/categories/CategoryManagerView';

export const metadata: Metadata = {
  title: 'Door Categories | Admin | Zellenth',
};

export default function AdminDoorCategoriesPage() {
  return <CategoryManagerView resourceLabel="Door Category" apiBasePath="/api/door-categories" />;
}
