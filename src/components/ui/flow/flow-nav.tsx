'use client';
import React, { useEffect } from 'react';
import { Button } from '../button';
import AppNavIconItem from '../app-nav-icon-item';
import AppNav from '../app-nav';
import { motion } from 'framer-motion';
import { useFlow } from '@/context/flow-context';

import { RunButton } from './run-flow-button';
import SaveFlowButton from './save-flow-button';
import Drawer from '../drawer';
import { Bug, File, KeySquare } from 'lucide-react';
import { Label } from '../label';
import { useHotkeys } from 'react-hotkeys-hook';
import EditFlow from './edit-flow';

import FlowDocuments from './flow-documents';
import { showToast } from '../toast';

const FlowNav = () => {
  const {
    flowName,
    setShowKeyInputArea,
    showKeyInputArea,
    showEditDrawer,
    setShowEditDrawer,
    paramShowRequest,
    showMore,
    setShowMore,
    setToolDrawerOpen,
    showFlowDocs,
    setShowFlowDocs,
  } = useFlow();

  useHotkeys('ctrl+m', () => {
    onMoreAreaPressHandler();
  });
  useHotkeys('ctrl+e', () => {
    onEditAreaPressHandler();
  });

  useEffect(() => {
    if (paramShowRequest === 'edit') {
      setShowEditDrawer(true);
    }
  }, [paramShowRequest, setShowEditDrawer]);

  const onEditAreaPressHandler = () => {
    setShowEditDrawer(!showEditDrawer);
    setShowMore(false);
    setShowKeyInputArea(false);
    setToolDrawerOpen(false);
    setShowFlowDocs(false);
  };
  const onShowDocPressHandler = () => {
    setShowFlowDocs(!showFlowDocs);
    setShowEditDrawer(false);
    setShowMore(false);
    setShowKeyInputArea(false);
    setToolDrawerOpen(false);
  };
  const onMoreAreaPressHandler = () => {
    setShowMore(!showMore);
    setShowEditDrawer(false);
    setShowKeyInputArea(false);
    setToolDrawerOpen(false);
    setShowFlowDocs(false);
  };
  const onKeyInputAreaPressHandler = () => {
    setShowKeyInputArea(!showKeyInputArea);
    setShowEditDrawer(false);
    setShowMore(false);
    setToolDrawerOpen(false);
    setShowFlowDocs(false);
  };
  return (
    <>
      <AppNav
        logoHeading={flowName}
        renderItems={() => {
          return (
            <motion.div className="flex flex-row justify-between items-center gap-4 font-semibold text-[10px] text-c-surface-text-muted transition-all duration-100 ease-in">
              <RunButton />
              <SaveFlowButton />

              <AppNavIconItem
                hoverLabel="Ctrl+E"
                iconName="edit"
                label="Edit"
                onClick={onEditAreaPressHandler}
              />
              <AppNavIconItem
                hoverLabel="Ctrl+M"
                iconName="layout-grid"
                label="More"
                onClick={onMoreAreaPressHandler}
              />
              <Button className="font-semibold" variant={'gold'}>
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
        <div className="flex flex-wrap gap-3 justify-evenly items-center h-full">
          <motion.div
            onClick={onKeyInputAreaPressHandler}
            className="flex flex-col justify-center items-center my-2 gap-2 border-1 rounded-lg p-2 py-3 w-[32%] text-center hover:border-c-border transition-all duration-100 ease-in active:scale-[0.96] hover:text-c-secondary">
            <KeySquare size={32} />
            <Label className="text-xs">Keys</Label>
          </motion.div>
          <motion.div
            onClick={onShowDocPressHandler}
            className="flex flex-col justify-center items-center my-2 gap-2 border-1 rounded-lg p-2 py-3 w-[32%] text-center hover:border-c-border transition-all duration-100 ease-in active:scale-[0.96] hover:text-c-secondary">
            <File size={32} />
            <Label className="text-xs">Flow Docs</Label>
          </motion.div>
          <motion.div
            onClick={() => {
              showToast({
                description:
                  'Glad you are interedted in making our app better, this feature is in development phase, will notify you once shipped.',
              });
            }}
            className="flex flex-col justify-center items-center my-2 gap-2 border-1 rounded-lg p-2 py-3 w-[32%] text-center hover:border-c-border transition-all duration-100 ease-in active:scale-[0.96] hover:text-c-secondary">
            <Bug size={32} />
            <Label className="text-xs">Report Bug</Label>
          </motion.div>
        </div>
      </Drawer>
      <Drawer
        width={'w-[400px]'}
        height={'h-[300px]'}
        className="top-[110px] left-auto right-[10px] sm:top-[80px] sm:left-auto sm:right-[10px]"
        position="top"
        visible={showEditDrawer}
        onClose={onEditAreaPressHandler}>
        <EditFlow />
      </Drawer>
      <Drawer
        width={'w-fit'}
        height={'h-fit'}
        className="top-[110px] left-auto right-[10px] sm:top-[80px] sm:left-auto sm:right-[10px]"
        position="top"
        visible={showFlowDocs}
        onClose={onShowDocPressHandler}>
        <FlowDocuments />
      </Drawer>
    </>
  );
};

export default FlowNav;
