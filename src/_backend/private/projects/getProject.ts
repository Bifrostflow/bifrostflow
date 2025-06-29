'use server';
import { APIResponse } from '@/_backend/models/response';
import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';

export interface ProjectWithStatus {
  id: string;
  name: string;
  description: string | null;
  created_at: string; // ISO 8601 timestamp
  status: 'touched' | 'not_touched';
}

export const getProject = async (
  id: string,
): Promise<APIResponse<Omit<ProjectWithStatus, 'status'>[]> | null> => {
  const endpoint = `${url}/flow?flow_id=${id}`;
  console.log(endpoint);

  try {
    const { getToken } = await auth(); // 👈 SSR-safe
    const token = await getToken();

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.statusText}`);
    }

    const json: APIResponse<Omit<ProjectWithStatus, 'status'>[]> =
      await res.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error('❌ Error fetching project files:', error);
    return null;
  }
};

export default getProject;
