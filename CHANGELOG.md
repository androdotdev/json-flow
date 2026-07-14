# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.0] — 2026-07

### Added
- Engine semantic analysis: cyclic graph detection, unreachable node detection, edge-missing-node detection
- Cytoscape adapter (`toCytoscape()`) for renderer output
- JSON Flow web client with Monaco editor, live preview, Cytoscape rendering
- Theme toggle (dark/light)
- Layout direction adjustment (LR, RL, TB, BT)
- Workspace component with debounced JSON parsing and error handling
- Landing page with demo video

### Changed
- Migrated from Vite client to Next.js 16 App Router (`jsonflow-web/`)
- Modularized landing page with component-based architecture

### Fixed
- Internal navigation: replaced `<a>` with Next.js `<Link>` for SPA routing

## [1.0.0] — 2026-06

### Added
- Initial engine package (`@andro.dev/jsonflow-engine`) with Zod validation
- Graph schema: nodes, edges, graph types (flow, graph, sequence), layout directions
- pnpm workspace monorepo setup with `engine/` and `jsonflow-web/` packages
- Basic engine test suite (happy path)
