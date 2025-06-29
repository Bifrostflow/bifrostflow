import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
