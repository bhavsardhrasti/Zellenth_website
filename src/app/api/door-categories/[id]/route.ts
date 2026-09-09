import type { NextRequest } from 'next/server';

import { withApiHandler } from '@/lib/api/with-handler';
import { ok } from '@/lib/api/response';
import { objectIdSchema } from '@/schemas/common.schema';
import { updateDoorCategorySchema } from '@/schemas/door-category.schema';
import {
  getDoorCategoryById,
  updateDoorCategory,
  archiveDoorCategory,
} from '@/lib/services/door-category.service';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = withApiHandler(async (_request: NextRequest, { params }: RouteContext) => {
  const { id } = await params;
  objectIdSchema.parse(id);
  const category = await getDoorCategoryById(id);
  return ok(category);
});

export const PATCH = withApiHandler(async (request: NextRequest, { params }: RouteContext) => {
  const { id } = await params;
  objectIdSchema.parse(id);
  const body = updateDoorCategorySchema.parse(await request.json());
  const category = await updateDoorCategory(id, body);
  return ok(category, 'Category updated');
});

export const DELETE = withApiHandler(async (_request: NextRequest, { params }: RouteContext) => {
  const { id } = await params;
  objectIdSchema.parse(id);
  const category = await archiveDoorCategory(id);
  return ok(category, 'Category archived');
});
