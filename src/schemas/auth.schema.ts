import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional(),
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
