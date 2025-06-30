import React from 'react';
import '@xyflow/react/dist/style.css';
import { Edge, Node, ReactFlowProvider } from '@xyflow/react';
import FlowCanvas from '@/components/ui/flow/flow-canvas';
import { getNodesForFlow } from '@/_backend/private/projects/getNodesForFlow';
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
        let serverNodes = JSON.parse(response.data.nodes_data);
        serverNodes = serverNodes ? JSON.parse(serverNodes) : [];

        let serverEdges = JSON.parse(response.data.edges_data);
        serverEdges = serverEdges ? JSON.parse(serverEdges) : [];
        serverEdges = serverEdges.map((edge: Edge) => ({
          tool_inout: null,
          ...edge,
        }));
        return {
          nodes: serverNodes.data || [start_point],
          edges: serverEdges.data || [],
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return { nodes: [start_point], edges: [] };
      }
    };
    const { edges, nodes } = await loadGraph();

    return (
      <ReactFlowProvider>
        <FlowCanvas initialEdges={edges} initialNodes={nodes} slug={slug} />
      </ReactFlowProvider>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    return (
      <ReactFlowProvider>
        <FlowCanvas
          slug={slug}
          initialEdges={[]}
          initialNodes={[start_point]}
        />
      </ReactFlowProvider>
    );
  }
}
