'use server';

import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';
import { APIResponse } from '@/_backend/models/response';

interface UpdateFlowKeys {
  apiKeys: string;
  flow_id: string;
}

export const updateFlowKeys = async (
  data: UpdateFlowKeys,
): Promise<APIResponse<null> | null> => {
  const endpoint = `${url}/update-flow-keys`;
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
      throw new Error('Failed to update keys');
    }

    const json = await res.json();

    return json;
  } catch (error) {
    console.error('Error updating keys', error);
    return null;
  }
};
