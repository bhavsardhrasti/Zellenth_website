import type { NextRequest } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { withApiHandler } from '@/lib/api/with-handler';
import { created, paginated } from '@/lib/api/response';
import { laminateSchema, laminateQuerySchema } from '@/schemas/laminate.schema';
import { listLaminates, createLaminate } from '@/lib/services/laminate.service';

export const GET = withApiHandler(async (request: NextRequest) => {
  const query = laminateQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
  const { items, meta } = await listLaminates(query);
  return paginated(items, meta);
});

export const POST = withApiHandler(async (request: NextRequest) => {
  await requireAdmin();
  const body = laminateSchema.parse(await request.json());
  const laminate = await createLaminate(body);
  return created(laminate);
});
