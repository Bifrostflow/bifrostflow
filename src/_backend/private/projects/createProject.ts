'use server';

import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';
import { CreateProjectInput } from '@/lib/zod/createProjectSchemas';
import { APIResponse } from '@/_backend/models/response';
import { ProjectWithStatus } from './getProjects';

interface CreateProject extends CreateProjectInput {
  name: string;
  description: string;
}

export const createProject = async (
  body: CreateProject,
): Promise<APIResponse<ProjectWithStatus[]> | null> => {
  const endpoint = `${url}/create-flow`;
  try {
    const { getToken } = await auth();
    const token = await getToken();

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

    const json: APIResponse<ProjectWithStatus[]> = await res.json();

    return json;
  } catch (error) {
    console.error('Error creating project', error);
    return null;
  }
};

export const tryTemplate = async (
  template_id: string,
): Promise<APIResponse<ProjectWithStatus[]> | null> => {
  const endpoint = `${url}/try-template?template_id=${template_id}`;
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to create project');
    }

    const json: APIResponse<ProjectWithStatus[]> = await res.json();

    return json;
  } catch (error) {
    console.error('Error creating project', error);
    return null;
  }
};
