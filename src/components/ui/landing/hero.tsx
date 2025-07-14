import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuroraBackground } from '../aurora-background';
import ColourfulText from '../colourful-text';
import { SparklesCore } from '../sparkles';
import Features from './features';
import Pricing from './pricing';
import { IconBrandTwitter } from '@tabler/icons-react';
import { Typography } from '../typography';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

function Hero() {
  return (
    <div className="relative flex flex-col h-fit w-full items-center justify-center bg-white dark:bg-black">
      <AuroraBackground className="flex flex-col justify-center items-center">
        <div
          className={cn(
            'absolute inset-0',
            '[background-size:20px_20px]',
            '[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]',
            'dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]',
          )}
        />
        {/* Radial gradient for the container to give a faded look */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
        <div className="px-4 mt-20 md:mt-[15vh] h-fit py-10 md:py-20 flex flex-col justify-center items-center">
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
            <div className="text-center">
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
                    className="mr-2 inline-block text-c-on-background text-[28px]">
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
            <SignedOut>
              <SignInButton
                forceRedirectUrl={'/home'}
                mode="modal"
                signUpFallbackRedirectUrl={'/home'}>
                <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  Start Building
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href={'/home'}>
                <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  Start Building
                </button>
              </Link>
            </SignedIn>
          </motion.div>
        </div>
        <div className="relative flex mt-50 flex-row font-bold text-transparent z-2">
          <span className="">
            <ColourfulText
              colors={[
                'oklch(74.6% 0.16 232.661)',
                'oklch(70.7% 0.165 254.624)',
                'oklch(70.7% 0.165 254.624)',
                'oklch(70.7% 0.165 254.624)',
              ]}
              text="What Flows in Bifrost"
            />
          </span>
          <SparklesCore
            background="transparent"
            minSize={0.5}
            maxSize={1.5}
            particleDensity={500}
            className="w-full h-[20px] absolute -bottom-2"
            particleColor="#00d3f2"
          />
        </div>
        <Features />
        <Pricing />
        <footer className="bg-c-primary h-[10vh] p-4 w-full flex flex-col items-center justify-center">
          <span className="dark:text-white text-black font-bold relative z-100 pb-3">
            Built by dwarfs and perfected by
          </span>
          <div className="flex flex-row justify-start items-center gap-2 text-c-primary dark:text-white z-99 relative font-bold">
            <IconBrandTwitter />
            <Link href={'https://x.com/8xCVardhan'} target="_blank">
              <Typography>@8xCVardhan</Typography>
            </Link>
          </div>
        </footer>
      </AuroraBackground>
    </div>
  );
}

export default Hero;
