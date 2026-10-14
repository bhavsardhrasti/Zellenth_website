'use client';

import { ArrowRight, ChevronRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { EnquiryModal } from '@/components/shared/EnquiryModal';
import { Button } from '@/components/ui/Button';
import { MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { contactInfo } from '@/lib/data/contact';

const mapsUrl = 'https://maps.google.com/?q=' + encodeURIComponent(contactInfo.address);
const mapsEmbedUrl =
  'https://maps.google.com/maps?q=' + encodeURIComponent(contactInfo.address) + '&output=embed';

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
    href: mapsUrl,
    external: true,
  },
] as const;

const inputClass =
  'bg-background border-border text-text-primary font-body focus:border-brand w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors';

type EnquiryForm = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const emptyForm: EnquiryForm = { name: '', phone: '', email: '', message: '' };
export default function ContactView(): React.JSX.Element {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [form, setForm] = useState<EnquiryForm>(emptyForm);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const updateField =
    (field: keyof EnquiryForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('Please fill in your name, phone number and message.');
      return;
    }
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) {
      setError('Please enter a valid phone number.');
      return;
    }

    const text = [
      'New enquiry from website',
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      form.email.trim() ? `Email: ${form.email.trim()}` : '',
      `Message: ${form.message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const url = new URL(contactInfo.whatsappHref);
      url.searchParams.set('text', text);
      window.open(url.toString(), '_blank', 'noopener,noreferrer');
    } catch {
      window.open(contactInfo.whatsappHref, '_blank', 'noopener,noreferrer');
    }
    setSent(true);
    setForm(emptyForm);
  };
  return (
    <main className="bg-background min-h-dvh">
      <AnimatedSection immediate>
        <div
          className="relative flex min-h-[460px] items-center bg-cover bg-center sm:min-h-[520px] lg:min-h-[580px]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(18,18,18,0.75), rgba(18,18,18,0.35)), url('https://images.unsplash.com/photo-1494526585095-c41746248156?w=1600&q=80')",
          }}
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="font-body flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-white/80">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                <li aria-current="page" className="text-white">
                  Contact
                </li>
              </ol>
            </nav>
            <MicroLabel className="text-white/80">Contact us</MicroLabel>
            <MaskedHeading
              lines={['Let’s make', 'your next space feel right.']}
              className="mt-4 text-4xl text-white sm:text-5xl lg:text-6xl"
            />
            <p className="font-body mt-5 max-w-md text-base text-white/85 sm:text-lg">
              Tell us about your room and we&apos;ll help you pick the right door and laminate.
            </p>
          </div>
        </div>
      </AnimatedSection>
      <AnimatedSection className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {contactMethods.map(({ icon: Icon, label, value, href, external }) => (
            <a
              key={label}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="bg-surface border-border hover:bg-neutral-tint group flex h-full flex-col gap-3 rounded-2xl border px-4 py-3.5 transition-color"
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

      <AnimatedSection className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Map – left */}
          <div className="bg-surface border-border flex flex-col overflow-hidden rounded-2xl border">
            <iframe
              title="Zellenth factory location"
              src={mapsEmbedUrl}
              className="min-h-[320px] w-full flex-1 border-0 sm:min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <p className="font-body text-text-secondary text-sm">{contactInfo.address}</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-brand inline-flex items-center gap-2 text-sm font-medium"
              >
                Get directions
                <ArrowRight aria-hidden className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="bg-surface border-border rounded-2xl border p-5 sm:p-8">
            <MicroLabel className="text-brand">Free quote</MicroLabel>
            <h2 className="font-display text-text-primary mt-3 text-3xl sm:text-4xl">
              Let’s build your door.
            </h2>
            <p className="font-body text-text-secondary mt-3 text-sm sm:text-base">
              Tell us what you need and our team will get back to you. No login required.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
              <div>
                <label htmlFor="enquiry-name" className="sr-only">
                  Your name
                </label>
                <input
                  id="enquiry-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name *"
                  value={form.name}
                  onChange={updateField('name')}
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="enquiry-phone" className="sr-only">
                    Phone number
                  </label>
                  <input
                    id="enquiry-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Phone number *"
                    value={form.phone}
                    onChange={updateField('phone')}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="enquiry-email" className="sr-only">
                    Email (optional)
                  </label>
                  <input
                    id="enquiry-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email (optional)"
                    value={form.email}
                    onChange={updateField('email')}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="enquiry-message" className="sr-only">
                  Your message
                </label>
                <textarea
                  id="enquiry-message"
                  rows={5}
                  placeholder="Tell us about your door or laminate requirement *"
                  value={form.message}
                  onChange={updateField('message')}
                  className={`${inputClass} resize-none`}
                />
              </div>
              {error && (
                <p role="alert" className="font-body text-sm text-red-600">
                  {error}
                </p>
              )}
              {sent && !error && (
                <p role="status" className="font-body text-brand text-sm">
                  Thanks! Your enquiry is ready to send. We will reply within 24 hours.
                </p>
              )}
              <Button type="submit" className="w-full px-5 py-3 sm:w-auto sm:self-start">
                Send enquiry
              </Button>
            </form>
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
