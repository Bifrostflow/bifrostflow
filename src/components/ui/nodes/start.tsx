import React, { memo, ReactNode, useEffect, useState } from 'react';
import { NodeProps, Position, useReactFlow } from '@xyflow/react';
import { SystemTool, SystemToolType } from '@/_backend/getSystemTools';
import CustomHandle from '../handles/custom-handle';
import { Typography } from '../typography';
import { Button } from '../button';
import { X } from 'lucide-react';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';

import { useThemeToggle } from '@/hooks/theme-toggle';
import { motion } from 'framer-motion';

import { useHapticSound } from '@/hooks/useHapticSound';
import { useFlow } from '@/context/flow-context';
import { useNodeLoader } from '@/hooks/use-node-loader';
import { cn } from '@/lib/utils';
type UnionType = SystemTool & { delete: ReactNode };

export const typeToIconInitiate = (type: SystemToolType): IconName => {
  switch (type) {
    case 'on_speech':
      return 'mic';
    case 'on_prompt':
      return 'message-square';
    case 'on_start':
    default:
      return 'play';
  }
};

const InitiateNodeComp: React.FC<NodeProps> = ({ data, isConnectable }) => {
  const { setToolDrawerOpen } = useFlow();
  const { theme } = useThemeToggle();
  const [nodeData, setNodeData] = useState<UnionType>();
  const { setNodes, setEdges } = useReactFlow();
  useEffect(() => {
    setNodeData(data as unknown as UnionType);
  }, [data]);

  const onDeleteHandler = () => {
    setEdges(eds =>
      eds.filter(
        edge =>
          edge.source !== nodeData?.node_id &&
          edge.target !== nodeData?.node_id,
      ),
    );
    setNodes(nds => nds.filter(node => node.id !== nodeData?.node_id));
  };
  const play = useHapticSound('/node-drag.wav', 0.1);
  const { isLoading } = useNodeLoader(nodeData);
  //   emerald
  return (
    <motion.div
      onClick={() => {
        setToolDrawerOpen(true);
      }}
      drag
      dragListener={true} // default true
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragEnd={() => {
        play();
      }}
      className="group 
      
      shadow-sm 
      active:shadow-lg 
      shadow-gray-500/80 
    dark:shadow-gray-950 


      dark:bg-zinc-800 
      active:bg-zinc-200
      bg-zinc-100 

      p-2 
      rounded-xl 
      max-w-fit
      min-w-[180px] 

      border-1
       dark:border-zinc-500 
       border-emerald-600 
       dark:hover:border-emerald-600 
       hover:border-emerald-500 
       transition-all 
       duration-100 
       rounded-b-none
       flex flex-row
       items-center
       gap-2
       ease-linear">
      {nodeData?.category && (
        <DynamicIcon
          name={isLoading ? 'loader-2' : typeToIconInitiate(nodeData?.type)}
          className={cn('text-emerald-600  ', isLoading ? 'animate-spin' : '')}
        />
      )}
      <div className="flex justify-between items-center ">
        <div className=" flex flex-col">
          <div className="flex-row flex justify-start items-center gap-1 ">
            <Typography
              variant={'h4'}
              className="dark:text-zinc-400 text-zinc-500 group-hover:text-emerald-600 text-[14px] dark:group-hover:text-emerald-600">
              {nodeData?.name}
            </Typography>
          </div>
          <Button
            size="sm"
            variant={'ghost'}
            className="hover:shadow-none dark:hover:bg-transparent hover:bg-transparent shadow-none absolute top-[-2px] right-[-2px] "
            onClick={onDeleteHandler}>
            <X size={8} />
          </Button>
          <Typography
            variant={'p'}
            className="text-[8px] dark:text-zinc-400 text-zinc-500 whitespace-pre-wrap break-words font-medium tracking-normal truncate overflow-hidden text-ellipsis pr-4 dark:group-hover:text-emerald-600 group-hover:text-emerald-700 transition-all duration-100 ease-linear">
            {nodeData?.description}
          </Typography>
          {nodeData?.gpt_model && (
            <Typography
              className="text-[10px] group-hover:text-emerald-500 dark:group-hover:text-emerald-600 dark:text-zinc-400 text-zinc-500 capitalize font-semibold mt-1"
              variant={'p'}>
              {nodeData?.llm.replaceAll('-', ' ')} :{' '}
              <span className="uppercase">{nodeData?.gpt_model}</span>
            </Typography>
          )}
        </div>
      </div>
      <CustomHandle
        connectionCount={1}
        style={{
          backgroundColor:
            theme == 'dark'
              ? 'var(--color-emerald-600)'
              : 'var(--color-emerald-800)',
        }}
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </motion.div>
  );
};

export const InitiateNode = memo(InitiateNodeComp);
