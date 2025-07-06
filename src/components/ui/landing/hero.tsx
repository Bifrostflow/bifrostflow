/* eslint-disable @next/next/no-img-element */
import { motion } from 'framer-motion';
import Link from 'next/link';

function Hero() {
  return (
    // <AuroraBackground>

    <div className="bg-c-background relative mx-auto my-10 flex max-w-7xl flex-col items-end justify-center h-[90vh]">
      <div className="bg-c-secondary-variant w-[70px] absolute rotate-30 left-90 h-[150vh]"></div>
      <div className="bg-c-primary w-[70px] absolute rotate-30 left-55 h-[150vh]"></div>
      <div className="bg-c-secondary w-[70px] absolute rotate-30 left-20 h-[150vh]"></div>
      <motion.div
        initial={{
          translateX: 0,
          translateY: 0,
        }}
        animate={{
          translateX: 50,
          translateY: 0,
        }}
        transition={{
          duration: 5,
          delay: 1,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
        className="absolute right-120 top-10 h-[150px] w-[150px] bg-c-primary z-50 rounded-md shadow-md"></motion.div>
      <motion.div
        initial={{
          translateY: 0,
        }}
        animate={{
          translateY: 50,
        }}
        transition={{
          duration: 4,
          delay: 2,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
        className="absolute left-60 bottom-50 h-[150px] w-[150px] bg-c-primary z-50 rounded-md shadow-md"></motion.div>
      <div className="px-4 py-10 md:py-20 ">
        <h1 className="relative z-10 mx-auto max-w-4xl text-right text-xl font-semibold text-slate-700 md:text-2xl lg:text-4xl dark:text-white gap-10 flex flex-col">
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
                  className="mr-2 inline-block text-slate-400 text-[24px]">
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
          <Link href={'/home'}>
            <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Start Building
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
    // </AuroraBackground>
  );
}

export default Hero;
