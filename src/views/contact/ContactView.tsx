'use client';

import { ArrowRight, Mail, MapPin, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { EnquiryModal } from '@/components/shared/EnquiryModal';
import { Button } from '@/components/ui/Button';
import { MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { contactInfo } from '@/lib/data/contact';
import { CtaBanner } from '@/views/home/sections/CtaBanner';

const contactMethods = [
  {
    icon: Phone,
    label: 'Call us',
    value: contactInfo.phone,
    href: contactInfo.phoneHref,
    external: false,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Quick chat with our team',
    href: contactInfo.whatsappHref,
    external: true,
  },
  {
    icon: Mail,
    label: 'Email',
    value: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
    external: false,
  },
  {
    icon: MapPin,
    label: 'Visit',
    value: contactInfo.address,
    href: 'https://maps.google.com/?q=' + encodeURIComponent(contactInfo.address),
    external: true,
  },
] as const;

const quickStats = [
  ['24h', 'Typical response time'],
  ['Custom', 'Door + laminate guidance'],
  ['No login', 'Fast, direct support'],
] as const;

export default function ContactView(): React.JSX.Element {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  return (
    <main className="bg-background min-h-dvh">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
        <Breadcrumbs items={[{ label: 'Contact' }]} />
      </div>

      <AnimatedSection immediate>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <MicroLabel className="text-brand">Contact us</MicroLabel>
              <MaskedHeading
                lines={['Let’s make', 'your next space feel right.']}
                className="text-text-primary mt-4 text-4xl sm:text-5xl lg:text-6xl"
              />
              <p className="font-body text-text-secondary mt-5 max-w-x text-base sm:text-lg">
                Share your project brief, timeline, or finish references and we&apos;ll help you
                pick the right doors, laminates, and finishes for the room you have in mind.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={() => setIsEnquiryOpen(true)} className="px-5 py-3">
                  Send an enquiry
                </Button>
                <a
                  href={contactInfo.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border text-text-primary hover:bg-neutral-tint inline-flex items-center gap-2 border px-5 py-3 text-sm font-medium transition-colors rounded-md"
                >
                  WhatsApp us
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {quickStats.map(([value, label]) => (
                  <div key={label} className="bg-surface border-border rounded-xl border p-4">
                    <div className="font-display text-brand text-3xl">{value}</div>
                    <p className="font-body text-text-secondary mt-1 text-xs leading-relaxed">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border-border relative overflow-hidden rounded-[28px] border p-4 shadow-card sm:p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(143,85,45,0.20),_transparent_55%)]" />
              <div className="relative">
                <div
                  className="relative h-[360px] overflow-hidden rounded-[24px] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, rgba(18,18,18,0.3), rgba(18,18,18,0.55)), url('https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80')",
                  }}
                >
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/80">
                      <Sparkles aria-hidden className="h-3.5 w-3.5" />
                      Design support
                    </div>
                    <h2 className="font-display mt-3 text-3xl">Built for real homes</h2>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="bg-background border-border flex items-center justify-between gap-4 rounded-2xl border px-4 py-3">
                    <div>
                      <p className="font-body text-text-secondary text-xs uppercase tracking-[0.16em]">
                        Email
                      </p>
                      <p className="font-body text-text-primary mt-1 text-sm">
                        {contactInfo.email}
                      </p>
                    </div>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="bg-brand-tint text-brand inline-flex h-10 w-10 items-center justify-center rounded-full"
                      aria-label="Email us"
                    >
                      <Mail aria-hidden className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="bg-background border-border flex items-center justify-between gap-4 rounded-2xl border px-4 py-3">
                    <div>
                      <p className="font-body text-text-secondary text-xs uppercase tracking-[0.16em]">
                        Factory
                      </p>
                      <p className="font-body text-text-primary mt-1 text-sm">
                        {contactInfo.address}
                      </p>
                    </div>
                    <a
                      href={'https://maps.google.com/?q=' + encodeURIComponent(contactInfo.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-brand-tint text-brand inline-flex h-10 w-10 items-center justify-center rounded-full"
                      aria-label="Open address on map"
                    >
                      <MapPin aria-hidden className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {contactMethods.map(({ icon: Icon, label, value, href, external }) => (
            <a
              key={label}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="bg-surface border-border hover:bg-neutral-tint group flex h-full flex-col gap-4 rounded-2xl border p-5 transition-colors"
            >
              <span className="bg-brand-tint text-brand flex h-11 w-11 items-center justify-center rounded-full">
                <Icon aria-hidden className="h-5 w-5" />
              </span>
              <div>
                <p className="font-body text-text-secondary text-xs uppercase tracking-[0.18em]">
                  {label}
                </p>
                <p className="font-body text-text-primary mt-2 text-sm leading-relaxed">{value}</p>
              </div>
            </a>
          ))}
        </div>
      </AnimatedSection>

      <CtaBanner />

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        source="general"
      />
    </main>
  );
}
