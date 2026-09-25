import type { NextRequest } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { withApiHandler } from '@/lib/api/with-handler';
import { created, paginated } from '@/lib/api/response';
import { quoteRequestSchema, quoteRequestQuerySchema } from '@/schemas/quote-request.schema';
import { listQuoteRequests, createQuoteRequest } from '@/lib/services/quote-request.service';

function getClientIp(request: NextRequest): string | undefined {
  const forwardedFor = request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim();
}

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAdmin();
  const query = quoteRequestQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
  const { items, meta } = await listQuoteRequests(query);
  return paginated(items, meta);
});

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = quoteRequestSchema.parse(await request.json());
  const quoteRequest = await createQuoteRequest(body, getClientIp(request));
  return created({ referenceId: quoteRequest.referenceId, id: quoteRequest.id });
});
