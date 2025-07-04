'use server';
import { url } from '@/lib/path';

export type SystemToolType =
  | 'start'
  | 'end'
  | 'classify_message'
  | 'evaluate_code'
  | 'write_message'
  | 'write_mail_and_send'
  | 'write_code'
  | 'route_query'
  | string;

export type ToolCategory =
  | 'conditional'
  | 'action'
  | 'generate'
  | 'initiate'
  | 'close';

export interface SystemTool {
  id: string;
  name: string;
  type: SystemToolType;
  gpt_model: string;
  llm: string;
  description: string;
  what_i_do: string;
  category: ToolCategory;
  state: 'active' | 'inactive';
  require_key: boolean;
  key_name: string | null;
  input_type: 'none' | 'string' | 'url' | 'pdf' | 'image' | 'object';
  object_schema: string | null;
}

export type SystemTools = SystemTool[];

export const getSystemTools = async (): Promise<SystemTools> => {
  const endpoint = `${url}/system-tools`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      return [];
    }
    const json: SystemTools = await res.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error('Error fetching project files:', error);
    return [];
  }
};

export const getSystemToolsByID = async (
  id: string,
): Promise<SystemTool | null> => {
  const endpoint = `${url}/system-tools/${id}`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      return null;
    }
    const json: SystemTool = await res.json();
    return json;
  } catch (error) {
    console.error('Error fetching project files:', error);
    return null;
  }
};
