import type { NextRequest } from 'next/server';

import { withApiHandler } from '@/lib/api/with-handler';
import { created } from '@/lib/api/response';
import { signupSchema } from '@/schemas/auth.schema';
import { signupUser } from '@/lib/services/auth.service';

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = signupSchema.parse(await request.json());
  const user = await signupUser(body);
  return created(
    { id: user._id.toString(), name: user.name, phone: user.phone, email: user.email },
    'Account created',
  );
});
