import { SystemTool, ToolCategory } from '@/_backend/getSystemTools';
import { categoryToEdgeTypeMapping } from '@/components/ui/flow/flow-canvas';

import { useFlow } from '@/context/flow-context';
import { useReactFlow } from '@xyflow/react';
import { useEffect, useMemo } from 'react';

export const useNodeLoader = (node?: SystemTool) => {
  const { currentNodeInProcess } = useFlow();

  const isLoading = useMemo(() => {
    if (currentNodeInProcess?.next_nodes) {
      return currentNodeInProcess.next_nodes.includes(
        node?.node_id || 'ignore',
      );
    } else {
      return false;
    }
  }, [currentNodeInProcess, node]);
  return { isLoading };
};

export const useNodeViewport = () => {
  const { currentNodeInProcess, runningFlow } = useFlow();
  const { getNodes, setEdges, setCenter } = useReactFlow();

  // animate edge
  useEffect(() => {
    if (!runningFlow) {
      setCenter(250, 400, {
        duration: 100,
        zoom: 1,
        interpolate: 'smooth',
      });
      setEdges(eds => {
        return eds.map(ed => {
          return { ...ed, type: 'smoothstep' };
        });
      });
    }
    // create edge_id x n
    if (!!currentNodeInProcess) {
      if (!currentNodeInProcess.next_nodes) {
        setEdges(eds => {
          return eds.map(ed => {
            return { ...ed, type: 'smoothstep' };
          });
        });
      } else {
        const source = currentNodeInProcess.node_graph_id;
        const [currentNodeData] = getNodes().filter(
          nd => nd.data.node_id === source,
        );
        for (let i = 0; i < currentNodeInProcess.next_nodes.length; i++) {
          const target = currentNodeInProcess.next_nodes[i];
          const edgeID = `xy-edge__${source}-${target}`;
          const category: ToolCategory = currentNodeData.data
            ? (currentNodeData.data.category as ToolCategory)
            : 'initiate';
          setEdges(eds => {
            return eds.map(ed => {
              if (ed.id === edgeID) {
                return {
                  ...ed,
                  type: categoryToEdgeTypeMapping[category],
                };
              } else {
                return { ...ed, type: 'smoothstep' };
              }
            });
          });
        }
      }
    } else {
      setEdges(eds => {
        return eds.map(ed => {
          return { ...ed, type: 'smoothstep' };
        });
      });
    }
  }, [currentNodeInProcess, getNodes, setEdges, runningFlow, setCenter]);

  const { currentNode, viewport } = useMemo(() => {
    const [foundNode] = getNodes().filter(o_node => {
      return (
        o_node.data.node_id === (currentNodeInProcess?.next_nodes![0] || 'null')
      );
    });
    if (foundNode) {
      const viewport = {
        x: foundNode.position.x,
        y: foundNode.position.y,
        zoom: 2,
      };
      console.log(viewport, foundNode);

      setCenter(viewport.x + 250, viewport.y, {
        duration: 100,
        zoom: 2,
        interpolate: 'smooth',
      });
      return { viewport, currentNode: foundNode };
    }
    const viewport = { x: 0, y: 0, zoom: 1.2 };
    return { viewport, currentNode: null };
  }, [getNodes, currentNodeInProcess, setCenter]);

  return { currentNode, viewport };
};
