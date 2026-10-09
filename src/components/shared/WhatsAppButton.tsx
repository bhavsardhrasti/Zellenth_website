import { MessageCircle } from 'lucide-react';

import { contactInfo } from '@/lib/data/contact';

export function WhatsAppButton(): React.JSX.Element {
  return (
    <a
      href={contactInfo.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="bg-success-text shadow-elevated fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform hover:scale-105 sm:right-8 sm:bottom-8 sm:h-14 sm:w-14"
    >
      <MessageCircle aria-hidden className="h-6 w-6" />
    </a>
  );
}
