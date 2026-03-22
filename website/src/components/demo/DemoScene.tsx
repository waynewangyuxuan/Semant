import { useState, useRef, useEffect, useCallback } from "react";
import { SemanticProvider } from "@semant/react";
import { BookingScene } from "./scenes/BookingScene";
import { AIView } from "./AIView";
import { AgentConsole } from "./AgentConsole";
import { CommandTerminal, type TerminalHandle } from "./CommandTerminal";
import { TokenCounter } from "./TokenCounter";

const TABS = [
  { id: "geo", label: "GEO/SEO", badge: "Coming Soon" },
  { id: "research", label: "Deep Research", badge: "Coming Soon" },
  { id: "agentic", label: "Agentic", badge: null },
  { id: "structured", label: "Structured Data", badge: "Coming Soon" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** Command-driven animation sequence */
const DEMO_COMMANDS = [
  { cmd: 'set destination "San Diego, CA"', delay: 1200 },
  { cmd: "set check_in 2026-04-15", delay: 1000 },
  { cmd: "set check_out 2026-04-18", delay: 1000 },
  { cmd: "set guests 2", delay: 800 },
  { cmd: "set rooms 1", delay: 800 },
  { cmd: "search_hotels", delay: 2500 },
  { cmd: "book_hotel", delay: 3000 },
];

export function DemoScene() {
  const [activeTab, setActiveTab] = useState<TabId>("agentic");
  const terminalRef = useRef<TerminalHandle>(null);
  const animatingRef = useRef(false);
  const pausedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const runAnimation = useCallback(async () => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    // Run once, not in a loop
    for (const step of DEMO_COMMANDS) {
      if (pausedRef.current) break;
      if (terminalRef.current) {
        await terminalRef.current.agentExecute(step.cmd);
      }
      if (pausedRef.current) break;
      await new Promise((r) => { timeoutRef.current = setTimeout(r, step.delay); });
    }

    animatingRef.current = false;
  }, []);

  // Start animation on mount
  useEffect(() => {
    const startTimer = setTimeout(() => runAnimation(), 1500);
    return () => {
      clearTimeout(startTimer);
      pausedRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [runAnimation]);

  // Pause on user interaction, resume after idle
  const handleUserInteract = useCallback(() => {
    pausedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Resume after 8 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
      runAnimation();
    }, 8000);
  }, [runAnimation]);

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
        <div
          style={{ display: "flex", minHeight: 480 }}
          onClick={handleUserInteract}
          onKeyDown={handleUserInteract}
        >
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
              borderRight: "1px solid var(--a-border)",
            }}
          >
            <AIView />
          </div>

          {/* Agent Console */}
          <div
            style={{
              width: 280,
              flexShrink: 0,
              background: "#111113",
            }}
          >
            <AgentConsole />
          </div>
        </div>

        {/* Command Terminal */}
        <CommandTerminal ref={terminalRef} />

        {/* Token Counter */}
        <TokenCounter />
      </SemanticProvider>
    </div>
  );
}
