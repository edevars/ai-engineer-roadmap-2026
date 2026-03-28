import { useState } from "react";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Info } from "lucide-react";
import { cloudAwsData, CloudAwsAreaIcon } from "../data/cloud-aws-data";
import { PhaseCard } from "../components/PhaseCard";

const CloudAwsPage = () => {
  const [active, setActive] = useState("fundamentos-aws");
  const area = cloudAwsData.find(a => a.id === active);
  const freeCount  = area ? area.phases.reduce((acc, p) => acc + p.resources.filter(r => r.free).length, 0) : 0;
  const paidCount  = area ? area.phases.reduce((acc, p) => acc + p.resources.filter(r => !r.free).length, 0) : 0;
  const totalObjectives = area ? area.phases.reduce((acc, p) => acc + p.objectives.length, 0) : 0;

  return (
    <>
      {/* Area tabs */}
      <div className="tab-nav py-3.5 px-4 sm:py-[18px] sm:px-10" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {cloudAwsData.map(a => (
          <button key={a.id} onClick={() => setActive(a.id)} className="area-tab flex items-center gap-1.5 py-2 px-3 sm:py-[9px] sm:px-4 rounded-[10px] cursor-pointer whitespace-nowrap font-sans shrink-0 text-xs sm:text-[15px]"
            style={{
              background: active === a.id ? a.color + "18" : "rgba(255,255,255,0.04)",
              border: `1px solid ${active === a.id ? a.color + "55" : "rgba(255,255,255,0.08)"}`,
              color: active === a.id ? a.color : "#7a8898",
              fontWeight: active === a.id ? 700 : 400,
            }}>
            <span className="text-[13px] sm:text-[17px] flex items-center">
              <CloudAwsAreaIcon id={a.id} size={15} />
            </span>
            <span className="sm:hidden">{a.title.split(" ")[0]}</span>
            <span className="hidden sm:inline">{a.title}</span>
          </button>
        ))}
      </div>

      {/* Area content — keyed for fade-in on switch */}
      {area && (
        <div key={active} className="fade-in py-5 px-4 pb-12 sm:py-7 sm:px-10 sm:pb-12 max-w-[860px] mx-auto">
          <div className="mb-5">
            <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-[22px] sm:text-[32px] flex items-center">
                    <CloudAwsAreaIcon id={area.id} size={26} style={{ color: area.color }} />
                  </span>
                  <h2 className="text-lg sm:text-[26px] font-bold" style={{ color: area.color }}>{area.title}</h2>
                </div>
                <p className="text-[13px] sm:text-base ml-8 sm:ml-[42px] leading-normal" style={{ color: "#7a8898" }}>{area.subtitle}</p>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
                <div className="rounded-lg py-1.5 px-3.5 text-center" style={{ background: area.color + "18", border: `1px solid ${area.color}44` }}>
                  <div className="font-bold text-[15px] sm:text-xl font-mono" style={{ color: area.color }}>{area.period}</div>
                  <div className="hidden sm:block text-[13px]" style={{ color: "#5a6880" }}>duración recomendada</div>
                </div>
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap mt-3">
              <span className="text-[11px] sm:text-[13px] py-0.5 px-2 rounded-[5px]" style={{ background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)", color: "#00c896" }}>{freeCount} gratuitos</span>
              <span className="text-[11px] sm:text-[13px] py-0.5 px-2 rounded-[5px]" style={{ background: "rgba(255,180,0,0.1)", border: "1px solid rgba(255,180,0,0.25)", color: "#ffb800" }}>{paidCount} de pago</span>
              <span className="text-[11px] sm:text-[13px] py-0.5 px-2 rounded-[5px]" style={{ background: "rgba(150,150,255,0.1)", border: "1px solid rgba(150,150,255,0.25)", color: "#a0a0ff" }}>{totalObjectives} temas</span>
            </div>
          </div>
          <div className="flex gap-2.5 items-start rounded-[10px] p-3.5 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <Info size={15} className="shrink-0 mt-px" style={{ color: "#5a6880" }} />
            <p className="text-xs sm:text-[15px] leading-relaxed" style={{ color: "#8898aa" }}>{area.periodLabel}</p>
          </div>
          <div className="mb-4 p-2.5 px-3.5 rounded-lg" style={{ background: area.color + "0a", border: `1px solid ${area.color}22` }}>
            <p className="text-[11px] sm:text-sm leading-relaxed" style={{ color: "#7a8898" }}>
              ▸ Toca cada tema para ver <strong style={{ color: "#9aabb8" }}>por qué se estudia</strong>, su <strong style={{ color: "#9aabb8" }}>recurso</strong> y su <strong style={{ color: "#9aabb8" }}>mini-entregable</strong>.{"  "}
              <span style={{ color: "#78b4ff" }}>📚 OWNED</span> = libro o suscripción que ya tienes.
            </p>
          </div>
          {area.phases.map((phase, i) => <PhaseCard key={i} phase={phase} color={area.color} />)}
          <div className="mt-8 py-3.5 px-[18px] rounded-[10px] text-xs sm:text-[15px] leading-relaxed" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "#5a6880" }}>
            <strong style={{ color: "#7a8898" }}>Principio clave:</strong> Los roadmaps no son lineales. Si en el Mes 2 ya tienes el entregable del Mes 3, acelera. Los mini-entregables verifican que el conocimiento es real, no solo leído.
          </div>
        </div>
      )}
    </>
  );
};

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cloud-aws",
  component: CloudAwsPage,
});
