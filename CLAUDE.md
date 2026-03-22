# semant

> Semantic protocol for AI-readable, AI-operable web pages. A mirror, not an engine.

## Tech Stack
- TypeScript strict mode
- tsup (bundler, ESM + CJS dual output)
- npm workspaces monorepo
- `@semant/core` — pure JS, zero dependencies, framework-agnostic
- `@semant/react` — thin React 18+ adapter

## Current Phase
v0.1 — protocol design phase. The semantic protocol (how components describe themselves) is the core deliverable. Component count is secondary.

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
| `packages/react/src/` | Provider, hooks, reference components — React bindings |
| `examples/restaurant-booking/` | Full working example |

## Build & Dev
```bash
npm run build        # Build all packages
npm run dev          # Watch mode (all packages)
npm run typecheck    # Type check all packages
```
