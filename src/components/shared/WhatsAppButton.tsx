import { MessageCircle } from 'lucide-react';

import { contactInfo } from '@/lib/data/contact';

export function WhatsAppButton() {
  return (
    <a
      href={contactInfo.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="bg-success-text shadow-elevated fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white transition-transform hover:scale-105 sm:right-8 sm:bottom-8"
    >
      <MessageCircle aria-hidden className="h-6 w-6" />
    </a>
  );
}
