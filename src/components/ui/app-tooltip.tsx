import React, { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { Typography } from './typography';

function AppTooltip({
  tip,
  children,
}: {
  tip: string | ReactNode;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top">
        {typeof tip === 'string' ? (
          <Typography variant={'p'}>{tip}</Typography>
        ) : (
          tip
        )}
      </TooltipContent>
    </Tooltip>
  );
}

export default AppTooltip;
