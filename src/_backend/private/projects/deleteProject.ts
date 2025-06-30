'use server';
import { APIResponse } from '@/_backend/models/response';
import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';

export const deleteProject = async (
  id: string,
): Promise<APIResponse<null> | null> => {
  const endpoint = `${url}/delete-flow?flow_id=${id}`;

  try {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(endpoint, {
      method: 'POST',
      // body:JSON.stringify({})
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.statusText}`);
    }

    const json: APIResponse<null> = await res.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error('❌ Error fetching project files:', error);
    return null;
  }
};

export default deleteProject;
