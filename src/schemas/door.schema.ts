import { z } from 'zod';

import { objectIdSchema, paginationQuerySchema } from '@/schemas/common.schema';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const dimensionsSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  unit: z.enum(['mm', 'inch', 'ft']).default('mm'),
});

export const doorSchema = z.object({
  code: z.string().min(1).max(60),
  name: z.string().min(1).max(160),
  slug: z
    .string()
    .min(1)
    .max(180)
    .regex(slugPattern, 'Slug must be lowercase and hyphen-separated'),
  categoryId: objectIdSchema,
  patternType: z.string().max(100).optional(),
  dimensions: dimensionsSchema.optional(),
  description: z.string().max(2000).optional(),
  tags: z.array(z.string().min(1).max(40)).default([]),
});

export const updateDoorSchema = doorSchema.partial();

export const doorQuerySchema = paginationQuerySchema.extend({
  categoryId: objectIdSchema.optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const doorExclusionsSchema = z.object({
  excludedLaminateIds: z.array(objectIdSchema).default([]),
});

export type DoorInput = z.infer<typeof doorSchema>;
export type UpdateDoorInput = z.infer<typeof updateDoorSchema>;
export type DoorQuery = z.infer<typeof doorQuerySchema>;
export type DoorExclusionsInput = z.infer<typeof doorExclusionsSchema>;
