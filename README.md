# semant

**React components that describe themselves to AI.**

Build pages that are human-beautiful and machine-operable. Every component knows how to render itself *and* how to explain itself — as plain text, llms.txt, or JSON-LD. No separate metadata layer. No reverse engineering. One source of truth.

[npm](https://www.npmjs.com/package/semant)

---

## The Problem

AI agents trying to understand a web page today have two options:

1. **Screenshot + vision model** — slow, expensive, imprecise
2. **Parse the DOM** — a wall of nested `<div class="btn-primary mx-2 shadow-lg">` tells you nothing

Both are reverse engineering. The page was never designed to be understood.

## The Idea

What if components described themselves?

```tsx
// A normal select. AI sees: <div><select>...</select></div>
<select value={size} onChange={setSize}>
  <option>1</option>
  <option>2</option>
</select>

// A semant select. AI sees:
// [Select: party_size] options: [1, 2, 3, 4] current: 2
// Command: set party_size <1|2|3|4>
<SemanticSelect
  name="party_size"
  label="Party Size"
  options={[
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
  ]}
  value={size}
  onChange={setSize}
/>
```

Same UI for humans. But now AI can read the page, understand the state, and operate it — with zero vision models, zero DOM parsing.

## Quick Start

```bash
npm install semant
```

```tsx
import {
  SemanticProvider,
  SemanticSelect,
  SemanticAction,
  SemanticInfo,
  SemanticHead,
  SemanticBridge,
} from "semant";

function App() {
  const [size, setSize] = useState(2);

  return (
    <SemanticProvider title="Restaurant Booking" description="Book a table at Nōri">
      <SemanticHead baseUrl="https://mysite.com" />
      <SemanticBridge />

      <SemanticInfo
        role="restaurant"
        title="Nōri Omakase"
        meta={{ cuisine: "Japanese", rating: 4.7, price: "$$$" }}
      >
        <h1>Nōri Omakase</h1>
        <p>Japanese · $$$</p>
      </SemanticInfo>

      <SemanticSelect
        name="party_size"
        label="Party Size"
        options={[1, 2, 3, 4, 5, 6].map((n) => ({ value: n, label: String(n) }))}
        value={size}
        onChange={setSize}
      />

      <SemanticAction
        name="submit_booking"
        label="Book Table"
        onExecute={() => alert("Booked!")}
        enabled={size > 0}
        requires={["party_size", "date", "time"]}
      />
    </SemanticProvider>
  );
}
```

Two extra lines (`<SemanticHead>` and `<SemanticBridge>`) and your page is now AI-readable through four channels simultaneously.

## How AI Reads Your Page

Semant exposes your page state through four channels. You don't need to pick — `<SemanticHead>` and `<SemanticBridge>` enable all of them at once.

### 1. JSON-LD in `<head>` (search engines, AI Overview)

`<SemanticHead>` automatically injects a `<script type="application/ld+json">` tag with Schema.org structured data. Google, Bing, and AI Overview can parse it. Updates automatically when state changes.

### 2. llms.txt (AI crawlers)

Use `toLlmsTxt()` to generate [llms.txt](https://llmstxt.org)-compatible output and serve it at `yoursite.com/llms.txt`. Perplexity, Claude, and 600+ sites already use this convention.

```ts
// In your server route / build script
import { toLlmsTxt } from "semant";
const content = toLlmsTxt(page, { baseUrl: "https://mysite.com" });
// Serve as /llms.txt
```

### 3. Hidden DOM node (browser agents)

`<SemanticBridge>` renders a hidden `<div id="semantic-state">` with a plain-text description of the page. Browser agents (Claude in Chrome, Operator, etc.) can read it directly from the DOM instead of parsing the entire page.

### 4. Global JS API (the most powerful path)

`<SemanticBridge>` also exposes `window.__semant` — a full read/write API:

```javascript
// Read the current page state
__semant.getState()
// Returns plain text like:
// [Select: party_size] options: [1, 2, 3, 4, 5, 6] current: 2
// [Action: submit_booking] enabled: true

// Execute a command and get the updated state in one step
const { ok, state } = await __semant.execute("set party_size 4")
// ok: true
// state: "...party_size current: 4..."

// Trigger an action
await __semant.execute("submit_booking")
```

`execute()` returns a Promise that resolves after React has re-rendered, so the `state` in the response is always up-to-date.

## API

### Core

| Export | Description |
|--------|-------------|
| `SemanticProvider` | Wrap your app. Sets page title/description. |
| `useSemantic(options)` | Register any component as a semantic node. The escape hatch for custom components. |
| `useSemanticPage()` | Read the full semantic state. Re-renders on changes. |
| `useSemanticStore()` | Get the store directly for executing commands. |
| `field(def)` | Helper to create a typed field with TypeScript inference. |

### AI Delivery

| Export | Description |
|--------|-------------|
| `<SemanticHead>` | Injects JSON-LD `<script>` into `<head>`. Auto-updates. |
| `<SemanticBridge>` | Hidden DOM node + `window.__semant` global API. |

### Output Renderers

| Export | Description |
|--------|-------------|
| `toPlainText(page)` | AI-readable plain text with commands |
| `toLlmsTxt(page, options?)` | [llms.txt](https://llmstxt.org) spec-compatible output |
| `toJsonLd(page, options?)` | Schema.org JSON-LD structured data |
| `toJsonLdScript(page, options?)` | JSON-LD as string for `<script>` embedding |

### Reference Components

These are optional — use them directly, or use `useSemantic` to make your own.

| Component | Description |
|-----------|-------------|
| `SemanticSelect` | Dropdown / option picker |
| `SemanticDatePicker` | Date selector |
| `SemanticTextInput` | Text / email / number input |
| `SemanticAction` | Button / submit action |
| `SemanticInfo` | Static info block (restaurant details, product specs, etc.) |
| `SemanticList` | List of items with metadata |

All components support custom rendering via `children` render prop (except `SemanticAction` which uses a `render` prop, since `children` is used for button content).

## Make Your Own Components Semantic

The reference components are just examples. The real power is `useSemantic`:

```tsx
import { useSemantic } from "semant";

function MyFancyColorPicker({ color, onChange }) {
  useSemantic({
    role: "Field",
    title: "Color Picker",
    fields: [
      {
        key: "color",
        label: "Selected Color",
        type: "color-picker",  // any string works, not limited to built-in types
        value: color,
        options: ["red", "blue", "green", "yellow"],
        set: (v) => onChange(v),
      },
    ],
  });

  // Your beautiful custom UI here
  return <div>...</div>;
}
```

Three lines of integration. Your component is now self-describing and AI-operable.

## Philosophy

The web was built for human eyes. AI understands it through reverse engineering — parsing DOMs, taking screenshots, guessing what buttons do.

`llms.txt` made the web **readable** to AI. semant makes it **operable**.

Every component carries its own documentation. Not as an afterthought, not as a separate metadata layer, but as a first-class output generated from the same state that renders the UI.

The page *is* its own API.

## Contributing

This is v0.1 — the protocol is the point, not the component count. PRs welcome for:

- New output formats (OpenAPI, MCP, etc.)
- Framework adapters (Vue, Svelte, etc.)
- More reference components
- Better docs

## License

MIT
