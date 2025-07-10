'use client';
import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  getNodesBounds,
  getViewportForBounds,
  MiniMap,
  Node,
  ReactFlow,
  reconnectEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { motion } from 'framer-motion';
import { DefaultNode } from '@/components/ui/nodes/default';
import { ToolCategory, SystemTool } from '@/_backend/getSystemTools';
import { BugIcon, Home, Key, Menu, Save, Trash2 } from 'lucide-react';
import { mapTypesToDeleteButtonColor } from '@/lib/utils';
import { EndNode } from '@/components/ui/nodes/end';
import { RoutingNode } from '@/components/ui/nodes/routing';
import { StartNode } from '@/components/ui/nodes/start';
import { StartPointNode } from '@/components/ui/nodes/start-point';
import SideDrawer from '@/components/ui/side-drawer';
import { validateIndirectFlow } from '@/lib/validation';
import { toast } from 'sonner';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { updateFlowGraph } from '@/_backend/private/projects/updateNodes';
import { useFlow } from '@/context/flow-context';
import EnterKeys from './enter-keys-area';
import { toPng } from 'html-to-image';
import { fallback } from '@/lib/fallback-flow-snap';

import { useRouter } from 'next/navigation';
import { RunButton } from './run-flow-button';
import { DraggablePanel } from '../draggable-panel';
import { Button } from '../button';
import ResponsePreview from './response-preview';
import print from '@/lib/print';
import Drawer from '../drawer';
import EditFlow from './edit-flow';

export type InitiatorType = 'on_prompt' | 'on_start';

export default function FlowCanvas() {
  const {
    initialEdges,
    initialNodes,
    slug,
    setShowKeyInputArea,
    showKeyInputArea,
    setAPIKeys,
    chunkResponse,
    loaderUIText,
    paramShowRequest,
  } = useFlow();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [idCounter, setIdCounter] = useState<number>(1);
  const [tabsToSelect, setTabsToSelect] = useState<ToolCategory[]>([
    'initiate',
  ]);
  // const [showActionPanel, setShowActionPanel] = useState(false);
  const [initiatorType, setInitiatorType] = useState<InitiatorType>();
  const [updatingNodes, setUpdatingNodes] = useState(false);
  const [lastUpdatedNodes, setlastUpdatedNodes] = useState<Node[]>([]);
  const [lastUpdatedEdges, setlastUpdatedEdges] = useState(initialEdges);
  const edgeReconnectSuccessful = useRef(true);
  const navigation = useRouter();
  useEffect(() => {
    if (paramShowRequest === 'edit') {
      setEditDrawerOpen(true);
    }
  }, [paramShowRequest]);
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
    setlastUpdatedNodes(sanitizedNodes);
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
      } as unknown as Record<string, unknown>,
      position: node.position,
    };
    return newNode;
  };

  const handleAddNode = (node: SystemTool) => {
    const id = `${idCounter}-${node.id}`;
    if (node.category === 'initiate') {
      setInitiatorType(node.type as InitiatorType);
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

  const getImage = async () => {
    const imageHeight = 1080;
    const imageWidth = 720;
    const nodesBounds = getNodesBounds(nodes);
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
  // FIXME: track saved or unsaved changes
  const saveFlowHandler = (imageString: string) => {
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
      snap: imageString,
    }).finally(() => {
      setUpdatingNodes(false);
    });
  };

  const onSaveFlow = async () => {
    const isValid = validateIndirectFlow(edges);
    if (isValid) {
      const imageString = await getImage();
      saveFlowHandler(imageString || fallback);
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
      setEdges(els =>
        reconnectEdge({ ...oldEdge, animated: true }, newConnection, els).map(
          e => ({ ...e, animated: true, type: 'smoothstep' }),
        ),
      );
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

  const graphReadyToSave = useMemo(() => {
    let needUpdate = false;
    if (JSON.stringify(edges) !== JSON.stringify(lastUpdatedEdges)) {
      needUpdate = true;
    }
    const compareDataCurrentNode = nodes.map(n => {
      return {
        node_id: n.id,
        type: n.type,
        data_id: n.data.id,
        data_state: n.data.state,
      };
    });
    const compareDataLastUpdatedNode = lastUpdatedNodes.map(n => {
      return {
        node_id: n.id,
        type: n.type,
        data_id: n.data.id,
        data_state: n.data.state,
      };
    });
    if (
      JSON.stringify(compareDataCurrentNode) !==
      JSON.stringify(compareDataLastUpdatedNode)
    ) {
      needUpdate = true;
      // id,type,
      // data->id,state,
    }
    return needUpdate;
  }, [edges, nodes, lastUpdatedEdges, lastUpdatedNodes]);

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <ReactFlow
          onChange={() => {
            print('view changed');
          }}
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
            position="bottom-left"
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
          <div className="px-4 my-4 bg-zinc-700/00 w-full flex justify-between items-center gap-1 absolute right-0 z-1000">
            <Button
              onClick={navigation.back}
              className=" px-5 py-2 cursor-pointer rounded-full text-white text-sm bg-gradient-to-br from-green-400 to-green-800  transition-all duration-50 ease-linear active:pb-1.5 active:pt-2.5 flex justify-between items-center gap-1">
              <Home className="h-[16px] w-[16px]" />
              Home
            </Button>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowKeyInputArea(true)}
                className=" px-5 py-2 cursor-pointer rounded-full text-white text-sm bg-gradient-to-br from-green-400 to-green-800  transition-all duration-50 ease-linear active:pb-1.5 active:pt-2.5 flex justify-between items-center gap-1">
                <Key className="h-[16px] w-[16px]" />
                Manage Keys
              </Button>

              <RunButton
                initiatorType={initiatorType}
                edges={edges}
                nodes={nodes}
                needUpdate={graphReadyToSave}
                onUpdateGraph={(nodes, edges) => {
                  setlastUpdatedEdges(edges);
                  setlastUpdatedNodes(nodes);
                }}
              />

              <Button
                disabled={updatingNodes || !graphReadyToSave}
                onClick={onSaveFlow}
                className=" px-5 py-2 cursor-pointer rounded-full text-white text-sm bg-gradient-to-br from-green-400 to-green-800  transition-all duration-50 ease-linear active:pb-1.5 active:pt-2.5 flex justify-between items-center gap-1
                disabled:from-gray-400
                disabled:to-gray-500
                disabled:opacity-100
                ">
                <Save className="h-[16px] w-[16px]" />
                {updatingNodes ? 'Saving..' : 'Save'}
              </Button>
              <Button
                disabled={updatingNodes}
                onClick={onSaveFlow}
                className=" px-5 py-2 cursor-pointer rounded-full text-white text-sm bg-gradient-to-br from-green-400 to-green-800  transition-all duration-50 ease-linear active:pb-1.5 active:pt-2.5 flex justify-between items-center gap-1">
                <BugIcon />
                Report Bug
              </Button>
              <Link
                href={`/flow/edit/${slug}`}
                className=" px-5 py-2 cursor-pointer rounded-full text-white text-sm bg-gradient-to-br from-green-400 to-green-800  transition-all duration-50 ease-linear active:pb-1.5 active:pt-2.5 flex justify-between items-center gap-1">
                <Save className="h-[16px] w-[16px]" />
                Edit
              </Link>
              <div className="flex justify-start items-center">
                <Button
                  onClick={() => {
                    setDrawerOpen(true);
                  }}
                  className="text-zinc-200 hover:text-zinc-100 bg-gradient-to-br from-green-600 to-indigo-800 p-2 rounded-full">
                  <Menu />
                </Button>
              </div>
            </div>
          </div>
          <Controls position="bottom-right" orientation="horizontal" />
        </ReactFlow>
        <EnterKeys
          onKeysSaved={resData => {
            setShowKeyInputArea(false);
            setAPIKeys(resData);
          }}
          apiDataFields={checkIfAPIKeyRequired().requiredKeys}
          onClose={() => setShowKeyInputArea(false)}
          open={showKeyInputArea}
        />
        {!!chunkResponse && <ResponsePreview data={{ ...chunkResponse }} />}
        <DraggablePanel edges={edges} initiatorType={initiatorType} />
        {loaderUIText.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.2,
              delay: 0.1,
            }}
            className="p-5 min-w-[200px] min-h-[200px] rounded-sm bg-white absolute bottom-10 left-10 transition-all ease-in duration-100">
            {loaderUIText.map((text, i) => {
              return (
                <p
                  key={`${text}-${i}`}
                  className="italic text-md text-black font-semibold p-2 transition-all duration-200 ease-in-out tracking-tight">
                  {text}
                </p>
              );
            })}
          </motion.div>
        )}
      </div>
      <Drawer
        width={'w-[400px]'}
        height={'h-[300px]'}
        className="top-[110px] left-auto right-[10px] sm:top-[60px] sm:left-auto sm:right-[10px]"
        position="top"
        visible={editDrawerOpen}
        onClose={() => {
          setEditDrawerOpen(false);
        }}>
        <EditFlow slug={slug} />
      </Drawer>
      <SideDrawer
        activeTabs={tabsToSelect}
        onAddNode={handleAddNode}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      />
    </div>
  );
}
