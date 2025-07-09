import React from 'react';
import '@xyflow/react/dist/style.css';
import { Edge, Node, ReactFlowProvider } from '@xyflow/react';
import { getNodesForFlow } from '@/_backend/private/projects/getNodesForFlow';
import FlowContextWrapper from './flow-context-wrapper';
import { getSystemToolsByID } from '@/_backend/getSystemTools';
import { redirect } from 'next/navigation';
const start_point: Node = {
  id: '0-start_point',
  type: 'start_point',
  data: {
    label: '',
    category: 'start-point',
  },
  position: { x: 250, y: 250 },
  draggable: false,
};

export default async function Flow({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const loadGraph = async () => {
      try {
        const response = await getNodesForFlow(slug);
        if (!response.isSuccess) {
          return null;
        }
        if (!response.data) {
          return { nodes: [start_point], edges: [] };
        }

        const parsedServerNodes = JSON.parse(response.data.nodes);
        const serverNodes: Node[] =
          (parsedServerNodes.data as Node[]) || ([start_point] as Node[]);
        const hydratedNodes = [];
        for (let i = 0; i < serverNodes.length; i++) {
          const node = serverNodes[i];
          const nodeInfo = await getSystemToolsByID(node.data.id as string);

          node.data = {
            ...node.data,
            ...nodeInfo,
          };

          hydratedNodes.push(node);
        }
        let serverEdges = JSON.parse(response.data.edges);
        serverEdges = serverEdges.data.map((edge: Edge) => ({
          tool_input: null,
          ...edge,
        }));
        const apiKeys = JSON.parse(response.data.api_keys) || {};

        return {
          nodes: serverNodes || [start_point],
          edges: serverEdges || [],
          apiKeys,
        };
      } catch (error) {
        console.log('ERROR ONE: ', error);
        return { nodes: [start_point], edges: [], apiKeys: {} };
      }
    };
    const loadedresponse = await loadGraph();
    if (!loadedresponse) {
      return redirect('/home');
    }
    const { edges, nodes, apiKeys } = loadedresponse;

    return (
      <ReactFlowProvider>
        <FlowContextWrapper
          apiKeys={apiKeys || {}}
          initialEdges={edges}
          initialNodes={nodes}
          slug={slug}
        />
      </ReactFlowProvider>
    );
  } catch (_e) {
    console.log('ERROR: ', _e);
    return redirect('/home');
  }
}
