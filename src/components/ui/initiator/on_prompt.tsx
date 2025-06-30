'use client';
import { Loader2, Send, X } from 'lucide-react';
import { useState } from 'react';
import { Edge } from '@xyflow/react';
import { Textarea } from '../textarea';
import { ChunkResponse, ChunkResponseData } from '@/_backend/runFlow';
import { CodeEvaluateResponse } from '../responses/code_evaluate';
import { MarkdownTextResponse } from '../responses/markdown-text';
import print from '@/lib/print';

type Props = {
  edges: Edge[];
  onClose: () => void;
  flow_id: string;
};

export const OnPrompt = ({ edges, onClose, flow_id }: Props) => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<ChunkResponse>();
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState('');
  const runFlow = async () => {
    setLoading(true);
    setLoaderText(() => 'Running prompt');
    try {
      const res = await fetch('/api/run-flow', {
        method: 'POST',
        body: JSON.stringify({ input: message, data: edges, flow_id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.body) {
        console.error('No response body');
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const responseArray: ChunkResponse[] = [];
      setLoaderText(() => 'getting data');
      await new Promise(resolve => setTimeout(resolve, 300));
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const json: ChunkResponseData = JSON.parse(
                line.replace('data: ', ''),
              );
              responseArray.push(json.response);
              setLoaderText(() => json.ui_response);
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (err) {
              console.error('Error parsing JSON', err);
            }
          }
        }
      }
      print('LAST RES: ', responseArray[responseArray.length - 1]);
      setResponse(responseArray[responseArray.length - 1]);
    } catch (error) {
      print(error);
      setLoaderText('');
      setLoading(false);
    } finally {
      setLoaderText(() => '');
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
        {response && (
          <>
            {response.meta.type === 'evaluate_code' && (
              <CodeEvaluateResponse response={response} />
            )}
            {(!response.meta.type || response.meta.type === 'other') && (
              <MarkdownTextResponse response={response.messages.content} />
            )}
          </>
        )}
      </div>
      <p className="italic p-2 text-sm text-white"> {loaderText}</p>
      <div className="w-full max-w-3xl flex gap-2 items-center">
        <Textarea
          disabled={loading}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={'Type your message...'}
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
