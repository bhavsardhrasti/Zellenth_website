'use client';

import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';

import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { EnquiryModal } from '@/components/shared/EnquiryModal';
import { Button } from '@/components/ui/Button';
import { contactInfo } from '@/lib/data/contact';

export default function ContactView() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  return (
    <main className="bg-background min-h-dvh">
      <div className="mx-auto max-w-3xl px-6 pt-6 sm:pt-8">
        <Breadcrumbs items={[{ label: 'Contact' }]} />
      </div>

      <AnimatedSection immediate className="mx-auto max-w-3xl px-6 pt-6 pb-16 text-center sm:pb-24">
        <span className="text-brand text-badge font-medium tracking-wider uppercase">
          Get in touch
        </span>
        <h1 className="font-display text-hero text-text-primary mt-3">
          Talk to our team about your project
        </h1>
        <p className="font-body text-text-secondary mt-5 text-base sm:text-lg">
          Whether you&apos;re choosing a door or finalizing a laminate, we&apos;re happy to help. No
          login required.
        </p>
        <Button onClick={() => setIsEnquiryOpen(true)} className="mt-8">
          Send an Enquiry
        </Button>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-4xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2">
          <a
            href={contactInfo.phoneHref}
            className="bg-surface border-border shadow-card hover:bg-neutral-tint flex items-center gap-4 rounded-md border p-6 transition-colors"
          >
            <span className="bg-brand-tint text-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
              <Phone aria-hidden className="h-5 w-5" />
            </span>
            <div>
              <p className="font-body text-text-primary font-medium">Call us</p>
              <p className="font-body text-text-secondary text-sm">{contactInfo.phone}</p>
            </div>
          </a>

          <a
            href={contactInfo.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface border-border shadow-card hover:bg-neutral-tint flex items-center gap-4 rounded-md border p-6 transition-colors"
          >
            <span className="bg-brand-tint text-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
              <MessageCircle aria-hidden className="h-5 w-5" />
            </span>
            <div>
              <p className="font-body text-text-primary font-medium">WhatsApp us</p>
              <p className="font-body text-text-secondary text-sm">Chat with our team</p>
            </div>
          </a>

          <a
            href={`mailto:${contactInfo.email}`}
            className="bg-surface border-border shadow-card hover:bg-neutral-tint flex items-center gap-4 rounded-md border p-6 transition-colors"
          >
            <span className="bg-brand-tint text-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
              <Mail aria-hidden className="h-5 w-5" />
            </span>
            <div>
              <p className="font-body text-text-primary font-medium">Email us</p>
              <p className="font-body text-text-secondary text-sm">{contactInfo.email}</p>
            </div>
          </a>

          <div className="bg-surface border-border shadow-card flex items-center gap-4 rounded-md border p-6">
            <span className="bg-brand-tint text-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
              <MapPin aria-hidden className="h-5 w-5" />
            </span>
            <div>
              <p className="font-body text-text-primary font-medium">Visit our factory</p>
              <p className="font-body text-text-secondary text-sm">{contactInfo.address}</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        source="general"
      />
    </main>
  );
}
