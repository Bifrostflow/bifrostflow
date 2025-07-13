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
          'z-100 h-[64px] w-[100%] px-36 py-1 dark:bg-zinc-800 bg-c-surface flex flex-row justify-between items-center shadow-md dark:shadow-zinc-900 shadow-c-background-text-muted/20',
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
          <div className="hidden md:flex flex-row gap-2 mx-4 justify-between items-center mr-10 ">
            {renderItems && renderItems()}
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
            <Menu className="h-[48px] w-[48px] g-red-800" />
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
            'fixed top-10 w-[100%] flex-row gap-2 px-4 justify-end items-center pr-10 py-1 transition-all duration-100 ease-in dark:bg-zinc-800 bg-c-surface shadow-md dark:shadow-zinc-900 z-100 ',
            showMenuItems ? 'flex md:hidden' : 'hidden',
          )}>
          {renderItems && renderItems()}
        </motion.div>
      )}
    </>
  );
}

export default AppNav;
