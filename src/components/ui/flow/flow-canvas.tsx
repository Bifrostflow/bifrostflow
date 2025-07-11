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
import { motion } from 'framer-motion';
import { DefaultNode } from '@/components/ui/nodes/default';
import { EndNode } from '@/components/ui/nodes/end';
import { RoutingNode } from '@/components/ui/nodes/routing';
import { StartNode } from '@/components/ui/nodes/start';
import { StartPointNode } from '@/components/ui/nodes/start-point';
import SideDrawer from '@/components/ui/side-drawer';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useFlow, useGraphOP } from '@/context/flow-context';

import { DraggablePanel } from '../draggable-panel';

import ResponsePreview from './response-preview';
import print from '@/lib/print';
import Drawer from '../drawer';
import EditFlow from './edit-flow';
import { Typography } from '../typography';
import { Button } from '../button';

export type InitiatorType = 'on_prompt' | 'on_start';

export default function FlowCanvas() {
  const {
    initialEdges,
    slug,
    setShowKeyInputArea,
    showKeyInputArea,

    chunkResponse,
    loaderUIText,
    paramShowRequest,
    setToolDrawerOpen,
    toolDrawerOpen,
  } = useFlow();

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const edgeReconnectSuccessful = useRef(true);

  const { edgesOG, nodesOG, onEdgesChange, onNodesChange, setEdges } =
    useGraphOP();

  useEffect(() => {
    if (paramShowRequest === 'edit') {
      setEditDrawerOpen(true);
    }
  }, [paramShowRequest]);

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
  // const checkIfAPIKeyRequired = () => {
  //   const requiredKeys: Record<string, boolean> = {};
  //   for (let i = 0; i < nodesOG.length; i++) {
  //     const node = nodesOG[i];
  //     const nodeData = node.data as unknown as SystemTool;
  //     if (nodeData.require_key) {
  //       if (nodeData.key_name) {
  //         requiredKeys[nodeData.key_name] = true;
  //       }
  //     }
  //   }
  //   return { isKeyRequire: Object.keys(requiredKeys).length > 0, requiredKeys };
  // };

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
          <div className="px-4 my-4 bg-zinc-700/00 w-full flex justify-between items-center gap-1 absolute right-0 z-1000">
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
          </div>

          <Button
            className="absolute right-2 top-20 z-999"
            onClick={() => setToolDrawerOpen(true)}>
            Tools
          </Button>

          <Controls position="bottom-left" orientation="horizontal" />
        </ReactFlow>

        {/* <EnterKeys
          onKeysSaved={resData => {
            setShowKeyInputArea(false);
            setAPIKeys(resData);
          }}
          apiDataFields={checkIfAPIKeyRequired().requiredKeys}
          onClose={() => setShowKeyInputArea(false)}
          open={showKeyInputArea}
        /> */}
        {!!chunkResponse && <ResponsePreview data={{ ...chunkResponse }} />}
        <DraggablePanel />
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
      <Drawer
        width={'w-[400px]'}
        height={'h-fit'}
        className="top-[110px] left-auto right-[10px] sm:top-[70px] sm:left-auto sm:right-[10px]"
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
