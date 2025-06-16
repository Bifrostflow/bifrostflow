import React from 'react';
import ColourfulText from './colourful-text';

export const HeaderName = ({ isStart }: { isStart: boolean }) => {
  return (
    <h1
      className={
        !isStart
          ? 'text-6xl uppercase absolute top-[38%] left-[calc(50%-250px)] font-black tracking-wide bg-gradient-to-t from-blue-600 to-violet-400 bg-clip-text text-transparent transition-all duration-500 ease-in-out'
          : 'text-6xl uppercase absolute top-4 left-4 font-black tracking-wide bg-gradient-to-t from-blue-600 to-violet-400 bg-clip-text text-transparent transition-all duration-500 ease-in-out'
      }>
      <ColourfulText text="BIFROST &nbsp;FLOW" />
    </h1>
  );
};
