import { z } from 'zod';

export const createProjectSchema = z.object({
  users: z.string(),
  edges: z.string(),
  nodes: z.string(),
  api_keys: z.string(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
