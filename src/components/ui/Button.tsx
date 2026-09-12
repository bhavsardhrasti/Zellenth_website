import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  icon?: LucideIcon;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'bg-surface text-text-primary border border-border hover:bg-neutral-tint',
  ghost: 'bg-transparent text-text-primary hover:bg-neutral-tint',
  danger: 'bg-error-text text-white hover:opacity-90',
};

export function Button({
  variant = 'primary',
  isLoading = false,
  icon: Icon,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'text-button font-body rounded-sm inline-flex items-center justify-center gap-2 px-4 py-2 font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_CLASSES[variant],
        className,
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        Icon && <Icon aria-hidden className="h-3.5 w-3.5" />
      )}
      {children}
    </button>
  );
}
