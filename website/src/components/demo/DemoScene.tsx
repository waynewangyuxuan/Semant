import { useState, useRef, useEffect, useCallback, type FC } from "react";
import { SemanticProvider } from "@semant/react";
import { BookingScene } from "./scenes/BookingScene";
import { MediumScene } from "./scenes/MediumScene";
import { MapsScene } from "./scenes/MapsScene";
import { ShopifyScene } from "./scenes/ShopifyScene";
import { AIView } from "./AIView";
import { AgentConsole } from "./AgentConsole";
import { CommandTerminal, type TerminalHandle } from "./CommandTerminal";
import { TokenCounter } from "./TokenCounter";
import { clearLog } from "./executionLog";

interface SceneConfig {
  id: string;
  label: string;
  title: string;
  description: string;
  commands: { cmd: string; delay: number }[];
  Component: FC;
}

const SCENES: SceneConfig[] = [
  {
    id: "geo",
    label: "GEO/SEO",
    title: "Tech Article",
    description: "A Medium-style article with semantic metadata",
    commands: [
      { cmd: "bookmark_article", delay: 1500 },
      { cmd: "share_article", delay: 2000 },
    ],
    Component: MediumScene,
  },
  {
    id: "research",
    label: "Deep Research",
    title: "Location Search",
    description: "Search and filter restaurants on a map",
    commands: [
      { cmd: 'set query "ramen near me"', delay: 1000 },
      { cmd: "set cuisine Japanese", delay: 800 },
      { cmd: "set price $$", delay: 800 },
      { cmd: "set min_rating 4.0", delay: 800 },
      { cmd: "select_result 1", delay: 2000 },
    ],
    Component: MapsScene,
  },
  {
    id: "agentic",
    label: "Agentic",
    title: "Hotel Search",
    description: "Search and book hotels on Booking.com",
    commands: [
      { cmd: 'set destination "San Diego, CA"', delay: 1200 },
      { cmd: "set check_in 2026-04-15", delay: 1000 },
      { cmd: "set check_out 2026-04-18", delay: 1000 },
      { cmd: "set guests 2", delay: 800 },
      { cmd: "set rooms 1", delay: 800 },
      { cmd: "search_hotels", delay: 2500 },
      { cmd: "book_hotel", delay: 3000 },
    ],
    Component: BookingScene,
  },
  {
    id: "structured",
    label: "Structured Data",
    title: "Product Page",
    description: "Shopify product page with live structured data",
    commands: [
      { cmd: 'set color "Forest Green"', delay: 1200 },
      { cmd: "set size L", delay: 1000 },
      { cmd: "set quantity 2", delay: 1000 },
      { cmd: "add_to_cart", delay: 2000 },
    ],
    Component: ShopifyScene,
  },
];

export function DemoScene() {
  const [activeIdx, setActiveIdx] = useState(2); // default to Agentic
  const scene = SCENES[activeIdx];
  const terminalRef = useRef<TerminalHandle>(null);
  const cancelledRef = useRef(false);

  // Run animation for current scene
  useEffect(() => {
    cancelledRef.current = false;
    clearLog();

    const run = async () => {
      await new Promise((r) => setTimeout(r, 1500));

      for (const step of scene.commands) {
        if (cancelledRef.current) return;
        if (terminalRef.current) {
          await terminalRef.current.agentExecute(step.cmd);
        }
        if (cancelledRef.current) return;
        await new Promise((r) => setTimeout(r, step.delay));
      }
    };

    run();

    return () => { cancelledRef.current = true; };
  }, [activeIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUserInteract = useCallback(() => {
    cancelledRef.current = true;
  }, []);

  const handleTabSwitch = useCallback((idx: number) => {
    cancelledRef.current = true;
    setActiveIdx(idx);
  }, []);

  const ActiveComponent = scene.Component;

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
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => handleTabSwitch(i)}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "none",
              background: activeIdx === i ? "var(--h-card-bg)" : "transparent",
              color: "var(--h-text)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              fontWeight: activeIdx === i ? 600 : 400,
              cursor: "pointer",
              borderBottom: activeIdx === i ? "2px solid var(--h-accent)" : "2px solid transparent",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Demo Content */}
      <SemanticProvider title={scene.title} description={scene.description}>
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
            <ActiveComponent />
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
