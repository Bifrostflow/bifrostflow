import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { PlusIcon } from 'lucide-react';

const SPNode: React.FC<NodeProps & { onPress: () => void }> = ({ onPress }) => {
  return (
    <div
      className={`
                        bg-gradient-to-br from-cyan-600 to-blue-700
                        hover:from-cyan-700
                        hover:to-blue-700
                        active:from-cyan-600
                        active:to-blue-600
                        text-blue-100
                        rounded-sm
                        px-2 py-1
                        shadow-lg
                        border-0 
                        active:scale-[1.03]
                        text-[6px] font-medium
                        transition-all duration-100 ease-[cubic-bezier(0.34, 1.56, 0.64, 1)]
  `}>
      <div
        className="text-xs font-semibold text-blue-100 flex justify-between items-center"
        onClick={onPress}>
        Start
        <PlusIcon className="h-[12px] w-[12px] ml-1 text-blue-100" />
      </div>
    </div>
  );
};

export const StartPointNode = memo(SPNode);
