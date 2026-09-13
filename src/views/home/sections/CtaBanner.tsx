import { MessageCircle, Phone } from 'lucide-react';

import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { contactInfo } from '@/lib/data/contact';

export function CtaBanner() {
  return (
    <AnimatedSection className="bg-action">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
        <h2 className="font-display text-h1 text-action-text">Get a Free Quote Today</h2>
        <p className="font-body max-w-md text-white/70">
          Talk to our team about your door and laminate requirements. No login required.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={contactInfo.phoneHref}
            className="bg-surface text-text-primary hover:bg-neutral-tint shadow-card inline-flex items-center gap-2 rounded-sm px-6 py-3 font-medium transition-colors"
          >
            <Phone aria-hidden className="h-4 w-4" />
            {contactInfo.phone}
          </a>
          <a
            href={contactInfo.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
          >
            <MessageCircle aria-hidden className="h-4 w-4" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
}
