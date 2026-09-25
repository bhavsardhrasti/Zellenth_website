import type { NextRequest } from 'next/server';

import { withApiHandler } from '@/lib/api/with-handler';
import { ok } from '@/lib/api/response';
import { getQuoteRequestByReference } from '@/lib/services/quote-request.service';

interface RouteContext {
  params: Promise<{ referenceId: string }>;
}

export const GET = withApiHandler(async (_request: NextRequest, { params }: RouteContext) => {
  const { referenceId } = await params;
  const quoteRequest = await getQuoteRequestByReference(referenceId);
  return ok(quoteRequest);
});
