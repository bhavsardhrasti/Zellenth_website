import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';
import {
  baseFieldClasses,
  fieldBorderClass,
  InputWrapper,
} from '@/components/ui/inputs/InputWrapper';

interface TextAreaInputProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'className'
> {
  label?: string | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  wrapperClassName?: string | undefined;
}

export const TextAreaInput = forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  function TextAreaInput(
    { label, error, hint, required, id, wrapperClassName, rows = 4, ...props },
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
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          required={required}
          className={cn(baseFieldClasses, fieldBorderClass(Boolean(error)), 'resize-y')}
          {...props}
        />
      </InputWrapper>
    );
  },
);
