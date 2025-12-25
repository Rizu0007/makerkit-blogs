import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters long')
    .max(200, 'Title must be less than 200 characters')
    .trim()
    .refine((val) => val.length > 0, {
      message: 'Title cannot be only whitespace',
    }),
  body: z
    .string()
    .min(1, 'Body is required')
    .min(10, 'Body must be at least 10 characters long')
    .max(50000, 'Body must be less than 50,000 characters')
    .trim()
    .refine((val) => val.length >= 10, {
      message: 'Body must contain at least 10 characters of content',
    }),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
