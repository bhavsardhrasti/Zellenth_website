import type { Metadata } from 'next';

import LegalPageView from '@/views/legal/LegalPageView';
import { privacyPolicy } from '@/lib/data/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy | Zellenth',
  description: 'How Zellenth collects, uses, and protects your information.',
};

export default function PrivacyPage() {
  return <LegalPageView content={privacyPolicy} />;
}
