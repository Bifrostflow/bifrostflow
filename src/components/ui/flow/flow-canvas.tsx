'use client';
import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlow,
  reconnectEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';

import { DefaultNode } from '@/components/ui/nodes/default';
import { ToolCategory, SystemTool } from '@/_backend/getSystemTools';
import { Menu, Play, Save, Trash2 } from 'lucide-react';
import { mapTypesToDeleteButtonColor } from '@/lib/utils';
import { EndNode } from '@/components/ui/nodes/end';
import { RoutingNode } from '@/components/ui/nodes/routing';
import { StartNode } from '@/components/ui/nodes/start';
import { StartPointNode } from '@/components/ui/nodes/start-point';
import SideDrawer from '@/components/ui/side-drawer';
import ExecuteFlow from '@/components/ui/execute-flow';
import { validateIndirectFlow } from '@/lib/validation';
import { toast } from 'sonner';
import { DraggablePanel } from '@/components/ui/draggable-panel';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { updateFlowGraph } from '@/_backend/private/projects/updateNodes';
import { useFlow } from '@/context/flow-context';
import EnterKeys, { APIData } from './enter-keys-area';

export default function FlowCanvas() {
  const { initialEdges, initialNodes, slug, apiKeys } = useFlow();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [idCounter, setIdCounter] = useState<number>(1);
  const [tabsToSelect, setTabsToSelect] = useState<ToolCategory[]>([
    'initiate',
  ]);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [initiatorType, setInitiatorType] = useState<'on_prompt' | string>();
  const [updatingNodes, setUpdatingNodes] = useState(false);
  const [userKeys, setUserKeys] = useState<APIData>(apiKeys);
  const [showKeysInputArea, setShowKeysInputArea] = useState(false);
  const edgeReconnectSuccessful = useRef(true);

  const isMainNodesSelected = useMemo(() => {
    const { length } = nodes.filter(n => {
      const data: SystemTool = n.data as unknown as SystemTool;
      return ['action', 'generate'].includes(data.category) ? true : false;
    });
    return length > 0;
  }, [nodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const sourceNode = nodes.find(n => n.id === params.source);
      if (!sourceNode) return;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setEdges(eds => addEdge({ ...params, tool_input: '' }, eds));
    },
    [nodes, setEdges],
  );
  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  useEffect(() => {
    const initiateNodes = nodes.filter(
      node => node.data.category === 'initiate',
    );
    if (initiateNodes.length === 0) {
      setTabsToSelect(['initiate']);
    } else if (isMainNodesSelected) {
      setTabsToSelect(['conditional', 'action', 'generate', 'close']);
    } else {
      setTabsToSelect(['conditional', 'action', 'generate']);
    }
  }, [nodes, isMainNodesSelected]);
  useEffect(() => {
    const sanitizedNodes = initialNodes.map(node => mapNodesDataToNodes(node));
    setNodes(sanitizedNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNodes]);

  const mapNodesDataToNodes = (node: Node) => {
    if (node.data.category === 'initiate') {
      if (!!node?.data?.type) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setInitiatorType(node.data.type);
      }
    }
    const newNode: Node = {
      ...node,
      id: node.id,
      type: node.type,
      data: {
        ...node.data,
        onClick: () => {
          setDrawerOpen(true);
        },
        delete: (
          <Trash2
            size={10}
            color={
              mapTypesToDeleteButtonColor[
                node.data.category as unknown as ToolCategory
              ]
            }
            onClick={() => {
              handleRemoveNode(node.id);
            }}
          />
        ),
        executeFlow: <ExecuteFlow onExecuteFlow={onExecuteFlow} />,
      } as unknown as Record<string, unknown>,
      position: node.position,
    };
    return newNode;
  };
  const validateRequiredKeys = () => {
    const { requiredKeys } = checkIfAPIKeyRequired();
    let fieldCounter = 0;
    for (let i = 0; i < Object.keys(requiredKeys).length; i++) {
      const key = Object.keys(requiredKeys)[i];
      const found = Object.keys(userKeys).find(
        apiKeyLabel => apiKeyLabel === key,
      );
      if (found) {
        fieldCounter++;
      }
    }
    return fieldCounter === Object.keys(requiredKeys).length;
  };
  const handleAddNode = (node: SystemTool) => {
    const id = `${idCounter}-${node.id}`;
    if (node.category === 'initiate') {
      setInitiatorType(node.type);
    }

    const newNode: Node = {
      id,
      type: node.category || 'default',
      data: {
        ...node,
        onClick: () => {
          setDrawerOpen(true);
        },
        delete: (
          <Trash2
            size={10}
            color={mapTypesToDeleteButtonColor[node.category]}
            onClick={() => {
              handleRemoveNode(id);
            }}
          />
        ),
        executeFlow: <ExecuteFlow onExecuteFlow={onExecuteFlow} />,
      } as unknown as Record<string, unknown>,
      position: { x: 250, y: 250 },
    };
    setIdCounter(id => id + 1);
    setNodes(nds => {
      if (newNode.data.category === 'initiate') {
        const filterStartPoint = nds.filter(
          n => n.data.category !== 'start-point',
        );
        return [...filterStartPoint, newNode];
      } else {
        return [...nds, newNode];
      }
    });
  };

  const handleRemoveNode = (id: string) => {
    setNodes(nds => nds.filter(node => node.id !== id));
    setEdges(eds =>
      eds.filter(edge => edge.source !== id && edge.target !== id),
    );
  };
  const onExecuteFlow = async () => {
    const { isKeyRequire } = checkIfAPIKeyRequired();
    if (!isKeyRequire) {
      runFlow();
    } else {
      if (!validateRequiredKeys()) {
        setShowKeysInputArea(true);
      } else {
        runFlow();
      }
    }
  };

  // FIXME: track saved or unsaved changes
  const saveFlowHandler = () => {
    setUpdatingNodes(true);
    const minimizedNodes = nodes.map((node: Node): Node => {
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
      edges: JSON.stringify({ data: edges }),
    }).finally(() => {
      setUpdatingNodes(false);
    });
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
        setShowActionPanel(true);
      } catch (error) {
        console.log(error);
      } finally {
        setUpdatingNodes(false);
      }
    } else {
      toast('Incomplete flow for graph.');
    }
  };
  const onSaveFlow = () => {
    const isValid = validateIndirectFlow(edges);
    if (isValid) {
      saveFlowHandler();
    } else {
      toast('Incomplete flow for graph.');
    }
  };
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true;
      setEdges(els => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges],
  );

  const onReconnectEnd = useCallback(
    (_noe: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges(eds => eds.filter(e => e.id !== edge.id));
      }

      edgeReconnectSuccessful.current = true;
    },
    [setEdges],
  );
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
  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <ReactFlow
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          draggable={false}
          nodes={nodes}
          edges={edges}
          nodeTypes={{
            custom: DefaultNode,
            default: DefaultNode,
            start_point: props => (
              <StartPointNode
                {...props}
                onPress={() => {
                  setDrawerOpen(true);
                }}
              />
            ),
            conditional: RoutingNode,
            action: DefaultNode,
            generate: DefaultNode,
            initiate: StartNode,
            close: EndNode,
          }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView>
          <Background
            color="var(--color-zinc-500)"
            size={1}
            gap={16}
            bgColor="var(--color-zinc-900)"
          />
          <MiniMap
            maskColor="var(--color-zinc-800)"
            bgColor="var(--color-zinc-700)"
            nodeColor={(node: Node) => {
              if (node.data.category === 'initiate')
                return 'var(--color-emerald-400)';
              if (node.data.category === 'start_point')
                return 'var(--color-zinc-700)';
              if (node.data.category === 'close') return 'var(--color-red-400)';
              if (node.data.category === 'conditional')
                return 'var(--color-lime-400)';
              return 'var(--color-cyan-400)';
            }}
          />
          <div className="pr-2 m-4 bg-zinc-700/00 w-[20%] flex justify-between items-center gap-1 absolute right-0 z-1000">
            <div className="flex gap-3">
              {/* <div className="bg-zinc-700 px-3 py-1 text-zinc-200 text-sm rounded-xs hover:text-blue-100 hover:bg-gradient-to-b hover:from-zinc-700 hover:to-zinc-500/50">
                Save
              </div> */}
              {/* <div className=" px-5 py-2 cursor-pointer rounded-full text-zinc-200 text-sm bg-gradient-to-br from-blue-400 to-indigo-800 hover:text-blue-100 transition-all duration-50 ease-linear">
                Save
              </div> */}
              <button
                onClick={() => setShowKeysInputArea(true)}
                className=" px-5 py-2 cursor-pointer rounded-full text-white text-sm bg-gradient-to-br from-green-400 to-green-800  transition-all duration-50 ease-linear active:pb-1.5 active:pt-2.5 flex justify-between items-center gap-1">
                <Play className="h-[16px] w-[16px]" />
                Manage Keys
              </button>
              <div
                onClick={onExecuteFlow}
                className=" px-5 py-2 cursor-pointer rounded-full text-white text-sm bg-gradient-to-br from-green-400 to-green-800  transition-all duration-50 ease-linear active:pb-1.5 active:pt-2.5 flex justify-between items-center gap-1">
                <Play className="h-[16px] w-[16px]" />
                Run
              </div>
              <button
                disabled={updatingNodes}
                onClick={onSaveFlow}
                className=" px-5 py-2 cursor-pointer rounded-full text-white text-sm bg-gradient-to-br from-green-400 to-green-800  transition-all duration-50 ease-linear active:pb-1.5 active:pt-2.5 flex justify-between items-center gap-1">
                <Save className="h-[16px] w-[16px]" />
                {updatingNodes ? 'Saving..' : 'Save'}
              </button>
              <Link
                href={`/flow/edit/${slug}`}
                className=" px-5 py-2 cursor-pointer rounded-full text-white text-sm bg-gradient-to-br from-green-400 to-green-800  transition-all duration-50 ease-linear active:pb-1.5 active:pt-2.5 flex justify-between items-center gap-1">
                <Save className="h-[16px] w-[16px]" />
                Edit
              </Link>
              {/* <div className=" px-5 py-2 cursor-pointer rounded-full text-zinc-200 text-sm bg-gradient-to-br from-fuchsia-400 to-indigo-800 hover:text-teal-100 transition-all duration-50 ease-linear">
                Load
              </div> */}
              {/* <div className=" px-5 py-2 cursor-pointer rounded-full text-zinc-200 text-sm bg-gradient-to-br from-stone-500 to-indigo-800 hover:text-purple-100 transition-all duration-50 ease-linear">
                Settings
              </div> */}
              {/* <div className="bg-zinc-700 px-3 py-1 text-zinc-200 text-sm rounded-xs hover:text-blue-100 hover:bg-gradient-to-b hover:from-zinc-700 hover:to-zinc-500/50">
                Load
              </div> */}
            </div>
            <div className="flex justify-start items-center">
              <button
                onClick={() => {
                  setDrawerOpen(true);
                }}
                className="text-zinc-200 hover:text-zinc-100 bg-gradient-to-br from-green-600 to-indigo-800 p-2 rounded-full">
                <Menu />
              </button>
            </div>
          </div>
          <DraggablePanel
            flow_id={slug}
            onClose={() => setShowActionPanel(false)}
            edges={edges}
            visible={showActionPanel}
            initiatorType={initiatorType}
          />
          <Controls position="bottom-right" orientation="horizontal" />
        </ReactFlow>
        <EnterKeys
          onKeysSaved={resData => {
            setShowKeysInputArea(false);
            setUserKeys(resData);
          }}
          apiDataFields={checkIfAPIKeyRequired().requiredKeys}
          onClose={() => setShowKeysInputArea(false)}
          open={showKeysInputArea}
        />
      </div>
      <SideDrawer
        activeTabs={tabsToSelect}
        onAddNode={handleAddNode}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      />
    </div>
  );
}
