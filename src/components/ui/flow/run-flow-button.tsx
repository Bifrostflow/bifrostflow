'use client';

import { SystemTool } from '@/_backend/getSystemTools';
import { useFlow } from '@/context/flow-context';
import { validateIndirectFlow } from '@/lib/validation';
import { Edge, Node } from '@xyflow/react';
import { Play } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../button';
import { updateFlowGraph } from '@/_backend/private/projects/updateNodes';
import { InitiatorType } from './flow-canvas';

type Props = {
  nodes: Node[];
  edges: Edge[];
  initiatorType?: InitiatorType;
};

export const RunButton = ({ nodes, edges, initiatorType }: Props) => {
  const {
    setShowKeyInputArea,
    apiKeys,
    slug,
    setActionPanelVisible,
    runFlowHandler,
    runningFlow,
  } = useFlow();
  const [updatingNodes, setUpdatingNodes] = useState(false);

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
  const runPressHandler = () => {
    const { isKeyRequire } = checkIfAPIKeyRequired();
    if (!isKeyRequire) {
      runFlow();
    } else {
      if (!validateRequiredKeys()) {
        setShowKeyInputArea(true);
      } else {
        runFlow();
      }
    }
  };

  const checkIfAPIKeyRequired = () => {
    const requiredKeys: Record<string, boolean> = {};
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
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
    if (initiatorType === 'on_prompt') {
      setActionPanelVisible(true);
    } else if (initiatorType === 'on_start') {
      runFlowHandler({ edges, message: 'ignore' });
    }
  };

  const runFlow = async () => {
    const isValid = validateIndirectFlow(edges);
    if (isValid) {
      setUpdatingNodes(true);
      try {
        await updateFlowGraph({
          flow_id: slug,
          nodes: JSON.stringify({ data: nodes }),
          edges: JSON.stringify({ data: edges }),
        });
        handleInitiatorRunner();
      } catch (error) {
        console.log(error);
      } finally {
        setUpdatingNodes(false);
      }
    } else {
      toast('Incomplete flow for graph.');
    }
  };
  return (
    <Button
      disabled={updatingNodes || !initiatorType || runningFlow}
      onClick={runPressHandler}
      className=" px-5 py-2 cursor-pointer rounded-full text-white text-sm bg-gradient-to-br from-green-400 to-green-800  transition-all duration-50 ease-linear active:pb-1.5 active:pt-2.5 flex justify-between items-center gap-1">
      <Play className="h-[16px] w-[16px]" />
      {`${runningFlow ? 'Running' : updatingNodes ? 'Saving...' : 'Run'}`}
    </Button>
  );
};
