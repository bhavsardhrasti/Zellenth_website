import type { NextRequest } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { withApiHandler } from '@/lib/api/with-handler';
import { ok } from '@/lib/api/response';
import { objectIdSchema } from '@/schemas/common.schema';
import { updateLaminateSchema } from '@/schemas/laminate.schema';
import { getLaminateById, updateLaminate, archiveLaminate } from '@/lib/services/laminate.service';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = withApiHandler(async (_request: NextRequest, { params }: RouteContext) => {
  const { id } = await params;
  objectIdSchema.parse(id);
  const laminate = await getLaminateById(id);
  return ok(laminate);
});

export const PATCH = withApiHandler(async (request: NextRequest, { params }: RouteContext) => {
  await requireAdmin();
  const { id } = await params;
  objectIdSchema.parse(id);
  const body = updateLaminateSchema.parse(await request.json());
  const laminate = await updateLaminate(id, body);
  return ok(laminate, 'Laminate updated');
});

export const DELETE = withApiHandler(async (_request: NextRequest, { params }: RouteContext) => {
  await requireAdmin();
  const { id } = await params;
  objectIdSchema.parse(id);
  const laminate = await archiveLaminate(id);
  return ok(laminate, 'Laminate archived');
});
