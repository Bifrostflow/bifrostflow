import { EnhancedResponse } from '@/_backend/runFlow';
import React from 'react';
import ReactMarkdown from 'react-markdown';
type Props<T> = {
  response: EnhancedResponse<T>;
};

export const MarkdownTextResponse = <T,>({ response }: Props<T>) => {
  return (
    <div className="bg-zinc-900 border-0 rounded-md shadow-lg p-4 space-y-2 w-full max-w-md text-sm text-zinc-200">
      <ReactMarkdown
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          a: ({ node, ...rests }) => {
            return (
              <a
                {...rests}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue underline"
              />
            );
          },
        }}>
        {response.messages.reduce((p, c) => {
          return p + '\n\n\n\n' + c;
        }, '')}
      </ReactMarkdown>
    </div>
  );
};
