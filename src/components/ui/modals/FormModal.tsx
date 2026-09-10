import type { ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { ModalWrapper } from '@/components/ui/modals/ModalWrapper';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: ReactNode;
  submitLabel?: string;
  isLoading?: boolean;
  isSubmitDisabled?: boolean;
  error?: string | null;
}

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitLabel = 'Save',
  isLoading = false,
  isSubmitDisabled = false,
  error,
}: FormModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={title}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-4"
      >
        {children}
        {error && (
          <p className="text-body-sm bg-error-bg text-error-text rounded-sm px-3 py-2">{error}</p>
        )}
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={isLoading || isSubmitDisabled}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
