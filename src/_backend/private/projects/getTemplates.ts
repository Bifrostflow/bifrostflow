'use server';
import { APIResponse } from '@/_backend/models/response';
import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';

type ToolRef = {
  id: string;
  name: string;
  description: string;
};

// type JSONSchema = {
//   type: string;
//   properties: Record<string, any>;
//   required?: string[];
// };

// Uncomment if needed later
// type APIConfig = {
//   apiKeyRequired: boolean;
//   keysRequired: string[];
//   endpoint: string;
//   rateLimit?: string;
// };

type Graph = {
  nodes: string;
  edges: string;
};

export type FlowTemplate = {
  id: string;
  name: string;
  description: string;
  category:
    | 'social-media'
    | 'office'
    | 'software-development'
    | 'writing'
    | 'communication'
    | 'blogging';
  icon?: string;
  visibility: 'public' | 'private' | 'draft';

  createdBy: string;
  createdAt: string;
  updatedAt: string;

  graph: Graph;

  toolsUsed: ToolRef[];
  systemToolsUsed: ToolRef[];

  inputSchema?: null;
  outputSchema?: string | null;
  isSellable: boolean;
  price?: number | null;
  keywords: string[];
  tags: string[];
  version: string;
};

export const getTemplates = async (): Promise<APIResponse<
  FlowTemplate[]
> | null> => {
  const endpoint = `${url}/templates`;

  try {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.statusText}`);
    }

    const json: APIResponse<FlowTemplate[]> = await res.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(`❌ Error fetching templates:`, error);
    return null;
  }
};

export const getTemplateById = async (
  id: string,
): Promise<APIResponse<FlowTemplate> | null> => {
  const endpoint = `${url}/template?template_id=${id}`;

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
      throw new Error(`Failed to fetch template ${id}: ${res.statusText}`);
    }

    const json: APIResponse<FlowTemplate> = await res.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error('❌ Error fetching project files:', error);
    return null;
  }
};

export default getTemplates;
