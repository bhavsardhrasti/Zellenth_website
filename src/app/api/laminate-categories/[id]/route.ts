import type { NextRequest } from 'next/server';

import { withApiHandler } from '@/lib/api/with-handler';
import { ok } from '@/lib/api/response';
import { objectIdSchema } from '@/schemas/common.schema';
import { updateLaminateCategorySchema } from '@/schemas/laminate-category.schema';
import {
  getLaminateCategoryById,
  updateLaminateCategory,
  archiveLaminateCategory,
} from '@/lib/services/laminate-category.service';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = withApiHandler(async (_request: NextRequest, { params }: RouteContext) => {
  const { id } = await params;
  objectIdSchema.parse(id);
  const category = await getLaminateCategoryById(id);
  return ok(category);
});

export const PATCH = withApiHandler(async (request: NextRequest, { params }: RouteContext) => {
  const { id } = await params;
  objectIdSchema.parse(id);
  const body = updateLaminateCategorySchema.parse(await request.json());
  const category = await updateLaminateCategory(id, body);
  return ok(category, 'Category updated');
});

export const DELETE = withApiHandler(async (_request: NextRequest, { params }: RouteContext) => {
  const { id } = await params;
  objectIdSchema.parse(id);
  const category = await archiveLaminateCategory(id);
  return ok(category, 'Category archived');
});
