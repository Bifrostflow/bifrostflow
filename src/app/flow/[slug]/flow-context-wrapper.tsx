import { Edge, Node } from '@xyflow/react';
import React from 'react';
import { FlowProvider } from '../../../context/flow-context';
import FlowCanvas from '@/components/ui/flow/flow-canvas';
import { APIData } from '@/components/ui/flow/enter-keys-area';
import FlowNav from '@/components/ui/flow/flow-nav';

function FlowContextWrapper({
  slug,
  initialEdges,
  initialNodes,
  apiKeys,
  paramShowRequest,
  name,
}: {
  apiKeys: APIData;
  slug: string;
  name: string;
  initialNodes: Node[];
  initialEdges: Edge[];
  paramShowRequest: 'edit' | 'other' | undefined;
}) {
  return (
    <FlowProvider
      defaultEdges={initialEdges}
      defaultNodes={initialNodes}
      apiKeys={apiKeys}
      slug={slug}
      name={name}
      paramShowRequest={paramShowRequest}>
      <FlowNav />
      <FlowCanvas />
    </FlowProvider>
  );
}

export default FlowContextWrapper;
