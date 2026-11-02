export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

import AboutView from '@/views/about/AboutView';

export const metadata: Metadata = {
  title: 'About | Zellenth',
  description: 'Zellenth manufactures doors and laminate finishes in Ahmedabad, Gujarat.',
};

export default function AboutPage() {
  return <AboutView />;
}
