import React from 'react';
import '@xyflow/react/dist/style.css';
import { Edge, Node, ReactFlowProvider } from '@xyflow/react';
import { getNodesForFlow } from '@/_backend/private/projects/getNodesForFlow';
import FlowContextWrapper from './flow-context-wrapper';
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
  // get graph
  try {
    const loadGraph = async () => {
      try {
        const response = await getNodesForFlow(slug);
        if (!response.data) {
          return { nodes: [start_point], edges: [] };
        }

        let serverNodes = JSON.parse(response.data.nodes);
        serverNodes = serverNodes.data || [start_point];

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
    const { edges, nodes, apiKeys } = await loadGraph();

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
    return (
      <ReactFlowProvider>
        <FlowContextWrapper
          apiKeys={{}}
          slug={slug}
          initialEdges={[]}
          initialNodes={[start_point]}
        />
      </ReactFlowProvider>
    );
  }
}
