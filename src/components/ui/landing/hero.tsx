import React from 'react';
import { AuroraBackground } from '../aurora-background';
import { motion } from 'framer-motion';
import { SparklesCore } from '../sparkles';

function Hero() {
  return (
    <AuroraBackground>
      <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
        <div className="px-4 py-10 md:py-20">
          <h1 className="relative z-10 mx-auto max-w-4xl text-center text-xl font-semibold text-slate-700 md:text-2xl lg:text-4xl dark:text-white gap-10 flex flex-col">
            <div className="relative flex flex-row justify-center items-center font-bold">
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.3,
                  delay: 0.8,
                }}
                className="relative z-10 mx-auto max-w-xl py-4 text-center text-6xl md:text-8xl font-bold">
                Bifrost Flow
              </motion.p>
              <SparklesCore
                background="transparent"
                minSize={0.1}
                maxSize={0.8}
                particleDensity={250}
                className="w-[80%] h-[150px] absolute"
                particleColor="#ffffff"
              />
            </div>
            <div>
              {'Your Gateway to Intelligent Agent Workflows'
                .split(' ')
                .map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                      ease: 'easeInOut',
                    }}
                    className="mr-2 inline-block text-slate-400">
                    {word}
                  </motion.span>
                ))}
            </div>
          </h1>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 1,
            }}
            className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4">
            <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Start Building
            </button>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              delay: 1.2,
            }}
            className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
              <img
                src="https://assets.aceternity.com/pro/aceternity-landing.webp"
                alt="Landing page preview"
                className="aspect-[16/9] h-auto w-full object-cover"
                height={1000}
                width={1000}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </AuroraBackground>
  );
}

export default Hero;
