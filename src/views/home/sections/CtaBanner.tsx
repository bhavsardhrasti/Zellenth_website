'use client';

import { MessageCircle, Phone } from 'lucide-react';

import {
  ContainerAnimated,
  ContainerStagger,
  GalleryGrid,
  GalleryGridCell,
} from '@/components/ui/cta-section-with-gallery';
import { contactInfo } from '@/lib/data/contact';

// Verified live Unsplash photos — checked with a HEAD request earlier.
const IMAGES = [
  'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=600&q=80',
  'https://images.unsplash.com/photo-1611600700192-d87eaeed4f81?w=600&q=80',
  'https://images.unsplash.com/photo-1617307074423-6344f18d357f?w=600&q=80',
  'https://images.unsplash.com/photo-1772696860271-c53a0e799d31?w=600&q=80',
];

export function CtaBanner() {
  return (
    <section className="bg-action relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 20% 0%, rgba(143, 85, 45, 0.35), transparent 70%)',
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2">
        <ContainerStagger>
          <ContainerAnimated className="text-accent-2 text-badge mb-3 block font-medium tracking-wider uppercase">
            Free quote
          </ContainerAnimated>
          <ContainerAnimated className="font-display text-h1 text-action-text">
            Get a Free Quote Today
          </ContainerAnimated>
          <ContainerAnimated className="font-body my-4 max-w-md text-white/70 md:my-6">
            Talk to our team about your door and laminate requirements. No login required.
          </ContainerAnimated>
          <ContainerAnimated className="flex flex-wrap gap-3">
            <a
              href={contactInfo.phoneHref}
              className="bg-surface text-text-primary hover:bg-surface-warm shadow-card inline-flex items-center gap-2 rounded-sm px-6 py-3 font-medium transition-colors"
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
          </ContainerAnimated>
        </ContainerStagger>

        <GalleryGrid className="hidden md:grid">
          {IMAGES.map((src, index) => (
            <GalleryGridCell index={index} key={src}>
              <img className="size-full object-cover object-center" src={src} alt="" />
            </GalleryGridCell>
          ))}
        </GalleryGrid>
      </div>
    </section>
  );
}
