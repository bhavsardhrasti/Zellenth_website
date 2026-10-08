'use client';

import { MessageCircle, Phone } from 'lucide-react';

import { GradedImage, Grain, MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { contactInfo } from '@/lib/data/contact';

// Verified live Unsplash photo, graded to the brand hue like the hero.
const BACKDROP = 'https://images.unsplash.com/photo-1760085160766-ed473efe941e?w=1800&q=80';

export function CtaBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      <GradedImage src={BACKDROP} accent="#8f552d" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/60" />
      <Grain />

      <div className="relative mx-auto flex min-h-[60vh] max-w-6xl flex-col justify-between gap-10 px-4 py-12 sm:gap-12 sm:px-6 sm:py-14">
        <MicroLabel className="text-white/70">Free quote</MicroLabel>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <MaskedHeading lines={['Let’s build', 'your door.']} className="text-5xl sm:text-7xl" />
            <p className="font-body mt-6 max-w-sm text-sm text-white/75">
              Talk to our team about your door and laminate requirements. No login required.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={contactInfo.phoneHref}
              className="bg-surface text-text-primary hover:bg-surface-warm inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors"
            >
              <Phone aria-hidden className="h-4 w-4" />
              {contactInfo.phone}
            </a>
            <a
              href={contactInfo.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/40 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10"
            >
              <MessageCircle aria-hidden className="h-4 w-4" />
              WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
