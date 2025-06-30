import { motion } from 'framer-motion';
import { OnPrompt } from './initiator/on_prompt';
import { Edge } from '@xyflow/react';

interface IProps {
  onClose: () => void;
  edges: Edge[];
  initiatorType?: 'on_prompt' | string;
  visible: boolean;
  flow_id: string;
}

export const DraggablePanel = ({
  initiatorType,
  edges,
  onClose,
  visible,
  flow_id,
}: IProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`p-3 bg-zinc-700 rounded-2xl m-1 border-2 border-zinc-400 w-[300px] z-[10000]
            absolute
            bottom-5
          left-5
          transform transition-transform duration-300
          ${visible ? 'translate-y-0' : 'translate-y-100'}
        `}>
      {initiatorType === 'on_prompt' && (
        <OnPrompt flow_id={flow_id} onClose={onClose} edges={edges} />
      )}
    </motion.div>
  );
};
