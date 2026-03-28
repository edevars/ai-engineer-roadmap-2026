import { useState } from "react";
import { BookMarked, BookOpen, ChevronRight, Sparkles, Terminal } from "lucide-react";
import { getBadge } from "../utils/badges";
import { LCChip } from "./LCChip";

export const ObjectiveItem = ({ obj, color }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-1.5 rounded-lg overflow-hidden transition-[border-color] duration-200" style={{ border: `1px solid ${open ? color + "44" : "rgba(255,255,255,0.06)"}` }}>
      <button onClick={() => setOpen(!open)} className="objective-btn w-full flex items-center gap-2.5 p-3 sm:px-3.5 sm:py-2.5 border-none cursor-pointer text-left font-sans"
        style={{ background: open ? color + "0d" : "rgba(255,255,255,0.02)" }}>
        <ChevronRight size={13} className={`chevron-icon${open ? " open" : ""}`} style={{ color, flexShrink: 0 }} />
        <span className="text-[13px] sm:text-[15px] font-medium leading-relaxed" style={{ color: "#dde6f0" }}>{obj.topic}</span>
      </button>
      <div className={`accordion-wrapper${open ? " open" : ""}`}>
        <div className="accordion-inner">
          <div className="p-3 sm:pl-[38px] sm:pr-3.5 sm:pb-4 sm:pt-3" style={{ background: color + "07", borderTop: `1px solid ${color}1a` }}>
            <p className="text-[13px] sm:text-[15px] leading-[1.75] mb-3.5" style={{ color: "#9aabb8" }}>{obj.why}</p>

            {/* Recurso + Mini-entregable */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 ${obj.leetcodeProblems ? "mb-3.5" : ""}`}>
              <a href={obj.resource.url} target="_blank" rel="noopener noreferrer"
                className="resource-link flex items-start gap-2 p-2.5 px-3 rounded-lg no-underline cursor-pointer"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="shrink-0 mt-0.5" style={{ color: "#7a8898" }}>
                  {obj.resource.owned ? <BookMarked size={14} /> : <BookOpen size={14} />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[11.5px] sm:text-[13px] font-semibold" style={{ color: "#cdd6e0" }}>Recurso</span>
                    {(() => { const b = getBadge(obj.resource); return <span className="text-[9px] sm:text-[10px] py-px px-[5px] rounded font-bold" style={{ background: b.bg, color: b.color }}>{b.label}</span>; })()}
                  </div>
                  <span className="text-[12px] sm:text-sm leading-relaxed block" style={{ color }}>{obj.resource.name} ↗</span>
                </div>
              </a>
              <div className="p-2.5 px-3 rounded-lg" style={{ background: color + "0d", border: `1px solid ${color}22` }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={13} style={{ color, flexShrink: 0 }} />
                  <span className="text-[11.5px] sm:text-[13px] font-semibold" style={{ color }}>Mini-entregable</span>
                </div>
                <p className="text-[12px] sm:text-sm leading-normal m-0" style={{ color: "#b0bec8" }}>{obj.miniDeliverable}</p>
              </div>
            </div>

            {/* LeetCode problems */}
            {obj.leetcodeProblems && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Terminal size={12} style={{ color: "#FF6B35", flexShrink: 0 }} />
                  <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase" style={{ color: "#7a8898" }}>Problemas LeetCode</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
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
