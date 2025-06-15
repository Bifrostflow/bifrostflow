import { url } from '@/lib/path';
import { Edge } from '@xyflow/react';

interface ResponseFlow {
  type: null;
  message: string;
  meta: string;
}

export type MetaTypes = 'evaluate_code' | 'other';

export interface EnhancedResponse<T> {
  type: null;
  metaType?: MetaTypes;
  message: string;
  meta: T;
}

export interface CodeEvaluate {
  rating: number;
  is_code: boolean;
  remark: string;
  type: MetaTypes;
}

const responseHandler = <T>(response: ResponseFlow): EnhancedResponse<T> => {
  if (!!response.meta.length) {
    const metaData = JSON.parse(response.meta);
    return {
      message: response.message,
      meta: metaData as T,
      type: null,
      metaType: metaData.type,
    };
  } else {
    return {
      message: response.message,
      meta: response.meta as T,
      type: response.type,
    };
  }
};

export const runFlowWithInput = async <T>(request: {
  input: string;
  data: Edge[];
}): Promise<EnhancedResponse<T>> => {
  const endpoint = `${url}/run-flow`;

  try {
    const res = await fetch(endpoint, {
      body: JSON.stringify(request),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch project files');
    }

    const json: ResponseFlow = await res.json();
    console.log(json);
    return responseHandler(json);
  } catch (error) {
    console.error('Error fetching project files:', error);
    throw new Error('Failed to load project files');
  }
};
