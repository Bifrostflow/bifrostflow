import { Play } from 'lucide-react';
import React from 'react';

type Props = {
  onExecuteFlow: () => void;
};

export default function ExecuteFlow({ onExecuteFlow }: Props) {
  return (
    <div
      className="flex py-[2px] px-[3px] bg-emerald-600 rounded-full justify-between items-center active:bg-emerald-500"
      onClick={onExecuteFlow}>
      <span className="text-[6px] text-emerald-200 font-semibold">
        Run Flow
      </span>{' '}
      <Play className="text-emerald-200" size={8} />
    </div>
  );
}
