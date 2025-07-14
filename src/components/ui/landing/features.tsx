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
import {
  IconApi,
  IconCodeCircle,
  IconPlanet,
  IconPuzzle2,
  IconShoppingCartCode,
  IconTool,
  IconTopologyStar3,
  IconWorldCode,
} from '@tabler/icons-react';

const features = [
  {
    title: 'Flow-based Agent Builder',
    description:
      'Create powerful AI Agents visually, using an intuitive flow-based interface.',
    icon: <IconTopologyStar3 />,
  },
  {
    title: 'Prebuilt Tools, Ready to Plug',
    description:
      'Use ready-made tools or create your own — just plug and play, no boilerplate needed.',
    icon: <IconTool />,
  },
  {
    title: 'Access via API',
    description:
      'Deploy agents anywhere with seamless API access — web, mobile, or CLI.',
    icon: <IconApi />,
  },
  {
    title: 'Marketplace (Coming Soon)',
    description:
      'Sell or share your agents and tools in our upcoming AI marketplace.',
    icon: <IconShoppingCartCode />,
  },
  {
    title: 'Run Anywhere',
    description:
      'Run agents inside your product, your cloud, or even on your Raspberry Pi.',
    icon: <IconWorldCode />,
  },
  {
    title: 'Open Realm for Agents',
    description:
      'We’re not just a platform. We’re building a whole realm where agents thrive.',
    icon: <IconPlanet />,
  },
  {
    title: 'Modular by Design',
    description:
      'Every agent, every tool — fully modular. Just pick what you need and go.',
    icon: <IconPuzzle2 />,
  },
  {
    title: 'Powered by Open Standards',
    description:
      'Built on open AI protocols and open-source tech — no vendor lock-in.',
    icon: <IconCodeCircle />,
  },
];

export default function Features() {
  return (
    <div className="w-full md:w-3xl lg:w-4xl grid grid-cols-2 mt-10 md:grid-cols-2 lg:grid-cols-3 xl:w-6xl 2xl:w-7xl xl:grid-cols-4  relative z-10 py-10 pb-20 xl:max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  const isEven = index % 2 === 0;
  console.log(isEven);

  return (
    <div
      className={cn(
        'flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800',
        (index === 0 || index === 4) && 'lg:border-l dark:border-neutral-800',
        index < 4 && 'lg:border-b dark:border-neutral-800',
      )}>
      {index < 4 && (
        <div
          className={cn(
            'opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t  to-transparent pointer-events-none',
            isEven ? 'dark:from-blue-950' : 'dark:from-cyan-900',
          )}
        />
      )}
      {index >= 4 && (
        <div
          className={cn(
            'opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b to-transparent pointer-events-none',
            !isEven ? 'dark:from-blue-950' : 'dark:from-cyan-900',
          )}
        />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div
          className={cn(
            'absolute left-0 inset-y-0 h-6 group-hover/feature:h-7 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center',
          )}
        />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
