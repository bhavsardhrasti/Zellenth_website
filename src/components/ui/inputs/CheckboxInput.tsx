import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

interface CheckboxInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'type'
> {
  label: string;
  error?: string;
}

export const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>(
  function CheckboxInput({ label, error, id, ...props }, ref) {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-body-sm text-text-primary flex items-center gap-2">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={cn(
              'border-border text-accent focus:ring-accent h-4 w-4 rounded-sm',
              error && 'border-error-text',
            )}
            {...props}
          />
          {label}
        </label>
        {error && <p className="text-body-sm text-error-text">{error}</p>}
      </div>
    );
  },
);
