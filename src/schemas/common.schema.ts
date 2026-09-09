import { z } from 'zod';

import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/utils/constants';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');
