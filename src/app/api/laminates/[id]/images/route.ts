import type { NextRequest } from 'next/server';

import { withApiHandler } from '@/lib/api/with-handler';
import { created } from '@/lib/api/response';
import { objectIdSchema } from '@/schemas/common.schema';
import { parseImageUploadFormData } from '@/lib/services/image.service';
import { addLaminateImage } from '@/lib/services/laminate.service';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const POST = withApiHandler(async (request: NextRequest, { params }: RouteContext) => {
  const { id } = await params;
  objectIdSchema.parse(id);

  const { buffer, altText, isPrimary } = await parseImageUploadFormData(await request.formData());
  const laminate = await addLaminateImage(id, buffer, altText, isPrimary);
  return created(laminate, 'Image uploaded');
});
