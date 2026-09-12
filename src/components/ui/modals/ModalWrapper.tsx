'use client';

import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils/cn';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  titleIcon?: ReactNode;
  hideTitle?: boolean;
  hideCloseButton?: boolean;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ModalWrapper({
  isOpen,
  onClose,
  title,
  titleIcon,
  hideTitle = false,
  hideCloseButton = false,
  footer,
  children,
  className,
}: ModalWrapperProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            aria-hidden
            onClick={onClose}
            className="absolute inset-0 bg-[var(--color-text-primary)]/40"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn(
              'bg-surface shadow-elevated rounded-md relative w-full max-w-lg p-6',
              className,
            )}
          >
            {((title && !hideTitle) || !hideCloseButton) && (
              <div className="mb-4 flex items-start justify-between gap-4">
                {title && !hideTitle ? (
                  <div className="flex items-center gap-3">
                    {titleIcon}
                    <h2 className="font-display text-h2 text-text-primary">{title}</h2>
                  </div>
                ) : (
                  <span />
                )}
                {!hideCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="text-text-secondary hover:text-text-primary hover:bg-neutral-tint shrink-0 cursor-pointer rounded-full p-1 transition-colors"
                  >
                    <X aria-hidden className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
            {children}
            {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
