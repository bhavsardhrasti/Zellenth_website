import type { NextRequest } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { withApiHandler } from '@/lib/api/with-handler';
import { created, paginated } from '@/lib/api/response';
import {
  laminateCategorySchema,
  laminateCategoryQuerySchema,
} from '@/schemas/laminate-category.schema';
import {
  listLaminateCategories,
  createLaminateCategory,
} from '@/lib/services/laminate-category.service';

export const GET = withApiHandler(async (request: NextRequest) => {
  const query = laminateCategoryQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
  const { items, meta } = await listLaminateCategories(query);
  return paginated(items, meta);
});

export const POST = withApiHandler(async (request: NextRequest) => {
  await requireAdmin();
  const body = laminateCategorySchema.parse(await request.json());
  const category = await createLaminateCategory(body);
  return created(category);
});
