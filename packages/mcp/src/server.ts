import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import {
  SemanticStore,
  toMCPTools,
  toPlainText,
} from "@semant/core";
import type { ToMCPToolsOptions } from "@semant/core";

// ── Types ──

export interface CreateSemantMCPServerOptions {
  /** Server name exposed to MCP clients. Default: "semant" */
  name?: string;
  /** Server version. Default: "0.1.0" */
  version?: string;
  /** Options passed to toMCPTools(). */
  toolOptions?: ToMCPToolsOptions;
}

export interface SemantMCPServer {
  /** The underlying MCP Server instance */
  server: Server;
  /** Connect to any MCP transport */
  connect: (transport: Transport) => Promise<void>;
  /** Convenience: connect via stdio */
  connectStdio: () => Promise<void>;
  /** Unsubscribe from store changes and clean up */
  dispose: () => void;
}

// ── Factory ──

/**
 * Create an MCP server that bridges tool calls to a SemanticStore.
 * Tools are dynamically generated from the store's current semantic page state.
 */
export function createSemantMCPServer(
  store: SemanticStore,
  options?: CreateSemantMCPServerOptions
): SemantMCPServer {
  const serverName = options?.name ?? "semant";
  const serverVersion = options?.version ?? "0.1.0";
  const toolOptions = options?.toolOptions;
  const setPrefix = toolOptions?.setPrefix ?? "set_";
  const introspectionPrefix = toolOptions?.introspectionPrefix ?? "semant_";

  const server = new Server(
    { name: serverName, version: serverVersion },
    { capabilities: { tools: {} } }
  );

  // ── ListTools handler ──

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const page = store.getSnapshot();
    const tools = toMCPTools(page, toolOptions);
    return { tools };
  });

  // ── CallTool handler ──

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const args = (request.params.arguments ?? {}) as Record<string, unknown>;
    const page = store.getSnapshot();

    // Introspection: get_state
    if (toolName === `${introspectionPrefix}get_state`) {
      return {
        content: [{ type: "text" as const, text: toPlainText(page) }],
      };
    }

    // Introspection: list_fields
    if (toolName === `${introspectionPrefix}list_fields`) {
      const fields = page.nodes.flatMap((n) =>
        n.fields.map((f) => ({
          key: f.key,
          type: f.type,
          label: f.label,
          value: f.value,
          settable: !!f.set,
          executable: f.type === "action" && !!f.execute,
        }))
      );
      return {
        content: [{ type: "text" as const, text: JSON.stringify(fields, null, 2) }],
      };
    }

    // Set field
    if (toolName.startsWith(setPrefix)) {
      const fieldKey = toolName.slice(setPrefix.length);
      const value = args.value;
      const result = store.execute(`set ${fieldKey} ${value}`);
      const updatedState = toPlainText(store.getSnapshot());
      return {
        content: [
          { type: "text" as const, text: result.message },
          { type: "text" as const, text: `\nUpdated state:\n${updatedState}` },
        ],
        isError: !result.ok,
      };
    }

    // Action
    const result = store.execute(toolName);
    const updatedState = toPlainText(store.getSnapshot());
    return {
      content: [
        { type: "text" as const, text: result.message },
        { type: "text" as const, text: `\nUpdated state:\n${updatedState}` },
      ],
      isError: !result.ok,
    };
  });

  // ── Dynamic tool updates (debounced via microtask) ──

  let notifyScheduled = false;
  const unsubscribe = store.subscribe(() => {
    if (!notifyScheduled) {
      notifyScheduled = true;
      queueMicrotask(() => {
        notifyScheduled = false;
        server.notification({
          method: "notifications/tools/list_changed",
        }).catch(() => {
          // Client may not support notifications — ignore
        });
      });
    }
  });

  // ── Public API ──

  return {
    server,
    connect: (transport: Transport) => server.connect(transport),
    connectStdio: async () => {
      const transport = new StdioServerTransport();
      await server.connect(transport);
    },
    dispose: () => {
      unsubscribe();
    },
  };
}
