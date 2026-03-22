# Product Definition

## Problem
AI agents understanding web pages today must reverse-engineer them — screenshot + vision model (slow, expensive) or DOM parsing (div soup, meaningless class names). The page was never designed to be understood.

## Solution
Components that describe themselves. Each semant component knows how to render itself for humans AND explain itself to AI — as plain text, llms.txt, or JSON-LD. One source of truth, no separate metadata layer.

**semant is a mirror, not an engine.** It reflects component state. It does not drive it.

**semant is a protocol, not a UI library.** It composes with everything. It replaces nothing.

**llms.txt made the web readable to AI. semant makes it operable.**

## Core Concepts

### SemanticField
The unit of interaction. Open-typed, framework-agnostic:
- `key` — unique identifier, used in commands
- `type` — open string (`"select"`, `"date"`, `"location"`, `"3d-orientation"`, anything)
- `value` — current value (JSON-serializable)
- `constraints` — free-form `Record<string, unknown>` (`{ options: [...] }`, `{ min: 0, max: 100 }`, `{ bounds: [...] }`)
- `set()` / `execute()` — callbacks the developer provides

### SemanticNode
The atomic unit. Every component registered via `useSemantic()` becomes a node with:
- `role` — what kind of thing (open string: "Field", "restaurant", "map", anything)
- `fields` — interactive state
- `meta` — arbitrary metadata

### SemanticPage
The page-level container. Holds title, description, and all registered nodes. Managed by `SemanticStore`.

### SemanticStore
Framework-agnostic pub/sub store (`@semant/core`). Holds all nodes, supports:
- Register/unregister nodes (components mount/unmount)
- Shallow equality to skip unnecessary notifications
- Text command execution (`set party_size 4`, `submit_booking`)

### Four Output Channels
All enabled by two React components: `<SemanticHead>` + `<SemanticBridge>`.

1. **JSON-LD in `<head>`** — for search engines / AI Overview. Auto-updates via `<SemanticHead>`.
2. **llms.txt** — for AI crawlers. Generate via `toLlmsTxt()`, serve at `/llms.txt`.
3. **Hidden DOM node** — `<SemanticBridge>` renders `<div id="__semant">` for browser agents.
4. **Global JS API** — `window.__semant` with `getState()`, `getStructured()`, `execute()`, `fields()`, `version`. The most powerful path.

### Discovery Signal
`<SemanticHead>` injects `<meta name="semant" content="0.1.0">` so agents know the page supports semant.

### Command Protocol
Text-based command interface:
- `set <field_key> <value>` — update a field
- `<action_key>` — trigger an action
- `execute()` returns `{ ok, message }` and waits for React re-render

We don't validate commands. If an agent sends an invalid value, the developer's `set()` handles it.

## Target Users
1. **Web developers** — add AI-readability to existing apps with minimal effort
2. **AI agent builders** — get structured, operable page state without vision models
3. **SEO/GEO practitioners** — structured data generation from component state

## v0.1 Scope
- Core protocol (`@semant/core` — store, types, output renderers)
- React bindings (`@semant/react` — hooks, provider, reference components)
- Reference components (Select, DatePicker, TextInput, Action, Info, List)
- Three output formats (plaintext, llms.txt, JSON-LD)
- Two delivery components (SemanticHead, SemanticBridge)
- One example (restaurant-booking)

## What We Explicitly Don't Do
1. Auto-infer semantics from DOM — developers declare explicitly
2. Manage state — we call the `set()` callback and let the framework handle the rest
3. Validate commands — the developer's code handles validation
4. Define semantic types — `type` is an open string
5. Enforce structure — developers organize nodes however they want

## Open Directions (not committed)
- More framework adapters (Vue, Svelte, vanilla JS)
- New output formats (OpenAPI, MCP)
- More reference components
- Server-side rendering support
