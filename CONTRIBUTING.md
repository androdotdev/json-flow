# Contributing

Thanks for your interest in JSON Flow! Here's how to get started.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 10.28.1 (`npm i -g pnpm@10.28.1`)

## Setup

```bash
git clone https://github.com/androdotdev/json-flow.git
cd json-flow
pnpm install
```

## Development

```bash
# Start the web app
pnpm -C jsonflow-web dev

# Build the engine (watch mode)
pnpm -C engine dev

# Run engine tests
pnpm -C engine test
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm -r build` | Build all packages |
| `pnpm -C engine test` | Run engine tests |
| `pnpm -C jsonflow-web lint` | Lint web app |

## Code Style

- **TypeScript strict mode** is enforced across the monorepo
- Use `import type` for type-only imports
- Files: kebab-case
- Variables/functions: camelCase
- Types/interfaces: PascalCase
- Constants: `UPPER_SNAKE_CASE`
- React components: PascalCase

## Pull Request Process

1. Create a branch from `main` with a descriptive name (`feat/`, `fix/`, `docs/`, `chore/`)
2. Make your changes
3. Ensure engine tests pass: `pnpm -C engine test`
4. Ensure web app builds: `pnpm -C jsonflow-web build`
5. Open a PR against `main`
6. CI will auto-run lint, tests, and build checks

## Reporting Issues

- Use GitHub Issues
- Include the engine version, input JSON (if applicable), and expected vs actual behavior
- For bugs: include reproduction steps

## License

MIT
