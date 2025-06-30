import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string(),
  users: z.string(),
  edges: z.string(),
  nodes: z.string(),
  api_keys: z.string(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
