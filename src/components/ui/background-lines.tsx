'use client';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import React from 'react';

export const BackgroundLines = ({
  children,
  className,
  svgOptions,
}: {
  children: React.ReactNode;
  className?: string;
  svgOptions?: {
    duration?: number;
  };
}) => {
  return (
    <div
      className={cn(
        'h-[20rem] md:h-screen w-full bg-white dark:bg-black',
        className,
      )}>
      <SVG svgOptions={svgOptions} />
      {children}
    </div>
  );
};

const pathVariants = {
  initial: { strokeDashoffset: 800, strokeDasharray: '50 800' },
  animate: {
    strokeDashoffset: 0,
    strokeDasharray: '20 800',
    opacity: [0, 1, 1, 0],
  },
};

const SVG = ({
  svgOptions,
}: {
  svgOptions?: {
    duration?: number;
  };
}) => {
  const paths = [
    'M720 450 L1020.00 450.00 L1001.91 552.61 Z',
    'M720 450 L997.16 564.81 L941.18 652.68 Z',
    'M720 450 L932.13 662.13 L846.79 721.89 Z',
    'M720 450 L834.81 727.16 L733.09 749.71 Z',
    'M720 450 L720.00 750.00 L617.39 731.91 Z',
    'M720 450 L605.19 727.16 L517.32 671.18 Z',
    'M720 450 L507.87 662.13 L448.11 576.79 Z',
    'M720 450 L442.84 564.81 L420.29 463.09 Z',
    'M720 450 L420.00 450.00 L438.09 347.39 Z',
    'M720 450 L442.84 335.19 L498.82 247.32 Z',
    'M720 450 L507.87 237.87 L593.21 178.11 Z',
    'M720 450 L605.19 172.84 L706.91 150.29 Z',
    'M720 450 L720.00 150.00 L822.61 168.09 Z',
    'M720 450 L834.81 172.84 L922.68 228.82 Z',
    'M720 450 L932.13 237.87 L991.89 323.21 Z',
    'M720 450 L997.16 335.19 L1019.71 436.91 Z',
  ];

  const colors = ['#0021A3ff', '#0C9AA7ff', '#1B73F9ff', '#024AB1ff'];

  return (
    <motion.svg
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 w-full h-full scale-[10] z-0">
      {paths.map((path, idx) => (
        <motion.path
          d={path}
          fill={colors[idx % colors.length]}
          variants={pathVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: svgOptions?.duration || 5,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
            delay: Math.floor(Math.random() * 5),
            repeatDelay: Math.floor(Math.random() * 5 + 2),
          }}
          key={`path-first-${idx}`}
        />
      ))}

      {/* Duplicate layer for subtle glow/light */}
      {paths.map((path, idx) => (
        <motion.path
          d={path}
          fill={colors[(idx + 2) % colors.length]}
          opacity={0.5}
          variants={pathVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: svgOptions?.duration || 5,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
            delay: Math.floor(Math.random() * 5),
            repeatDelay: Math.floor(Math.random() * 8 + 1),
          }}
          key={`path-second-${idx}`}
        />
      ))}
    </motion.svg>
  );
};
