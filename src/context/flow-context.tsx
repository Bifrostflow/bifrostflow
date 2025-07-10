'use client';
import { ChunkResponse, ChunkResponseData } from '@/_backend/runFlow';
import { APIData } from '@/components/ui/flow/enter-keys-area';
import print from '@/lib/print';
import { Edge, Node } from '@xyflow/react';
import { Link } from 'lucide-react';
import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'sonner';

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
  runningFlow: boolean;
};

const FlowContext = createContext<FlowContextType | undefined>(undefined);

interface FlowBody {
  message: string;
  edges: Edge[];
}

export const FlowProvider = ({
  children,
  slug,
  defaultEdges,
  defaultNodes,
  apiKeys,
}: {
  children: ReactNode;
  slug: string;
  apiKeys: APIData;
  defaultNodes: Node[];
  defaultEdges: Edge[];
}) => {
  const [APIKeys, setAPIKeys] = useState<APIData>(apiKeys);
  const [showKeyInputArea, setShowKeyInputArea] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [UILoaderText, setUILoaderText] = useState<string[]>([]);
  const [chunkResponse, setChunkResponse] = useState<ChunkResponse>();
  const [runningFlow, setRunningFlow] = useState(false);
  const runFlowHandler = async ({ edges, message }: FlowBody) => {
    setRunningFlow(true);
    setUILoaderText(prev => [...prev, 'Preparing Flow.']);
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
      setUILoaderText(prev => [...prev, 'Building Graph.']);
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
              responseArray.push(json.response);
              if (json.error) {
                toast(json.error || '');
              }
              if (json.response.type === 'show-documents') {
                toast(json.ui_response, { action: <Link /> });
              }
              setUILoaderText(prev => [...prev, json.ui_response]);
              await new Promise(resolve => setTimeout(resolve, 100));
            } catch (err) {
              console.error('Error parsing JSON', err);
            }
          }
        }
      }
      if (responseArray[responseArray.length - 1].type === '')
        print('LAST RES: ', responseArray[responseArray.length - 1]);
      setChunkResponse(responseArray[responseArray.length - 1]);
    } catch (error) {
      print(error);
      // setUILoaderText([]);
      setRunningFlow(false);
    } finally {
      setUILoaderText([]);
      setRunningFlow(false);
    }
  };
  print('UILoaderText: ', UILoaderText);
  return (
    <FlowContext.Provider
      value={{
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
        chunkResponse,
        loaderUIText: UILoaderText,
        runningFlow,
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
