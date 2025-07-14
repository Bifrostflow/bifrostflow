import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import React from 'react';
import { Label } from './label';

function AppNavIconItem({
  hoverLabel,
  iconName,
  label,
  onClick,
  disable,
  loading,
}: {
  iconName: IconName;
  label: string;
  hoverLabel: string;
  onClick?: () => void;
  disable?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      disabled={disable}
      onClick={onClick}
      className="relative justify-baseline items-center border-b-2 border-b-transparent hover:border-b-2 active:scale-[0.96] gap-1 hover:text-c-primary transition-all duration-100 ease-in flex flex-col min-w-[48px] h-[48px] group mt-3 disabled:opacity-50">
      {loading ? (
        <DynamicIcon name={'loader-2'} className="animate-spin" size={22} />
      ) : (
        <DynamicIcon name={iconName} size={22} />
      )}
      <Label className="text-[12px] relative flex justify-center items-center z-99 px-1">
        <span className="left-auto right-auto opacity-100 group-hover:opacity-0 absolute top-0 whitespace-nowrap">
          {label}
        </span>
        <span className="opacity-0 group-hover:opacity-100 absolute top-0 whitespace-nowrap">
          {hoverLabel}
        </span>
      </Label>
    </button>
  );
}

export default AppNavIconItem;
