'use client';

import { forwardRef, useState } from 'react';

import { cn } from '@/utils/cn';
import {
  baseFieldClasses,
  fieldBorderClass,
  InputWrapper,
} from '@/components/ui/inputs/InputWrapper';
import type { TextInputProps } from '@/components/ui/inputs/TextInput';

export const PasswordInput = forwardRef<HTMLInputElement, Omit<TextInputProps, 'type'>>(
  function PasswordInput({ label, error, hint, required, id, wrapperClassName, ...props }, ref) {
    const [visible, setVisible] = useState(false);

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
          <input
            ref={ref}
            id={id}
            type={visible ? 'text' : 'password'}
            required={required}
            autoComplete="current-password"
            className={cn(baseFieldClasses, fieldBorderClass(Boolean(error)), 'pr-16')}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            className="text-body-sm text-text-secondary hover:text-text-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
            tabIndex={-1}
          >
            {visible ? 'Hide' : 'Show'}
          </button>
        </div>
      </InputWrapper>
    );
  },
);
