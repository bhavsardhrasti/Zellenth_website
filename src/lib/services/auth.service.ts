import bcrypt from 'bcrypt';

import { connectToDatabase } from '@/lib/db/connect';
import { User } from '@/lib/db/models/User.model';
import { ConflictError } from '@/lib/errors';
import type { SignupInput } from '@/schemas/auth.schema';

const SALT_ROUNDS = 10;

export async function signupUser(input: SignupInput) {
  await connectToDatabase();

  const existing = await User.findOne({
    $or: [{ phone: input.phone }, ...(input.email ? [{ email: input.email }] : [])],
  });
  if (existing) {
    throw new ConflictError('An account with this phone or email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = new User({
    name: input.name,
    phone: input.phone,
    email: input.email,
    passwordHash,
  });
  await user.save();
  return user;
}
