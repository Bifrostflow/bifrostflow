import React, { memo, ReactNode, useEffect, useState } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { SystemNode } from '@/_backend/getSystemNodes';
import CustomHandle from '../handles/custom-handle';

type UnionType = SystemNode & { delete: ReactNode };

const ENode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  const [nodeData, setNodeData] = useState<UnionType>();
  useEffect(() => {
    setNodeData(data as unknown as UnionType);
  }, [data]);

  // bg-[#f1f5f9]
  return (
    <div
      className="
    rounded-bl-lg
    rounded-br-lg
    rounded-0
    px-3 py-1
    shadow-lg
    transition-all duration-100 ease-[cubic-bezier(0.34, 1.56, 0.64, 1)]
    border 
    border-red-400
    bg-zinc-900
    active:bg-zinc-800
    ">
      <CustomHandle
        connectionCount={2}
        style={{
          backgroundColor: 'var(--color-red-400)',
          border: 0,
        }}
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="flex justify-between items-center gap-2">
        <p className="text-[10px] text-red-400">End</p>
        {nodeData?.delete}
      </div>
    </div>
  );
};

export const EndNode = memo(ENode);
