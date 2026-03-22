import { useState } from "react";
import {
  SemanticInfo,
  SemanticList,
  SemanticAction,
} from "@semant/react";

interface Article {
  id: string;
  title: string;
  date: string;
}

const RELATED_ARTICLES: Article[] = [
  { id: "a1", title: "The Death of Manual JSON-LD", date: "2026-03-15" },
  { id: "a2", title: "llms.txt: One Year Later", date: "2026-02-28" },
  { id: "a3", title: "How AI Agents Actually Read Your Website", date: "2026-03-10" },
];

const TAGS = ["web development", "AI", "semantic web", "GEO", "SEO"];

export function MediumScene() {
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);

  return (
    <div style={{ fontFamily: "var(--font-body)", maxWidth: 520 }}>
      {/* Article header */}
      <SemanticInfo
        role="article"
        title="Why Component-Level Semantics Will Replace Schema.org"
        meta={{
          author: "Wayne Zhang",
          published: "2026-03-21",
          reading_time: "8 min",
          summary: "Traditional SEO metadata is maintained separately from UI. semant changes that — components describe themselves.",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: 12,
            color: "#1a1a1a",
          }}
        >
          Why Component-Level Semantics Will Replace Schema.org
        </h2>

        {/* Author */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2d6a4f, #95d5b2)",
            }}
          />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Wayne Zhang</div>
            <div style={{ fontSize: 12, color: "#6b6b6b" }}>Mar 21 · 8 min read</div>
          </div>
        </div>
      </SemanticInfo>

      {/* Article body preview */}
      <div
        style={{
          fontSize: 15,
          lineHeight: 1.8,
          color: "#333",
          marginBottom: 20,
          borderBottom: "1px solid #eee",
          paddingBottom: 20,
        }}
      >
        <p style={{ marginBottom: 12 }}>
          Traditional SEO metadata lives in <code style={{ background: "#f0f0f0", padding: "2px 4px", borderRadius: 3, fontSize: 13 }}>&lt;head&gt;</code> —
          hand-written JSON-LD that drifts from your actual UI. When a user picks a different color or size,
          the structured data stays frozen.
        </p>
        <p>
          What if each component could describe itself? What if the metadata was always in sync because it
          <em>comes from</em> the component state, not a separate file?
        </p>
      </div>

      {/* Tags */}
      <SemanticList
        name="tags"
        label="Article Tags"
        items={TAGS}
        getLabel={(t) => t}
        getKey={(t) => t}
      >
        {({ items }) => (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {items.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "4px 12px",
                  background: "#f0f0f0",
                  borderRadius: 16,
                  fontSize: 13,
                  color: "#555",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </SemanticList>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <SemanticAction
          name="bookmark_article"
          label="Bookmark"
          onExecute={() => setBookmarked(true)}
          enabled={!bookmarked}
          description="Save article to reading list"
        >
          <button
            onClick={() => setBookmarked(true)}
            disabled={bookmarked}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: 20,
              background: bookmarked ? "#2d6a4f" : "#fff",
              color: bookmarked ? "#fff" : "#333",
              fontSize: 13,
              cursor: bookmarked ? "default" : "pointer",
            }}
          >
            {bookmarked ? "✓ Bookmarked" : "☆ Bookmark"}
          </button>
        </SemanticAction>

        <SemanticAction
          name="share_article"
          label="Share"
          onExecute={() => setShared(true)}
          enabled={!shared}
          description="Share this article"
        >
          <button
            onClick={() => setShared(true)}
            disabled={shared}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: 20,
              background: shared ? "#2d6a4f" : "#fff",
              color: shared ? "#fff" : "#333",
              fontSize: 13,
              cursor: shared ? "default" : "pointer",
            }}
          >
            {shared ? "✓ Shared" : "↗ Share"}
          </button>
        </SemanticAction>
      </div>

      {/* Related articles */}
      <SemanticList
        name="related_articles"
        label="Related Articles"
        items={RELATED_ARTICLES}
        getLabel={(a) => a.title}
        getKey={(a) => a.id}
        getMeta={(a) => ({ date: a.date })}
      >
        {({ items }) => (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#6b6b6b", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Related
            </div>
            {items.map((article) => (
              <div
                key={article.id}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 14, color: "#2d6a4f", fontWeight: 500 }}>{article.title}</span>
                <span style={{ fontSize: 12, color: "#999" }}>{article.date}</span>
              </div>
            ))}
          </div>
        )}
      </SemanticList>
    </div>
  );
}
