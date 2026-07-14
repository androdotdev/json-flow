# Diagram Specification

This document describes the JSON schema accepted by `@andro.dev/jsonflow-engine` and the engine graph output.

---

## Input Schema

### Graph

```typescript
{
  type?: "graph" | "sequence" | "flow"       // default: "flow"
  layout?: {
    direction?: "LR" | "RL" | "TB" | "BT"    // default: "LR"
  }
  nodes: Node[]
  edges: Edge[]
}
```

### Node

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (min 1) | ✅ | Unique node identifier |
| `label` | `string` | — | Display label |
| `type` | `string` | — | User-defined type annotation |
| `kind` | `"actor" | "lifeline" | "message" | "activity" | "state" | "class"` | — | Visual category hint for renderers |
| `shape` | `"ellipse" | "rectangle" | "round-rectangle" | "diamond" | "hexagon" | "triangle"` | — | Renderer shape hint |
| `properties` | `Record<string, unknown>` | — | Arbitrary metadata passthrough |

### Edge

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `from` | `string` (min 1) | ✅ | Source node ID |
| `to` | `string` (min 1) | ✅ | Target node ID |
| `label` | `string` | — | Display label |
| `kind` | `"next" | "call" | "return" | "async" | "transition" | "inherit" | "association"` | — | Edge semantics hint |
| `link_type` | `"solid" | "dash" | "dot" | "double" | "bold" | "arrow" | "open-arrow"` | — | Visual style hint |

---

## Output: Engine Graph

After validation, the engine returns an `EngineGraph`:

```typescript
{
  type: "graph" | "sequence" | "flow"
  layout: { direction: "LR" | "RL" | "TB" | "BT" }
  nodes: EngineNode[]
  edges: EngineEdge[]
  meta: {
    isCyclic: boolean
  }
  semantic: SemanticIssue[]
}
```

### Semantic Issues

| Issue Type | Description |
|------------|-------------|
| `edge-missing-node` | An edge references a node ID that doesn't exist in `nodes` |
| `unreachable-node` | A node has no incoming and no outgoing edges |

---

## Adapter: Cytoscape

The `toCytoscape()` adapter transforms `EngineGraph` into Cytoscape.js elements:

```typescript
{
  elements: [
    { data: { id: string, label?: string, ...nodeFields } },
    { data: { id: string, source: string, target: string, label?: string, ...edgeFields } }
  ]
}
```

Edge IDs are auto-generated as `"<from>-><to>"`.
