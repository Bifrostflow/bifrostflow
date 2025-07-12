'use server';
import { url } from '@/lib/path';
import print from '@/lib/print';
import { auth } from '@clerk/nextjs/server';
import { Edge } from '@xyflow/react';

export interface ResponseFlow {
  type: null;
  messages: string[];
  meta: string;
}

export type MetaTypes = 'evaluate_code' | 'code_documentation' | 'other';

export interface MetaForNode {
  node_id: string;
  type: string;
}

export interface CodeEvaluate extends MetaForNode {
  rating: number;
  is_code: boolean;
  remark: string;
  code: string;
  type: 'evaluate_code';
}

export interface CodeDocumentation extends MetaForNode {
  content: string;
  file_name_without_extension: string;
  response_message: string;
  type: 'code_documentation';
}

export interface Other extends MetaForNode {
  type: 'other';
}

type RunFlowInput = {
  input: string;
  data: Edge[];
  flow_id: string;
};

interface ChunkNodeData {
  node_graph_id: string;
  node_input: string | null;
  next_nodes: string[] | null;
}

type Meta = CodeEvaluate | CodeDocumentation | Other;

export type LLMMessageType = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export interface ChunkResponse {
  messages: LLMMessageType;
  meta?: Meta;
  type: null | string;
}
export interface ChunkResponseData {
  node_data: ChunkNodeData;
  response: ChunkResponse;
  ui_response: string;
  error?: string;
}

export async function* runFlowWithInput({
  input,
  data,
  flow_id,
}: RunFlowInput) {
  const endpoint = `${url}/run-flow`;

  try {
    const { getToken } = await auth();
    const token = await getToken();
    print(JSON.stringify({ input, data, flow_id, input_type: 'none' }));
    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ input, data, flow_id }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error('Failed to run flow');
    if (!res.body) throw new Error('Empty response body');

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    const finalResponse = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim().startsWith('data:')) {
          try {
            const chunk: ChunkResponseData = JSON.parse(
              line.replace('data: ', ''),
            );
            finalResponse.push(chunk);
            yield chunk;
          } catch (err) {
            console.error('Failed to parse stream chunk', err);
          }
        }
      }
    }
    return finalResponse;
  } catch (err) {
    console.error('Stream Error:', err);
    throw err;
  }
}
