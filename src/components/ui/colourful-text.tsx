'use client';
import React from 'react';
import { motion } from 'motion/react';

export default function ColourfulText({ text }: { text: string }) {
  const colors = [
    'oklch(62.3% 0.214 259.815)',
    'oklch(58.5% 0.233 277.117)',
    'oklch(62.3% 0.214 259.815)',
    'oklch(58.5% 0.233 277.117)',
    'oklch(62.3% 0.214 259.815)',
    'oklch(58.5% 0.233 277.117)',
    'oklch(62.3% 0.214 259.815)',
    'oklch(58.5% 0.233 277.117)',
    'oklch(69.6% 0.17 162.48)',
  ];

  const [currentColors, setCurrentColors] = React.useState(colors);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return text.split('').map((char, index) => (
    <motion.span
      key={`${char}-${count}-${index}`}
      initial={{
        y: 0,
      }}
      animate={{
        color: currentColors[index % currentColors.length],
        y: [0, -1, 0],
        scale: [1, 1.01, 1],
        filter: ['blur(0px)', `blur(2px)`, 'blur(0px)'],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 1,
        delay: index * 0.05,
      }}
      className="text-6xl inline-block whitespace-pre font-sans tracking-tight ">
      {char}
    </motion.span>
  ));
}
