# semant — Project Spec
> Semantic protocol for AI-readable, AI-operable web pages.
**Documents**: 0 | **Subfolders**: 1

## Context Injection Guide
| Task Scenario | Read These Files | Lines |
|---------------|------------------|-------|
| Understand the product and protocol | `Core/Product.md` | ~80 |
| Add a new reference component | `Core/Technical.md`, `Core/Regulation.md`, any existing component in `packages/react/src/components/` | ~120 |
| Add a new output format | `Core/Product.md` (four channels), `Core/Technical.md`, `packages/core/src/outputs/plaintext.ts` as reference | ~130 |
| Modify the core store or types | `Core/Product.md`, `Core/Technical.md`, `Core/Regulation.md` | ~140 |
| Add a framework adapter (Vue, Svelte) | `Core/Product.md`, `Core/Technical.md`, `packages/react/` as reference adapter | ~150 |
| Fix a bug in existing component | `Core/Regulation.md`, the relevant component file | ~60 |

## Subfolders
| Folder | Purpose | Start With |
|--------|---------|------------|
| Core/ | Product definition, technical architecture, development constraints | `Core/Product.md` |
