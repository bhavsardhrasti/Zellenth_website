import type { NextRequest } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { withApiHandler } from '@/lib/api/with-handler';
import { ok } from '@/lib/api/response';
import { objectIdSchema } from '@/schemas/common.schema';
import { updateEnquiryStatusSchema } from '@/schemas/enquiry.schema';
import { updateEnquiryStatus } from '@/lib/services/enquiry.service';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const PATCH = withApiHandler(async (request: NextRequest, { params }: RouteContext) => {
  await requireAdmin();
  const { id } = await params;
  objectIdSchema.parse(id);
  const body = updateEnquiryStatusSchema.parse(await request.json());
  const enquiry = await updateEnquiryStatus(id, body);
  return ok(enquiry, 'Status updated');
});
