import { Edge, Node } from '@xyflow/react';
import React from 'react';
import { FlowProvider } from './flow-context';
import FlowCanvas from '@/components/ui/flow/flow-canvas';
import { APIData } from '@/components/ui/flow/enter-keys-area';

function FlowContextWrapper({
  slug,
  initialEdges,
  initialNodes,
  apiKeys,
}: {
  apiKeys: APIData;
  slug: string;
  initialNodes: Node[];
  initialEdges: Edge[];
}) {
  return (
    <FlowProvider
      defaultEdges={initialEdges}
      defaultNodes={initialNodes}
      apiKeys={apiKeys}
      slug={slug}>
      <FlowCanvas />
    </FlowProvider>
  );
}

export default FlowContextWrapper;
