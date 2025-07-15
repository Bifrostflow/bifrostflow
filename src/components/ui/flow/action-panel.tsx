import { OnPrompt } from '../initiator/on_prompt';
import { useFlow } from '@/context/flow-context';
import Drawer from '../drawer';
import { OnSpeech } from '../initiator/on-speech';

export const ActionPanel = () => {
  const {
    actionPanelVisible,
    setActionPanelVisible,
    initiatorTypeValue,
    setChunkResponse,
  } = useFlow();
  const onCloseHandler = () => {
    setActionPanelVisible(false);
    setChunkResponse(undefined);
  };
  return (
    <Drawer
      visible={actionPanelVisible}
      onClose={onCloseHandler}
      position="bottom"
      className="bottom-10 right-20 left-auto w-3xl max-w-3xl p-0 px-4 pt-4">
      {initiatorTypeValue === 'on_prompt' && (
        <OnPrompt onClose={onCloseHandler} />
      )}
      {initiatorTypeValue === 'on_speech' && (
        <OnSpeech onClose={onCloseHandler} />
      )}
    </Drawer>
  );
};
