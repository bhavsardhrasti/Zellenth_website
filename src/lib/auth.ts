import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

import { authConfig } from '@/lib/auth.config';
import { connectToDatabase } from '@/lib/db/connect';
import { User } from '@/lib/db/models/User.model';
import { UnauthorizedError, ForbiddenError } from '@/lib/errors';
import { server } from '@/lib/env';
import type { UserRole } from '@/lib/db/models/User.model';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: server.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: 'Email or phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier;
        const password = credentials?.password;
        if (typeof identifier !== 'string' || typeof password !== 'string') {
          return null;
        }

        await connectToDatabase();
        const user = await User.findOne({
          isActive: true,
          $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
        }).select('+passwordHash');
        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email ?? null,
          role: user.role,
        };
      },
    }),
  ],
});

interface SessionUser {
  id: string;
  role: UserRole;
  name?: string | null;
  email?: string | null;
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user) {
    throw new UnauthorizedError('Authentication required');
  }
  return session.user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw new ForbiddenError('Admin access required');
  }
  return user;
}
