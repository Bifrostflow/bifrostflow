'use client';
import { X } from 'lucide-react';

import { useFlow } from '@/context/flow-context';
import { Button } from '../button';

import ChatResponseViewer from './chat_response_viewer';
import RecordAudio from './record-audio';

type Props = {
  onClose: () => void;
};

export const OnSpeech = ({ onClose }: Props) => {
  const { runningFlow, setChunkResponse } = useFlow();

  return (
    <div className="w-full max-w-5xl flex-col justify-center items-center gap-0">
      <div className="flex justify-end mb-3">
        <Button
          size={'icon'}
          onClick={
            runningFlow
              ? () => {}
              : () => {
                  setChunkResponse(undefined);
                  onClose();
                }
          }>
          <X />
        </Button>
      </div>
      <ChatResponseViewer />
      <div className="w-full max-w-5xl flex gap-2 items-end justify-start">
        <RecordAudio />
      </div>
    </div>
  );
};
