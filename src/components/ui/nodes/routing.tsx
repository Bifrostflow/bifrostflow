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
import { useNodeLoader } from '@/hooks/use-node-loader';
import { cn } from '@/lib/utils';
type UnionType = SystemTool & { delete: ReactNode };

const RoutingNodeComp: React.FC<NodeProps> = ({ data, isConnectable }) => {
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
  //   cyan
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
        'group shadow-sm active:shadow-lg shadow-gray-500/80 dark:shadow-gray-950 dark:bg-zinc-800 active:bg-zinc-200 bg-zinc-100 p-2 rounded-lg max-w-3xs min-w-3xs border-1 dark:border-zinc-500 border-cyan-600 dark:hover:border-cyan-500 hover:border-cyan-500 transition-all duration-100 ease-linear',
        isLoading ? 'dark:border-cyan-500' : '',
      )}>
      <CustomHandle
        connectionCount={1}
        type="target"
        position={Position.Top}
        onConnect={params => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
        style={{
          backgroundColor:
            theme == 'dark' ? 'var(--color-cyan-300)' : 'var(--color-cyan-600)',
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
                    'dark:group-hover:text-cyan-500 group-hover:text-cyan-600 text-zinc-500 dark:text-zinc-400',
                    isLoading
                      ? 'animate-spin dark:text-cyan-500 text-cyan-600'
                      : '',
                  )}
                  size={16}
                />
              )}
              <Typography
                variant={'h4'}
                className={cn(
                  'dark:group-hover:text-cyan-500 text-zinc-500 dark:text-zinc-400 group-hover:text-cyan-600 text-[14px]',
                  isLoading ? 'dark:text-cyan-500 text-cyan-600' : '',
                )}>
                {nodeData?.name}
              </Typography>
            </div>
            <Button
              size="sm"
              variant={'ghost'}
              className="hover:shadow-none hover:bg-transparent dark:hover:bg-transparent shadow-none absolute top-[-2px] right-[-2px] "
              onClick={onDeleteHandler}>
              <X size={8} />
            </Button>
          </div>
          <Typography
            variant={'p'}
            className={cn(
              'text-[8px] text-zinc-500 dark:text-zinc-400 whitespace-pre-wrap break-words font-medium tracking-normal truncate overflow-hidden text-ellipsis w-3xs pr-4 dark:group-hover:text-cyan-500 group-hover:text-cyan-700 transition-all duration-100 ease-linear',
              isLoading ? 'dark:text-cyan-500 text-cyan-700' : '',
            )}>
            {nodeData?.description}
          </Typography>
          {nodeData?.gpt_model && (
            <Typography
              className={cn(
                'text-[10px] group-hover:text-cyan-500 text-zinc-500 dark:text-zinc-400 capitalize font-semibold mt-1',
                isLoading ? 'text-cyan-500' : '',
              )}
              variant={'p'}>
              {nodeData?.llm.replaceAll('-', ' ')} :{' '}
              <span className="uppercase">{nodeData?.gpt_model}</span>
            </Typography>
          )}
          {/* <div className="flex-col p-1 justify-center gap-2 items-center hidden group-hover:flex absolute -right-12 top-0  h-full">
            <Button
              size="icon"
              variant={'destructive'}
              onClick={onDeleteHandler}>
              <Trash size={10} className="text-[10px]" />
            </Button>
          </div> */}
        </div>
      </div>
      <CustomHandle
        connectionCount={2}
        style={{
          backgroundColor:
            theme == 'dark' ? 'var(--color-cyan-600)' : 'var(--color-cyan-800)',
        }}
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </motion.div>
  );
};

export const RoutingNode = memo(RoutingNodeComp);
