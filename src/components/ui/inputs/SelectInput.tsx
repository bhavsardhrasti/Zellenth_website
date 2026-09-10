import { forwardRef, type SelectHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';
import {
  baseFieldClasses,
  fieldBorderClass,
  InputWrapper,
} from '@/components/ui/inputs/InputWrapper';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label?: string | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  options: SelectOption[];
  placeholder?: string | undefined;
  wrapperClassName?: string | undefined;
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(function SelectInput(
  { label, error, hint, required, id, options, placeholder, wrapperClassName, ...props },
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
      <select
        ref={ref}
        id={id}
        required={required}
        className={cn(baseFieldClasses, fieldBorderClass(Boolean(error)))}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </InputWrapper>
  );
});
