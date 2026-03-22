import { useState } from "react";
import {
  SemanticInfo,
  SemanticSelect,
  SemanticTextInput,
  SemanticAction,
} from "@semant/react";

const COLOR_OPTIONS = [
  { value: "Black", label: "Black", hex: "#1a1a1a" },
  { value: "Forest Green", label: "Forest Green", hex: "#2d6a4f" },
  { value: "Navy", label: "Navy", hex: "#1b3a5c" },
  { value: "Oatmeal", label: "Oatmeal", hex: "#d4c9a8" },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL"].map((s) => ({ value: s, label: s }));

export function ShopifyScene() {
  const [color, setColor] = useState("Black");
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState("1");
  const [added, setAdded] = useState(false);

  const selectedColorHex = COLOR_OPTIONS.find((c) => c.value === color)?.hex ?? "#1a1a1a";

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <SemanticInfo
        role="product"
        title="Merino Wool Crewneck"
        meta={{
          brand: "Everlane",
          sku: `MW-CN-${color.replace(/\s/g, "").slice(0, 2).toUpperCase()}-${size}`,
          price: 98.0,
          currency: "USD",
          rating: 4.6,
          reviews: 284,
          availability: "InStock",
        }}
      >
        {/* Product image placeholder */}
        <div
          style={{
            height: 160,
            borderRadius: 8,
            marginBottom: 16,
            background: `linear-gradient(135deg, ${selectedColorHex}, ${selectedColorHex}dd)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.3s",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, fontFamily: "var(--font-mono)" }}>
            product image
          </span>
        </div>

        {/* Product info */}
        <div style={{ fontSize: 12, color: "#999", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Everlane
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Merino Wool Crewneck</h3>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>$98</div>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
          {"★".repeat(4)}☆ 4.6 ({284} reviews)
        </div>

        {/* Color selector */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Color: <span style={{ fontWeight: 400 }}>{color}</span>
          </div>
          <SemanticSelect
            name="color"
            label="Color"
            options={COLOR_OPTIONS.map((c) => ({ value: c.value, label: c.label }))}
            value={color}
            onChange={(v) => { setColor(String(v)); setAdded(false); }}
          >
            {({ options, selected, select }) => (
              <div style={{ display: "flex", gap: 8 }}>
                {options.map((o) => {
                  const hex = COLOR_OPTIONS.find((c) => c.value === o.value)?.hex ?? "#000";
                  return (
                    <button
                      key={o.value}
                      onClick={() => select(o.value)}
                      title={o.label}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: selected === o.value ? "2px solid #333" : "2px solid #ddd",
                        background: hex,
                        cursor: "pointer",
                        outline: selected === o.value ? "2px solid #fff" : "none",
                        outlineOffset: -4,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </SemanticSelect>
        </div>

        {/* Size selector */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Size</div>
          <SemanticSelect
            name="size"
            label="Size"
            options={SIZE_OPTIONS}
            value={size}
            onChange={(v) => { setSize(String(v)); setAdded(false); }}
          >
            {({ options, selected, select }) => (
              <div style={{ display: "flex", gap: 6 }}>
                {options.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => select(o.value)}
                    style={{
                      padding: "8px 16px",
                      border: selected === o.value ? "2px solid #333" : "1px solid #ddd",
                      borderRadius: 6,
                      background: selected === o.value ? "#f5f5f5" : "#fff",
                      fontSize: 13,
                      fontWeight: selected === o.value ? 600 : 400,
                      cursor: "pointer",
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </SemanticSelect>
        </div>

        {/* Quantity */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Quantity</div>
          <SemanticTextInput
            name="quantity"
            label="Quantity"
            value={quantity}
            onChange={(v) => { setQuantity(String(v)); setAdded(false); }}
            type="number"
          >
            {({ value, onChange }) => (
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <button
                  onClick={() => onChange(String(Math.max(1, Number(value) - 1)))}
                  style={{ width: 36, height: 36, border: "1px solid #ddd", borderRadius: "6px 0 0 6px", background: "#f5f5f5", fontSize: 16, cursor: "pointer" }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  min={1}
                  style={{ width: 48, height: 36, border: "1px solid #ddd", borderLeft: "none", borderRight: "none", textAlign: "center", fontSize: 14, fontFamily: "var(--font-body)", outline: "none" }}
                />
                <button
                  onClick={() => onChange(String(Number(value) + 1))}
                  style={{ width: 36, height: 36, border: "1px solid #ddd", borderRadius: "0 6px 6px 0", background: "#f5f5f5", fontSize: 16, cursor: "pointer" }}
                >
                  +
                </button>
              </div>
            )}
          </SemanticTextInput>
        </div>

        {/* Add to Cart */}
        <SemanticAction
          name="add_to_cart"
          label="Add to Cart"
          onExecute={() => setAdded(true)}
          enabled={!added}
          description="Add product to shopping cart"
        >
          <button
            onClick={() => setAdded(true)}
            disabled={added}
            style={{
              width: "100%",
              padding: "14px",
              background: added ? "#4ade80" : "#1a1a1a",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: added ? "default" : "pointer",
              transition: "background 0.3s",
            }}
          >
            {added ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        </SemanticAction>
      </SemanticInfo>
    </div>
  );
}
