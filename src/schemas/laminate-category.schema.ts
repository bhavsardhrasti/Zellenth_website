import { z } from 'zod';

import { objectIdSchema, paginationQuerySchema } from '@/schemas/common.schema';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const laminateCategorySchema = z.object({
  name: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(140)
    .regex(slugPattern, 'Slug must be lowercase and hyphen-separated'),
  parentId: objectIdSchema.optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const updateLaminateCategorySchema = laminateCategorySchema.partial();

export const laminateCategoryQuerySchema = paginationQuerySchema.extend({
  parentId: objectIdSchema.optional(),
});

export type LaminateCategoryInput = z.infer<typeof laminateCategorySchema>;
export type UpdateLaminateCategoryInput = z.infer<typeof updateLaminateCategorySchema>;
export type LaminateCategoryQuery = z.infer<typeof laminateCategoryQuerySchema>;
