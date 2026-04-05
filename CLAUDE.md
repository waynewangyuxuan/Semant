# semant

> Semantic protocol for AI-readable, AI-operable web pages. A mirror, not an engine.

## Tech Stack
- TypeScript strict mode
- tsup (bundler, ESM + CJS dual output)
- npm workspaces monorepo
- `@semant/core` — pure JS, zero dependencies, framework-agnostic
- `@semant/react` — thin React 18+ adapter (13 reference components)
- `@semant/vue` — thin Vue 3.3+ adapter (13 reference components, full React parity)
- `@semant/mcp` — MCP server bridge for AI agent tool discovery

## Current Phase
v0.1 complete. Core protocol, React adapter, Vue adapter, MCP adapter, 13 reference components per framework, 4 output formats. Next: Svelte 5 adapter, SSR support.

## Key Rule
**Read spec/ before writing code.** Understanding the semantic protocol design is essential — this isn't a typical component library.

## Getting Started
1. Read `spec/Meta.md` — project overview and navigation
2. Read `spec/Core/Regulation.md` — development constraints
3. Load task-specific context per `spec/Meta.md` Context Injection Guide
4. For website tasks, read `spec/Website/Meta.md` for routing

## Quick Reference
| Path | Content |
|------|---------|
| `spec/Meta.md` | Project navigation and context routing |
| `spec/Core/Product.md` | What semant is, core concepts, architecture |
| `spec/Core/Technical.md` | Code organization and key patterns |
| `spec/Core/Regulation.md` | Development constraints |
| `spec/Website/` | Website spec: landing page, docs, design language |
| `spec/Decisions/` | Architecture Decision Records |
| `packages/core/src/` | Types, SemanticStore, output renderers — framework-agnostic core |
| `packages/react/src/` | Provider, hooks, 13 reference components — React bindings |
| `packages/vue/src/` | Provider, composables, 13 reference components — Vue 3 bindings |
| `packages/mcp/src/` | MCP server bridge — AI agent tool discovery |
| `examples/restaurant-booking/` | Full working example |

## Build & Dev
```bash
npm run build        # Build all packages
npm run dev          # Watch mode (all packages)
npm run typecheck    # Type check all packages
```
