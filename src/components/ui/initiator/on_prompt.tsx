'use client';
import { Loader2, Send, X } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '../textarea';

import { useFlow } from '@/context/flow-context';
import { Button } from '../button';

import ChatResponseViewer from './chat_response_viewer';

type Props = {
  onClose: () => void;
};

export const OnPrompt = ({ onClose }: Props) => {
  const { runFlowHandler, runningFlow, setChunkResponse } = useFlow();
  const [message, setMessage] = useState('');

  return (
    <div className="w-full max-w-5xl flex-col justify-center items-center pb-3">
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
        <Textarea
          disabled={runningFlow}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={'Type your message...'}
          className="text-c-background-text text-lg border-2 border-c-primary rounded-xl"
        />
        <Button
          disabled={runningFlow || !message}
          onClick={() => {
            runFlowHandler({ message });
          }}>
          Send
          {runningFlow ? (
            <Loader2 className="animate-spin h-[18px] w-[18px]" />
          ) : (
            <Send className=" h-[18px] w-[18px]" />
          )}
        </Button>
      </div>
    </div>
  );
};
