import { forwardRef } from 'react';

import { TextInput, type TextInputProps } from '@/components/ui/inputs/TextInput';

export const NumberInput = forwardRef<HTMLInputElement, Omit<TextInputProps, 'type'>>(
  function NumberInput(props, ref) {
    return <TextInput ref={ref} type="number" {...props} />;
  },
);
