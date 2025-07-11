'use client';
'strict';
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
export const RunButton = () => {
  useEffect(() => {
    console.log('::::RUN INITIATED::::');
  }, []);

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
  } = useFlow();
  const { getEdges, getNodes } = useReactFlow();
  const [updatingNodes, setUpdatingNodes] = useState(false);
  useHotkeys('ctrl+r', () => {
    console.log('HOTKEY TRIGGERED');
    runPressHandler();
  });
  useHotkeys('esc', () => {
    setShowKeyInputArea(false);
  });

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
      } else {
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
    return { isKeyRequire: Object.keys(requiredKeys).length > 0, requiredKeys };
  };

  const handleInitiatorRunner = () => {
    if (initiatorTypeValue === 'on_prompt') {
      setActionPanelVisible(true);
    } else if (initiatorTypeValue === 'on_start') {
      runFlowHandler({ edges: getEdges(), message: 'ignore' });
    }
  };

  const runFlow = async (imageString: string) => {
    const isValid = validateIndirectFlow(getEdges());
    if (isValid) {
      try {
        if (graphHaveChanges) {
          setUpdatingNodes(true);
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
          }}
        />
      </Drawer>
    </>
  );
};
