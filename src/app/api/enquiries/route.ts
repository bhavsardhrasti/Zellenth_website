import type { NextRequest } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { withApiHandler } from '@/lib/api/with-handler';
import { created, paginated } from '@/lib/api/response';
import { enquirySchema, enquiryQuerySchema } from '@/schemas/enquiry.schema';
import { listEnquiries, createEnquiry } from '@/lib/services/enquiry.service';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAdmin();
  const query = enquiryQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
  const { items, meta } = await listEnquiries(query);
  return paginated(items, meta);
});

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = enquirySchema.parse(await request.json());
  const enquiry = await createEnquiry(body);
  return created(enquiry);
});
