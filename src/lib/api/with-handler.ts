import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { AppError } from '@/lib/errors';
import { fail } from '@/lib/api/response';

type RouteHandler = (...args: never[]) => Promise<NextResponse>;

export function withApiHandler<T extends RouteHandler>(handler: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ZodError) {
        return fail('Validation failed', 400, JSON.stringify(error.issues));
      }

      if (error instanceof AppError) {
        return fail(error.message, error.statusCode);
      }

      console.error(error);

      const message =
        process.env.NODE_ENV === 'production'
          ? 'Something went wrong. Please try again later.'
          : error instanceof Error
            ? error.message
            : 'Unknown error';

      return fail(message, 500);
    }
  }) as T;
}
