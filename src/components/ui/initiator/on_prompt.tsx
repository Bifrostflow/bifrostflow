'use client';
import { Loader2, Send, X } from 'lucide-react';
import { useState } from 'react';
import { Edge } from '@xyflow/react';
import { Textarea } from '../textarea';
import {
  CodeEvaluate,
  EnhancedResponse,
  MetaTypes,
  runFlowWithInput,
} from '@/_backend/runFlow';
import { CodeEvaluateResponse } from '../responses/code_evaluate';
import { MarkdownTextResponse } from '../responses/markdown-text';

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
    setResponse(undefined);
    setLoading(true);
    console.log(edges, message);
    try {
      const response = await runFlowWithInput({ data: edges, input: message });
      console.log(response);

      setMetaResponse(response.metaType);
      setResponse(response as EnhancedResponse<T>);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-col justify-center items-center rounded-2xl">
      <div className="flex justify-end">
        <button
          onClick={loading ? () => {} : onClose}
          className="text-zinc-200 hover:text-zinc-100 bg-gradient-to-br from-emerald-500 to-emerald-800 p-1 rounded-full mb-2">
          <X />
        </button>
      </div>
      <div className="w-full min-h-[200px] max-h-[300px] mb-2 rounded-2xl border-2 border-zinc-600 overflow-y-scroll h-64 scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-zinc-800">
        {response &&
          (metaResponse ? (
            metaResponse === 'evaluate_code' ? (
              <CodeEvaluateResponse
                response={response as EnhancedResponse<CodeEvaluate>}
              />
            ) : null
          ) : (
            <MarkdownTextResponse response={response} />
          ))}
      </div>
      <div className="w-full max-w-3xl flex gap-2 items-center">
        <Textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-h-[40px] max-h-[100px] resize-y border-emerald-500 placeholder:text-emerald-500 text-emerald-200"
        />
        <button
          disabled={loading || !message}
          onClick={runFlow}
          className="bg-gradient-to-br from-emerald-500 to-emerald-800 rounded-full p-2">
          {loading ? (
            <Loader2 className="animate-spin text-white h-[18px] w-[18px]" />
          ) : (
            <Send className="text-white h-[18px] w-[18px]" />
          )}
        </button>
      </div>
    </div>
  );
};
