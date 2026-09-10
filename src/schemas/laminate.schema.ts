import { z } from 'zod';

import { objectIdSchema, paginationQuerySchema } from '@/schemas/common.schema';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const finishEnum = z.enum(['matte', 'gloss', 'textured']);
const grainDirectionEnum = z.enum(['horizontal', 'vertical', 'no-grain']);

export const laminateSchema = z.object({
  code: z.string().min(1).max(60),
  name: z.string().min(1).max(160),
  slug: z
    .string()
    .min(1)
    .max(180)
    .regex(slugPattern, 'Slug must be lowercase and hyphen-separated'),
  categoryId: objectIdSchema,
  finish: finishEnum,
  colorFamily: z.string().min(1).max(80),
  collectionName: z.string().max(120).optional(),
  size: z.string().max(60).optional(),
  priceBracket: z.string().max(60).optional(),
  grainDirection: grainDirectionEnum,
  patternScale: z.number().positive().optional(),
  description: z.string().max(2000).optional(),
  tags: z.array(z.string().min(1).max(40)).default([]),
});

export const updateLaminateSchema = laminateSchema.partial();

export const laminateQuerySchema = paginationQuerySchema.extend({
  categoryId: objectIdSchema.optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
  finish: finishEnum.optional(),
  colorFamily: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type LaminateInput = z.infer<typeof laminateSchema>;
export type UpdateLaminateInput = z.infer<typeof updateLaminateSchema>;
export type LaminateQuery = z.infer<typeof laminateQuerySchema>;
