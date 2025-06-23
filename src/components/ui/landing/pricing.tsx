// import React from 'react';
// import { motion } from 'framer-motion';
// import { cn } from '@/lib/utils';

// function Features() {
//   return (
// <div
//   className={cn(
//     'transition-all w-full relative flex h-[100vh] flex-col items-center justify-start bg-transparent text-white overflow-hidden',
//   )}></div>
//   );
// }

// export default Features;

import { cn } from '@/lib/utils';
import { PricingTable } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function Pricing() {
  return (
    <div
      id="features"
      className={cn(
        'transition-all w-full h-[70vh] flex justify-center items-center  bg-zinc-950 text-white overflow-hidden',
      )}>
      <div className="columns-3 flex justify-center items-center ">
        <PricingTable
          appearance={{
            baseTheme: dark,
          }}
        />
      </div>
    </div>
  );
}
