# JSONFLOW

Schema-aware engine + client for turning JSON into Cytoscape-ready diagrams.

Live: https://json-flow-client.vercel.app/

## Packages

- `engine/` — `@andro.dev/jsonflow-engine` (Zod validation + parser)
- `jsonflow-web/` — React + Monaco + Cytoscape UI

## Quick Start

```bash
pnpm install
pnpm -C jsonflow-web dev
```

## Engine

```bash
pnpm -C engine build
pnpm -C engine test
```

## Client

```bash
pnpm -C jsonflow-web dev
pnpm -C jsonflow-web build
```
