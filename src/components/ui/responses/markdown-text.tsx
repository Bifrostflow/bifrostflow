import { Copy } from 'lucide-react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '../button';
import { showToast } from '../toast';
type Props = {
  response: string;
};

export const MarkdownTextResponse = ({ response }: Props) => {
  return (
    <div className="relative">
      {response.length > 50 && (
        <Button
          onClick={() => {
            navigator.clipboard.writeText(response);
            showToast({ title: 'Copied!', type: 'success' });
          }}
          className="absolute -left-15 bottom-8"
          size={'icon'}>
          <Copy />
        </Button>
      )}
      <ReactMarkdown
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          a: ({ node, ...rests }) => {
            return (
              <a
                {...rests}
                target="_blank"
                rel="noopener noreferrer"
                className="text-c-primary underline"
              />
            );
          },
        }}>
        {response}
      </ReactMarkdown>
    </div>
  );
};
