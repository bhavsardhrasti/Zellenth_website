import type { Metadata } from 'next';

import { QuoteRequestDetailView } from '@/views/admin/quote-requests/QuoteRequestDetailView';

export const metadata: Metadata = {
  title: 'Quote Request | Admin | Zellenth',
};

interface AdminQuoteRequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminQuoteRequestDetailPage({
  params,
}: AdminQuoteRequestDetailPageProps) {
  const { id } = await params;
  return <QuoteRequestDetailView id={id} />;
}
