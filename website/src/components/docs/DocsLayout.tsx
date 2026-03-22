import { Outlet, Link, useLocation } from "react-router-dom";
import { SemanticProvider, SemanticHead, SemanticBridge, SemanticInfo } from "@semant/react";
import { Sidebar } from "./Sidebar";

function pageTitle(pathname: string): string {
  if (pathname.includes("/why")) return "Why semant";
  if (pathname.includes("/quickstart")) return "Quick Start";
  if (pathname.includes("/wrap-component")) return "Wrap Your Own Component";
  if (pathname.includes("/reference/api")) return "API Reference";
  return "Documentation";
}

export function DocsLayout() {
  const { pathname } = useLocation();
  const title = pageTitle(pathname);

  return (
    <SemanticProvider title={`semant docs — ${title}`} description="Documentation for the semant semantic protocol">
      <SemanticHead />
      <SemanticBridge />
      <SemanticInfo role="documentation" title={title} meta={{ section: "docs", path: pathname }} />
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Nav */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: 56,
          borderBottom: "1px solid var(--h-border)",
          background: "var(--h-card-bg)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            to="/"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--h-text)",
              textDecoration: "none",
            }}
          >
            semant
          </Link>
          <span
            style={{
              fontSize: 12,
              color: "var(--h-accent)",
              fontWeight: 600,
              padding: "2px 8px",
              background: "rgba(45, 106, 79, 0.08)",
              borderRadius: 4,
            }}
          >
            docs
          </span>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 14 }}>
          <Link to="/docs" style={{ color: "var(--h-accent)", textDecoration: "none", fontWeight: 500 }}>
            Docs
          </Link>
          <a href="https://github.com/waynewangyuxuan/Semant" target="_blank" rel="noopener" style={{ color: "var(--h-text-secondary)", textDecoration: "none" }}>
            GitHub
          </a>
          <a href="https://www.npmjs.com/package/@semant/react" target="_blank" rel="noopener" style={{ color: "var(--h-text-secondary)", textDecoration: "none" }}>
            npm
          </a>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 240,
            flexShrink: 0,
            borderRight: "1px solid var(--h-border)",
            background: "var(--h-bg)",
            overflow: "auto",
          }}
        >
          <Sidebar />
        </aside>

        {/* Content */}
        <main
          style={{
            flex: 1,
            padding: "40px 48px",
            overflowY: "auto",
          }}
        >
          <div style={{ maxWidth: 800 }}>
            <Outlet />

            {/* Footer */}
            <footer
              style={{
                marginTop: 60,
                paddingTop: 20,
                borderTop: "1px solid var(--h-border)",
                fontSize: 13,
                color: "var(--h-text-secondary)",
                fontFamily: "var(--font-mono)",
              }}
            >
              This page describes itself. Console → window.__semant.getState()
            </footer>
          </div>
        </main>
      </div>
    </div>
    </SemanticProvider>
  );
}
