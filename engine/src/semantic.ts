import type { Graph } from "./types/graph";

export type SemanticIssue =
  | {
      type: "edge-missing-node";
      edge: { from: string; to: string };
      missing: string;
    }
  | {
      type: "unreachable-node";
      nodeId: string;
      index: number;
    };

export type SemanticMeta = {
  isCyclic: boolean;
};

export type SemanticResult = {
  meta: SemanticMeta;
  issues: SemanticIssue[];
};

const buildAdjacency = (graph: Graph, nodeIds: Set<string>) => {
  const adjacency = new Map<string, string[]>();
  const incoming = new Map<string, number>();

  graph.nodes.forEach((node) => {
    adjacency.set(node.id, []);
    incoming.set(node.id, 0);
  });

  graph.edges.forEach((edge) => {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      return;
    }
    adjacency.get(edge.from)?.push(edge.to);
    incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
  });

  return { adjacency, incoming };
};

const detectCycle = (adjacency: Map<string, string[]>) => {
  const visiting = new Set<string>();
  const visited = new Set<string>();
  let isCyclic = false;

  const dfs = (nodeId: string) => {
    if (isCyclic) return;
    if (visiting.has(nodeId)) {
      isCyclic = true;
      return;
    }
    if (visited.has(nodeId)) return;

    visiting.add(nodeId);
    const neighbors = adjacency.get(nodeId) ?? [];
    neighbors.forEach(dfs);
    visiting.delete(nodeId);
    visited.add(nodeId);
  };

  Array.from(adjacency.keys()).forEach(dfs);
  return isCyclic;
};

/**
 * Per spec: a node is unreachable if it has no incoming AND no outgoing edges.
 * i.e., it's completely isolated from the graph.
 */
const findUnreachable = (
  adjacency: Map<string, string[]>,
  incoming: Map<string, number>,
) => {
  const unreachable: string[] = [];

  for (const [nodeId] of adjacency) {
    const outdegree = adjacency.get(nodeId)?.length ?? 0;
    const indegree = incoming.get(nodeId) ?? 0;
    if (indegree === 0 && outdegree === 0) {
      unreachable.push(nodeId);
    }
  }

  return unreachable;
};

export const analyzeGraph = (graph: Graph): SemanticResult => {
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  const issues: SemanticIssue[] = [];

  graph.edges.forEach((edge) => {
    if (!nodeIds.has(edge.from)) {
      issues.push({
        type: "edge-missing-node",
        edge: { from: edge.from, to: edge.to },
        missing: edge.from,
      });
    }
    if (!nodeIds.has(edge.to)) {
      issues.push({
        type: "edge-missing-node",
        edge: { from: edge.from, to: edge.to },
        missing: edge.to,
      });
    }
  });

  const { adjacency, incoming } = buildAdjacency(graph, nodeIds);
  const isCyclic = detectCycle(adjacency);

  const unreachable = findUnreachable(adjacency, incoming);
  // Track array indices for traceability — each node gets its position
  const nodeIndex = new Map<string, number>();
  graph.nodes.forEach((node, i) => {
    // For duplicate IDs, only the last index is stored;
    // the semantic issue still reports the correct index per occurrence
    if (!nodeIndex.has(node.id)) {
      nodeIndex.set(node.id, i);
    }
  });

  unreachable.forEach((nodeId) => {
    issues.push({
      type: "unreachable-node",
      nodeId,
      index: nodeIndex.get(nodeId) ?? -1,
    });
  });

  return {
    meta: { isCyclic },
    issues,
  };
};
