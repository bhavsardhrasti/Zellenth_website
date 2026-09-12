import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { requireAdmin } from '@/lib/auth';
import { withApiHandler } from '@/lib/api/with-handler';
import { ok } from '@/lib/api/response';
import { objectIdSchema } from '@/schemas/common.schema';
import { setPrimaryDoorImage, deleteDoorImage } from '@/lib/services/door.service';

const indexParamSchema = z.coerce.number().int().min(0);

interface RouteContext {
  params: Promise<{ id: string; index: string }>;
}

export const PATCH = withApiHandler(async (_request: NextRequest, { params }: RouteContext) => {
  await requireAdmin();
  const { id, index } = await params;
  objectIdSchema.parse(id);
  const door = await setPrimaryDoorImage(id, indexParamSchema.parse(index));
  return ok(door, 'Primary image updated');
});

export const DELETE = withApiHandler(async (_request: NextRequest, { params }: RouteContext) => {
  await requireAdmin();
  const { id, index } = await params;
  objectIdSchema.parse(id);
  const door = await deleteDoorImage(id, indexParamSchema.parse(index));
  return ok(door, 'Image deleted');
});
