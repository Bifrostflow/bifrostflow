import { ChunkResponse } from '@/_backend/runFlow';
import React from 'react';

type Props = {
  response: ChunkResponse;
};

export const CodeEvaluateResponse = ({ response }: Props) => {
  const { meta } = response;
  if (!meta) return null;
  if (meta.type === 'evaluate_code') {
    return (
      <div className="bg-background border border-c-secondary rounded-md shadow-lg p-4 space-y-2 w-full max-w-md text-sm text-c-background-text">
        <p className="flex items-start gap-1">
          <span className="font-semibold text-c-secondary">
            {meta.is_code ? 'Code:' : ''}
          </span>
          {!!meta.code && (
            <pre className="bg-c-secondary-variant px-2 py-1 rounded text-c-on-secondary font-semibold font-mono text-xs whitespace-pre-wrap break-words">
              <code>{meta.code}</code>
            </pre>
          )}
        </p>
        <p>
          <span className="font-semibold text-emerald-400">Remark:</span>{' '}
          <span>{meta.remark}</span>
        </p>
        <p>
          <span className="font-semibold text-emerald-400">Rating:</span>{' '}
          <span className="text-c-background-text font-bold">
            {meta.rating}/10
          </span>
        </p>
      </div>
    );
  }
};
