import { z } from 'zod';

export const entrySchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  streetAddress: z.string().trim().max(300).optional().default(''),
  cityStateAddress: z.string().trim().max(300).optional().default(''),
  description: z.string().trim().max(2000).optional().default(''),
  date: z.coerce.date().optional().nullable(),
  websiteUrl: z
    .string()
    .trim()
    .max(500)
    .refine((val) => !val || /^https?:\/\//.test(val) || /^[\w.-]+\.\w{2,}/.test(val), {
      message: 'Must be a valid URL',
    })
    .optional()
    .default(''),
  phoneNumber: z.string().trim().max(30).optional().default(''),
});
