import { url } from '@/lib/path';

export type SystemNodeType =
  | 'start'
  | 'end'
  | 'classify_message'
  | 'evaluate_code'
  | 'write_message'
  | 'write_mail_and_send'
  | 'write_code'
  | 'route_query'
  | string;

export type NodeCategory =
  | 'conditional'
  | 'action'
  | 'generate'
  | 'initiate'
  | 'close';

export interface SystemNode {
  _id: string;
  name: string;
  type: SystemNodeType;
  gpt_model: string;
  llm: string;
  description: string;
  what_i_do: string;
  category: NodeCategory;
  state: 'active' | 'inactive';
}

export type SystemNodes = SystemNode[];

export const getSystemNodes = async (): Promise<SystemNodes> => {
  const endpoint = `${url}/system-nodes`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error('Failed to fetch project files');
    }
    const json: SystemNodes = await res.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error('Error fetching project files:', error);
    throw new Error('Failed to load project files');
  }
};
