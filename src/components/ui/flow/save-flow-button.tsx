'use client';
import { validateIndirectFlow } from '@/lib/validation';
import {
  getNodesBounds,
  getViewportForBounds,
  Node,
  useReactFlow,
} from '@xyflow/react';
import React, { useState } from 'react';
import { showToast } from '../toast';
import { fallback } from '@/lib/fallback-flow-snap';
import { toPng } from 'html-to-image';
import { updateFlowGraph } from '@/_backend/private/projects/updateNodes';
import { useFlow } from '@/context/flow-context';
import AppNavIconItem from '../app-nav-icon-item';

const SaveFlowButton = () => {
  const { slug, graphHaveChanges } = useFlow();
  const [savingGraph, setSavingGraph] = useState(false);
  const { getEdges, getNodes } = useReactFlow();

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

  const onSaveFlow = async () => {
    const isValid = validateIndirectFlow(getEdges());
    if (isValid) {
      const imageString = await getImage();
      saveFlowHandler(imageString || fallback);
    } else {
      showToast({ description: 'Incomplete flow for graph.', type: 'error' });
    }
  };

  const saveFlowHandler = (imageString: string) => {
    setSavingGraph(true);
    const minimizedNodes = getNodes().map((node: Node): Node => {
      return {
        ...node,
        data: {
          id: node.data.id,
        },
      };
    });
    updateFlowGraph({
      flow_id: slug,
      nodes: JSON.stringify({ data: minimizedNodes }),
      edges: JSON.stringify({ data: getEdges() }),
      snap: imageString,
    }).finally(() => {
      setSavingGraph(false);
    });
  };

  return (
    <AppNavIconItem
      loading={savingGraph}
      disable={savingGraph || !graphHaveChanges}
      hoverLabel="Ctrl+S"
      iconName="save"
      label="Save"
      onClick={onSaveFlow}
    />
  );
};

export default SaveFlowButton;
