import { Edge } from '@xyflow/react';

const initiateIds = ['684d858808dca10a34a65a53', '686a060b7493977b931934c3'];
const closeIds = ['684e733dc2b59ec01fb72c77'];

export const validateIndirectFlow = (edges: Edge[]): boolean => {
  const extractId = (nodeStr: string) => nodeStr.split('-')[1]; // remove index
  console.log(edges);

  // Build graph from edges
  const graph = new Map<string, string[]>();
  edges.forEach(edge => {
    const src = extractId(edge.source);
    const tgt = extractId(edge.target);
    if (!graph.has(src)) graph.set(src, []);
    graph.get(src)!.push(tgt);
  });

  // Check if at least one path exists from any initiateId to any closeId
  const visited = new Set<string>();
  const queue: string[] = [...initiateIds];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    if (closeIds.includes(current)) return true;

    const neighbors = graph.get(current) || [];
    queue.push(...neighbors);
  }

  return false;
};
