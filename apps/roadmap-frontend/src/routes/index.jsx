import { useState } from "react";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Info, Cloud } from "lucide-react";
import { roadmapData, AreaIcon } from "../data/roadmap-data";
import { cloudAwsData, CloudAwsAreaIcon } from "../data/cloud-aws-data";
import { PhaseCard } from "../components/PhaseCard";

const AWS_COLOR = "#FF9500";

const RoadmapPage = () => {
  const [active, setActive] = useState("system-design");
  const [awsSub, setAwsSub] = useState("fundamentos-aws");

  const isCloud = active === "cloud-aws";
  const area = isCloud
    ? cloudAwsData.find(a => a.id === awsSub)
    : roadmapData.find(a => a.id === active);

  const freeCount  = area ? area.phases.reduce((acc, p) => acc + p.resources.filter(r => r.free).length, 0) : 0;
  const paidCount  = area ? area.phases.reduce((acc, p) => acc + p.resources.filter(r => !r.free).length, 0) : 0;
  const totalObjectives = area ? area.phases.reduce((acc, p) => acc + p.objectives.length, 0) : 0;

  const totalAwsObjectives = cloudAwsData.reduce((acc, a) => acc + a.phases.reduce((a2, p) => a2 + p.objectives.length, 0), 0);
  const totalAwsPhases = cloudAwsData.reduce((acc, a) => acc + a.phases.length, 0);

  return (
    <>
      {/* Area tabs */}
      <div className="tab-nav py-3 px-4 sm:py-4 sm:px-10 gap-2 sm:gap-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {roadmapData.map(a => {
          const on = active === a.id;
          return (
            <button key={a.id} onClick={() => setActive(a.id)}
              className="area-tab flex items-center gap-2 py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl cursor-pointer whitespace-nowrap font-sans shrink-0"
              style={{
                background: on ? a.color + "12" : "transparent",
                border: `1px solid ${on ? a.color + "40" : "transparent"}`,
                boxShadow: on ? `0 0 16px ${a.color}10` : "none",
              }}>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: on ? a.color + "22" : "rgba(255,255,255,0.05)" }}>
                <AreaIcon id={a.id} size={13} style={{ color: on ? a.color : "#5a6880" }} />
              </div>
              <span className={`text-xs sm:text-[14px] ${on ? "font-bold" : "font-medium"}`} style={{ color: on ? a.color : "#6a7888" }}>
                <span className="sm:hidden">{a.id === "algoritmos" ? "DSA" : a.id === "ingles-tecnico" ? "Inglés" : a.title.split(" ")[0]}</span>
                <span className="hidden sm:inline">{a.title}</span>
              </span>
              {on && <span className="hidden sm:inline text-[9px] font-mono font-bold py-0.5 px-1.5 rounded-md" style={{ background: a.color + "18", color: a.color + "AA" }}>{a.period}</span>}
            </button>
          );
        })}

        {/* Divider */}
        <div className="shrink-0 self-center" style={{ width: 1, height: 24, background: "rgba(255,255,255,0.08)" }} />

        {/* Cloud AWS single tab */}
        <button onClick={() => setActive("cloud-aws")}
          className="area-tab flex items-center gap-2 py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl cursor-pointer whitespace-nowrap font-sans shrink-0"
          style={{
            background: isCloud ? AWS_COLOR + "12" : "transparent",
            border: `1px solid ${isCloud ? AWS_COLOR + "40" : "transparent"}`,
            boxShadow: isCloud ? `0 0 16px ${AWS_COLOR}10` : "none",
          }}>
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: isCloud ? AWS_COLOR + "22" : "rgba(255,255,255,0.05)" }}>
            <Cloud size={13} style={{ color: isCloud ? AWS_COLOR : "#5a6880" }} />
          </div>
          <span className={`text-xs sm:text-[14px] ${isCloud ? "font-bold" : "font-medium"}`} style={{ color: isCloud ? AWS_COLOR : "#6a7888" }}>
            <span className="sm:hidden">Cloud</span>
            <span className="hidden sm:inline">Cloud (AWS)</span>
          </span>
        </button>
      </div>

      {/* ── Cloud AWS: optional description + sub-category cards ── */}
      {isCloud && (
        <div className="fade-in px-4 sm:px-10 pt-5 sm:pt-7 max-w-[860px] mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-1.5">
            <Cloud size={20} style={{ color: AWS_COLOR }} />
            <h2 className="text-lg sm:text-[22px] font-bold m-0" style={{ color: AWS_COLOR }}>Cloud (AWS)</h2>
            <span className="text-[9px] sm:text-[10px] font-bold font-mono uppercase tracking-wider py-0.5 px-2 rounded" style={{ background: AWS_COLOR + "15", border: `1px solid ${AWS_COLOR}35`, color: AWS_COLOR }}>
              Opcional
            </span>
          </div>
          <p className="text-[12px] sm:text-[13px] leading-relaxed mb-4 ml-[30px] sm:ml-[32px]" style={{ color: "#5a6880" }}>
            Roadmap independiente del plan principal — {totalAwsPhases} fases, {totalAwsObjectives} temas. Actívalo si tu carrera lo requiere.
          </p>

          {/* Sub-category cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5 mb-6">
            {cloudAwsData.map(a => {
              const selected = awsSub === a.id;
              const topics = a.phases.reduce((acc, p) => acc + p.objectives.length, 0);
              return (
                <button key={a.id} onClick={() => setAwsSub(a.id)}
                  className="card-hover rounded-[10px] p-3 sm:p-3.5 cursor-pointer text-left font-sans"
                  style={{
                    background: selected ? a.color + "14" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${selected ? a.color + "50" : "rgba(255,255,255,0.06)"}`,
                    boxShadow: selected ? `0 0 12px ${a.color}12` : "none",
                  }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: selected ? a.color + "22" : "rgba(255,255,255,0.04)" }}>
                      <CloudAwsAreaIcon id={a.id} size={14} style={{ color: selected ? a.color : "#5a6880" }} />
                    </div>
                    {selected && <div className="w-1.5 h-1.5 rounded-full ml-auto shrink-0" style={{ background: a.color }} />}
                  </div>
                  <div className="text-[11px] sm:text-[12px] font-semibold leading-tight mb-1" style={{ color: selected ? a.color : "#8898aa" }}>
                    {a.title}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono" style={{ color: "#4a5a6a" }}>
                    {a.period} · {topics} temas
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Area content — keyed for fade-in on switch */}
      {area && (
        <div key={isCloud ? awsSub : active} className={`fade-in px-4 pb-12 sm:px-10 sm:pb-12 max-w-[860px] mx-auto ${isCloud ? "pt-0" : "py-5 sm:py-7"}`}>
          <div className="mb-5">
            <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-[22px] sm:text-[32px] flex items-center">
                    {isCloud
                      ? <CloudAwsAreaIcon id={area.id} size={26} style={{ color: area.color }} />
                      : <AreaIcon id={area.id} size={26} style={{ color: area.color }} />}
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
  path: "/roadmap",
  component: RoadmapPage,
});
