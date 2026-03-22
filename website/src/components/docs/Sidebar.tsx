import { NavLink } from "react-router-dom";

interface NavItem {
  label: string;
  to: string;
  disabled?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    title: "Start",
    items: [
      { label: "Home", to: `/docs` },
      { label: "Why semant", to: `/docs/why` },
      { label: "Quick Start", to: `/docs/quickstart` },
    ],
  },
  {
    title: "Guides",
    items: [
      { label: "Wrap Your Own Component", to: `/docs/guides/wrap-component` },
    ],
  },
  {
    title: "Reference",
    items: [
      { label: "API Reference", to: `/docs/reference/api` },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { label: "Mirror Principle", to: "#", disabled: true },
      { label: "Semantic Fields", to: "#", disabled: true },
      { label: "Command Protocol", to: "#", disabled: true },
      { label: "Delivery Channels", to: "#", disabled: true },
    ],
  },
];

const linkStyle = (isActive: boolean, disabled: boolean): React.CSSProperties => ({
  display: "block",
  padding: "6px 16px",
  fontSize: 14,
  color: disabled ? "var(--h-text-secondary)" : isActive ? "var(--h-accent)" : "var(--h-text)",
  textDecoration: "none",
  fontWeight: isActive ? 600 : 400,
  borderLeft: isActive ? "3px solid var(--h-accent)" : "3px solid transparent",
  opacity: disabled ? 0.4 : 1,
  cursor: disabled ? "default" : "pointer",
});

export function Sidebar() {
  return (
    <nav style={{ padding: "16px 0" }}>
      {SECTIONS.map((section) => (
        <div key={section.title} style={{ marginBottom: 20 }}>
          <div
            style={{
              padding: "0 16px 6px",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--h-text-secondary)",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            {section.title}
          </div>
          {section.items.map((item) =>
            item.disabled ? (
              <span key={item.label} style={linkStyle(false, true)}>
                {item.label}
              </span>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === `/docs`}
                style={({ isActive }) => linkStyle(isActive, false)}
              >
                {item.label}
              </NavLink>
            )
          )}
        </div>
      ))}
    </nav>
  );
}
