'use server';
import { APIResponse } from '@/_backend/models/response';
import { ClerkProfileSchema } from '@/components/ui/settings/profile-setting';
import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';
import z from 'zod';

export interface ProjectWithStatus {
  id: string;
  name: string;
  description: string | null;
  updated_at: string; // ISO 8601 timestamp
  status: 'touched' | 'not_touched';
  snap_path?: string | null;
}

interface ProjectsResponse {
  projects: ProjectWithStatus[];
  project_limit: number;
  current_project_count: number;
}

export const updateClerkUser = async (
  data: z.infer<typeof ClerkProfileSchema>,
): Promise<APIResponse<ProjectsResponse> | null> => {
  const endpoint = `${url}/update-user`;

  try {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return {
        data: null,
        isSuccess: false,
        message: 'something went wrong',
        error: '',
      };
    }

    const json: APIResponse<ProjectsResponse> = await res.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error('❌ Error updating user:', error);
    return {
      data: null,
      isSuccess: false,
      message: '❌ Error updating user: ' + error,
      error: '',
    };
  }
};

export default updateClerkUser;
