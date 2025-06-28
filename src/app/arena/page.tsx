'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import '@xyflow/react/dist/style.css';
import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlow,
  ReactFlowProvider,
  reconnectEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';

import { DefaultNode } from '@/components/ui/nodes/default';
import { NodeCategory, SystemNode } from '@/_backend/getSystemNodes';
import { Menu, Play, Trash2 } from 'lucide-react';
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
import { HeaderName } from '@/components/ui/header-name';
import { StickyBanner } from '@/components/ui/sticky-banner';

const start_point = {
  id: '0-start_point',
  type: 'start_point',
  data: {
    label: '',
    category: 'start-point',
  },
  position: { x: 250, y: 250 },
  draggable: false,
};

const initialNodes: Node[] = [start_point];
const initialEdges: Edge[] = [];

const FlowCanvas: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [idCounter, setIdCounter] = useState<number>(1);
  const [tabsToSelect, setTabsToSelect] = useState<NodeCategory[]>([
    'initiate',
  ]);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [initiatorType, setInitiatorType] = useState<'on_prompt' | string>();
  const edgeReconnectSuccessful = useRef(true);

  const isMainNodesSelected = useMemo(() => {
    const { length } = nodes.filter(n => {
      const data: SystemNode = n.data as unknown as SystemNode;
      return ['action', 'generate'].includes(data.category) ? true : false;
    });
    return length > 0;
  }, [nodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const sourceNode = nodes.find(n => n.id === params.source);
      if (!sourceNode) return;
      setEdges(eds => addEdge(params, eds));
    },
    [nodes, setEdges],
  );
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
  const isStarted = useMemo(() => {
    return nodes.filter(n => n.data.category === 'start-point').length === 0;
  }, [nodes]);

  const handleAddNode = (node: SystemNode) => {
    const id = `${idCounter}-${node._id}`;
    if (node.category === 'initiate') {
      setInitiatorType(node.type);
    }

    const newNode: Node = {
      id,
      type: node.category || 'default',
      data: {
        ...node,
        onClick: (id: string) => {
          console.log(id);
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
    console.log(newNode);
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
  console.log(edges);
  const onExecuteFlow = () => {
    const isValid = validateIndirectFlow(edges);
    if (isValid) {
      setShowActionPanel(true);
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
          <StickyBanner className="bg-gradient-to-b from-emerald-700 to-emerald-900">
            <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
              Under Construction till new features,{' '}
              <b>Deadline is 30th June 2025</b>
            </p>
          </StickyBanner>
          <HeaderName isStart={isStarted} />
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
          <div className="pr-2 m-4 bg-zinc-700/00 w-[10%] flex justify-between items-center gap-1 absolute right-0 z-1000">
            <div className="flex gap-3">
              {/* <div className="bg-zinc-700 px-3 py-1 text-zinc-200 text-sm rounded-xs hover:text-blue-100 hover:bg-gradient-to-b hover:from-zinc-700 hover:to-zinc-500/50">
                Save
              </div> */}
              {/* <div className=" px-5 py-2 cursor-pointer rounded-full text-zinc-200 text-sm bg-gradient-to-br from-blue-400 to-indigo-800 hover:text-blue-100 transition-all duration-50 ease-linear">
                Save
              </div> */}
              <div
                onClick={onExecuteFlow}
                className=" px-5 py-2 cursor-pointer rounded-full text-white text-sm bg-gradient-to-br from-green-400 to-green-800  transition-all duration-50 ease-linear active:pb-1.5 active:pt-2.5 flex justify-between items-center gap-1">
                <Play className="h-[16px] w-[16px]" />
                Run
              </div>
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
            onClose={() => setShowActionPanel(false)}
            edges={edges}
            visible={showActionPanel}
            initiatorType={initiatorType}
          />

          <Controls position="bottom-right" orientation="horizontal" />
        </ReactFlow>
      </div>
      <SideDrawer
        activeTabs={tabsToSelect}
        onAddNode={handleAddNode}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      />
    </div>
  );
};

const Arena: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
};

export default Arena;
