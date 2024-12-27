import { z } from 'zod';

export const blogValidationSchema = z.object({
  title: z.string().nonempty({ message: 'Title is required' }),
  content: z.string().nonempty({ message: 'Content is required' }),
});


  export const updateBlogValidationSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
  });