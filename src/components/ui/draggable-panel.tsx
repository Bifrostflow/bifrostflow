import { motion } from 'framer-motion';
import { OnPrompt } from './initiator/on_prompt';
import { Edge } from '@xyflow/react';
import { InitiatorType } from './flow/flow-canvas';
import { useFlow } from '@/context/flow-context';

interface IProps {
  edges: Edge[];
  initiatorType?: InitiatorType;
}

export const DraggablePanel = ({ initiatorType, edges }: IProps) => {
  const { actionPanelVisible, setActionPanelVisible } = useFlow();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`p-3 bg-zinc-700 rounded-2xl m-1 border-2 border-zinc-400 w-[300px] z-[10000]
            absolute
            bottom-0
          left-5
          transform transition-transform duration-300
          ${actionPanelVisible ? 'translate-y-0' : 'translate-y-100'}
        `}>
      {initiatorType === 'on_prompt' && (
        <OnPrompt onClose={() => setActionPanelVisible(false)} edges={edges} />
      )}
      {/* {initiatorType === 'on_start' && (
        <OnPrompt flow_id={flow_id} onClose={onClose} edges={edges} />
      )} */}
    </motion.div>
  );
};
