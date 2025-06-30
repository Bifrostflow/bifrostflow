'use server';
import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';
import { Edge } from '@xyflow/react';

interface ResponseFlow {
  type: null;
  messages: string[];
  meta: string;
}

export type MetaTypes = 'evaluate_code' | 'other';

export interface EnhancedResponse<T> {
  type: null;
  metaType?: MetaTypes;
  messages: string[];
  meta: T;
}

export interface CodeEvaluate {
  rating: number;
  is_code: boolean;
  remark: string;
  type: MetaTypes;
}

const responseHandler = <T>(response: ResponseFlow): EnhancedResponse<T> => {
  if (response.meta.length > 1) {
    const metaData = JSON.parse(response.meta);
    return {
      messages: response.messages,
      meta: metaData as T,
      type: null,
      metaType: metaData.type,
    };
  } else {
    return {
      messages: response.messages,
      meta: response.meta as T,
      type: response.type,
      metaType: undefined,
    };
  }
};

export const runFlowWithInput = async <T>(request: {
  input: string;
  data: Edge[];
}): Promise<EnhancedResponse<T>> => {
  const endpoint = `${url}/run-flow`;

  try {
    const { getToken } = await auth();
    const token = await getToken();
    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch project files');
    }

    const json: ResponseFlow = await res.json();
    return responseHandler(json);
  } catch (error) {
    console.error('Error fetching project files:', error);
    throw new Error('Failed to load project files');
  }
};
