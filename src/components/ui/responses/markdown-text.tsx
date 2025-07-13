import React from 'react';
import ReactMarkdown from 'react-markdown';
type Props = {
  response: string;
};

export const MarkdownTextResponse = ({ response }: Props) => {
  return (
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
  );
};
