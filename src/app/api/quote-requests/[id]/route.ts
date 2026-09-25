import type { NextRequest } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { withApiHandler } from '@/lib/api/with-handler';
import { ok } from '@/lib/api/response';
import { objectIdSchema } from '@/schemas/common.schema';
import { updateQuoteRequestSchema } from '@/schemas/quote-request.schema';
import { getQuoteRequestById, updateQuoteRequest } from '@/lib/services/quote-request.service';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = withApiHandler(async (_request: NextRequest, { params }: RouteContext) => {
  await requireAdmin();
  const { id } = await params;
  objectIdSchema.parse(id);
  const quoteRequest = await getQuoteRequestById(id);
  return ok(quoteRequest);
});

export const PATCH = withApiHandler(async (request: NextRequest, { params }: RouteContext) => {
  await requireAdmin();
  const { id } = await params;
  objectIdSchema.parse(id);
  const body = updateQuoteRequestSchema.parse(await request.json());
  const quoteRequest = await updateQuoteRequest(id, body);
  return ok(quoteRequest, 'Quote request updated');
});
