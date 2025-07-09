import { SignedIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import React, { JSX, useState } from 'react';
import { Typography } from './typography';
import { Menu } from 'lucide-react';
import { Button } from './button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
function AppNav({ renderItems }: { renderItems: () => JSX.Element }) {
  //   useHotkeys('ctrl+s', () => onSaveHandler());
  //   const onSaveHandler = () => {
  //     console.log('running ctrl + s');
  //   };
  const [showMenuItems, setShowMenuItems] = useState(false);
  return (
    <>
      <div className="z-100 relative w-[100%] px-4 py-1 dark:bg-zinc-800 bg-c-surface flex flex-row justify-between items-center shadow-md dark:shadow-zinc-900 shadow-c-background-text-muted/20">
        <div className="flex flex-row justify-start items-center gap-4">
          <Image
            src={'/icon.png'}
            width={32}
            height={32}
            className="h-[32px] w-[32px]"
            alt=""
          />
          <Typography className="text-c-surface-text" variant={'h4'}>
            Trend to Tweet
          </Typography>
        </div>
        <div className="flex-row justify-between items-center flex">
          <div className="hidden md:flex flex-row gap-2 mx-4 justify-between items-center mr-10 ">
            {renderItems()}
          </div>
          <SignedIn>
            <UserButton userProfileUrl="/profile" />
          </SignedIn>
          <Button
            variant={'link'}
            onClick={() => {
              setShowMenuItems(!showMenuItems);
            }}
            className="flex md:hidden">
            <Menu />
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        className={cn(
          'flex-row gap-2 px-4 justify-end items-center pr-10 py-1 transition-all duration-100 ease-in dark:bg-zinc-800 bg-c-surface shadow-md dark:shadow-zinc-900 z-100 relative',
          showMenuItems ? 'flex md:hidden' : 'hidden',
        )}>
        {renderItems()}
      </motion.div>
    </>
  );
}

export default AppNav;
