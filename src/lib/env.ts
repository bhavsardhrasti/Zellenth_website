import { z } from 'zod';

const serverEnvSchema = z.object({
  MONGODB_URI: z.string().min(1),

  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),

  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  CLOUDFLARE_API_TOKEN: z.string().optional(),

  MEILISEARCH_HOST: z.string().url().optional(),
  MEILISEARCH_API_KEY: z.string().optional(),

  EMAIL_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  RECAPTCHA_SECRET_KEY: z.string().optional(),

  SENTRY_DSN: z.string().optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_R2_PUBLIC_URL: z.string().url(),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_GA4_ID: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

function loadServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid server environment variables:\n${parsed.error.toString()}`);
  }
  return parsed.data;
}

function loadClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
    NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });
  if (!parsed.success) {
    throw new Error(`Invalid client environment variables:\n${parsed.error.toString()}`);
  }
  return parsed.data;
}

// `server` is only safe to import from server-side code (Route Handlers, Server
// Actions, Server Components) — importing it into a Client Component bundles
// nothing here, but referencing the values there will read as `undefined` since
// Next.js only inlines NEXT_PUBLIC_* vars into the client bundle.
export const server = loadServerEnv();
export const client = loadClientEnv();
