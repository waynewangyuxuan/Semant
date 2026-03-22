# semant/core — Architecture & Design Decisions

> This document captures the core architectural thinking behind semant. It's meant to be the single source of truth for anyone contributing to the framework.

---

## 1. What semant Is (and Isn't)

### semant is a mirror, not an engine.

It reflects component state. It does not drive component state.

semant does not manage your UI, does not own your data, does not handle your business logic. It provides a **declaration layer** — a way for any component to say "here's what I am, here's my current state, here's how to operate me." That's it.

The component's actual behavior — state management, validation, side effects, inter-field dependencies — all of that stays in the developer's code, in whatever framework they're using. semant just watches and reports.

### semant is a protocol, not a UI library.

It is not competing with shadcn, Ant Design, or Chakra. It composes with all of them. A developer can wrap any existing component with a three-line semant declaration and get AI-readability for free. We never ask anyone to replace their components.

### semant is a way for developers to do the mapping. We don't do the mapping for them.

We don't try to understand complex business logic. We don't auto-infer semantic meaning from DOM structure. We provide a simple, explicit API for developers to declare what their components are. This is a deliberate choice — it means semant works with any level of component complexity without semant itself becoming complex.

---

## 2. Package Architecture

### Two packages, clear boundary.

```
@semant/core    — Pure JavaScript. Zero dependencies. Framework-agnostic.
@semant/react   — React bindings. Thin wrapper around core.
```

**`@semant/core`** contains:
- `SemanticStore` — the pub/sub store that collects and manages semantic nodes
- Command interpreter — parses and executes text commands like `set party_size 4`
- Output renderers — `toPlainText()`, `toLlmsTxt()`, `toJsonLd()`
- Type definitions

**`@semant/react`** contains:
- `SemanticProvider` — React context that wraps the app
- `useSemantic()` — hook to register a component as a semantic node
- `useSemanticPage()` — hook to read the full semantic state
- `useSemanticStore()` — hook to get the store directly
- `SemanticBridge` — auto-wires all delivery mechanisms
- Reference components (optional)

**Why this split matters:**
- `@semant/core` can be used in Vue, Svelte, vanilla JS, Node.js SSR, or anywhere. The store is just a plain JS object with subscribe/publish.
- Framework-specific packages (`@semant/vue`, `@semant/svelte`, etc.) are thin adapters that wire the store into each framework's reactivity system.
- The core can be tested in isolation with zero browser or framework dependencies.

### Future adapters (not built yet, but the architecture supports them):

```
@semant/vue     — Vue 3 composable: useSemantic()
@semant/svelte  — Svelte store adapter
@semant/vanilla — Plain JS helper: semant.register(element, declaration)
```

---

## 3. Data Model

### Open metadata, not fixed types.

The framework does not define what semantic types exist. Developers do.

```typescript
interface SemanticField {
  key: string;                              // Unique identifier, used in commands
  label: string;                            // Human-readable name
  type: string;                             // Open — "select", "date", "location", "color", anything
  value: unknown;                           // Current value, must be serializable
  constraints?: Record<string, unknown>;    // Free-form — { options: [...] }, { min: 0, max: 100 }, { bounds: [...] }
  description?: string;                     // Natural language description for AI
  set?: (value: unknown) => void;           // Callback to change the value
  execute?: () => void;                     // For action types — trigger the action
}

interface SemanticNode {
  id: string;                               // Auto-generated or user-provided
  role: string;                             // Open — "form", "info", "list", "map", anything
  title?: string;
  description?: string;
  meta?: Record<string, unknown>;           // Free-form static metadata
  fields: SemanticField[];
  order?: number;                           // Rendering order hint
}

interface SemanticPage {
  title: string;
  description?: string;
  nodes: SemanticNode[];
}
```

### Why open types matter:

With fixed types (`"select" | "date" | "time" | ...`), a map component would have to declare itself as `type: "text"` and explain in the description that it's actually a coordinate picker. This is ugly and lossy.

With open types, it declares `type: "location"` and `constraints: { bounds: [[lat1, lng1], [lat2, lng2]], zoom: { min: 1, max: 20 } }`. The framework doesn't need to understand what "location" means — AI reads the type, constraints, and description and figures it out.

This also means the framework never needs a major version bump to support new interaction patterns. A VR component can declare `type: "3d-orientation"` on day one. The framework doesn't care.

### Serialization contract:

All values in `SemanticField.value`, `SemanticNode.meta`, and `SemanticField.constraints` must be JSON-serializable. This is the one hard rule. It ensures that any output renderer can consume the data, and that the state can be transmitted over any channel (DOM text, HTTP response, WebSocket, etc.).

---

## 4. State Flow

### Two directions, same mechanism.

**Human → UI → semant (passive observation):**

```
User clicks UI
  → React state updates (developer's setState/reducer/store)
    → Component re-renders
      → useSemantic() re-executes with new values
        → SemanticStore updates
          → Output renderers produce new text
```

semant is purely reactive here. It just reads what the component declares on each render. It doesn't intercept events, doesn't wrap handlers, doesn't touch the DOM.

**AI → semant → UI (command execution):**

```
Agent calls window.__semant.execute("set party_size 4")
  → SemanticStore finds field with key "party_size"
    → Calls the field's set() callback
      → Developer's setState fires
        → Component re-renders
          → useSemantic() re-executes with new values
            → SemanticStore updates
              → Agent calls getState() to confirm
```

The key insight: **the `set()` function is a bridge that the developer provides.** We don't own it, we just call it. After that, React's own reactivity takes over, the component re-renders, and semant's observation loop picks up the new state automatically.

### Why we don't own state:

If semant managed state, we'd have to solve:
- Two-way sync between semant state and framework state
- Conflict resolution when both human and AI modify state
- State persistence, hydration, and time travel
- Integration with every state management library (Redux, Zustand, Jotai, MobX, Pinia, etc.)

By not owning state, all of these problems are the developer's to solve with their existing tools. semant stays simple.

### Inter-field dependencies:

If selecting a date changes the available time slots, that logic lives in the developer's code. When the time slots update, the component re-renders, `useSemantic()` re-registers with the new options, and semant's output automatically reflects the change.

We don't need to know about the dependency. We just see the result.

---

## 5. Command Interpreter

### Simple text protocol.

The command interpreter understands two patterns:

```
set <field_key> <value>       — Update a field's value
<action_key>                  — Execute an action
```

That's it. No query language, no conditionals, no scripting. An AI agent that wants to do something complex (e.g., "book a table for 4 on Friday at 7pm") will decompose it into a sequence of set commands. The decomposition is the AI's job, not ours.

### Value parsing:

When `execute("set party_size 4")` is called:
- Try to parse the value as a number. If it works, pass the number.
- Otherwise, pass the raw string.
- The developer's `set()` function handles type coercion from there.

### Error handling:

`execute()` returns `{ ok: boolean, message: string }`:
- `{ ok: true, message: "set party_size = 4" }` — success
- `{ ok: false, message: "unknown field: party_siz" }` — field not found
- `{ ok: false, message: "unknown command: book now" }` — unrecognized pattern

### Future consideration: compound commands.

We might eventually want:
```
get <field_key>               — Read a single field's value
list_fields                   — List all available fields and actions
describe <field_key>          — Get full description of a field
```

But these are not needed for v0.1. `getState()` already returns everything.

---

## 6. Delivery Mechanisms

### Four channels, all auto-wired by `<SemanticBridge>`.

The semantic output needs to reach different AI consumers through different channels. A single `<SemanticBridge />` component enables all of them:

### 6.1 `window.__semant` (Global JS API)

```javascript
window.__semant = {
  getState: () => string,           // Returns toPlainText() output
  getStructured: () => object,      // Returns the raw SemanticPage object
  execute: (cmd: string) => { ok: boolean, message: string },
  version: "0.1.0",
  fields: () => string[],           // List all field keys
}
```

**Consumer:** Any agent that can execute JavaScript in a browser context (Claude in Chrome, OpenAI Operator, custom agents, browser extensions).

**Why it's the strongest path:** Full read-write loop. Agent reads state, decides, acts, reads again. All in text. No vision model, no DOM parsing.

### 6.2 Hidden DOM node

```html
<div id="__semant"
     aria-hidden="true"
     style="display:none"
     data-semant-version="0.1.0">
  <!-- Live toPlainText() output, updated on every state change -->
</div>
```

**Consumer:** Browser agents that read DOM but can't execute arbitrary JS (some sandboxed environments).

**Why it matters:** Fallback for environments where `window.__semant` isn't accessible. The agent just reads `document.getElementById('__semant').textContent`.

### 6.3 `<script type="application/ld+json">`

Auto-injected into `<head>`:

```html
<script type="application/ld+json">
  { "@context": "https://schema.org", ... }
</script>
```

**Consumer:** Google, Bing, AI Overviews, any crawler that parses structured data.

**Why it matters:** SEO/GEO. This is the "free" benefit developers get just by using semant.

### 6.4 `/llms.txt` endpoint

This one requires server-side integration. semant provides the `toLlmsTxt()` function; the developer wires it into their server's route handler:

```javascript
// Next.js example
export function GET() {
  const page = getSemanticPageFromSSR();
  return new Response(toLlmsTxt(page), {
    headers: { "Content-Type": "text/plain" }
  });
}
```

**Consumer:** AI crawlers that look for `/llms.txt` (growing ecosystem, 600+ sites already have one).

### Discovery signal:

For agents to know a page supports semant, we inject:

```html
<meta name="semant" content="0.1.0">
```

This is cheap and unambiguous. An agent checks for this meta tag first, then knows it can use `window.__semant`.

---

## 7. Lifecycle & Edge Cases

### Component mount/unmount

- `useSemantic()` registers the node on every render (idempotent — same id overwrites).
- `useEffect` cleanup unregisters on unmount.
- This means: if a modal opens and contains semant components, they appear in the semantic tree. When the modal closes, they disappear. Correct behavior.

### Async / lazy-loaded content

- A component that loads data asynchronously should call `useSemantic()` on every render, including while loading.
- During loading, it can declare `fields: []` or a single field with `value: "loading..."`.
- When data arrives, the next render updates the fields with real values.
- The semantic tree is always a snapshot of the current render state. This is fine.

### SSR (Server-Side Rendering)

- `@semant/core`'s store works in any JS environment, including Node.js.
- On the server, components render once, `useSemantic()` populates the store, and `toLlmsTxt()` / `toJsonLd()` can be called to produce static output.
- `window.__semant` is only available client-side. The hidden DOM node and JSON-LD script tag work with SSR.
- For frameworks like Next.js: the initial HTML includes the JSON-LD and hidden DOM node. Client-side hydration then activates `window.__semant`.

### Route changes (SPA)

- When the user navigates to a new route, old components unmount (unregistering from the store) and new ones mount (registering).
- The store automatically reflects the current route's components.
- No special handling needed — React's component lifecycle does the work.
- If a developer wants a "global" node that persists across routes (e.g., site-wide info), they put it in a layout component that doesn't unmount.

### Multiple stores (micro-frontends)

- Not supported in v0.1. One `SemanticProvider` per page.
- Future: nested providers with scope merging.

---

## 8. What We Explicitly Don't Do

This list is as important as what we do. These are conscious choices, not gaps.

1. **We don't auto-infer semantics from DOM.** No magic analysis of existing components. Developers declare explicitly.

2. **We don't manage state.** No two-way binding, no store, no reducers. We call the `set()` callback the developer gives us and let their framework handle the rest.

3. **We don't validate commands.** If an agent sends `set party_size 99` and the options are 1-8, we still call `set(99)`. The developer's code should handle validation. We just pass through.

4. **We don't define semantic types.** `type` is an open string. We don't maintain a registry. AI is smart enough to figure out what `type: "location"` means.

5. **We don't enforce structure.** A developer can put all their fields in one giant node, or split into 50 nodes. We don't opinionate on organization.

6. **We don't do i18n.** Labels and descriptions are whatever language the developer writes them in. AI handles the multilingual part.

7. **We don't cache or diff.** Every render produces a fresh snapshot. Output renderers run from scratch each time. For v0.1 this is fine — the data is small.

---

## 9. Design Principles (Summary)

1. **Mirror, not engine.** Reflect state. Don't drive it.
2. **Protocol, not library.** Compose with everything. Replace nothing.
3. **Open semantics.** The developer defines meaning. The framework transports it.
4. **Framework-agnostic core.** Pure JS store. Framework bindings are thin adapters.
5. **Explicit over magic.** Three lines of declaration beats automatic inference that breaks.
6. **Small surface area.** One hook, one store, three output functions. That's the API.
7. **AI-native.** Every design decision asks: "does this make it easier for an AI agent to read and operate this page?"