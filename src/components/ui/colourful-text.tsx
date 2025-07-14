'use client';
import React from 'react';
import { motion } from 'motion/react';

export default function ColourfulText({
  text,
  colors = ['#00FFFF', '#008FFF', '#00FFFF', '#00BFFF', '#008FFF', '#00BFFF'],
}: {
  text: string;
  colors?: string[];
}) {
  const [currentColors, setCurrentColors] = React.useState(colors);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [colors]);

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
      className="lg:text-7xl md:text-6xl text-4xl sm:text-5xl inline-block whitespace-pre font-sans tracking-tight">
      {char}
    </motion.span>
  ));
}
