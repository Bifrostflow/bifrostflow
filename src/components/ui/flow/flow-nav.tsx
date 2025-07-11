'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../button';
import AppNavIconItem from '../app-nav-icon-item';
import AppNav from '../app-nav';
import { motion } from 'framer-motion';
import { useFlow } from '@/context/flow-context';

import { RunButton } from './run-flow-button';
import SaveFlowButton from './save-flow-button';
import Drawer from '../drawer';
import { KeySquare } from 'lucide-react';
import { Label } from '../label';
import { useHotkeys } from 'react-hotkeys-hook';

const FlowNav = () => {
  const { name, setShowKeyInputArea } = useFlow();
  useEffect(() => {
    console.log('::::FlowNav INITIATED::::');
  }, []);
  useHotkeys('ctrl+m', () => {
    setShowMore(!showMore);
  });

  const [showMore, setShowMore] = useState(false);
  return (
    <>
      <AppNav
        logoHeading={name}
        renderItems={() => {
          return (
            <motion.div className="flex flex-row justify-between items-center gap-4 font-semibold text-[10px] text-c-surface-text-muted transition-all duration-100 ease-in">
              <RunButton />
              <SaveFlowButton />

              <AppNavIconItem
                hoverLabel="Ctrl+E"
                iconName="edit"
                label="Edit"
                onClick={() => {}}
              />
              <AppNavIconItem
                hoverLabel="Ctrl+M"
                iconName="layout-grid"
                label="More"
                onClick={() => {
                  setShowMore(true);
                }}
              />
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
      <Drawer
        width={'w-[300px]'}
        height={'h-[300px]'}
        visible={showMore}
        position="right"
        className="top-[110px] left-auto right-[10px] sm:top-[80px] sm:left-auto sm:right-[10px]"
        onClose={setShowMore}>
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <motion.div
            onClick={() => {
              setShowKeyInputArea(true);
            }}
            className="flex flex-col justify-center items-center my-2 gap-2">
            <KeySquare size={32} />
            <Label className="text-xs">Manage Keys</Label>
          </motion.div>
          {/* {[1, 2, 3, 4, 5, 6, 7].map(res => {
            return (
            );
          })} */}
        </div>
      </Drawer>
    </>
  );
};

export default FlowNav;
