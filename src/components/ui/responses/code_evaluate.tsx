import { CodeEvaluate, EnhancedResponse } from '@/backend/runFlow';
import React from 'react';

type Props = {
  response: EnhancedResponse<CodeEvaluate>;
};

export const CodeEvaluateResponse = ({ response }: Props) => {
  return (
    <div className="bg-zinc-900 border border-emerald-600 rounded-md shadow-lg p-4 space-y-2 w-full max-w-md text-sm text-emerald-100">
      <p className="flex items-start gap-1">
        <span className="font-semibold text-emerald-400">
          {response.meta.is_code ? 'Code :' : ''}
        </span>
        <code className="bg-emerald-950 px-2 py-1 rounded text-emerald-300 font-mono text-xs">
          {response.message}
        </code>
      </p>
      <p>
        <span className="font-semibold text-emerald-400">Remark:</span>{' '}
        <span>{response.meta.remark}</span>
      </p>
      <p>
        <span className="font-semibold text-emerald-400">Rating:</span>{' '}
        <span className="text-yellow-400 font-bold">
          {response.meta.rating}/10
        </span>
      </p>
    </div>
  );
};
