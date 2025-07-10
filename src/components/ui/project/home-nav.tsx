'use client';
import React from 'react';
import { Button } from '../button';
import AppNavIconItem from '../app-nav-icon-item';
import AppNav from '../app-nav';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const HomeNav = () => {
  const pathname = usePathname();
  const {} = useRouter();
  return (
    <>
      <AppNav
        logoHeading="BifrostFlow"
        renderItems={() => {
          return (
            <motion.div className="flex flex-row justify-between items-center gap-4 font-semibold text-[10px] text-c-surface-text-muted transition-all duration-100 ease-in">
              <Link
                href={'/home'}
                className={`link ${
                  pathname === '/home' ? 'text-c-secondary' : ''
                }`}>
                <AppNavIconItem
                  hoverLabel="Home"
                  iconName="home"
                  label="Home"
                  onClick={() => {}}
                />
              </Link>
              <Link
                href={'/home/plans'}
                className={`link ${
                  pathname === '/home/plans' ? 'text-c-secondary' : ''
                }`}>
                <AppNavIconItem
                  hoverLabel="Plans"
                  iconName="dollar-sign"
                  label="Plans"
                  onClick={() => {}}
                />
              </Link>
              <Link
                href={'/home/keys'}
                className={`link ${
                  pathname === '/home/keys' ? 'text-c-secondary' : ''
                }`}>
                <AppNavIconItem
                  hoverLabel="My Keys"
                  iconName="key"
                  label="My Keys"
                  onClick={() => {}}
                />
              </Link>
              <Button
                className="
              relative inline-block font-semibold overflow-hidden group 
              text-black bg-gradient-to-b from-[#FFD700] via-[#FFC107] to-[#FF8C00]">
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-white to-yellow-100 opacity-10 blur-xl animate-pulse"></span>
                <span className="flex sm:hidden relative z-10">Become Pro</span>
                <span className="hidden sm:flex relative z-10">
                  Upgrade To Pro
                </span>
              </Button>
            </motion.div>
          );
        }}
      />
    </>
  );
};

export default HomeNav;
