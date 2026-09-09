import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

import { connectToDatabase } from '@/lib/db/connect';
import { User } from '@/lib/db/models/User.model';
import { UnauthorizedError, ForbiddenError } from '@/lib/errors';
import { server } from '@/lib/env';
import type { UserRole } from '@/lib/db/models/User.model';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: server.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
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
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as UserRole;
      return session;
    },
  },
});

export async function requireAuth(): Promise<{ id: string; role: UserRole }> {
  const session = await auth();
  if (!session?.user) {
    throw new UnauthorizedError('Authentication required');
  }
  return session.user;
}

export async function requireAdmin(): Promise<{ id: string; role: UserRole }> {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw new ForbiddenError('Admin access required');
  }
  return user;
}
