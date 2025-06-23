'use client';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          'transition-all relative flex h-[100vh] flex-col items-center justify-start bg-[#1b53e000] text-white overflow-hidden',
          className,
        )}
        {...props}>
        <div
          className="absolute inset-0 overflow-hidden animate-heartbeat-gradient"
          style={
            {
              '--aurora': `repeating-linear-gradient(
                120deg,
                #00FFFF 0%,
                #008FFF 10%,
                #00BFFF 20%,
                #008FFF 30%,
                #008FFF 50%,
                #00BFFF 60%,
                #00FFFF 70%
              )`,
              '--white-gradient': `repeating-linear-gradient(
                100deg,
                #008FFF 0%,
                #1B73F9 7%,
                transparent 10%,
                transparent 12%,
                #024AB1 16%
              )`,
              '--transparent': 'transparent',
            } as React.CSSProperties
          }>
          <div
            className={cn(
              `pointer-events-none absolute -inset-[10px]
              [background-size:300%,_200%]
              [background-position:50%_50%,50%_50%]
              opacity-60 blur-[20px] invert filter will-change-transform
              after:absolute after:inset-0
              after:[background-image:var(--white-gradient),var(--aurora)]
              after:[background-size:200%,_100%]
              after:[background-attachment:fixed]
              after:content-[""]
              dark:invert-0
              `,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_50%_0%,black_10%,var(--transparent)_70%)]`,
            )}></div>
        </div>
        {children}
      </div>
    </main>
  );
};
