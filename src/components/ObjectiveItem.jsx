import { useState } from "react";
import { BookMarked, BookOpen, ChevronRight, Sparkles, Terminal } from "lucide-react";
import { useIsMobile } from "../hooks/use-is-mobile";
import { getBadge } from "../utils/badges";
import { LCChip } from "./LCChip";

export const ObjectiveItem = ({ obj, color }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <div style={{ marginBottom: "6px", borderRadius: "8px", overflow: "hidden", border: `1px solid ${open ? color + "44" : "rgba(255,255,255,0.06)"}`, transition: "border-color 0.2s" }}>
      <button onClick={() => setOpen(!open)} className="objective-btn"
        style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: isMobile ? "12px" : "10px 14px", background: open ? color + "0d" : "rgba(255,255,255,0.02)", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <ChevronRight size={13} className={`chevron-icon${open ? " open" : ""}`} style={{ color, flexShrink: 0 }} />
        <span style={{ color: "#dde6f0", fontSize: isMobile ? "13px" : "13.5px", fontWeight: 500, lineHeight: 1.4 }}>{obj.topic}</span>
      </button>
      <div className={`accordion-wrapper${open ? " open" : ""}`}>
        <div className="accordion-inner">
          <div style={{ padding: isMobile ? "12px" : "12px 14px 16px 38px", background: color + "07", borderTop: `1px solid ${color}1a` }}>
            <p style={{ color: "#9aabb8", fontSize: "13px", lineHeight: 1.75, marginBottom: "14px" }}>{obj.why}</p>

            {/* Recurso + Mini-entregable */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px", marginBottom: obj.leetcodeProblems ? "14px" : "0" }}>
              <a href={obj.resource.url} target="_blank" rel="noopener noreferrer" className="resource-link"
                style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", textDecoration: "none", cursor: "pointer" }}
              >
                <div style={{ flexShrink: 0, marginTop: "2px", color: "#7a8898" }}>
                  {obj.resource.owned ? <BookMarked size={14} /> : <BookOpen size={14} />}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                    <span style={{ color: "#cdd6e0", fontSize: "11.5px", fontWeight: 600 }}>Recurso</span>
                    {(() => { const b = getBadge(obj.resource); return <span style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "4px", background: b.bg, color: b.color, fontWeight: 700 }}>{b.label}</span>; })()}
                  </div>
                  <span style={{ color, fontSize: "12px", lineHeight: 1.4, display: "block" }}>{obj.resource.name} ↗</span>
                </div>
              </a>
              <div style={{ padding: "10px 12px", background: color + "0d", border: `1px solid ${color}22`, borderRadius: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <Sparkles size={13} style={{ color, flexShrink: 0 }} />
                  <span style={{ color, fontSize: "11.5px", fontWeight: 600 }}>Mini-entregable</span>
                </div>
                <p style={{ color: "#b0bec8", fontSize: "12px", lineHeight: 1.5, margin: 0 }}>{obj.miniDeliverable}</p>
              </div>
            </div>

            {/* LeetCode problems */}
            {obj.leetcodeProblems && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <Terminal size={12} style={{ color: "#FF6B35", flexShrink: 0 }} />
                  <span style={{ color: "#7a8898", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Problemas LeetCode</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {obj.leetcodeProblems.map((p, i) => <LCChip key={i} p={p} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
