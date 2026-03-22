import { DemoScene } from "../components/demo/DemoScene";

const BASE = import.meta.env.BASE_URL;

export function Landing() {
  return (
    <div style={{ minHeight: "100vh" }}>
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
          <a
            href="https://github.com/waynewangyuxuan/Semant"
            target="_blank"
            rel="noopener"
            style={{ color: "var(--h-accent)", fontWeight: 500 }}
          >
            View on GitHub
          </a>
          <a
            href={`${BASE}docs`}
            style={{ color: "var(--h-accent)", fontWeight: 500 }}
          >
            Read the Docs
          </a>
        </div>
      </footer>
    </div>
  );
}
