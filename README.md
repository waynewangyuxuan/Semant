# semant

**React components that describe themselves to AI.**

Build pages that are human-beautiful and machine-operable. Every component knows how to render itself *and* how to explain itself — as plain text, llms.txt, or JSON-LD. No separate metadata layer. No reverse engineering. One source of truth.

[Live Demo](https://semant-demo.vercel.app) · [npm](https://www.npmjs.com/package/semant)

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
  useSemanticPage,
  toPlainText,
} from "semant";

function App() {
  const [size, setSize] = useState(2);

  return (
    <SemanticProvider title="Restaurant Booking" description="Book a table at Nōri">
      <SemanticInfo
        role="restaurant"
        title="Nōri Omakase"
        meta={{ cuisine: "Japanese", rating: 4.7, price: "$$$" }}
      >
        <h1>Nōri Omakase</h1>
        <p>★★★★½ · Japanese · $$$</p>
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

      <AIView />
    </SemanticProvider>
  );
}

function AIView() {
  const page = useSemanticPage();
  return <pre>{toPlainText(page)}</pre>;
}
```

The `<pre>` above renders something like:

```
# Restaurant Booking
> Book a table at Nōri

[restaurant: Nōri Omakase]
  cuisine: Japanese
  rating: 4.7
  price: $$$

[Field: Party Size]
  [Select: party_size] options: [1, 2, 3, 4, 5, 6] current: 2

[Action: Book Table]
  [Action: submit_booking] enabled: true
    Requires: party_size, date, time

## Commands
  set party_size <1|2|3|4|5|6>
  submit_booking
```

AI reads that. Sends `set party_size 4`. Done.

## API

### Core

| Export | Description |
|--------|-------------|
| `SemanticProvider` | Wrap your app. Sets page title/description. Collects all semantic nodes. |
| `useSemantic(options)` | Register any component as a semantic node. This is the escape hatch — use it to make *your own* components self-describing. |
| `useSemanticPage()` | Read the full semantic state. Re-renders on changes. |
| `useSemanticStore()` | Get the store directly. Call `store.execute("set party_size 4")` to operate the page via text commands. |

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

Every component accepts a `children` render prop so you can use your own UI while keeping the semantic layer.

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
        type: "select",
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

## Output Formats

### Plain Text (for AI agents)
```
[Field: Color Picker]
  [Select: color] options: [red, blue, green, yellow] current: blue

## Commands
  set color <red|blue|green|yellow>
```

### llms.txt (for crawlers)
```markdown
# My App
> A beautiful app with a color picker

## Color Picker
### Fields
- **Selected Color** (`color`): red, blue, green, yellow — current: blue
### Actions
- `apply_color`: Apply the selected color
```

### JSON-LD (for search engines)
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "My App",
  "mainEntity": [...]
}
```

One source of truth. Three outputs. Zero extra maintenance.

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
