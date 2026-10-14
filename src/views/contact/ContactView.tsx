'use client';

import { ArrowRight, ChevronRight, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
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
  'bg-background border-border text-text-primary font-body placeholder:text-text-secondary/60 focus:border-brand pointer-events-auto w-full rounded-sm border px-5 py-3.5 text-sm outline-none transition-colors';

const labelClass =
  'font-body text-text-primary mb-2 block text-xs font-semibold uppercase tracking-[0.18em]';

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

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email address and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    const text = [
      'New enquiry from website',
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim() || 'Not provided'}`,
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
              className="mt-4 text-3xl text-white sm:text-5xl lg:text-6xl"
            />
            <p className="font-body mt-5 max-w-md text-base text-white/85 sm:text-lg">
              Tell us about your room and we&apos;ll help you pick the right door and laminate.
            </p>
          </div>
        </div>
      </AnimatedSection>
      <AnimatedSection className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Enquiry form – left */}
          <div className="bg-surface border-border flex min-w-0 flex-col border rounded-sm p-5 sm:p-8">
            <MicroLabel className="text-brand">Send a message</MicroLabel>

            <form onSubmit={handleSubmit} noValidate className="mt-8 grid gap-5">
              <div>
                <label htmlFor="enquiry-name" className={labelClass}>
                  Full name <span className="text-brand">*</span>
                </label>
                <input
                  id="enquiry-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={updateField('name')}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="enquiry-email" className={labelClass}>
                  Email address <span className="text-brand">*</span>
                </label>
                <input
                  id="enquiry-email"
                  type="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={updateField('email')}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="enquiry-phone" className={labelClass}>
                  Phone number
                </label>
                <input
                  id="enquiry-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 00000 00000"
                  value={form.phone}
                  onChange={updateField('phone')}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="enquiry-message" className={labelClass}>
                  Message <span className="text-brand">*</span>
                </label>
                <textarea
                  id="enquiry-message"
                  rows={6}
                  placeholder="Tell us about your project, space, or any questions you have..."
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
              <Button
                type="submit"
                className="w-full justify-center gap-3 pointer-events-auto rounded-sm px-6 py-3 sm:w-auto sm:self-start"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Send message
                </span>
                <Send aria-hidden className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </form>
          </div>

          {/* Details + map – right */}
          <div className="flex min-w-0 flex-col gap-5">
            <div className="border-border divide-y border-t border-b">
              {contactMethods.map(({ icon: Icon, label, value, href, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="group flex min-w-0 items-center gap-3 py-5 transition-colors sm:py-4"
                >
                  <span className="text-brand shrink-0 transition-transform duration-200 group-hover:-translate-y-1">
                    <Icon aria-hidden className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span className="font-body text-text-secondary w-22 shrink-0 text-xs uppercase tracking-[0.18em] sm:w-28">
                    {label}
                  </span>
                  <span className="font-display text-text-primary group-hover:text-brand min-w-0 flex-1 break-words text-base transition-colors sm:text-lg">
                    {value}
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="text-text-secondary shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </a>
              ))}
            </div>

            <div className="bg-surface border-border flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border">
              <iframe
                title="Zellenth factory location"
                src={mapsEmbedUrl}
                className="min-h-[320px] w-full flex-1 border-0 sm:min-h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <p className="font-body text-text-secondary min-w-0 flex-1 break-words text-sm">
                  {contactInfo.address}
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-brand inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium"
                >
                  Get directions
                  <ArrowRight aria-hidden className="h-2 w-2" />
                </a>
              </div>
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
