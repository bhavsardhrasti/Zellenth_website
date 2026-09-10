'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/inputs/TextInput';
import { PasswordInput } from '@/components/ui/inputs/PasswordInput';
import { loginSchema, type LoginInput } from '@/schemas/auth.schema';

interface LoginViewProps {
  callbackUrl: string;
}

export default function LoginView({ callbackUrl }: LoginViewProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { identifier: '', password: '' },
  });

  async function onSubmit(values: LoginInput) {
    setFormError(null);

    const response = await signIn('credentials', {
      ...values,
      redirect: false,
    });

    if (!response || response.error) {
      setFormError('Invalid email/phone or password.');
      return;
    }

    router.push(callbackUrl as Route);
    router.refresh();
  }

  return (
    <main className="bg-background flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="bg-surface shadow-card rounded-md w-full max-w-sm p-8">
        <h1 className="font-display text-h2 text-text-primary text-center">Sign in</h1>
        <p className="text-body-sm text-text-secondary mt-2 text-center">
          Enter your credentials to continue.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          <TextInput
            label="Email or phone"
            id="identifier"
            error={errors.identifier?.message}
            required
            autoComplete="username"
            {...register('identifier')}
          />
          <PasswordInput
            label="Password"
            id="password"
            error={errors.password?.message}
            required
            {...register('password')}
          />

          {formError && (
            <p className="text-body-sm bg-error-bg text-error-text rounded-sm px-3 py-2">
              {formError}
            </p>
          )}

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!isValid || isSubmitting}
            className="mt-2 w-full"
          >
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
}
