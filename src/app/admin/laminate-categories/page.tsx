import type { Metadata } from 'next';

import { CategoryManagerView } from '@/views/admin/categories/CategoryManagerView';

export const metadata: Metadata = {
  title: 'Laminate Categories | Admin | Zellenth',
};

export default function AdminLaminateCategoriesPage() {
  return (
    <CategoryManagerView resourceLabel="Laminate Category" apiBasePath="/api/laminate-categories" />
  );
}
