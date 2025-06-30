'use server';

import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';
import { APIResponse } from '@/_backend/models/response';

interface UpdateFlowGraph {
  nodes: string;
  edges: string;
  flow_id: string;
}

export const updateFlowGraph = async (
  data: UpdateFlowGraph,
): Promise<APIResponse<null> | null> => {
  const endpoint = `${url}/update-flow-graph`;
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
      throw new Error('Failed to create project');
    }

    const json = await res.json();

    return json;
  } catch (error) {
    console.error('Error Updated Nodes', error);
    return null;
  }
};
