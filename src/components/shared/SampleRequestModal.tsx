'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, PackageCheck } from 'lucide-react';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { TextAreaInput } from '@/components/ui/inputs/TextAreaInput';
import { TextInput } from '@/components/ui/inputs/TextInput';
import { ModalWrapper } from '@/components/ui/modals/ModalWrapper';
import { apiFetch } from '@/lib/api/client';

const sampleRequestSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(160),
  phone: z.string().trim().min(6, 'Enter a valid phone number').max(20),
  finish: z.string().trim().min(1, 'Tell us which finish you would like').max(160),
  address: z.string().trim().min(1, 'Delivery address is required').max(500),
});

type SampleRequestValues = z.infer<typeof sampleRequestSchema>;

const DEFAULT_VALUES: SampleRequestValues = {
  name: '',
  phone: '',
  finish: '',
  address: '',
};

interface SampleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SampleRequestModal({
  isOpen,
  onClose,
}: SampleRequestModalProps): React.JSX.Element {
  const formId = useId();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SampleRequestValues>({
    resolver: zodResolver(sampleRequestSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  function handleClose(): void {
    onClose();
    reset(DEFAULT_VALUES);
    setIsSubmitted(false);
  }

  const onSubmit = handleSubmit(async ({ name, phone, finish, address }) => {
    const response = await apiFetch('/api/enquiries', {
      method: 'POST',
      body: JSON.stringify({
        name,
        phone,
        source: 'general',
        message: `Sample request\nFinish: ${finish}\nDelivery address: ${address}`,
      }),
    });

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    setIsSubmitted(true);
  });

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title="Request a sample"
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
              icon={PackageCheck}
            >
              Send request
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
          <h3 className="font-display text-h2 text-text-primary">Request received</h3>
          <p className="text-body text-text-secondary">
            Our team will be in touch to confirm the finish and delivery details.
          </p>
          <Button onClick={handleClose} className="mt-2 w-fit">
            Close
          </Button>
        </div>
      ) : (
        <form id={formId} onSubmit={onSubmit} className="flex flex-col gap-4">
          <p className="text-body-sm text-text-secondary -mt-2">
            Tell us where to send it and which finish you would like to see.
          </p>
          <TextInput label="Name" required error={errors.name?.message} {...register('name')} />
          <TextInput
            label="Phone"
            required
            type="tel"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <TextInput
            label="Finish"
            required
            placeholder="e.g. Natural Oak, PRE-01"
            error={errors.finish?.message}
            {...register('finish')}
          />
          <TextAreaInput
            label="Delivery address"
            required
            rows={3}
            error={errors.address?.message}
            {...register('address')}
          />
        </form>
      )}
    </ModalWrapper>
  );
}
