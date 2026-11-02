export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

import ContactView from '@/views/contact/ContactView';

export const metadata: Metadata = {
  title: 'Contact | Zellenth',
  description: 'Get in touch with Zellenth for doors, laminates, and installation enquiries.',
};

export default function ContactPage() {
  return <ContactView />;
}
