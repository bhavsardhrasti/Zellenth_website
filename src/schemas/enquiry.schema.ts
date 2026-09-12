import { z } from 'zod';

import { objectIdSchema, paginationQuerySchema } from '@/schemas/common.schema';

export const enquirySchema = z.object({
  name: z.string().min(1).max(160),
  phone: z.string().min(6).max(20),
  email: z.string().email().max(160).optional(),
  message: z.string().max(2000).optional(),
  doorId: objectIdSchema.optional(),
  laminateId: objectIdSchema.optional(),
  source: z.enum(['visualizer', 'door_detail', 'laminate_detail']),
});

export const enquiryQuerySchema = paginationQuerySchema.extend({
  status: z.enum(['new', 'contacted', 'closed']).optional(),
  search: z.string().optional(),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'closed']),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
export type EnquiryQuery = z.infer<typeof enquiryQuerySchema>;
export type UpdateEnquiryStatusInput = z.infer<typeof updateEnquiryStatusSchema>;
