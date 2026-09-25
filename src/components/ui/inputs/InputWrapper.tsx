import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface InputWrapperProps {
  label?: string | undefined;
  htmlFor?: string | undefined;
  error?: string | undefined;
  required?: boolean | undefined;
  hint?: string | undefined;
  className?: string | undefined;
  children: ReactNode;
}

export function InputWrapper({
  label,
  htmlFor,
  error,
  required,
  hint,
  className,
  children,
}: InputWrapperProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-body-sm text-text-primary font-medium">
          {label}
          {required && <span className="text-error-text ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-body-sm text-error-text">{error}</p>
      ) : hint ? (
        <p className="text-body-sm text-text-secondary">{hint}</p>
      ) : null}
    </div>
  );
}

export const baseFieldClasses =
  'text-body font-body w-full rounded-sm border bg-surface px-3 py-2 text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-brand focus-visible:ring-brand focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50';

export function fieldBorderClass(hasError?: boolean): string {
  return hasError ? 'border-error-text' : 'border-border';
}
