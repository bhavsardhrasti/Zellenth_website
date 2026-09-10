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
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={title} hideTitle>
      <div className="flex items-start gap-3">
        {variant === 'danger' && (
          <span className="bg-error-bg text-error-text flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
            <AlertTriangle aria-hidden className="h-5 w-5" />
          </span>
        )}
        <div>
          <h2 className="font-display text-h2 text-text-primary">{title}</h2>
          <p className="text-body text-text-secondary mt-2">{description}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant={variant} onClick={onConfirm} isLoading={isLoading} disabled={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </ModalWrapper>
  );
}
