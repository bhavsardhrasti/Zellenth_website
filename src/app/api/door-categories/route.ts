import type { NextRequest } from 'next/server';

import { withApiHandler } from '@/lib/api/with-handler';
import { created, paginated } from '@/lib/api/response';
import { doorCategorySchema, doorCategoryQuerySchema } from '@/schemas/door-category.schema';
import { listDoorCategories, createDoorCategory } from '@/lib/services/door-category.service';

export const GET = withApiHandler(async (request: NextRequest) => {
  const query = doorCategoryQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
  const { items, meta } = await listDoorCategories(query);
  return paginated(items, meta);
});

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = doorCategorySchema.parse(await request.json());
  const category = await createDoorCategory(body);
  return created(category);
});
