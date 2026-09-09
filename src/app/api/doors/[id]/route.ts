import type { NextRequest } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { withApiHandler } from '@/lib/api/with-handler';
import { ok } from '@/lib/api/response';
import { objectIdSchema } from '@/schemas/common.schema';
import { updateDoorSchema } from '@/schemas/door.schema';
import { getDoorById, updateDoor, archiveDoor } from '@/lib/services/door.service';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = withApiHandler(async (_request: NextRequest, { params }: RouteContext) => {
  const { id } = await params;
  objectIdSchema.parse(id);
  const door = await getDoorById(id);
  return ok(door);
});

export const PATCH = withApiHandler(async (request: NextRequest, { params }: RouteContext) => {
  await requireAdmin();
  const { id } = await params;
  objectIdSchema.parse(id);
  const body = updateDoorSchema.parse(await request.json());
  const door = await updateDoor(id, body);
  return ok(door, 'Door updated');
});

export const DELETE = withApiHandler(async (_request: NextRequest, { params }: RouteContext) => {
  await requireAdmin();
  const { id } = await params;
  objectIdSchema.parse(id);
  const door = await archiveDoor(id);
  return ok(door, 'Door archived');
});
