// ── Types ──

export interface SemanticField {
  /** Unique key for this field, e.g. "party_size" — used in commands */
  key: string;
  /** Human-readable label */
  label: string;
  /** Open type string — "select", "date", "location", "3d-orientation", anything */
  type: string;
  /** Current value (must be JSON-serializable) */
  value: unknown;
  /** Free-form constraints — { options: [...] }, { min: 0, max: 100 }, { bounds: [...] }, etc. */
  constraints?: Record<string, unknown>;
  /** Natural language description for AI */
  description?: string;
  /** Setter — called by the command interpreter */
  set?: (value: unknown) => void;
  /** For actions — the execute function */
  execute?: () => void;
}

export interface SemanticNode {
  /** Node id, auto-generated or user-provided */
  id: string;
  /** Semantic role: what is this block? Open string. */
  role: string;
  /** Human-readable title */
  title?: string;
  /** Short description */
  description?: string;
  /** Arbitrary metadata (must be JSON-serializable) */
  meta?: Record<string, unknown>;
  /** Interactive fields */
  fields: SemanticField[];
  /** Ordering hint */
  order?: number;
}

export interface SemanticPage {
  /** Page title */
  title: string;
  /** Page description */
  description?: string;
  /** All registered nodes */
  nodes: SemanticNode[];
}
