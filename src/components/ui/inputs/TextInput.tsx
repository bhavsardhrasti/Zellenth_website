import { forwardRef, type InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/utils/cn';
import {
  baseFieldClasses,
  fieldBorderClass,
  InputWrapper,
} from '@/components/ui/inputs/InputWrapper';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  wrapperClassName?: string | undefined;
  icon?: LucideIcon | undefined;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, error, hint, required, id, wrapperClassName, icon: Icon, ...props },
  ref,
) {
  return (
    <InputWrapper
      label={label}
      htmlFor={id}
      error={error}
      hint={hint}
      required={required}
      className={wrapperClassName}
    >
      <div className="relative">
        {Icon && (
          <Icon
            aria-hidden
            className="text-text-secondary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          />
        )}
        <input
          ref={ref}
          id={id}
          required={required}
          className={cn(baseFieldClasses, fieldBorderClass(Boolean(error)), Icon && 'pl-9')}
          {...props}
        />
      </div>
    </InputWrapper>
  );
});
