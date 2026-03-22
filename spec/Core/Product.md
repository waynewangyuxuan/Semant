# Product Definition

## Problem
AI agents understanding web pages today must reverse-engineer them — screenshot + vision model (slow, expensive) or DOM parsing (div soup, meaningless class names). The page was never designed to be understood.

## Solution
Components that describe themselves. Each semant component knows how to render itself for humans AND explain itself to AI — as plain text, llms.txt, or JSON-LD. One source of truth, no separate metadata layer.

**llms.txt made the web readable to AI. semant makes it operable.**

## Core Concepts

### SemanticNode
The atomic unit. Every component registered via `useSemantic()` becomes a node with:
- `role` — what kind of thing (Field, Action, Info, etc.)
- `fields` — interactive state (value, options, setter, validator)
- `meta` — arbitrary metadata

### SemanticPage
The page-level container. Holds title, description, and all registered nodes. Managed by `SemanticStore`.

### SemanticStore
External store (React `useSyncExternalStore` pattern). Holds all nodes, supports:
- Register/unregister nodes (components mount/unmount)
- Shallow equality to skip unnecessary re-renders
- Text command execution (`set party_size 4`, `submit_booking`)

### Four Output Channels
All enabled by two components: `<SemanticHead>` + `<SemanticBridge>`.

1. **JSON-LD in `<head>`** — for search engines / AI Overview. Auto-updates via `<SemanticHead>`.
2. **llms.txt** — for AI crawlers. Generate via `toLlmsTxt()`, serve at `/llms.txt`.
3. **Hidden DOM node** — `<SemanticBridge>` renders `<div id="semantic-state">` for browser agents.
4. **Global JS API** — `window.__semant` with `getState()` and `execute()`. The most powerful path.

### Command Protocol
Text-based command interface:
- `set <field_key> <value>` — update a field
- `<action_key>` — trigger an action
- `execute()` returns `{ ok, message }` and waits for React re-render

## Target Users
1. **Web developers** — add AI-readability to existing React apps with minimal effort
2. **AI agent builders** — get structured, operable page state without vision models
3. **SEO/GEO practitioners** — structured data generation from component state

## v0.1 Scope
- Core protocol (SemanticStore, hooks, types)
- Reference components (Select, DatePicker, TextInput, Action, Info, List)
- Three output formats (plaintext, llms.txt, JSON-LD)
- Two delivery components (SemanticHead, SemanticBridge)
- One example (restaurant-booking)

## Open Directions (not committed)
- Framework adapters (Vue, Svelte)
- New output formats (OpenAPI, MCP)
- More reference components
- Server-side rendering support
