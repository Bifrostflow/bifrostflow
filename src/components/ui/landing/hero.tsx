import { motion } from 'framer-motion';
import Link from 'next/link';

const blurVariants = {
  animate: (i: number) => ({
    filter: ['blur(5px)', 'blur(2px)', 'blur(5px)'],
    width: ['70px', '75px', '70px'],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeIn',
      delay: i * 1.5, // staggers each by 1s
    },
  }),
};

function BlurredBars() {
  return (
    <>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          custom={i}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          variants={blurVariants}
          animate="animate"
          className={`absolute rotate-30 h-[150vh] w-[70px] ${
            i === 0
              ? 'left-20 bg-c-secondary'
              : i === 1
              ? 'left-55 bg-c-primary'
              : 'left-90 bg-c-secondary-variant'
          }`}
        />
      ))}
    </>
  );
}

function Hero() {
  return (
    // <AuroraBackground>

    <div className="backdrop-blur-xl bg-cover bg-center w-full flex flex-col items-end justify-center h-[100vh]">
      <BlurredBars />
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
