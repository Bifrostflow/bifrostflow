'use server';

import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';
import { APIResponse } from '@/_backend/models/response';

interface GraphResponse {
  node_id: string;
  nodes_data: string;
  edge_id: string;
  edges_data: string;
  edges_api_keys: string;
}

export const getNodesForFlow = async (
  flow_id: string,
): Promise<APIResponse<GraphResponse>> => {
  const endpoint = `${url}/load-nodes?flow_id=${flow_id}`;
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return { data: null, error: '', isSuccess: false, message: '' };
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error Updated Nodes', error);
    return { data: null, error: '', isSuccess: false, message: '' };
  }
};
