import type { NextRequest } from 'next/server';

import { withApiHandler } from '@/lib/api/with-handler';
import { created, paginated } from '@/lib/api/response';
import { doorSchema, doorQuerySchema } from '@/schemas/door.schema';
import { listDoors, createDoor } from '@/lib/services/door.service';

export const GET = withApiHandler(async (request: NextRequest) => {
  const query = doorQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
  const { items, meta } = await listDoors(query);
  return paginated(items, meta);
});

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = doorSchema.parse(await request.json());
  const door = await createDoor(body);
  return created(door);
});
