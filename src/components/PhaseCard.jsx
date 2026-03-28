import { useState } from "react";
import { Hexagon } from "lucide-react";
import { ObjectiveItem } from "./ObjectiveItem";
import { ResourceChip } from "./ResourceChip";

export const PhaseCard = ({ phase, color }) => {
  const [showResources, setShowResources] = useState(false);
  return (
    <div className="card-hover rounded-xl mb-4 p-4 sm:py-5 sm:px-6" style={{ background: phase.isPremodule ? color + "09" : "rgba(255,255,255,0.025)", border: phase.isPremodule ? `1px solid ${color}44` : `1px solid rgba(255,255,255,0.07)`, borderLeft: `3px solid ${color}` }}>
      {phase.isPremodule && (
        <div className="inline-flex items-center gap-1.5 rounded-md py-[3px] px-2.5 text-[10px] sm:text-xs font-mono tracking-widest uppercase mb-2.5" style={{ background: color + "22", border: `1px solid ${color}55`, color }}>
          <Hexagon size={10} /> Pre-módulo recomendado
        </div>
      )}
      <div className="flex items-start gap-2.5 mb-4 flex-wrap">
        <span className="rounded-md py-0.5 px-2.5 text-[11px] sm:text-[13px] font-mono tracking-wide font-semibold whitespace-nowrap shrink-0" style={{ background: color + "22", color, border: `1px solid ${color}44` }}>{phase.label}</span>
        <span className="font-bold text-sm sm:text-[17px] leading-relaxed" style={{ color: "#fff" }}>{phase.title}</span>
      </div>
      <div className="mb-4">
        {phase.objectives.map((obj, i) => <ObjectiveItem key={i} obj={obj} color={color} />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5">
        <div className="rounded-lg p-2.5 px-3.5" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="text-[10px] sm:text-xs tracking-widest uppercase mb-1 font-mono" style={{ color: "#888" }}>Entregable de fase</div>
          <div className="text-[12.5px] sm:text-sm leading-normal" style={{ color: "#e0e6f0" }}>{phase.deliverable}</div>
        </div>
        <div className="rounded-lg p-2.5 px-3.5" style={{ background: color + "11", border: `1px solid ${color}22` }}>
          <div className="text-[10px] sm:text-xs tracking-widest uppercase mb-1 font-mono" style={{ color: color + "cc" }}>Métrica de éxito</div>
          <div className="text-[12.5px] sm:text-sm leading-normal" style={{ color: "#e0e6f0" }}>{phase.metric}</div>
        </div>
      </div>
      <button onClick={() => setShowResources(!showResources)} className="phase-toggle-btn flex items-center gap-1.5 bg-transparent rounded-[7px] py-1.5 px-3 text-xs sm:text-sm cursor-pointer font-sans"
        style={{ border: `1px solid ${showResources ? color + "66" : "rgba(255,255,255,0.1)"}`, color: showResources ? color : "#7a8898", marginBottom: showResources ? "12px" : "0" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = color + "66"; e.currentTarget.style.color = color; }}
        onMouseLeave={e => { if (!showResources) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#7a8898"; } }}
      >
        <span className="inline-block transition-transform duration-200" style={{ transform: showResources ? "rotate(90deg)" : "rotate(0deg)" }}>▸</span>
        Recursos generales de la fase
        <span className="rounded py-px px-1.5 text-[10px] sm:text-xs font-bold" style={{ background: color + "22", color }}>{phase.resources.length}</span>
      </button>
      <div className={`accordion-wrapper${showResources ? " open" : ""}`}>
        <div className="accordion-inner">
          <div className="flex flex-wrap gap-[7px] pt-1">
            {phase.resources.map((r, i) => <ResourceChip key={i} resource={r} color={color} />)}
          </div>
        </div>
      </div>
    </div>
  );
};
