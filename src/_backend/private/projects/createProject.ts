'use server';

import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';
import { CreateProjectInput } from '@/lib/zod/createProjectSchemas';
import { APIResponse } from '@/_backend/models/response';
import { ProjectWithStatus } from './getProjects';

export const createProject = async (
  body: CreateProjectInput,
): Promise<APIResponse<ProjectWithStatus[]> | null> => {
  const endpoint = `${url}/create-flow`;
  try {
    const { getToken } = await auth(); // 👈 SSR-safe
    const token = await getToken();
    console.log(token);
    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to create project');
    }

    const json = await res.json();
    console.log('Created Project', json);
    return json;
  } catch (error) {
    console.error('Error creating project', error);
    return null;
  }
};
