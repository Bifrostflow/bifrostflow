import React, { useEffect, useState } from 'react';
import { CodeEvaluateResponse } from '../responses/code_evaluate';
import { MarkdownTextResponse } from '../responses/markdown-text';
import { Button } from '../button';
import { Typography } from '../typography';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useFlow } from '@/context/flow-context';
import { ChunkResponse } from '@/_backend/runFlow';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import MetaResponsePreview from '../flow/meta-response-preview';
import { ExternalLink } from 'lucide-react';
const ChatResponseViewer = () => {
  const { chunkResponse, loaderUIText, runningFlow, setChunkResponse } =
    useFlow();
  const [chunkMessageList, setChunkMessageList] = useState<ChunkResponse[]>([]);
  const [selectedMetaToShow, setSelectedMetaToShow] =
    useState<string>('second');
  useEffect(() => {
    if (
      chunkResponse &&
      chunkResponse?.messages &&
      chunkResponse.messages.role !== 'system'
    ) {
      console.log('-->HERE Too', { chunkResponse });
      if (chunkResponse.links_to_open?.type === 'create_tweet') {
        window.open(
          chunkResponse.links_to_open.url,
          '_blank',
          'noopener,noreferrer',
        );
      }
      setChunkMessageList(prev => [...prev, chunkResponse]);
    }
    return () => {
      // setChunkResponse(undefined);
      // setChunkMessageList([]);
    };
  }, [chunkResponse, setChunkResponse]);
  useEffect(() => {
    if (runningFlow) {
      setChunkMessageList([]);
    }
  }, [runningFlow]);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chunkMessageList]);

  useEffect(() => {
    if (loaderUIText[loaderUIText.length - 1]) {
      setChunkMessageList(prev => [
        ...prev,
        {
          messages: {
            content: loaderUIText[loaderUIText.length - 1],
            role: 'system',
          },
          meta: undefined,
          type: 'server',
          links_to_open: undefined,
        },
      ]);
    }
  }, [loaderUIText]);

  return (
    <div className="w-full max-w-5xl min-h-[500px] max-h-[500px] mb-2 rounded-2xl border-1 border-c-border overflow-y-scroll scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-zinc-800 bg-c-surface flex-col-reverse">
      {!!chunkMessageList.length &&
        chunkMessageList.map((chunk, i) => {
          const key = `${i}_${chunk.messages.content}`;
          return (
            <motion.div
              key={`${i}_${chunk.messages.content}`}
              className={cn(
                'm-2 flex gap-2 flex-col mb-4 transition-all duration-200 ease-in-out',
                chunk.messages.role !== 'assistant'
                  ? 'items-end flex-row-reverse'
                  : '',
              )}>
              <div
                className={cn(
                  'flex flex-row justify-start items-end gap-2',
                  chunk.messages.role !== 'assistant'
                    ? 'flex-row-reverse justify-end'
                    : '',
                )}>
                <Button
                  size={'icon'}
                  variant={
                    chunk.messages.role === 'assistant'
                      ? 'secondary'
                      : 'default'
                  }>
                  <DynamicIcon
                    size={28}
                    name={
                      chunk.messages.role === 'assistant'
                        ? 'bot'
                        : chunk.messages.role === 'system'
                        ? 'server'
                        : 'user'
                    }
                  />
                </Button>
                <div className="flex flex-col gap-2 items-start">
                  {chunk?.meta?.type === 'evaluate_code' ? (
                    <CodeEvaluateResponse response={chunk} />
                  ) : chunk.type === 'server' ? (
                    <div className="bg-background border-1 border-c-primary rounded-full shadow-md px-2 py-0 w-full max-w-md text-xs text-c-background-text">
                      <Typography variant={'p'}>
                        {chunk.messages.content}
                      </Typography>
                    </div>
                  ) : chunk.messages.role === 'assistant' ? (
                    <div className="bg-background border-1 border-c-secondary rounded-md shadow-lg p-4 space-y-2 w-full max-w-md text-sm text-c-background-text">
                      <MarkdownTextResponse response={chunk.messages.content} />
                    </div>
                  ) : (
                    <div className="bg-background border-1 border-c-primary rounded-md shadow-md px-2 py-1 w-full max-w-md text-sm text-c-background-text">
                      <Typography variant={'p'}>
                        {chunk.messages.content}
                      </Typography>
                    </div>
                  )}
                  {!!chunk?.meta?.type && (
                    <div className="flex flex-row justify-between-items-center gap-2">
                      <Button
                        onClick={() => {
                          setSelectedMetaToShow(
                            selectedMetaToShow === key ? '' : key,
                          );
                        }}
                        size={'sm'}
                        className="capitalize"
                        variant={'outline_secondary'}>
                        Full response
                        <DynamicIcon size={28} name={'settings'} />
                      </Button>
                      {!!chunk.links_to_open?.url ? (
                        <Button
                          onClick={() => {
                            window.open(
                              chunk.links_to_open?.url,
                              '_blank',
                              'noopener,noreferrer',
                            );
                          }}
                          size={'sm'}
                          className="capitalize"
                          variant={'secondary'}>
                          {chunk.links_to_open?.label}
                          <ExternalLink size={28} name={'settings'} />
                        </Button>
                      ) : null}
                    </div>
                  )}
                  <AnimatePresence>
                    {!!chunk && key === selectedMetaToShow && (
                      <MetaResponsePreview data={{ ...chunk }} />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatResponseViewer;
