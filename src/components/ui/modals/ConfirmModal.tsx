import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { ModalWrapper } from '@/components/ui/modals/ModalWrapper';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'primary';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  isLoading = false,
  variant = 'danger',
}: ConfirmModalProps) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      titleIcon={
        variant === 'danger' && (
          <span className="bg-error-bg text-error-text flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
            <AlertTriangle aria-hidden className="h-5 w-5" />
          </span>
        )
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant={variant} onClick={onConfirm} isLoading={isLoading} disabled={isLoading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-body text-text-secondary">{description}</p>
    </ModalWrapper>
  );
}
