import type { Metadata } from 'next';

import { QuoteRequestsAdminListView } from '@/views/admin/quote-requests/QuoteRequestsAdminListView';

export const metadata: Metadata = {
  title: 'Quote Requests | Admin | Zellenth',
};

export default function AdminQuoteRequestsPage() {
  return <QuoteRequestsAdminListView />;
}
