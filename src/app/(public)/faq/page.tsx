import type { Metadata } from 'next';

import FaqView from '@/views/faq/FaqView';

export const metadata: Metadata = {
  title: 'FAQ | Zellenth',
  description: 'Answers to common questions about Zellenth doors, laminates, and ordering.',
};

export default function FaqPage() {
  return <FaqView />;
}
