import React from 'react';
import { Typography } from '../typography';
import { cn } from '@/lib/utils';

const StartNew = () => {
  return (
    <div className="rounded-md min-w-2xs max-w-2xs w-full group/card bg-c-surface">
      <div
        className={cn(
          'cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-center items-center p-4 dark:border-2 dark:border-c-border ',
        )}>
        {/* ✅ Overlay gradient */}
        <div className="absolute inset-0 transition duration-300  bg-gradient-to-b from-transparent dark:via-black/50 hover:dark:via-transparent dark:to-black/90 via-transparent to-c-primary/90 opacity-60 z-10"></div>

        <Typography variant={'h2'}>Start New</Typography>
        <Typography variant={'p'}>Notingh can stop you now...</Typography>
      </div>
    </div>
  );
};

export default StartNew;
