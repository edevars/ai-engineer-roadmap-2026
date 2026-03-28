import { useState } from "react";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Info } from "lucide-react";
import { roadmapData, AreaIcon } from "../data/roadmap-data";
import { useIsMobile } from "../hooks/use-is-mobile";
import { PhaseCard } from "../components/PhaseCard";

const RoadmapPage = () => {
  const [active, setActive] = useState("system-design");
  const isMobile = useIsMobile();
  const area = roadmapData.find(a => a.id === active);
  const freeCount  = area ? area.phases.reduce((acc, p) => acc + p.resources.filter(r => r.free).length, 0) : 0;
  const paidCount  = area ? area.phases.reduce((acc, p) => acc + p.resources.filter(r => !r.free).length, 0) : 0;
  const totalObjectives = area ? area.phases.reduce((acc, p) => acc + p.objectives.length, 0) : 0;

  return (
    <>
      {/* Area tabs */}
      <div className="tab-nav" style={{ padding: isMobile ? "14px 16px" : "18px 40px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {roadmapData.map(a => (
          <button key={a.id} onClick={() => setActive(a.id)} className="area-tab" style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: isMobile ? "8px 12px" : "9px 16px",
            background: active === a.id ? a.color + "18" : "rgba(255,255,255,0.04)",
            border: `1px solid ${active === a.id ? a.color + "55" : "rgba(255,255,255,0.08)"}`,
            borderRadius: "10px", color: active === a.id ? a.color : "#7a8898",
            fontSize: isMobile ? "12px" : "15px", fontWeight: active === a.id ? 700 : 400,
            cursor: "pointer", whiteSpace: "nowrap",
            fontFamily: "'DM Sans', system-ui, sans-serif", flexShrink: 0,
          }}>
            <span style={{ fontSize: isMobile ? "13px" : "17px", display:"flex", alignItems:"center" }}>
              <AreaIcon id={a.id} size={isMobile ? 13 : 17} />
            </span>
            {isMobile ? (a.id === "algoritmos" ? "DSA" : a.id === "ingles-tecnico" ? "Inglés" : a.title.split(" ")[0]) : a.title}
          </button>
        ))}
      </div>

      {/* Area content — keyed for fade-in on switch */}
      {area && (
        <div key={active} className="fade-in" style={{ padding: isMobile ? "20px 16px 48px" : "28px 40px 48px", maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: isMobile ? "wrap" : "nowrap" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{ fontSize: isMobile ? "22px" : "32px", display:"flex", alignItems:"center" }}>
                    <AreaIcon id={area.id} size={isMobile ? 22 : 30} style={{ color: area.color }} />
                  </span>
                  <h2 style={{ fontSize: isMobile ? "18px" : "26px", fontWeight: 700, color: area.color }}>{area.title}</h2>
                </div>
                <p style={{ color: "#7a8898", fontSize: isMobile ? "13px" : "16px", marginLeft: isMobile ? "32px" : "42px", lineHeight: 1.5 }}>{area.subtitle}</p>
              </div>
              <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: isMobile ? "center" : "flex-end", gap: "8px", flexShrink: 0 }}>
                <div style={{ background: area.color + "18", border: `1px solid ${area.color}44`, borderRadius: "8px", padding: "6px 14px", textAlign: "center" }}>
                  <div style={{ color: area.color, fontWeight: 700, fontSize: isMobile ? "15px" : "20px", fontFamily: "'Space Mono', monospace" }}>{area.period}</div>
                  {!isMobile && <div style={{ color: "#5a6880", fontSize: isMobile ? "11px" : "13px" }}>duración recomendada</div>}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "12px" }}>
              <span style={{ fontSize: isMobile ? "11px" : "13px", padding: "2px 8px", background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)", borderRadius: "5px", color: "#00c896" }}>{freeCount} gratuitos</span>
              <span style={{ fontSize: isMobile ? "11px" : "13px", padding: "2px 8px", background: "rgba(255,180,0,0.1)", border: "1px solid rgba(255,180,0,0.25)", borderRadius: "5px", color: "#ffb800" }}>{paidCount} de pago</span>
              <span style={{ fontSize: isMobile ? "11px" : "13px", padding: "2px 8px", background: "rgba(150,150,255,0.1)", border: "1px solid rgba(150,150,255,0.25)", borderRadius: "5px", color: "#a0a0ff" }}>{totalObjectives} temas</span>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "14px", marginBottom: "16px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <Info size={15} style={{ color: "#5a6880", flexShrink: 0, marginTop: "1px" }} />
            <p style={{ color: "#8898aa", fontSize: isMobile ? "12px" : "15px", lineHeight: 1.6 }}>{area.periodLabel}</p>
          </div>
          <div style={{ marginBottom: "16px", padding: "10px 14px", background: area.color + "0a", border: `1px solid ${area.color}22`, borderRadius: "8px" }}>
            <p style={{ color: "#7a8898", fontSize: isMobile ? "11px" : "14px", lineHeight: 1.6 }}>
              ▸ Toca cada tema para ver <strong style={{ color: "#9aabb8" }}>por qué se estudia</strong>, su <strong style={{ color: "#9aabb8" }}>recurso</strong> y su <strong style={{ color: "#9aabb8" }}>mini-entregable</strong>.{"  "}
              <span style={{ color: "#78b4ff" }}>📚 OWNED</span> = libro o suscripción que ya tienes.
            </p>
          </div>
          {area.phases.map((phase, i) => <PhaseCard key={i} phase={phase} color={area.color} />)}
          <div style={{ marginTop: "32px", padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", color: "#5a6880", fontSize: isMobile ? "12px" : "15px", lineHeight: 1.6 }}>
            <strong style={{ color: "#7a8898" }}>Principio clave:</strong> Los roadmaps no son lineales. Si en el Mes 2 ya tienes el entregable del Mes 3, acelera. Los mini-entregables verifican que el conocimiento es real, no solo leído.
          </div>
        </div>
      )}
    </>
  );
};

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: RoadmapPage,
});
