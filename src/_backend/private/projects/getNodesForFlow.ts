'use server';

import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';
import { APIResponse } from '@/_backend/models/response';

interface GraphResponse {
  nodes: string;
  edges: string;
  api_keys: string;
  name: string;
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

export interface IFlowDocument {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
    lastModified: string;
    contentLength: number;
    httpStatusCode: number;
  };
}

export const getDocsForFlow = async (
  flow_id: string,
): Promise<APIResponse<IFlowDocument[]>> => {
  const endpoint = `${url}/get-flow-docs?flow_id=${flow_id}`;
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(endpoint, {
      method: 'GET',
      next: {
        revalidate: 60,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return { data: null, error: '', isSuccess: false, message: '' };
    }

    const json = await res.json();
    console.log('RESPONSE: ', json);

    return json;
  } catch (error) {
    console.error('Error Updated Nodes', error);
    return { data: null, error: '', isSuccess: false, message: '' };
  }
};

export const openDocForFlow = async (
  flow_id: string,
  name: string,
): Promise<APIResponse<IFlowDocument[]>> => {
  const endpoint = `${url}/open-doc?flow_id=${flow_id}&name=${name}`;
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(endpoint, {
      method: 'GET',
      next: {
        revalidate: 60,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return { data: null, error: '', isSuccess: false, message: '' };
    }

    const json = await res.json();
    console.log('RESPONSE: ', json);

    return json;
  } catch (error) {
    console.error('Error Updated Nodes', error);
    return { data: null, error: '', isSuccess: false, message: '' };
  }
};
