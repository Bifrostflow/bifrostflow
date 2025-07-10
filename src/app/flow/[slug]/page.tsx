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
          return { nodes: [start_point], edges: [], isSuccess: false };
        }
        const finalNodes: Node[] = [];
        const finalEdges: Edge[] = [];

        // extract edge
        if (!!response.data.edges) {
          try {
            let parsedEdge = JSON.parse(response.data.edges);
            parsedEdge = parsedEdge?.data.map((edge: Edge) => ({
              tool_input: null,
              ...edge,
            }));
            finalEdges.push(...parsedEdge);
          } catch (error) {
            console.log(error);
          }
        }

        // extract nodes
        if (response.data.nodes) {
          try {
            let parsedNodes = JSON.parse(response.data.nodes);
            parsedNodes =
              (parsedNodes.data as Node[]) || ([start_point] as Node[]);
            for (let i = 0; i < parsedNodes.length; i++) {
              const node = parsedNodes[i];
              if (node.data.id) {
                const nodeInfo = await getSystemToolsByID(
                  node.data.id as string,
                );

                node.data = {
                  ...node.data,
                  ...nodeInfo,
                };

                finalNodes.push(node);
              }
            }
          } catch (error) {
            console.log(error);
            finalNodes.push(start_point);
          }
        } else {
          finalNodes.push(start_point);
        }
        let finalAPIKeys = {};
        if (response.data.api_keys) {
          try {
            finalAPIKeys = JSON.parse(response.data.api_keys) || {};
          } catch (error) {
            console.log(error);
            finalAPIKeys = {};
          }
        }

        return {
          nodes: finalNodes || [start_point],
          edges: finalEdges || [],
          apiKeys: finalAPIKeys,
          isSuccess: true,
        };
      } catch (error) {
        console.log('ERROR ONE: ', error);
        redirect('/home');
        return { isSuccess: false };
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
          initialEdges={edges || []}
          initialNodes={nodes || [start_point]}
          slug={slug}
        />
      </ReactFlowProvider>
    );
  } catch (_e) {
    console.log('ERROR: ', _e);
    return redirect('/home');
  }
}
