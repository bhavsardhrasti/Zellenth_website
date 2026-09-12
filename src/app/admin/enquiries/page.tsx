import type { Metadata } from 'next';

import { EnquiriesAdminListView } from '@/views/admin/enquiries/EnquiriesAdminListView';

export const metadata: Metadata = {
  title: 'Enquiries | Admin | Zellenth',
};

export default function AdminEnquiriesPage() {
  return <EnquiriesAdminListView />;
}
