import React, { memo, ReactNode, useEffect, useState } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { SystemNode } from '@/backend/getSystemNodes';
import CustomHandle from '../handles/custom-handle';

type UnionType = SystemNode & { delete: ReactNode };

const DNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  const [nodeData, setNodeData] = useState<UnionType>();
  useEffect(() => {
    setNodeData(data as unknown as UnionType);
  }, [data]);

  return (
    <div
      className="
      w-[200px]
      p-3 py-5
      border-1 border-red-400
      m-5
      rounded-lg
    ">
      <CustomHandle
        connectionCount={1}
        type="target"
        position={Position.Top}
        onConnect={params => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
        style={{
          backgroundColor: 'var(--color-cyan-400)',
        }}
      />

      <div className="flex justify-center items-center">
        <div>
          <p className="text-[16px] text-red-400">{data?.label}</p>
          <p className="text-[8px] text-red-400">{data?.description}</p>
        </div>
        {nodeData?.delete}
      </div>
      <CustomHandle
        connectionCount={1}
        style={{
          backgroundColor: 'var(--color-cyan-400)',
        }}
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export const Feature1 = memo(DNode);
