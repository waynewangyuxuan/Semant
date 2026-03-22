# semant

> React components that describe themselves to AI. Build pages that are human-beautiful and machine-operable.

## Tech Stack
- React 18+ (peer dependency)
- TypeScript
- tsup (bundler, ESM + CJS dual output)
- No runtime dependencies

## Current Phase
v0.1 — protocol design phase. The semantic protocol (how components describe themselves) is the core deliverable. Component count is secondary.

## Key Rule
**Read spec/ before writing code.** Understanding the semantic protocol design is essential — this isn't a typical component library.

## Getting Started
1. Read `spec/Meta.md` — project overview and navigation
2. Read `spec/Core/Regulation.md` — development constraints
3. Load task-specific context per `spec/Meta.md` Context Injection Guide

## Quick Reference
| Path | Content |
|------|---------|
| `spec/Meta.md` | Project navigation and context routing |
| `spec/Core/Product.md` | What semant is, core concepts, architecture |
| `spec/Core/Technical.md` | Code organization and key patterns |
| `spec/Core/Regulation.md` | Development constraints |
| `src/core.tsx` | SemanticStore, Provider, hooks — the heart of the library |
| `src/components/` | Reference components (SemanticSelect, Action, etc.) |
| `src/outputs/` | Renderers: plaintext, llms.txt, JSON-LD |
| `examples/restaurant-booking/` | Full working example |

## Build & Dev
```bash
npm run build        # Build with tsup
npm run dev          # Watch mode
npm run typecheck    # Type check without emit
```
