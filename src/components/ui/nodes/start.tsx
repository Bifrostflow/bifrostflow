import React, { memo, ReactNode, useEffect, useState } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { SystemTool } from '@/_backend/getSystemTools';
import CustomHandle from '../handles/custom-handle';

type UnionType = SystemTool & {
  delete: ReactNode;
  executeFlow?: ReactNode;
  onClick: (id: string) => void;
};

const SNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  const [nodeData, setNodeData] = useState<UnionType>();
  useEffect(() => {
    setNodeData(data as unknown as UnionType);
  }, [data]);

  return (
    <div
      onClick={() => nodeData?.onClick(nodeData.id)}
      className={`
          rounded-tl-lg
          rounded-tr-lg
              rounded-0
              px-3 py-1
              shadow-lg
              transition-all duration-100 ease-[cubic-bezier(0.34, 1.56, 0.64, 1)]
              border
            border-emerald-400
            bg-zinc-900
            active:bg-zinc-800
        `}>
      <div className="flex justify-between items-center gap-2">
        <p className="text-[10px] text-emerald-400  whitespace-nowrap overflow-hidden text-ellipsis">
          {nodeData?.name}
        </p>
        {nodeData?.delete}
      </div>
      <CustomHandle
        connectionCount={1}
        style={{
          backgroundColor: 'var(--color-emerald-400)',
        }}
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export const StartNode = memo(SNode);
