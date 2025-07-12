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
} from '@xyflow/react';
import { DefaultNode } from '@/components/ui/nodes/default';
import { EndNode } from '@/components/ui/nodes/end';
import { RoutingNode } from '@/components/ui/nodes/routing';
import { StartNode } from '@/components/ui/nodes/start';
import { StartPointNode } from '@/components/ui/nodes/start-point';
import SideDrawer from '@/components/ui/side-drawer';

import { useCallback, useEffect, useRef } from 'react';
import { useFlow, useGraphOP } from '@/context/flow-context';

import { DraggablePanel } from '../draggable-panel';

import Drawer from '../drawer';

import { Button } from '../button';
import { SettingsIcon } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useThemeToggle } from '@/hooks/theme-toggle';

export type InitiatorType = 'on_prompt' | 'on_start';

export default function FlowCanvas() {
  const {
    initialEdges,
    setToolDrawerOpen,
    toolDrawerOpen,
    setActionPanelVisible,
    setShowEditDrawer,
    setShowKeyInputArea,
    setShowMore,
  } = useFlow();
  const { theme } = useThemeToggle();
  const edgeReconnectSuccessful = useRef(true);

  const { edgesOG, nodesOG, onEdgesChange, onNodesChange, setEdges } =
    useGraphOP();
  useHotkeys('ctrl+t', () => {
    showToolHandler();
  });
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const sourceNode = nodesOG.find(n => n.id === params.source);
      if (!sourceNode) return;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setEdges(eds => addEdge({ ...params, tool_input: '' }, eds));
    },
    [nodesOG, setEdges],
  );
  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

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
  const showToolHandler = () => {
    setToolDrawerOpen(!toolDrawerOpen);
    setActionPanelVisible(false);
    setShowEditDrawer(false);
    setShowKeyInputArea(false);
    setShowMore(false);
  };
  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <ReactFlow
          colorMode={theme}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          draggable={false}
          nodes={nodesOG}
          edges={edgesOG}
          nodeTypes={{
            custom: DefaultNode,
            default: DefaultNode,
            start_point: props => (
              <StartPointNode
                {...props}
                onPress={() => {
                  setToolDrawerOpen(true);
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
            size={0.8}
            gap={20}
            bgColor="var(--c-background)"
          />
          <MiniMap
            position="bottom-left"
            maskColor="var(--c-secondary)"
            bgColor="var(--c-background)"
            color="var(--c-background-color)"
            nodeColor={(node: Node) => {
              if (node.data.category === 'initiate')
                return 'var(--color-emerald-400)';
              if (node.data.category === 'start_point')
                return 'var(--c-background)';
              if (node.data.category === 'close') return 'var(--color-red-400)';
              if (node.data.category === 'conditional')
                return 'var(--color-lime-400)';
              return 'var(--color-cyan-400)';
            }}
          />
          {/* <div className="flex gap-3">
              <Button
                onClick={() => setShowKeyInputArea(true)}
                className=" px-5 py-2 cursor-pointer rounded-full text-white text-sm bg-gradient-to-br from-green-400 to-green-800  transition-all duration-50 ease-linear active:pb-1.5 active:pt-2.5 flex justify-between items-center gap-1">
                <Key className="h-[16px] w-[16px]" />
                Manage Keys
              </Button>


             
              <Button
                disabled={updatingNodes}
                onClick={onSaveFlow}
                className=" px-5 py-2 cursor-pointer rounded-full text-white text-sm bg-gradient-to-br from-green-400 to-green-800  transition-all duration-50 ease-linear active:pb-1.5 active:pt-2.5 flex justify-between items-center gap-1">
                <BugIcon />
                Report Bug
              </Button>
              <div className="flex justify-start items-center">
                <Button
                  onClick={() => {
                    setDrawerOpen(true);
                  }}
                  className="text-zinc-200 hover:text-zinc-100 bg-gradient-to-br from-green-600 to-indigo-800 p-2 rounded-full">
                  <Menu />
                </Button>
              </div>
            </div> */}

          <Button
            className="absolute right-2 top-20 z-999 group"
            onClick={showToolHandler}>
            Tools
            <SettingsIcon />
            <span className="hidden group-hover:flex">(Ctrl+T)</span>
          </Button>

          <Controls position="bottom-left" orientation="horizontal" />
        </ReactFlow>

        <DraggablePanel />
      </div>

      <Drawer
        // width={'w-[400px]'}
        height={'h-full'}
        className="top-[110px] left-auto right-[0px] sm:top-[64px] sm:left-auto sm:right-[0px] bg-c-surface w-[550px] max-h-full scroll-auto px-2 rounded-none  border-l-4 border-zinc-300 dark:border-zinc-500"
        position="right"
        visible={toolDrawerOpen}
        onClose={() => {
          setToolDrawerOpen(false);
        }}>
        <SideDrawer />
      </Drawer>
    </div>
  );
}
