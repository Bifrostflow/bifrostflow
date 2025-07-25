'use client';
import { SystemTool, ToolCategory } from '@/_backend/getSystemTools';
import {
  ChunkNodeData,
  ChunkResponse,
  ChunkResponseData,
} from '@/_backend/runFlow';
import { APIData } from '@/components/ui/flow/enter-keys-area';
import { InitiatorType } from '@/components/ui/flow/flow-canvas';
import { showToast } from '@/components/ui/toast';
import print from '@/lib/print';

import {
  Edge,
  Node,
  OnEdgesChange,
  OnNodesChange,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type FlowContextType = {
  slug: string;
  apiKeys: APIData;
  initialNodes: Node[];
  initialEdges: Edge[];
  setAPIKeys: (data: APIData) => void;
  showKeyInputArea: boolean;
  setShowKeyInputArea: (visible: boolean) => void;
  actionPanelVisible: boolean;
  setActionPanelVisible: (visible: boolean) => void;
  runFlowHandler: (body: FlowBody) => void;
  loaderUIText: string[];
  chunkResponse: ChunkResponse | undefined;
  setChunkResponse: (value: ChunkResponse | undefined) => void;
  runningFlow: boolean;
  name: string;
  paramShowRequest: 'edit' | 'other' | undefined;
  initiatorTypeValue?: InitiatorType;
  updateInitiatorTypeValue: (type: InitiatorType) => void;
  graphHaveChanges: boolean;
  updateLastSavedGraph: (nodes: Node[], edges: Edge[]) => void;

  nodesOG: Node[];
  edgesOG: Edge[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  setNodes: Dispatch<SetStateAction<Node[]>>;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;

  handleAddNode: (systemTool: SystemTool) => void;
  toolDrawerOpen: boolean;
  setToolDrawerOpen: (value: boolean) => void;
  isMainNodesSelected: boolean;
  tabsToSelectValue: ToolCategory[];
  showEditDrawer: boolean;
  showFlowDocs: boolean;
  setShowFlowDocs: (value: boolean) => void;
  setShowEditDrawer: (value: boolean) => void;
  flowName: string;
  setFlowName: (value: string) => void;
  showMore: boolean;
  setShowMore: (value: boolean) => void;
  uploadingAudio: boolean;
  setUploadingAudio: (value: boolean) => void;
  setRunningFlow: (value: boolean) => void;
  currentNodeInProcess: ChunkNodeData | undefined;
  setUILoaderText: Dispatch<SetStateAction<string[]>>;
};

const FlowContext = createContext<FlowContextType | undefined>(undefined);

interface FlowBody {
  message: string;
}

export const FlowProvider = ({
  children,
  slug,
  defaultEdges,
  defaultNodes,
  apiKeys,
  name,
  paramShowRequest,
}: {
  children: ReactNode;
  slug: string;
  name: string;
  apiKeys: APIData;
  defaultNodes: Node[];
  defaultEdges: Edge[];
  paramShowRequest?: 'edit' | 'other';
}) => {
  const [initiatorType, setInitiatorType] = useState<
    InitiatorType | undefined
  >();
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [APIKeys, setAPIKeys] = useState<APIData>(apiKeys);
  const [showKeyInputArea, setShowKeyInputArea] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showFlowDocs, setShowFlowDocs] = useState(false);
  const [UILoaderText, setUILoaderText] = useState<string[]>([]);
  const [chunkResponse, setChunkResponse] = useState<ChunkResponse>();
  const [runningFlow, setRunningFlow] = useState(false);
  const [lastUpdatedNodes, setlastUpdatedNodes] = useState<Node[]>([]);
  const [lastUpdatedEdges, setlastUpdatedEdges] = useState(defaultEdges);
  const [toolDrawerOpen, setToolDrawerOpen] = useState(false);
  const [idCounter, setIdCounter] = useState<number>(1);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  // noded and edges
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [flowName, setFlowName] = useState(name);
  const [showMore, setShowMore] = useState(false);
  const [currentNodeInProcess, setCurrentNodeInProcess] =
    useState<ChunkNodeData>();

  // noded and edges
  useEffect(() => {
    const sanitizedNodes = defaultNodes.map(node => mapNodesDataToNodes(node));
    setNodes(sanitizedNodes);
    setlastUpdatedNodes(sanitizedNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultNodes]);

  const isMainNodesSelected = useMemo(() => {
    const { length } = nodes.filter(n => {
      const data: SystemTool = n.data as unknown as SystemTool;
      return ['action', 'generate'].includes(data.category) ? true : false;
    });
    return length > 0;
  }, [nodes]);
  const tabsToSelectValue: ToolCategory[] = useMemo(() => {
    const initiateNodes = nodes.filter(
      node => node.data.category === 'initiate',
    );
    if (initiateNodes.length === 0) {
      return ['initiate'];
    } else if (isMainNodesSelected) {
      return ['conditional', 'action', 'generate', 'close'];
    } else {
      return ['conditional', 'action', 'generate'];
    }
  }, [nodes, isMainNodesSelected]);
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
    }
    return needUpdate;
  }, [edges, nodes, lastUpdatedEdges, lastUpdatedNodes]);

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
        node_id: node.id,
      } as unknown as Record<string, unknown>,
      position: node.position,
    };
    return newNode;
  };

  const runFlowHandler = async ({ message }: FlowBody) => {
    if (runningFlow) return;
    setRunningFlow(() => true);
    setUILoaderText(prev => [...prev, 'Let me prepare myself.']);
    setChunkResponse(undefined);
    try {
      const res = await fetch('/api/run-flow', {
        method: 'POST',
        body: JSON.stringify({ input: message, data: edges, flow_id: slug }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.body) {
        console.error('No response body');
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const responseArray: ChunkResponse[] = [];
      setUILoaderText(prev => [
        ...prev,
        "I've shared your query with the relevant decision-makers.",
      ]);
      print(UILoaderText);
      await new Promise(resolve => setTimeout(resolve, 300));
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const json: ChunkResponseData = JSON.parse(
                line.replace('data: ', ''),
              );
              if (json.error) {
                showToast({ description: json.error, type: 'error' });
              }
              setCurrentNodeInProcess(json.node_data);
              responseArray.push(json.response);
              setChunkResponse(json.response);

              if (json?.response?.type === 'show-documents') {
                setShowMore(true);
                setShowFlowDocs(true);
                showToast({
                  description: json.ui_response,
                  type: 'success',
                  button: { label: 'Check Here.', onClick() {} },
                });
              }
              setUILoaderText(prev => [...prev, json.ui_response]);
              await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (err) {
              console.error('Error parsing JSON', err);
            }
          }
        }
      }
      setCurrentNodeInProcess(undefined);
      if (responseArray[responseArray.length - 1].type === '')
        print('LAST RES: ', responseArray[responseArray.length - 1]);
    } catch (error) {
      print(error);
      // setUILoaderText([]);
      setRunningFlow(false);
    } finally {
      setUILoaderText([]);
      setRunningFlow(false);
    }
  };
  const handleAddNode = (node: SystemTool) => {
    const id = `${idCounter}-${node.id}`;
    console.log(id);

    if (node.category === 'initiate') {
      setInitiatorType(node.type as InitiatorType);
    }

    const newNode: Node = {
      id,
      type: node.category || 'default',
      data: {
        ...node,
        node_id: id,
      } as unknown as Record<string, unknown>,
      position: { x: 250, y: 250 },
    };
    setIdCounter(pid => pid + 1);
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

  return (
    <FlowContext.Provider
      value={{
        setRunningFlow,
        setUploadingAudio,
        uploadingAudio,
        setShowFlowDocs,
        showFlowDocs,
        currentNodeInProcess: currentNodeInProcess,
        updateLastSavedGraph(nodes, edges) {
          setlastUpdatedEdges(edges);
          setlastUpdatedNodes(nodes);
        },
        initiatorTypeValue: initiatorType,
        updateInitiatorTypeValue: setInitiatorType,
        slug,
        initialEdges: defaultEdges,
        initialNodes: defaultNodes,
        apiKeys: APIKeys,
        setAPIKeys,
        setShowKeyInputArea: setShowKeyInputArea,
        showKeyInputArea,
        actionPanelVisible: showActionPanel,
        setActionPanelVisible: setShowActionPanel,
        runFlowHandler: runFlowHandler,
        setChunkResponse,
        chunkResponse,
        loaderUIText: UILoaderText,
        runningFlow,
        paramShowRequest,
        name,
        graphHaveChanges: graphReadyToSave,
        // ----
        edgesOG: edges,
        nodesOG: nodes,
        onEdgesChange,
        onNodesChange,
        setEdges,
        setNodes,
        // ----
        handleAddNode,
        setToolDrawerOpen,
        toolDrawerOpen,
        isMainNodesSelected,
        tabsToSelectValue,
        // ------
        setShowEditDrawer,
        showEditDrawer,
        // ------
        flowName,
        setFlowName,
        showMore,
        setShowMore,
        setUILoaderText,
      }}>
      {children}
    </FlowContext.Provider>
  );
};

// 3️⃣ Custom Hook (optional but clean)
export const useFlow = (): FlowContextType => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
export const useGraphOP = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  const { edgesOG, nodesOG, onEdgesChange, onNodesChange, setEdges, setNodes } =
    context;
  return { edgesOG, nodesOG, onEdgesChange, onNodesChange, setEdges, setNodes };
};
