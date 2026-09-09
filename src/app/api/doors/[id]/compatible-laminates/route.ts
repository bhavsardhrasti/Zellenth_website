import type { NextRequest } from 'next/server';

import { withApiHandler } from '@/lib/api/with-handler';
import { paginated } from '@/lib/api/response';
import { objectIdSchema } from '@/schemas/common.schema';
import { laminateQuerySchema } from '@/schemas/laminate.schema';
import { getCompatibleLaminates } from '@/lib/services/door.service';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = withApiHandler(async (request: NextRequest, { params }: RouteContext) => {
  const { id } = await params;
  objectIdSchema.parse(id);
  const query = laminateQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
  const { items, meta } = await getCompatibleLaminates(id, query);
  return paginated(items, meta);
});
