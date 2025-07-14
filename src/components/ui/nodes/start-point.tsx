import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { Typography } from '../typography';
import { DynamicIcon } from 'lucide-react/dynamic';
import { motion } from 'framer-motion';
import { useHapticSound } from '@/hooks/useHapticSound';
import { useFlow } from '@/context/flow-context';

const StartPointNodeComp: React.FC<NodeProps> = ({}) => {
  const { setToolDrawerOpen } = useFlow();

  const play = useHapticSound('/node-drag.wav', 0.1);
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
      py-2 
      px-4
      bg-gradient-to-r
      from-c-primary to-c-primary-variant
  rounded-full
">
      <div className="flex-row flex justify-start items-center gap-1">
        <DynamicIcon
          name={'plus'}
          className="text-c-on-primary"
          size={22}
          fill="var(--chart-2)"
        />
        <Typography variant={'h4'} className="text-c-on-primary text-[14px]">
          Start
        </Typography>
      </div>
    </motion.div>
  );
};

export const StartPointNode = memo(StartPointNodeComp);
