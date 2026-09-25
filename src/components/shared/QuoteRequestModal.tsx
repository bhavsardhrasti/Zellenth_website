'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import Script from 'next/script';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { EmailInput } from '@/components/ui/inputs/EmailInput';
import { TextAreaInput } from '@/components/ui/inputs/TextAreaInput';
import { TextInput } from '@/components/ui/inputs/TextInput';
import { ModalWrapper } from '@/components/ui/modals/ModalWrapper';
import { apiFetch } from '@/lib/api/client';
import { contactInfo } from '@/lib/data/contact';
import type { WatchlistItem } from '@/hooks/useWatchlist';
import { ROUTES } from '@/utils/routes';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const quoteRequestFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(160),
  phone: z.string().min(6, 'Enter a valid phone number').max(20),
  email: z.union([z.string().email('Enter a valid email'), z.literal('')]),
  city: z.string().max(120),
  projectType: z.string().max(120),
  message: z.string().max(2000),
});

type QuoteRequestFormValues = z.infer<typeof quoteRequestFormSchema>;

const DEFAULT_VALUES: QuoteRequestFormValues = {
  name: '',
  phone: '',
  email: '',
  city: '',
  projectType: '',
  message: '',
};

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: WatchlistItem[];
  onSubmitted: () => void;
}

function toApiItems(items: WatchlistItem[]) {
  return items.map((item) => ({
    doorSnapshot: item.door
      ? { name: item.door.name, slug: item.door.slug, imageUrl: item.door.imageUrl || undefined }
      : undefined,
    laminateSnapshot: item.laminate
      ? {
          name: item.laminate.name,
          slug: item.laminate.slug,
          imageUrl: item.laminate.imageUrl || undefined,
        }
      : undefined,
    comboSnapshotUrl: item.comboSnapshotUrl,
  }));
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

async function getRecaptchaToken(): Promise<string | undefined> {
  const siteKey = RECAPTCHA_SITE_KEY;
  if (!siteKey || !window.grecaptcha) return undefined;
  return new Promise((resolve) => {
    window.grecaptcha?.ready(() => {
      window.grecaptcha
        ?.execute(siteKey, { action: 'quote_request' })
        .then(resolve)
        .catch(() => resolve(undefined));
    });
  });
}

export function QuoteRequestModal({ isOpen, onClose, items, onSubmitted }: QuoteRequestModalProps) {
  const formId = useId();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const siteKey = RECAPTCHA_SITE_KEY;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<QuoteRequestFormValues>({
    resolver: zodResolver(quoteRequestFormSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  function handleClose() {
    onClose();
    reset(DEFAULT_VALUES);
    setIsSubmitted(false);
    setReferenceId(null);
  }

  const onSubmit = handleSubmit(async (values) => {
    const recaptchaToken = await getRecaptchaToken();

    const response = await apiFetch<{ referenceId: string }>('/api/quote-requests', {
      method: 'POST',
      body: JSON.stringify({
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        city: values.city || undefined,
        projectType: values.projectType || undefined,
        message: values.message || undefined,
        items: toApiItems(items),
        recaptchaToken,
      }),
    });

    if (!response.success || !response.data) {
      toast.error(response.message);
      return;
    }

    setReferenceId(response.data.referenceId);
    setIsSubmitted(true);
    onSubmitted();
  });

  const whatsappHref = referenceId
    ? `${contactInfo.whatsappHref}?text=${encodeURIComponent(
        `Hi, I'd like a quote for reference ${referenceId} — ${items
          .map((item) => item.door?.name ?? item.laminate?.name)
          .filter(Boolean)
          .join(
            ', ',
          )}. ${typeof window !== 'undefined' ? window.location.origin : ''}${ROUTES.QUOTE_VIEW(referenceId)}`,
      )}`
    : undefined;

  return (
    <>
      {siteKey ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
          strategy="lazyOnload"
        />
      ) : null}
      <ModalWrapper
        isOpen={isOpen}
        onClose={handleClose}
        title="Request a Quote"
        footer={
          isSubmitted ? undefined : (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form={formId}
                isLoading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                Submit
              </Button>
            </>
          )
        }
      >
        {isSubmitted && referenceId ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="bg-success-bg text-success-text flex h-12 w-12 items-center justify-center rounded-full">
              <CheckCircle2 aria-hidden className="h-6 w-6" />
            </span>
            <h2 className="font-display text-h2 text-text-primary">Quote request sent</h2>
            <p className="text-body text-text-secondary">
              Your reference ID is{' '}
              <span className="text-text-primary font-medium">{referenceId}</span>. Our team will
              reach out shortly.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-action hover:bg-action-hover text-action-text rounded-sm px-6 py-3 font-medium transition-colors"
                >
                  Send on WhatsApp
                </a>
              ) : null}
              <Button onClick={handleClose} variant="secondary" className="w-fit">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form id={formId} onSubmit={onSubmit} className="flex flex-col gap-4">
            <p className="text-body-sm text-text-secondary -mt-2">
              Requesting a quote for {items.length} {items.length === 1 ? 'item' : 'items'} from
              your watchlist.
            </p>

            <TextInput label="Name" required error={errors.name?.message} {...register('name')} />
            <TextInput
              label="Phone"
              required
              type="tel"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <EmailInput label="Email" error={errors.email?.message} {...register('email')} />
            <TextInput label="City" error={errors.city?.message} {...register('city')} />
            <TextInput
              label="Project Type"
              error={errors.projectType?.message}
              {...register('projectType')}
            />
            <TextAreaInput label="Message" {...register('message')} />
          </form>
        )}
      </ModalWrapper>
    </>
  );
}
