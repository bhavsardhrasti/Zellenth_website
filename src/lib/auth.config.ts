import { NextResponse } from 'next/server';
import type { NextAuthConfig } from 'next-auth';

import type { UserRole } from '@/lib/db/models/User.model';

export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET as string,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [],
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
    authorized({ auth, request }) {
      if (!auth?.user) return false;
      if (auth.user.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.nextUrl.origin));
      }
      return true;
    },
  },
};
