'use client';

import { Button } from '@/components/ui/button';
import { Send, X } from 'lucide-react';
import { useState } from 'react';
import { Edge } from '@xyflow/react';
import { Textarea } from '../textarea';
import {
  CodeEvaluate,
  EnhancedResponse,
  MetaTypes,
  runFlowWithInput,
} from '@/backend/runFlow';
import { CodeEvaluateResponse } from '../responses/code_evaluate';

type Props = {
  edges: Edge[];
  onClose: () => void;
};

export const OnPrompt = <T,>({ edges, onClose }: Props) => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<EnhancedResponse<T>>();
  const [loading, setLoading] = useState(false);
  const [metaResponse, setMetaResponse] = useState<MetaTypes>();

  const runFlow = async () => {
    if (!message.trim().length) return;
    setLoading(true);
    console.log(edges, message);
    try {
      const response = await runFlowWithInput({ data: edges, input: message });
      console.log(response);

      if (response.metaType) {
        setMetaResponse(response.metaType);
      }
      setResponse(response as EnhancedResponse<T>);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-col justify-center items-center">
      <div className="w-full mb-2 rounded-sm flex justify-end">
        <X
          className="w-4 h-4 text-zinc-400"
          onClick={loading ? () => {} : onClose}
        />
      </div>
      <div className="w-full min-h-[200px] max-h-[300px] mb-2 rounded-sm border-2 border-zinc-600 overflow-y-scroll h-64 scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-zinc-800">
        {response &&
          (metaResponse ? (
            metaResponse === 'evaluate_code' ? (
              <CodeEvaluateResponse
                response={response as EnhancedResponse<CodeEvaluate>}
              />
            ) : null
          ) : (
            <p className="text-white text-sm p-2">{response?.message}</p>
          ))}
      </div>
      <div className="w-full max-w-3xl flex gap-2 items-center">
        <Textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-h-[40px] max-h-[100px] resize-y border-emerald-500 placeholder:text-emerald-500 text-emerald-200"
        />
        <Button
          disabled={loading || !message}
          onClick={runFlow}
          variant="default"
          className="flex gap-1 bg-emerald-500">
          <Send className="w-4 h-4 text-emerald-900 " />
        </Button>
      </div>
    </div>
  );
};
