import React, { memo, ReactNode, useEffect, useState } from 'react';
import { NodeProps, Position, useReactFlow } from '@xyflow/react';
import { SystemTool } from '@/_backend/getSystemTools';
import CustomHandle from '../handles/custom-handle';
import { Typography } from '../typography';
import { Button } from '../button';
import { X } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { typeToIcon } from '../system-tool-item';
import { useThemeToggle } from '@/hooks/theme-toggle';
import { motion } from 'framer-motion';

import { useHapticSound } from '@/hooks/useHapticSound';
import { useFlow } from '@/context/flow-context';
import { useNodeLoader } from '@/hooks/use-node-loader';
import { cn } from '@/lib/utils';
type UnionType = SystemTool & { delete: ReactNode };

const ActionNodeComp: React.FC<NodeProps> = ({ data, isConnectable }) => {
  const { theme } = useThemeToggle();
  const [nodeData, setNodeData] = useState<UnionType>();
  const { setNodes, setEdges } = useReactFlow();
  const { currentNodeInProcess } = useFlow();
  useEffect(() => {
    console.log(
      'OUT HERE: ',
      currentNodeInProcess?.node_graph_id,
      nodeData?.node_id,
    );

    if (currentNodeInProcess?.node_graph_id === nodeData?.node_id) {
      console.log(
        'LOADING: ',
        currentNodeInProcess?.node_graph_id,
        nodeData?.node_id,
      );
    }
  }, [currentNodeInProcess, nodeData]);

  useEffect(() => {
    setNodeData(data as unknown as UnionType);
  }, [data]);

  const { isLoading } = useNodeLoader(nodeData);

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
  //   green
  return (
    <motion.div
      drag
      dragListener={true} // default true
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragEnd={() => {
        play();
      }}
      className={cn(
        'group shadow-sm active:shadow-lg shadow-gray-500/80 dark:shadow-gray-950  dark:bg-zinc-800 active:bg-zinc-200 bg-zinc-100 p-2 rounded-lg max-w-3xs min-w-3xs border-1 dark:border-zinc-500 border-green-600 dark:hover:border-green-600 hover:border-green-500 transition-all duration-100 ease-linear',
        isLoading
          ? 'dark:border-green-600 border-green-500  animate-pulse'
          : '',
      )}>
      <CustomHandle
        connectionCount={1}
        type="target"
        position={Position.Top}
        onConnect={params => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
        style={{
          backgroundColor:
            theme == 'dark'
              ? 'var(--color-green-300)'
              : 'var(--color-green-600)',
        }}
      />

      <div className="flex justify-between items-center ">
        <div className=" w-full">
          <div className="flex flex-row justify-between items-center gap-1  w-[100%]">
            <div className="flex-row flex justify-start items-center gap-1 ">
              {nodeData?.category && (
                <DynamicIcon
                  name={isLoading ? 'loader-2' : typeToIcon(nodeData.type)}
                  className={cn(
                    'dark:group-hover:text-green-600 group-hover:text-green-600 text-zinc-500 dark:text-zinc-400',
                    isLoading
                      ? 'animate-spin dark:text-green-600 text-green-600'
                      : '',
                  )}
                  size={16}
                />
              )}
              <Typography
                variant={'h4'}
                className={cn(
                  'text-zinc-500 dark:text-zinc-400 dark:group-hover:text-green-600 group-hover:text-green-600 text-[14px]',
                  isLoading ? 'dark:text-green-600 text-green-600' : '',
                )}>
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
          </div>
          <Typography
            variant={'p'}
            className={cn(
              'text-[8px] text-zinc-500 dark:text-zinc-400 whitespace-pre-wrap break-words font-medium tracking-normal truncate overflow-hidden text-ellipsis w-3xs pr-4 dark:group-hover:text-green-600 group-hover:text-green-700 transition-all duration-100 ease-linear',
              isLoading ? 'dark:text-green-600 text-green-700' : '',
            )}>
            {nodeData?.description}
          </Typography>
          {nodeData?.gpt_model && (
            <p className="text-[6px] text-green-400">
              {nodeData?.llm}:{nodeData?.gpt_model}
            </p>
          )}
        </div>
      </div>
      <CustomHandle
        connectionCount={1}
        style={{
          backgroundColor:
            theme == 'dark'
              ? 'var(--color-green-600)'
              : 'var(--color-green-800)',
        }}
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </motion.div>
  );
};

export const ActionNode = memo(ActionNodeComp);
