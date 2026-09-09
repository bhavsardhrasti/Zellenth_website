import { z } from 'zod';

import { objectIdSchema, paginationQuerySchema } from '@/schemas/common.schema';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const doorCategorySchema = z.object({
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

export const updateDoorCategorySchema = doorCategorySchema.partial();

export const doorCategoryQuerySchema = paginationQuerySchema.extend({
  parentId: objectIdSchema.optional(),
});

export type DoorCategoryInput = z.infer<typeof doorCategorySchema>;
export type UpdateDoorCategoryInput = z.infer<typeof updateDoorCategorySchema>;
export type DoorCategoryQuery = z.infer<typeof doorCategoryQuerySchema>;
