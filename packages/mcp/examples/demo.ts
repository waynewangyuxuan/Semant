/**
 * Demo MCP server for testing semant MCP adapter.
 * Simulates a restaurant booking page with interactive fields.
 *
 * Run: npx tsx packages/mcp/examples/demo.ts
 * Test: npx @modelcontextprotocol/inspector npx tsx packages/mcp/examples/demo.ts
 */
import { SemanticStore } from "@semant/core";
import { createSemantMCPServer } from "../src/server";

// ── State ──

let partySize = 2;
let date = "2025-07-01";
let time = "19:00";
let guestName = "";

function registerFields() {
  store.register({
    id: "booking-form",
    role: "restaurant",
    title: "Nōri Reservation",
    description: "Book a table at Nōri Japanese Restaurant",
    meta: { cuisine: "Japanese", priceRange: "$$$" },
    fields: [
      {
        key: "party_size",
        label: "Party Size",
        type: "select",
        value: partySize,
        constraints: { options: [1, 2, 3, 4, 5, 6] },
        description: "Number of guests",
        set: (v: unknown) => {
          partySize = Number(v);
          registerFields();
        },
      },
      {
        key: "date",
        label: "Date",
        type: "date",
        value: date,
        description: "Reservation date",
        set: (v: unknown) => {
          date = String(v);
          registerFields();
        },
      },
      {
        key: "time",
        label: "Time",
        type: "select",
        value: time,
        constraints: { options: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"] },
        description: "Reservation time",
        set: (v: unknown) => {
          time = String(v);
          registerFields();
        },
      },
      {
        key: "guest_name",
        label: "Guest Name",
        type: "text",
        value: guestName,
        description: "Name for the reservation",
        set: (v: unknown) => {
          guestName = String(v);
          registerFields();
        },
      },
      {
        key: "submit_booking",
        label: "Submit Booking",
        type: "action",
        value: null,
        description: "Confirm and submit the reservation",
        constraints: { enabled: guestName.length > 0 },
        execute: () => {
          process.stderr.write(
            `\n✓ Booking confirmed: ${guestName}, party of ${partySize}, ${date} at ${time}\n\n`
          );
        },
      },
    ],
  });
}

// ── Bootstrap ──

const store = new SemanticStore();
store.setPage("Restaurant Booking", "Book a table at Nōri Japanese Restaurant");
registerFields();

const mcp = createSemantMCPServer(store);
mcp.connectStdio();
