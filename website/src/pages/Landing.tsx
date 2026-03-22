import { Link } from "react-router-dom";
import { DemoScene } from "../components/demo/DemoScene";

export function Landing() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Top Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          height: 56,
          borderBottom: "1px solid var(--h-border)",
        }}
      >
        <span
          className="heading"
          style={{ fontSize: 18, fontWeight: 700, color: "var(--h-text)" }}
        >
          semant
        </span>
        <div style={{ display: "flex", gap: 20, fontSize: 14 }}>
          <a href="#demo" style={{ color: "var(--h-text-secondary)", textDecoration: "none" }}>Demo</a>
          <Link to="/docs" style={{ color: "var(--h-text)", textDecoration: "none", fontWeight: 500 }}>Docs</Link>
          <a href="https://github.com/waynewangyuxuan/Semant" target="_blank" rel="noopener" style={{ color: "var(--h-text-secondary)", textDecoration: "none" }}>GitHub</a>
          <a href="https://www.npmjs.com/package/@semant/react" target="_blank" rel="noopener" style={{ color: "var(--h-text-secondary)", textDecoration: "none" }}>npm</a>
        </div>
      </nav>

      {/* Screen 1: Hero */}
      <header
        style={{
          padding: "80px 24px",
          textAlign: "center",
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <h1
          className="heading"
          style={{ fontSize: 48, fontWeight: 700, marginBottom: 12 }}
        >
          semant
        </h1>
        <p
          style={{
            fontSize: 20,
            color: "var(--h-text-secondary)",
            marginBottom: 40,
          }}
        >
          The web that AI can operate
        </p>
        <a
          href="#demo"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: "var(--h-accent)",
            color: "#fff",
            borderRadius: "var(--h-radius)",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          See it in action ↓
        </a>
      </header>

      {/* Screen 2: Interactive Demo */}
      <section
        id="demo"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <DemoScene />
      </section>

      {/* Screen 3: CTA */}
      <footer
        style={{
          padding: "80px 24px",
          textAlign: "center",
          maxWidth: 600,
          margin: "0 auto",
          borderTop: "1px solid var(--h-border)",
        }}
      >
        <p
          className="mono"
          style={{
            fontSize: 18,
            color: "var(--h-accent)",
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          The page is its own API.
        </p>
        <code
          className="mono"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "var(--a-bg)",
            color: "var(--a-accent)",
            borderRadius: "var(--a-radius)",
            fontSize: 15,
          }}
        >
          $ npm install @semant/react
        </code>
        <div style={{ marginTop: 24, display: "flex", gap: 16, justifyContent: "center" }}>
          <Link
            to="/docs/quickstart"
            style={{ color: "var(--h-accent)", fontWeight: 500, textDecoration: "none" }}
          >
            Get Started →
          </Link>
        </div>
      </footer>
    </div>
  );
}
