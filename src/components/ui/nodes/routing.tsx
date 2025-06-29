import React, { memo, ReactNode, useEffect, useState } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { SystemTool } from '@/_backend/getSystemTools';
import CustomHandle from '../handles/custom-handle';

type UnionType = SystemTool & { delete: ReactNode };

const RNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  const [nodeData, setNodeData] = useState<UnionType>();
  useEffect(() => {
    setNodeData(data as unknown as UnionType);
  }, [data]);

  return (
    <div
      className="
     rounded-2xl
    px-3 py-1
    shadow-lg
    transition-all duration-100 ease-[cubic-bezier(0.34, 1.56, 0.64, 1)]
    border 
     bg-zinc-900
    border-lime-400
    active:bg-zinc-800
    ">
      <div className="flex justify-between items-center gap-2">
        <CustomHandle
          connectionCount={1}
          style={{
            backgroundColor: 'var(--color-lime-400)',
          }}
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
        />
        <div>
          <p className="text-[10px] text-lime-400">{nodeData?.name}</p>
          <p className="text-[6px] text-lime-400">{nodeData?.description}</p>
        </div>
        {nodeData?.delete}
      </div>
      <CustomHandle
        connectionCount={2}
        style={{
          backgroundColor: 'var(--color-lime-400)',
        }}
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export const RoutingNode = memo(RNode);
