import { useState } from "react";
import {
  SemanticTextInput,
  SemanticSelect,
  SemanticList,
  SemanticAction,
  SemanticInfo,
} from "@semant/react";

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  price: string;
  cuisine: string;
}

const MOCK_RESULTS: Restaurant[] = [
  { id: "r1", name: "Menya Ultra", rating: 4.6, reviews: 892, distance: "0.3 mi", price: "$$", cuisine: "Japanese, Ramen" },
  { id: "r2", name: "Ramen Yamadaya", rating: 4.4, reviews: 1204, distance: "0.7 mi", price: "$$", cuisine: "Japanese, Ramen" },
  { id: "r3", name: "Underbelly Ramen", rating: 4.5, reviews: 567, distance: "1.2 mi", price: "$$", cuisine: "Japanese, Ramen" },
];

const CUISINE_OPTIONS = ["All", "Japanese", "Chinese", "Italian", "Mexican", "Thai"].map((c) => ({ value: c, label: c }));
const PRICE_OPTIONS = ["$", "$$", "$$$", "$$$$"].map((p) => ({ value: p, label: p }));
const RATING_OPTIONS = ["Any", "3.0", "3.5", "4.0", "4.5"].map((r) => ({ value: r, label: r === "Any" ? "Any rating" : `${r}+` }));

export function MapsScene() {
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [price, setPrice] = useState("$$");
  const [minRating, setMinRating] = useState("Any");
  const [selected, setSelected] = useState<string | null>(null);

  const hasQuery = query.trim().length > 0;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "var(--font-body)",
    outline: "none",
    background: "#fff",
  };

  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px",
    borderRadius: 20,
    border: "1px solid #ddd",
    background: active ? "#1a73e8" : "#fff",
    color: active ? "#fff" : "#555",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
  });

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* Google Maps header */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: "#1a73e8" }}>Maps</span>
        <span style={{ fontSize: 13, color: "#999" }}>Explore nearby</span>
      </div>

      <SemanticInfo role="search_platform" title="Location Search" meta={{ platform: "Google Maps", category: "restaurants" }}>
        {/* Search box */}
        <div style={{ padding: 16 }}>
          <SemanticTextInput
            name="query"
            label="Search"
            value={query}
            onChange={setQuery}
            placeholder="Search nearby..."
          >
            {({ value, onChange }) => (
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="🔍 Search nearby..."
                style={{ ...inputStyle, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
              />
            )}
          </SemanticTextInput>
        </div>

        {/* Filters */}
        <div style={{ padding: "0 16px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <SemanticSelect name="cuisine" label="Cuisine" options={CUISINE_OPTIONS} value={cuisine} onChange={(v) => setCuisine(String(v))}>
            {({ options, selected: sel, select }) => (
              <>
                {options.map((o) => (
                  <button key={o.value} onClick={() => select(o.value)} style={pillStyle(sel === o.value)}>
                    {o.label}
                  </button>
                ))}
              </>
            )}
          </SemanticSelect>
        </div>

        <div style={{ padding: "0 16px 12px", display: "flex", gap: 8 }}>
          <SemanticSelect name="price" label="Price Range" options={PRICE_OPTIONS} value={price} onChange={(v) => setPrice(String(v))}>
            {({ options, selected: sel, select }) => (
              <>
                {options.map((o) => (
                  <button key={o.value} onClick={() => select(o.value)} style={pillStyle(sel === o.value)}>
                    {o.label}
                  </button>
                ))}
              </>
            )}
          </SemanticSelect>

          <SemanticSelect name="min_rating" label="Min Rating" options={RATING_OPTIONS} value={minRating} onChange={(v) => setMinRating(String(v))}>
            {({ options, selected: sel, select }) => (
              <select
                value={sel ?? ""}
                onChange={(e) => select(e.target.value)}
                style={{ ...inputStyle, width: "auto", padding: "6px 10px", fontSize: 12 }}
              >
                {options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}
          </SemanticSelect>
        </div>

        {/* Results */}
        {hasQuery && (
          <div style={{ borderTop: "1px solid #eee" }}>
            <SemanticList
              name="search_results"
              label="Search Results"
              items={MOCK_RESULTS}
              getLabel={(r) => r.name}
              getKey={(r) => r.id}
              getMeta={(r) => ({ rating: r.rating, reviews: r.reviews, price: r.price, distance: r.distance })}
            >
              {({ items }) => (
                <div>
                  {items.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setSelected(r.id)}
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f0f0f0",
                        background: selected === r.id ? "#e8f0fe" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                        {"★".repeat(Math.floor(r.rating))} {r.rating} ({r.reviews.toLocaleString()}) · {r.distance} · {r.price}
                      </div>
                      <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{r.cuisine}</div>
                    </div>
                  ))}
                </div>
              )}
            </SemanticList>

            <div style={{ padding: "8px 16px", display: "flex", gap: 8 }}>
              <SemanticAction
                name="select_result"
                label="Select Result"
                onExecute={() => setSelected(MOCK_RESULTS[0].id)}
                enabled={true}
                requires={["search_results"]}
                description="Select a search result"
              >
                <span />
              </SemanticAction>
              <SemanticAction
                name="next_page"
                label="Next Page"
                onExecute={() => {}}
                enabled={true}
                description="Load next page of results"
              >
                <button style={{ padding: "6px 14px", border: "1px solid #ddd", borderRadius: 6, background: "#fff", fontSize: 12, cursor: "pointer" }}>
                  More results →
                </button>
              </SemanticAction>
            </div>
          </div>
        )}
      </SemanticInfo>
    </div>
  );
}
