import { describe, expect, it } from "vitest";
import { Engine } from "../src";

describe("Engine", () => {
  it("parses a minimal graph and defaults type to flow", () => {
    const engine = new Engine();
    const result = engine.parse({
      nodes: [{ id: "A" }, { id: "B" }],
      edges: [{ from: "A", to: "B" }],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.graph.type).toBe("flow");
      expect(result.engineGraph.nodes).toHaveLength(2);
      expect(result.engineGraph.edges).toHaveLength(1);
      expect(result.meta.isCyclic).toBe(false);
      expect(result.semantic).toHaveLength(0);
    }
  });

  describe("unreachable-node detection", () => {
    it("does NOT flag nodes that have edges", () => {
      const engine = new Engine();
      const result = engine.parse({
        nodes: [{ id: "A" }, { id: "B" }],
        edges: [{ from: "A", to: "B" }],
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        const unreachable = result.semantic.filter(
          (s) => s.type === "unreachable-node",
        );
        expect(unreachable).toHaveLength(0);
      }
    });

    it("flags isolated nodes (no incoming AND no outgoing edges)", () => {
      const engine = new Engine();
      const result = engine.parse({
        nodes: [{ id: "A" }, { id: "B" }, { id: "C" }],
        edges: [{ from: "A", to: "B" }],
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        const unreachable = result.semantic.filter(
          (s) => s.type === "unreachable-node",
        );
        // C has no edges at all → isolated → unreachable
        expect(unreachable).toHaveLength(1);
        expect(unreachable[0]).toMatchObject({
          type: "unreachable-node",
          nodeId: "C",
          index: 2,
        });
      }
    });

    it("flags all nodes when graph has no edges", () => {
      const engine = new Engine();
      const result = engine.parse({
        nodes: [{ id: "A" }, { id: "B" }],
        edges: [],
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        const unreachable = result.semantic.filter(
          (s) => s.type === "unreachable-node",
        );
        expect(unreachable).toHaveLength(2);
      }
    });

    it("does NOT flag nodes in a cycle as unreachable", () => {
      const engine = new Engine();
      const result = engine.parse({
        nodes: [{ id: "A" }, { id: "B" }, { id: "C" }],
        edges: [
          { from: "A", to: "B" },
          { from: "B", to: "C" },
          { from: "C", to: "A" },
        ],
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.meta.isCyclic).toBe(true);
        const unreachable = result.semantic.filter(
          (s) => s.type === "unreachable-node",
        );
        expect(unreachable).toHaveLength(0);
      }
    });
  });

  describe("edge-missing-node detection", () => {
    it("flags edges referencing non-existent nodes", () => {
      const engine = new Engine();
      const result = engine.parse({
        nodes: [{ id: "A" }],
        edges: [{ from: "A", to: "Z" }],
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        const missing = result.semantic.filter(
          (s) => s.type === "edge-missing-node",
        );
        expect(missing).toHaveLength(1);
        if (missing[0]?.type === "edge-missing-node") {
          expect(missing[0].missing).toBe("Z");
        }
      }
    });
  });

  describe("duplicate node ID deduplication", () => {
    it("appends _1, _2 etc when multiple nodes share the same ID", () => {
      const engine = new Engine();
      const result = engine.parse({
        nodes: [{ id: "A" }, { id: "A" }, { id: "B" }],
        edges: [{ from: "A", to: "B" }],
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.engineGraph.nodes).toHaveLength(3);
        expect(result.engineGraph.nodes[0].id).toBe("A");
        expect(result.engineGraph.nodes[1].id).toBe("A_1");
        expect(result.engineGraph.nodes[2].id).toBe("B");
      }
    });

    it("updates edge references to match deduplicated node IDs", () => {
      const engine = new Engine();
      const result = engine.parse({
        nodes: [{ id: "A" }, { id: "A" }],
        edges: [{ from: "A", to: "A" }],
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        // The first duplicate occurrence keeps the original ID, second gets _1
        // Edges referencing "A" resolve to the first occurrence
        expect(result.engineGraph.edges[0].from).toBe("A");
        expect(result.engineGraph.edges[0].to).toBe("A");
      }
    });
  });
});
