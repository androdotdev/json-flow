import { z } from "zod";
import { EdgeSchema, GraphSchema, NodeSchema } from "./schema/graph";
import type {
  Edge,
  EngineGraph,
  Graph,
  Node,
} from "./types/graph";
import { analyzeGraph, type SemanticIssue, type SemanticMeta } from "./semantic";

export type EngineResult =
  | {
      ok: true;
      graph: Graph;
      engineGraph: EngineGraph;
      meta: SemanticMeta;
      semantic: SemanticIssue[];
    }
  | { ok: false; error: z.ZodError };

/**
 * Given an array of input nodes, ensure IDs are unique by appending
 * `_<index>` when duplicates are detected.  Returns the deduplicated
 * nodes and a map from input id to deduplicated id.
 */
function deduplicateNodeIds(
  nodes: Node[],
): { nodes: Node[]; idMap: Map<string, string> } {
  const seen = new Map<string, number>();
  const deduped: Node[] = [];
  const idMap = new Map<string, string>();

  for (const node of nodes) {
    const count = seen.get(node.id) ?? 0;
    seen.set(node.id, count + 1);
    const newId = count > 0 ? `${node.id}_${count}` : node.id;
    if (count === 0) {
      idMap.set(node.id, newId); // Edge refs resolve to the first occurrence
    }
    deduped.push({ ...node, id: newId });
  }

  return { nodes: deduped, idMap };
}

/**
 * Rewrite edge from/to references using the deduplication map.
 */
function remapEdges(edges: Edge[], idMap: Map<string, string>): Edge[] {
  return edges.map((edge) => ({
    ...edge,
    from: idMap.get(edge.from) ?? edge.from,
    to: idMap.get(edge.to) ?? edge.to,
  }));
}

export class Engine {
  validate(input: unknown): Graph {
    return GraphSchema.parse(input);
  }

  safeValidate(input: unknown): ReturnType<typeof GraphSchema.safeParse> {
    return GraphSchema.safeParse(input);
  }

  parse(input: unknown): EngineResult {
    const result = GraphSchema.safeParse(input);
    if (!result.success) {
      return { ok: false, error: result.error };
    }

    const graph = result.data;

    // Deduplicate node IDs so the engine graph is always traceable
    const { nodes: dedupedNodes, idMap } = deduplicateNodeIds(graph.nodes);
    const dedupedEdges = remapEdges(graph.edges, idMap);

    const dedupedGraph: Graph = {
      ...graph,
      nodes: dedupedNodes,
      edges: dedupedEdges,
    };

    const engineGraph: EngineGraph = {
      nodes: dedupedGraph.nodes,
      edges: dedupedGraph.edges,
    };
    const semantic = analyzeGraph(dedupedGraph);

    return {
      ok: true,
      graph: dedupedGraph,
      engineGraph,
      meta: semantic.meta,
      semantic: semantic.issues,
    };
  }
}

export {
  EdgeSchema,
  GraphSchema,
  NodeSchema,
};

export { toCytoscape } from "./adapter/cytoscape";
