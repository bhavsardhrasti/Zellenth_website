import { forwardRef } from 'react';

import { TextInput, type TextInputProps } from '@/components/ui/inputs/TextInput';

export const EmailInput = forwardRef<HTMLInputElement, Omit<TextInputProps, 'type'>>(
  function EmailInput(props, ref) {
    return <TextInput ref={ref} type="email" autoComplete="email" {...props} />;
  },
);
