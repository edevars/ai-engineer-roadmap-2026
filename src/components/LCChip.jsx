import { DIFF_STYLE } from "../utils/difficulty-styles";

export const LCChip = ({ p }) => {
  const d = DIFF_STYLE[p.difficulty] || DIFF_STYLE.Medium;
  return (
    <a href={p.url} target="_blank" rel="noopener noreferrer" className="chip-hover" style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 9px", borderRadius: "6px", textDecoration: "none",
      background: d.bg, border: `1px solid ${d.border}`, cursor: "pointer",
    }}>
      <span style={{ color: "#6a7888", fontSize: "10px", fontFamily: "'Space Mono', monospace" }}>#{p.num}</span>
      <span style={{ color: "#dde6f0", fontSize: "11.5px", fontWeight: 500 }}>{p.name}</span>
      <span style={{ color: d.color, fontSize: "9px", fontWeight: 700, letterSpacing: "0.03em" }}>{p.difficulty}</span>
    </a>
  );
};
