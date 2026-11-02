export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

import { QuoteRequestView, type QuoteRequestViewData } from '@/views/quote/QuoteRequestView';
import { getQuoteRequestByReference } from '@/lib/services/quote-request.service';

interface QuotePageProps {
  params: Promise<{ referenceId: string }>;
}

export async function generateMetadata({ params }: QuotePageProps): Promise<Metadata> {
  const { referenceId } = await params;
  return {
    title: `Quote ${referenceId} | Zellenth`,
  };
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { referenceId } = await params;
  const quoteRequest = await getQuoteRequestByReference(referenceId);

  const data: QuoteRequestViewData = {
    referenceId: quoteRequest.referenceId,
    status: quoteRequest.status,
    createdAt: quoteRequest.createdAt.toISOString(),
    items: quoteRequest.items,
  };

  return <QuoteRequestView data={data} />;
}
