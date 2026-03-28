import { DIFF_STYLE } from "../utils/difficulty-styles";
import { useIsMobile } from "../hooks/use-is-mobile";

export const LCChip = ({ p }) => {
  const isMobile = useIsMobile();
  const d = DIFF_STYLE[p.difficulty] || DIFF_STYLE.Medium;
  return (
    <a href={p.url} target="_blank" rel="noopener noreferrer" className="chip-hover" style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 9px", borderRadius: "6px", textDecoration: "none",
      background: d.bg, border: `1px solid ${d.border}`, cursor: "pointer",
    }}>
      <span style={{ color: "#6a7888", fontSize: isMobile ? "10px" : "12px", fontFamily: "'Space Mono', monospace" }}>#{p.num}</span>
      <span style={{ color: "#dde6f0", fontSize: isMobile ? "11.5px" : "13px", fontWeight: 500 }}>{p.name}</span>
      <span style={{ color: d.color, fontSize: isMobile ? "9px" : "10px", fontWeight: 700, letterSpacing: "0.03em" }}>{p.difficulty}</span>
    </a>
  );
};
