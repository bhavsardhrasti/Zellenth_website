import { server } from '@/lib/env';

interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
}

export async function verifyRecaptcha(token?: string): Promise<boolean> {
  if (!server.RECAPTCHA_SECRET_KEY) {
    console.warn('RECAPTCHA_SECRET_KEY is not set — skipping reCAPTCHA verification.');
    return true;
  }

  if (!token) {
    return false;
  }

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: server.RECAPTCHA_SECRET_KEY, response: token }),
  });

  const result = (await response.json()) as RecaptchaVerifyResponse;
  return result.success && (result.score ?? 1) >= 0.5;
}
