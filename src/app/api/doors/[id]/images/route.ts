import type { NextRequest } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { withApiHandler } from '@/lib/api/with-handler';
import { created } from '@/lib/api/response';
import { objectIdSchema } from '@/schemas/common.schema';
import { parseImageUploadFormData } from '@/lib/services/image.service';
import { addDoorImage } from '@/lib/services/door.service';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const POST = withApiHandler(async (request: NextRequest, { params }: RouteContext) => {
  await requireAdmin();
  const { id } = await params;
  objectIdSchema.parse(id);

  const { buffer, altText, isPrimary } = await parseImageUploadFormData(await request.formData());
  const door = await addDoorImage(id, buffer, altText, isPrimary);
  return created(door, 'Image uploaded');
});
