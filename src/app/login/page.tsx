import type { Metadata } from 'next';

import LoginView from '@/views/auth/LoginView';

export const metadata: Metadata = {
  title: 'Sign in | Zellenth',
};

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;
  return <LoginView callbackUrl={callbackUrl ?? '/'} />;
}
