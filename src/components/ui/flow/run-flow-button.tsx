'use client';
import { SystemTool } from '@/_backend/getSystemTools';
import { useFlow } from '@/context/flow-context';
import { validateIndirectFlow } from '@/lib/validation';
import {
  getNodesBounds,
  getViewportForBounds,
  useReactFlow,
} from '@xyflow/react';

import { useEffect, useState } from 'react';

import { updateFlowGraph } from '@/_backend/private/projects/updateNodes';

import { fallback } from '@/lib/fallback-flow-snap';
import { toPng } from 'html-to-image';
import AppNavIconItem from '../app-nav-icon-item';
import Drawer from '../drawer';
import EnterKeys from './enter-keys-area';
import { useHotkeys } from 'react-hotkeys-hook';
import { showToast } from '../toast';
import { Button } from '../button';
import { X } from 'lucide-react';
import ChatResponseViewer from '../initiator/chat_response_viewer';

export const RunButton = () => {
  const [showChatResponseView, setShowChatResponseView] = useState(false);

  const {
    apiKeys,
    slug,
    setActionPanelVisible,
    runFlowHandler,
    runningFlow,
    initiatorTypeValue,
    graphHaveChanges,
    updateLastSavedGraph,
    setShowKeyInputArea,
    showKeyInputArea,
    setAPIKeys,
    setShowEditDrawer,
    setShowMore,
    setToolDrawerOpen,
    setChunkResponse,
  } = useFlow();
  const [continueRunAfterKeySave, setContinueRunAfterKeySave] = useState(false);
  const { getEdges, getNodes } = useReactFlow();
  const [updatingNodes, setUpdatingNodes] = useState(false);
  useHotkeys('ctrl+r', () => {
    console.log('HOTKEY TRIGGERED');
    runPressHandler();
  });
  useHotkeys('esc', () => {
    setShowKeyInputArea(false);
  });
  useEffect(() => {
    if (continueRunAfterKeySave && !showKeyInputArea) {
      runPressHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continueRunAfterKeySave, showKeyInputArea]);

  const validateRequiredKeys = () => {
    const { requiredKeys } = checkIfAPIKeyRequired();

    let fieldCounter = 0;
    for (let i = 0; i < Object.keys(requiredKeys).length; i++) {
      const key = Object.keys(requiredKeys)[i];
      const found = Object.keys(apiKeys).find(
        apiKeyLabel => apiKeyLabel === key,
      );
      if (found) {
        fieldCounter++;
      }
    }
    return fieldCounter === Object.keys(requiredKeys).length;
  };
  const runPressHandler = async () => {
    const { isKeyRequire } = checkIfAPIKeyRequired();

    if (!isKeyRequire) {
      const imageString = await getImage();
      runFlow(imageString || fallback);
    } else {
      if (!validateRequiredKeys()) {
        setShowKeyInputArea(true);
        setContinueRunAfterKeySave(() => true);
      } else {
        setContinueRunAfterKeySave(false);
        const imageString = await getImage();
        runFlow(imageString || fallback);
      }
    }
  };
  const getImage = async () => {
    const imageHeight = 1080;
    const imageWidth = 720;
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      1,
      1,
      2,
    );

    if (document) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return toPng(document.querySelector('.react-flow__viewport'), {
        backgroundColor: 'transparent',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: imageWidth,
          height: imageHeight,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      });
    } else {
      return null;
    }
  };
  const checkIfAPIKeyRequired = () => {
    const requiredKeys: Record<string, boolean> = {};
    for (let i = 0; i < getNodes().length; i++) {
      const node = getNodes()[i];
      const nodeData = node.data as unknown as SystemTool;
      if (nodeData.require_key) {
        if (nodeData.key_name) {
          requiredKeys[nodeData.key_name] = true;
        }
      }
    }
    console.log({ requiredKeys });
    return { isKeyRequire: Object.keys(requiredKeys).length > 0, requiredKeys };
  };

  const handleInitiatorRunner = () => {
    if (initiatorTypeValue === 'on_prompt') {
      setActionPanelVisible(true);
      setShowEditDrawer(false);
      setShowMore(false);
      setToolDrawerOpen(false);
    } else if (initiatorTypeValue === 'on_start') {
      setActionPanelVisible(false);
      setShowChatResponseView(true);
      runFlowHandler({ edges: getEdges(), message: 'ignore' });
    }
  };

  const runFlow = async (imageString: string) => {
    if (updatingNodes) return;
    const isValid = validateIndirectFlow(getEdges());
    if (isValid) {
      try {
        if (graphHaveChanges) {
          setUpdatingNodes(() => true);
          const response = await updateFlowGraph({
            flow_id: slug,
            nodes: JSON.stringify({ data: getNodes() }),
            edges: JSON.stringify({ data: getEdges() }),
            snap: imageString,
          });
          if (response?.isSuccess) {
            updateLastSavedGraph(getNodes(), getEdges());
          }
        }
        handleInitiatorRunner();
      } catch (error) {
        console.log(error);
      } finally {
        setUpdatingNodes(false);
      }
    } else {
      showToast({ description: 'Incomplete flow for graph.', type: 'error' });
    }
  };
  return (
    <>
      <AppNavIconItem
        disable={updatingNodes || !initiatorTypeValue || runningFlow}
        hoverLabel="Ctrl+R"
        iconName="play"
        label="Run"
        loading={updatingNodes || runningFlow}
        onClick={runPressHandler}
      />
      <Drawer
        onClose={setShowKeyInputArea}
        visible={showKeyInputArea}
        position="center">
        <EnterKeys
          apiDataFields={checkIfAPIKeyRequired().requiredKeys}
          onClose={() => setShowKeyInputArea(false)}
          onKeysSaved={resData => {
            setShowKeyInputArea(false);
            setAPIKeys(resData);
            if (continueRunAfterKeySave) {
              runPressHandler();
            }
          }}
        />
      </Drawer>

      <Drawer
        visible={showChatResponseView}
        onClose={() => {
          setShowChatResponseView(false);
        }}
        position="bottom"
        className="bottom-10 right-20 left-auto w-3xl max-w-3xl">
        <div className="w-full max-w-5xl flex-col justify-center items-center">
          <div className="flex justify-end mb-3">
            <Button
              size={'icon'}
              onClick={
                runningFlow
                  ? () => {}
                  : () => {
                      setChunkResponse(undefined);
                      setShowChatResponseView(false);
                    }
              }>
              <X />
            </Button>
          </div>
          <ChatResponseViewer />
        </div>
      </Drawer>
    </>
  );
};
