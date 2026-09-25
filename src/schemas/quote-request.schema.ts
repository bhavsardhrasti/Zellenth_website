import { z } from 'zod';

import { paginationQuerySchema } from '@/schemas/common.schema';

const quoteRequestItemSnapshotSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

const quoteRequestItemSchema = z
  .object({
    doorSnapshot: quoteRequestItemSnapshotSchema.optional(),
    laminateSnapshot: quoteRequestItemSnapshotSchema.optional(),
    comboSnapshotUrl: z.string().url().optional(),
  })
  .refine((item) => item.doorSnapshot || item.laminateSnapshot, {
    message: 'Each item needs a door or a laminate',
  });

export const quoteRequestSchema = z.object({
  name: z.string().min(1).max(160),
  phone: z.string().min(6).max(20),
  email: z.string().email().max(160).optional(),
  city: z.string().max(120).optional(),
  projectType: z.string().max(120).optional(),
  message: z.string().max(2000).optional(),
  items: z.array(quoteRequestItemSchema).min(1),
  recaptchaToken: z.string().optional(),
});

export const quoteRequestQuerySchema = paginationQuerySchema.extend({
  status: z.enum(['new', 'contacted', 'quoted', 'won', 'lost', 'closed']).optional(),
  city: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  search: z.string().optional(),
});

export const updateQuoteRequestSchema = z.object({
  status: z.enum(['new', 'contacted', 'quoted', 'won', 'lost', 'closed']).optional(),
  adminNotes: z.string().max(4000).optional(),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type QuoteRequestQuery = z.infer<typeof quoteRequestQuerySchema>;
export type UpdateQuoteRequestInput = z.infer<typeof updateQuoteRequestSchema>;
