# Interactive Elements

Five types of interactive components appear throughout the documentation. Each serves a specific pedagogical purpose.

## 1. Live Playground

**Appears in:** Quick Start, Core Concepts, Guides

Code editor on the left, split preview on the right (UI rendering on top, AI text output below). Editing code updates both previews in real-time.

```
┌─────────────────────┬──────────────────────┐
│  <SemanticSelect    │  UI Preview          │
│    name="party_size"│  ┌────────────────┐  │
│    options={[1,2,3]}│  │ [1] [2] [3]    │  │
│    value={size}     │  └────────────────┘  │
│    onChange={set}    ├──────────────────────┤
│  />                 │  AI View             │
│                     │  [Select: party_size]│
│                     │    current: 2        │
└─────────────────────┴──────────────────────┘
```

- Editor: CodeMirror 6 or Sandpack (not Monaco — bundle too large)
- Editing `name="party_size"` to `name="guests"` immediately changes AI view to `[Select: guests]`
- "Reset" button restores initial code

## 2. State Flow Diagram

**Appears in:** Core Concepts → Mirror Principle

Step-through animation showing data flow. Reader clicks "Next" to advance. Two flows:

**Human → AI:**
1. User clicks UI → React setState
2. Component re-renders → useSemantic() fires
3. Store updates field value
4. Output renderers refresh (plaintext, JSON-LD, llms.txt)
5. window.__semant.getState() returns updated text

**AI → Human:**
1. Agent calls window.__semant.execute("set party_size 4")
2. Store finds matching field
3. Calls developer's set() callback → setState
4. React re-renders → useSemantic() re-fires → store updates
5. Agent reads getState() to confirm

Core message: **semant has no state of its own. It rides React's render cycle.**

## 3. Field Schema Explorer

**Appears in:** Core Concepts → Semantic Fields

Interactive field builder. Reader inputs arbitrary `type`, `key`, `value`, and adds constraints. Real-time AI output preview shows what the AI would see.

Key ideology demonstrated: **`type` is an open string — the framework doesn't define what types exist.**

Reader can type `type: "color"` or `type: "3d-orientation"` — the framework accepts anything. AI figures out meaning from context.

## 4. Command Terminal

**Appears in:** Core Concepts → Command Protocol, Quick Start

Embedded terminal emulator connected to a live demo component beside it. Reader types semant commands, sees results, and watches the companion UI update.

```
> set party_size 4
✓ set party_size = 4

> submit_booking
✓ executed: submit_booking

> set nonexistent 123
✗ unknown field: nonexistent
```

The companion demo component visually reflects each command's effect.

## 5. Delivery Channel Tabs

**Appears in:** Core Concepts → Delivery Channels

Four tabs, each showing one delivery method's real output plus how AI consumers use it:

| Tab | Content | Consumer |
|-----|---------|----------|
| `window.__semant` | Console demo: getState() + execute() | Browser agents (Claude, Operator) |
| Hidden DOM | `<div id="__semant">` content | DOM-reading agents |
| JSON-LD | Schema.org output in `<head>` | Search engines, AI Overview |
| llms.txt | llms.txt spec format | AI crawlers |

Each tab also shows: setup instructions (usually one component) and which AI consumers use this channel.

## Ideology Callouts

Every documentation page starts with a Design Principle callout box (see `../DesignLanguage.md` for visual spec). Examples:

- **Mirror Principle page:** "useSemantic() doesn't manage your state. It reads what you declare on each render."
- **Semantic Fields page:** "The `type` field is a string, not a union. semant doesn't define what types exist. You do."
- **Delivery Channels page:** "The page is its own API. No separate backend. No manual sync."

## Dogfooding

### Every page has `window.__semant`

The documentation site itself uses semant components. Navigation, search, content sections — all registered as semantic nodes.

### Footer prompt

Every page footer includes:
```
This page describes itself. Console → window.__semant.getState()
```

### Search

Documentation search uses `SemanticTextInput` (search box) and `SemanticList` (results). Note: cross-page indexing uses the framework's built-in search — semant provides the semantic layer for the current page only.
