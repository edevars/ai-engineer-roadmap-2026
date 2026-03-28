import { useState } from "react";
import { Hexagon } from "lucide-react";
import { useIsMobile } from "../hooks/use-is-mobile";
import { ObjectiveItem } from "./ObjectiveItem";
import { ResourceChip } from "./ResourceChip";

export const PhaseCard = ({ phase, color }) => {
  const [showResources, setShowResources] = useState(false);
  const isMobile = useIsMobile();
  return (
    <div className="card-hover" style={{ background: phase.isPremodule ? color + "09" : "rgba(255,255,255,0.025)", border: phase.isPremodule ? `1px solid ${color}44` : `1px solid rgba(255,255,255,0.07)`, borderLeft: `3px solid ${color}`, borderRadius: "12px", padding: isMobile ? "16px" : "20px 24px", marginBottom: "16px" }}>
      {phase.isPremodule && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: color + "22", border: `1px solid ${color}55`, borderRadius: "6px", padding: "3px 10px", fontSize: isMobile ? "10px" : "12px", fontFamily: "'Space Mono', monospace", color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
          <Hexagon size={10} /> Pre-módulo recomendado
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: "6px", padding: "2px 10px", fontSize: isMobile ? "11px" : "13px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>{phase.label}</span>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: isMobile ? "14px" : "17px", lineHeight: 1.4 }}>{phase.title}</span>
      </div>
      <div style={{ marginBottom: "16px" }}>
        {phase.objectives.map((obj, i) => <ObjectiveItem key={i} obj={obj} color={color} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "10px 14px" }}>
          <div style={{ color: "#888", fontSize: isMobile ? "10px" : "12px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px", fontFamily: "'Space Mono', monospace" }}>Entregable de fase</div>
          <div style={{ color: "#e0e6f0", fontSize: isMobile ? "12.5px" : "14px", lineHeight: 1.5 }}>{phase.deliverable}</div>
        </div>
        <div style={{ background: color + "11", borderRadius: "8px", padding: "10px 14px", border: `1px solid ${color}22` }}>
          <div style={{ color: color + "cc", fontSize: isMobile ? "10px" : "12px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px", fontFamily: "'Space Mono', monospace" }}>Métrica de éxito</div>
          <div style={{ color: "#e0e6f0", fontSize: isMobile ? "12.5px" : "14px", lineHeight: 1.5 }}>{phase.metric}</div>
        </div>
      </div>
      <button onClick={() => setShowResources(!showResources)} className="phase-toggle-btn"
        style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: `1px solid ${showResources ? color + "66" : "rgba(255,255,255,0.1)"}`, borderRadius: "7px", padding: "6px 12px", color: showResources ? color : "#7a8898", fontSize: isMobile ? "12px" : "14px", cursor: "pointer", fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: showResources ? "12px" : "0" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = color + "66"; e.currentTarget.style.color = color; }}
        onMouseLeave={e => { if (!showResources) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#7a8898"; } }}
      >
        <span style={{ display: "inline-block", transition: "transform 0.2s", transform: showResources ? "rotate(90deg)" : "rotate(0deg)" }}>▸</span>
        Recursos generales de la fase
        <span style={{ background: color + "22", color, borderRadius: "4px", padding: "1px 6px", fontSize: isMobile ? "10px" : "12px", fontWeight: 700 }}>{phase.resources.length}</span>
      </button>
      <div className={`accordion-wrapper${showResources ? " open" : ""}`}>
        <div className="accordion-inner">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", paddingTop: "4px" }}>
            {phase.resources.map((r, i) => <ResourceChip key={i} resource={r} color={color} />)}
          </div>
        </div>
      </div>
    </div>
  );
};
