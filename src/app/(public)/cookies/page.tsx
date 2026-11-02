export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

import LegalPageView from '@/views/legal/LegalPageView';
import { cookiePolicy } from '@/lib/data/legal';

export const metadata: Metadata = {
  title: 'Cookie Policy | Zellenth',
  description: 'How Zellenth uses cookies and similar technologies on this website.',
};

export default function CookiesPage() {
  return <LegalPageView content={cookiePolicy} />;
}
