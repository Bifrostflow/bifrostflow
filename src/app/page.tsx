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
import { NodeCategory, SystemNode } from '@/backend/getSystemNodes';
import { Menu, Trash2 } from 'lucide-react';
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

const start_point = {
  id: '0-start_point',
  type: 'start_point',
  data: {
    label: '',
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
  const isStartSelected = useMemo(
    () =>
      nodes.find(n => {
        const data: SystemNode = n.data as unknown as SystemNode;
        return data.category === 'initiate';
      }),
    [nodes],
  );
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
    if (isMainNodesSelected) {
      setTabsToSelect(['conditional', 'action', 'generate', 'close']);
    } else if (isStartSelected) {
      setNodes(nds => nds.filter(nd => nd.type !== 'start_point'));
      setTabsToSelect(['conditional', 'action', 'generate']);
    } else {
      setNodes([start_point]);
      setTabsToSelect(['initiate']);
    }
  }, [isMainNodesSelected, isStartSelected, setNodes]);

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
    setNodes(nds => [...nds, newNode]);
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
          {/* <div className="p-2 m-1 bg-zinc-700 w-[50%] flex justify-between items-center gap-1 absolute right-0 z-1000"> */}
          <div className="p-2 m-4 bg-zinc-700 w-[40px] flex justify-center items-center gap-1 absolute right-0 z-1000">
            {/* <div className="flex gap-1">
              <div className="bg-zinc-700 px-3 py-1 text-zinc-200 text-sm rounded-xs hover:text-blue-100 hover:bg-gradient-to-b hover:from-zinc-700 hover:to-zinc-500/50">
                Save
              </div>
              <div className="bg-zinc-700 px-3 py-1 text-zinc-200 text-sm rounded-xs hover:text-blue-100 hover:bg-gradient-to-b hover:from-zinc-700 hover:to-zinc-500/50">
                Run
              </div>
              <div className="bg-zinc-700 px-3 py-1 text-zinc-200 text-sm rounded-xs hover:text-blue-100 hover:bg-gradient-to-b hover:from-zinc-700 hover:to-zinc-500/50">
                Load
              </div>
            </div> */}
            <div className="flex justify-start items-center">
              <button
                onClick={() => {
                  setDrawerOpen(true);
                }}
                className="text-zinc-200 hover:text-zinc-400">
                <Menu />
              </button>
            </div>
          </div>
          <button
            onClick={onExecuteFlow}
            className="
            disabled:from-zinc-800
            disabled:to-zinc-700
            disabled:active:scale-[1]
            absolute bottom-[20px]
            right-[230px]
            z-10 
            width-[100px]
                        bg-gradient-to-tl from-yellow-800 to-orange-400
                        hover:from-yellow-800
                        hover:to-orange-700
                        active:from-yellow-800
                        active:to-orange-500
                        text-white
                        rounded-sm
                        px-4 py-2
                        shadow-lg
                        border-0 
                        active:scale-[1.03]
                        text-sm font-semibold
                        transition-all duration-100 ease-[cubic-bezier(0.34, 1.56, 0.64, 1)]
            ">
            Run Flow
          </button>

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

const App: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
};

export default App;
