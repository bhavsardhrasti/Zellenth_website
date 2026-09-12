import type { NextRequest } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { withApiHandler } from '@/lib/api/with-handler';
import { ok } from '@/lib/api/response';
import { objectIdSchema } from '@/schemas/common.schema';
import { doorZonesSchema } from '@/schemas/door.schema';
import { updateDoorZones } from '@/lib/services/door.service';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const PATCH = withApiHandler(async (request: NextRequest, { params }: RouteContext) => {
  await requireAdmin();
  const { id } = await params;
  objectIdSchema.parse(id);
  const { zones } = doorZonesSchema.parse(await request.json());
  const door = await updateDoorZones(id, zones);
  return ok(door, 'Zones updated');
});
