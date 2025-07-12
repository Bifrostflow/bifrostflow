import { OnPrompt } from './initiator/on_prompt';
import { useFlow } from '@/context/flow-context';
import { useReactFlow } from '@xyflow/react';
import Drawer from './drawer';

export const DraggablePanel = () => {
  const {
    actionPanelVisible,
    setActionPanelVisible,
    initiatorTypeValue,
    setChunkResponse,
  } = useFlow();
  const { getEdges } = useReactFlow();
  const onCloseHandler = () => {
    setActionPanelVisible(false);
    setChunkResponse(undefined);
  };
  return (
    <Drawer
      visible={actionPanelVisible}
      onClose={onCloseHandler}
      position="bottom"
      className="bottom-10 right-20 left-auto w-3xl max-w-3xl">
      {initiatorTypeValue === 'on_prompt' && (
        <OnPrompt onClose={onCloseHandler} edges={getEdges()} />
      )}
    </Drawer>
  );
};
