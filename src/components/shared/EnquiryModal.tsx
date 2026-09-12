'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
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
import type { EnquirySource } from '@/lib/db/models/Enquiry.model';

const enquiryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(160),
  phone: z.string().min(6, 'Enter a valid phone number').max(20),
  email: z.union([z.string().email('Enter a valid email'), z.literal('')]),
  message: z.string().max(2000),
});

type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: EnquirySource;
  doorId?: string | undefined;
  doorName?: string | undefined;
  laminateId?: string | undefined;
  laminateName?: string | undefined;
}

const DEFAULT_VALUES: EnquiryFormValues = { name: '', phone: '', email: '', message: '' };

export function EnquiryModal({
  isOpen,
  onClose,
  source,
  doorId,
  doorName,
  laminateId,
  laminateName,
}: EnquiryModalProps) {
  const formId = useId();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  function handleClose() {
    onClose();
    reset(DEFAULT_VALUES);
    setIsSubmitted(false);
  }

  const onSubmit = handleSubmit(async (values) => {
    const response = await apiFetch('/api/enquiries', {
      method: 'POST',
      body: JSON.stringify({
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        message: values.message || undefined,
        doorId,
        laminateId,
        source,
      }),
    });

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    setIsSubmitted(true);
  });

  const contextLine =
    doorName && laminateName
      ? `${doorName} in ${laminateName}`
      : (doorName ?? laminateName ?? undefined);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title="Enquire"
      footer={
        isSubmitted ? undefined : (
          <>
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
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
      {isSubmitted ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="bg-success-bg text-success-text flex h-12 w-12 items-center justify-center rounded-full">
            <CheckCircle2 aria-hidden className="h-6 w-6" />
          </span>
          <h2 className="font-display text-h2 text-text-primary">
            Thanks — we&apos;ll be in touch
          </h2>
          <p className="text-body text-text-secondary">
            Our team will reach out about your enquiry shortly.
          </p>
          <Button onClick={handleClose} className="mt-2 w-fit">
            Close
          </Button>
        </div>
      ) : (
        <form id={formId} onSubmit={onSubmit} className="flex flex-col gap-4">
          {contextLine && (
            <p className="text-body-sm text-text-secondary -mt-2">
              Enquiring about: <span className="text-text-primary">{contextLine}</span>
            </p>
          )}

          <TextInput label="Name" required error={errors.name?.message} {...register('name')} />
          <TextInput
            label="Phone"
            required
            type="tel"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <EmailInput label="Email" error={errors.email?.message} {...register('email')} />
          <TextAreaInput label="Message" {...register('message')} />
        </form>
      )}
    </ModalWrapper>
  );
}
