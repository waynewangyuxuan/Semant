import { useState } from "react";
import { SemanticProvider } from "@semant/react";
import { BookingScene } from "./scenes/BookingScene";
import { AIView } from "./AIView";
import { CommandTerminal } from "./CommandTerminal";
import { TokenCounter } from "./TokenCounter";

const TABS = [
  { id: "geo", label: "GEO/SEO", badge: "Coming Soon" },
  { id: "research", label: "Deep Research", badge: "Coming Soon" },
  { id: "agentic", label: "Agentic", badge: null },
  { id: "structured", label: "Structured Data", badge: "Coming Soon" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function DemoScene() {
  const [activeTab, setActiveTab] = useState<TabId>("agentic");

  return (
    <div style={{ borderRadius: "var(--h-radius)", overflow: "hidden", border: "1px solid var(--h-border)" }}>
      {/* Tab Bar */}
      <div
        style={{
          display: "flex",
          gap: 0,
          background: "var(--h-bg)",
          borderBottom: "1px solid var(--h-border)",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.badge && setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "none",
              background: activeTab === tab.id ? "var(--h-card-bg)" : "transparent",
              color: tab.badge ? "var(--h-text-secondary)" : "var(--h-text)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              cursor: tab.badge ? "default" : "pointer",
              borderBottom: activeTab === tab.id ? "2px solid var(--h-accent)" : "2px solid transparent",
              opacity: tab.badge ? 0.5 : 1,
              position: "relative",
            }}
          >
            {tab.label}
            {tab.badge && (
              <span
                style={{
                  display: "block",
                  fontSize: 10,
                  color: "var(--h-text-secondary)",
                  fontWeight: 400,
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Demo Content */}
      <SemanticProvider title="Hotel Search" description="Search and book hotels on Booking.com">
        <div style={{ display: "flex", minHeight: 480 }}>
          {/* Human View */}
          <div
            style={{
              flex: 1,
              background: "var(--h-card-bg)",
              padding: 24,
              borderRight: "3px solid var(--h-border)",
              overflow: "auto",
            }}
          >
            {activeTab === "agentic" && <BookingScene />}
            {activeTab !== "agentic" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "var(--h-text-secondary)",
                }}
              >
                Coming Soon
              </div>
            )}
          </div>

          {/* AI View */}
          <div
            style={{
              flex: 1,
              background: "var(--a-bg)",
              padding: 24,
            }}
          >
            <AIView />
          </div>
        </div>

        {/* Command Terminal */}
        <CommandTerminal />

        {/* Token Counter */}
        <TokenCounter />
      </SemanticProvider>
    </div>
  );
}
