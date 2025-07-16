'use client';
import { SignedIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import React, { JSX, useState } from 'react';
import { Typography } from './typography';
import { Menu } from 'lucide-react';
import { Button } from './button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
function AppNav({
  renderItems,
  logoHeading,
  fixed = true,
}: {
  logoHeading?: string;
  renderItems?: () => JSX.Element;
  fixed?: boolean;
}) {
  const [showMenuItems, setShowMenuItems] = useState(false);
  return (
    <>
      <div
        className={cn(
          'z-100 h-[64px] w-[100%] px-5 sm:px-10 md:px-10 lg:px-10 xl:px-36 2xl:36 py-1 dark:bg-zinc-800 bg-c-surface flex flex-row justify-between items-center shadow-md dark:shadow-zinc-900 shadow-c-background-text-muted/20 rounded-0',
          fixed ? 'fixed' : 'relative',
        )}>
        <div className="flex flex-row justify-start items-center gap-4">
          <Link href={'/home'}>
            <Image
              src={'/icon.png'}
              width={32}
              height={32}
              className="h-[32px] w-[32px]"
              alt=""
            />
          </Link>
          {!!logoHeading && (
            <Typography className="text-c-surface-text" variant={'h4'}>
              {logoHeading}
            </Typography>
          )}
        </div>
        <div className="flex-row justify-between items-center flex">
          {/* { (
            <div className="fixed bottom-0 right-0 z-100 p-4 bg-red-800 sm:bg-blue-300 md:bg-pink-300 lg:bg-red-500 xl:bg-yellow-400 2xl:bg-blue-500 text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
              <div className="block sm:hidden">📱 Mobile (sm)</div>
              <div className="hidden sm:block md:hidden">
                💻 Small Tablet (sm → md)
              </div>
              <div className="hidden md:block lg:hidden">
                🖥️ Tablet (md → lg)
              </div>
              <div className="hidden lg:block xl:hidden">
                🖥️ Desktop (lg → xl)
              </div>
              <div className="hidden xl:block 2xl:hidden">
                🖥️ Extra Large (xl+)
              </div>
              <div className="hidden 2xl:block">🖥️ 2 Extra Large (2xl)</div>
            </div>
          )} */}
          <div className="hidden md:flex flex-row gap-2 mx-4 justify-between items-center mr-10 ">
            {renderItems && renderItems()}
          </div>
          <SignedIn>
            <UserButton userProfileUrl="/home/settings/profile" />
          </SignedIn>
          <Button
            size={'icon'}
            variant={'outline'}
            onClick={() => {
              setShowMenuItems(!showMenuItems);
            }}
            className="flex md:hidden ml-2 bg-transparent border-0">
            <Menu className="" />
          </Button>
        </div>
      </div>

      {showMenuItems && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className={cn(
            'fixed top-15 w-full flex-row gap-2 px-4 justify-end items-center py-1 transition-all duration-100 ease-in dark:bg-zinc-800 bg-c-surface shadow-md dark:shadow-zinc-900 z-100 ',
            showMenuItems ? 'flex md:hidden' : 'hidden',
          )}>
          {renderItems && renderItems()}
        </motion.div>
      )}
    </>
  );
}

export default AppNav;
