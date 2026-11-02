export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

import LegalPageView from '@/views/legal/LegalPageView';
import { termsOfService } from '@/lib/data/legal';

export const metadata: Metadata = {
  title: 'Terms of Service | Zellenth',
  description: 'The terms that govern your use of the Zellenth website and products.',
};

export default function TermsPage() {
  return <LegalPageView content={termsOfService} />;
}
