import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import React from 'react';
import { Label } from './label';

function AppNavIconItem({
  hoverLabel,
  iconName,
  label,
  onClick,
}: {
  iconName: IconName;
  label: string;
  hoverLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative justify-baseline items-center border-b-2 border-b-transparent hover:border-b-2  active:scale-[0.96] gap-1 hover:text-c-primary transition-all duration-100 ease-in flex flex-col w-[40px] h-[40px] group mt-1">
      <DynamicIcon name={iconName} size={20} />
      <Label className="text-[10px] relative flex justify-center items-center">
        <span className="opacity-100 group-hover:opacity-0 absolute top-[0px]">
          {label}
        </span>
        <span className="opacity-0 group-hover:opacity-100 absolute top-[0px]">
          {hoverLabel}
        </span>
      </Label>
    </button>
  );
}

export default AppNavIconItem;
