import React from 'react';
import '@xyflow/react/dist/style.css';
import { ReactFlowProvider } from '@xyflow/react';
import FlowCanvas from '@/components/ui/flow/flow-canvas';

export default async function Flow({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <ReactFlowProvider>
      <FlowCanvas slug={slug} />
    </ReactFlowProvider>
  );
}
