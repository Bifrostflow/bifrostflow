'use client';
import { APIData } from '@/components/ui/flow/enter-keys-area';
import { Edge, Node } from '@xyflow/react';
import { createContext, ReactNode, useContext } from 'react';

type FlowContextType = {
  slug: string;
  apiKeys: APIData;
  initialNodes: Node[];
  initialEdges: Edge[];
  // nodeValues: Record<string, string>;
  // setNodeValues: (id: string, values: string) => void;
};

const FlowContext = createContext<FlowContextType | undefined>(undefined);

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
  // const [nodeValues, setNodeValues] = useState<Record<string, string>>({});

  // const updateNodeValues = (id: string, values: string) => {
  //   const oldNodesValues = { ...nodeValues };
  //   oldNodesValues[id] = values;
  //   setNodeValues(oldNodesValues);
  // };

  return (
    <FlowContext.Provider
      value={{
        slug,
        initialEdges: defaultEdges,
        initialNodes: defaultNodes,
        apiKeys,
        // nodeValues,
        // setNodeValues: updateNodeValues,
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
