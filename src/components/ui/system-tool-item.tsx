import { NodeCategory, SystemNode } from '@/backend/getSystemNodes';

import clsx from 'clsx';
import {
  CirclePowerIcon,
  Cog,
  Pickaxe,
  Play,
  SignpostBig,
  Wrench,
} from 'lucide-react';
import { motion } from 'framer-motion';
type SystemToolItemProps = {
  onAddNode: (node: SystemNode) => void;
  node: SystemNode;
};

const typeToBGColor = (category: NodeCategory) => {
  switch (category) {
    case 'action':
      return 'bg-gradient-to-tl from-cyan-950 to-cyan-900';
    case 'close':
      return 'bg-gradient-to-tl from-orange-950 to-orange-900';
    case 'conditional':
      return 'bg-gradient-to-tl from-lime-950 to-lime-900';
    case 'generate':
      return 'bg-gradient-to-tl from-cyan-950 to-cyan-900';
    case 'initiate':
      return 'bg-gradient-to-tl from-emerald-950 to-emerald-900';
    default:
      return 'bg-gradient-to-tl from-zinc-950 to-zinc-900';
  }
};

const typeToIcon = (category: NodeCategory) => {
  switch (category) {
    case 'action':
      return <Pickaxe className="h-[22px] w-[22px]" />;
    case 'close':
      return <CirclePowerIcon className="h-[22px] w-[22px]" />;
    case 'conditional':
      return <SignpostBig className="h-[22px] w-[22px]" />;
    case 'generate':
      return <Cog className="h-[22px] w-[22px]" />;
    case 'initiate':
      return <Play className="h-[22px] w-[22px]" />;
    default:
      return <Wrench className="h-[22px] w-[22px]" />;
  }
};
const typeToTextColor = (category: NodeCategory) => {
  switch (category) {
    case 'action':
      return 'text-cyan-300';
    case 'close':
      return 'text-orange-300';
    case 'conditional':
      return 'text-lime-300';
    case 'generate':
      return 'text-cyan-300';
    case 'initiate':
      return 'text-emerald-300';
    default:
      return 'text-zinc-300';
  }
};
const typeToDescTextColor = (category: NodeCategory) => {
  switch (category) {
    case 'action':
      return 'text-cyan-500';
    case 'close':
      return 'text-orange-300';
    case 'conditional':
      return 'text-lime-500';
    case 'generate':
      return 'text-cyan-500';
    case 'initiate':
      return 'text-emerald-500';
    default:
      return 'text-zinc-500';
  }
};

export const SystemToolItem = ({ onAddNode, node }: SystemToolItemProps) => {
  // w-full

  const classes = clsx(
    'w-[100%] h-[70px]  flex items-center gap-2',
    `text-left border-0 border-zinc-400`,
    'p-2 text-xs transition-all duration-100 ease-in-out',
    typeToBGColor(node.category),
    typeToTextColor(node.category),
  );

  const descriptionTextClass = clsx(
    'font-xs',
    typeToDescTextColor(node.category),
  );
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={classes}
      onClick={() => onAddNode(node)}>
      {typeToIcon(node.category)}
      <div>
        <p className={'text-sm font-medium'}>{node.name}</p>
        <p className={descriptionTextClass}>{node.description}</p>
      </div>
    </motion.div>
  );
};
