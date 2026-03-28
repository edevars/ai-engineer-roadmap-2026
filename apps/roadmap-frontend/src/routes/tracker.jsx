import { useState } from "react";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { BarChart2, CalendarDays, Map, Check, X } from "lucide-react";
import { roadmapData } from "../data/roadmap-data";
import { AREA_META } from "../data/area-meta";
import { calendarWeek } from "../data/calendar-data";

const TrackerPage = () => {
  const [view, setView] = useState("weekly");
  const [weekChecked, setWeekChecked] = useState({});
  const [phaseChecked, setPhaseChecked] = useState({});

  // ── Weekly helpers ──
  const toggleWeek = (key) => setWeekChecked(p => ({ ...p, [key]: !p[key] }));
  const [activeCell, setActiveCell] = useState(null); // "di-bi" key or null
  const totalWeekBlocks = calendarWeek.reduce((s, d) => s + d.blocks.length, 0);
  const weekDone = Object.values(weekChecked).filter(Boolean).length;
  const weekPct = Math.round((weekDone / totalWeekBlocks) * 100);
  const totalWeekMin = calendarWeek.reduce((s, d) => s + d.totalMin, 0);
  const hoursPerArea = {};
  calendarWeek.forEach(d => d.blocks.forEach(b => { hoursPerArea[b.area] = (hoursPerArea[b.area] || 0) + b.duration; }));

  // ── Total helpers ──
  const togglePhase = (key) => setPhaseChecked(p => ({ ...p, [key]: !p[key] }));
  const allPhases = roadmapData.flatMap(area => area.phases.map((_, pi) => ({ areaId: area.id, phaseIdx: pi, key: `${area.id}-${pi}` })));
  const totalPhases = allPhases.length;
  const totalDonePhases = allPhases.filter(p => phaseChecked[p.key]).length;
  const totalPct = Math.round((totalDonePhases / totalPhases) * 100);

  return (
    <div className="min-h-[60vh] py-6 px-4 pb-[60px] sm:py-9 sm:px-10 sm:pb-[60px] max-w-[960px] mx-auto">

      {/* ── Tracker header ── */}
      <div className="mb-7">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 size={22} style={{ color: "#a78bfa" }} />
              <h2 className="text-xl sm:text-[28px] font-bold" style={{ color: "#e0e6f0" }}>Progress Tracker</h2>
            </div>
            <p className="text-[13px] sm:text-[15px] ml-[30px]" style={{ color: "#5a6880" }}>Seguimiento semanal y total del roadmap</p>
          </div>
          {/* Sub-view switcher */}
          <div className="flex gap-2">
            <button className={`nav-btn flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-5 rounded-lg cursor-pointer font-sans whitespace-nowrap text-xs sm:text-[15px] ${view === "weekly" ? "font-bold" : "font-normal"}`}
              style={{ background: view === "weekly" ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${view === "weekly" ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.08)"}`, color: view === "weekly" ? "#a78bfa" : "#5a6880" }}
              onClick={() => setView("weekly")}>
              <CalendarDays size={13} /> Esta semana
            </button>
            <button className={`nav-btn flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-5 rounded-lg cursor-pointer font-sans whitespace-nowrap text-xs sm:text-[15px] ${view === "total" ? "font-bold" : "font-normal"}`}
              style={{ background: view === "total" ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${view === "total" ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.08)"}`, color: view === "total" ? "#a78bfa" : "#5a6880" }}
              onClick={() => setView("total")}>
              <Map size={13} /> Total roadmap
            </button>
          </div>
        </div>

        {/* Master progress bar — always visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="rounded-xl p-3.5 px-[18px]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex justify-between mb-2">
              <span className="flex items-center gap-[5px] text-xs sm:text-sm" style={{ color: "#7a8898" }}><CalendarDays size={14} /> Esta semana</span>
              <span className="text-xs sm:text-sm font-bold font-mono" style={{ color: "#e0e6f0" }}>{weekDone}/{totalWeekBlocks} · {weekPct}%</span>
            </div>
            <div className="h-1.5 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-sm transition-[width] duration-400" style={{ width: `${weekPct}%`, background: "linear-gradient(90deg,#7C3AED,#00D4FF)" }} />
            </div>
          </div>
          <div className="rounded-xl p-3.5 px-[18px]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex justify-between mb-2">
              <span className="flex items-center gap-[5px] text-xs sm:text-sm" style={{ color: "#7a8898" }}><Map size={14} /> Total roadmap</span>
              <span className="text-xs sm:text-sm font-bold font-mono" style={{ color: "#e0e6f0" }}>{totalDonePhases}/{totalPhases} fases · {totalPct}%</span>
            </div>
            <div className="h-1.5 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-sm transition-[width] duration-400" style={{ width: `${totalPct}%`, background: "linear-gradient(90deg,#FF6B35,#FFB800)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          VIEW: ESTA SEMANA
      ══════════════════════════════════════════════════════════ */}
      {view === "weekly" && (() => {
        // ── Data pivot: area-centric rows ──
        const areaIds = Object.keys(AREA_META);
        const areaRows = areaIds.map(areaId => {
          const meta = AREA_META[areaId];
          const cells = calendarWeek.map((day, di) => {
            const bi = day.blocks.findIndex(b => b.area === areaId);
            return bi >= 0 ? { di, bi, block: day.blocks[bi], key: `${di}-${bi}` } : null;
          });
          const total = cells.filter(Boolean).length;
          const done = cells.filter(c => c && weekChecked[c.key]).length;
          return { areaId, meta, cells, total, done };
        });

        // ── Active cell detail ──
        const activeCellData = activeCell ? (() => {
          const [di, bi] = activeCell.split("-").map(Number);
          const day = calendarWeek[di];
          const block = day?.blocks[bi];
          if (!block) return null;
          return { di, bi, day, block, meta: AREA_META[block.area], key: activeCell };
        })() : null;

        return (
        <div>
          {/* Legend + total hours */}
          <div className="flex gap-2 flex-wrap mb-5 items-center">
            {Object.entries(hoursPerArea).map(([id, mins]) => {
              const m = AREA_META[id];
              return (
                <div key={id} className="flex items-center gap-1 py-[3px] px-[9px] rounded-full" style={{ background: m.color + "14", border: `1px solid ${m.color}30` }}>
                  <m.IconC size={10} style={{ color: m.color, flexShrink: 0 }} />
                  <span className="text-[10px] sm:text-xs font-semibold" style={{ color: m.color }}>{m.label}</span>
                  <span className="text-[10px] sm:text-xs" style={{ color: "#4a5060" }}>{Math.floor(mins/60) > 0 ? `${Math.floor(mins/60)}h` : ""}{mins%60 > 0 ? `${mins%60}m` : ""}</span>
                </div>
              );
            })}
            <span className="text-[11px] sm:text-[13px] font-mono ml-auto" style={{ color: "#3a4a5a" }}>{Math.floor(totalWeekMin/60)}h {totalWeekMin%60}m / semana</span>
          </div>

          {/* ── Heatmap table ── */}
          <div className="rounded-[14px] overflow-hidden mb-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              {/* Day headers */}
              <thead>
                <tr>
                  <th style={{ width: "110px", padding: "10px 14px", textAlign: "left" }} className="hidden sm:table-cell" />
                  <th style={{ width: "36px", padding: "10px 6px", textAlign: "left" }} className="sm:hidden" />
                  {calendarWeek.map((day, di) => (
                    <th key={di} className="text-[9px] sm:text-[11px] font-bold font-mono uppercase tracking-wider" style={{ color: "#4a5a6a", padding: "10px 0", textAlign: "center" }}>
                      {day.shortDay}
                    </th>
                  ))}
                  <th className="text-[9px] sm:text-[11px] font-mono" style={{ color: "#3a4a5a", padding: "10px 14px 10px 8px", textAlign: "right", width: "80px" }}>Progreso</th>
                </tr>
              </thead>
              <tbody>
                {areaRows.map(({ areaId, meta, cells, total, done }) => {
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <tr key={areaId} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      {/* Area label — full on desktop */}
                      <td className="hidden sm:table-cell" style={{ padding: "8px 14px" }}>
                        <div className="flex items-center gap-[6px]">
                          <meta.IconC size={13} style={{ color: meta.color, flexShrink: 0 }} />
                          <span className="text-[12px] font-semibold whitespace-nowrap" style={{ color: meta.color }}>{meta.label}</span>
                        </div>
                      </td>
                      {/* Area label — icon only on mobile */}
                      <td className="sm:hidden" style={{ padding: "6px 8px" }}>
                        <div className="flex items-center justify-center">
                          <meta.IconC size={14} style={{ color: meta.color }} />
                        </div>
                      </td>
                      {/* Day cells */}
                      {cells.map((cell, di) => (
                        <td key={di} style={{ padding: "6px 0", textAlign: "center" }}>
                          {cell ? (
                            <div
                              className="heatmap-cell w-5 h-5 sm:w-7 sm:h-7 inline-flex items-center justify-center cursor-pointer rounded-md sm:rounded-lg"
                              style={{
                                background: weekChecked[cell.key] ? meta.color : "transparent",
                                border: `2px solid ${weekChecked[cell.key] ? meta.color : meta.color + "45"}`,
                                boxShadow: activeCell === cell.key ? `0 0 0 2px ${meta.color}60` : "none",
                              }}
                              onClick={() => {
                                toggleWeek(cell.key);
                                setActiveCell(activeCell === cell.key ? null : cell.key);
                              }}
                            >
                              {weekChecked[cell.key] && <Check size={11} strokeWidth={3} style={{ color: "#000" }} />}
                            </div>
                          ) : (
                            <span className="inline-block text-[10px] sm:text-xs" style={{ color: "#2a3040" }}>—</span>
                          )}
                        </td>
                      ))}
                      {/* Per-area progress */}
                      <td style={{ padding: "6px 14px 6px 8px" }}>
                        <div className="flex flex-col items-end gap-[3px]">
                          <span className="text-[10px] sm:text-xs font-mono font-semibold" style={{ color: meta.color }}>{done}/{total}</span>
                          <div className="w-full max-w-[56px] h-[3px] rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-full rounded-sm" style={{ width: `${pct}%`, background: meta.color, transition: "width 0.3s" }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Cell detail row ── */}
          {activeCellData && (
            <div className="rounded-[10px] p-3 px-4 mb-4 flex items-start gap-3" style={{ background: activeCellData.meta.color + "0c", border: `1px solid ${activeCellData.meta.color}30` }}>
              <div
                className="w-5 h-5 rounded-md shrink-0 mt-px flex items-center justify-center cursor-pointer"
                style={{
                  border: `2px solid ${weekChecked[activeCellData.key] ? activeCellData.meta.color : "rgba(255,255,255,0.2)"}`,
                  background: weekChecked[activeCellData.key] ? activeCellData.meta.color : "transparent",
                }}
                onClick={() => toggleWeek(activeCellData.key)}
              >
                {weekChecked[activeCellData.key] && <span className="check-pop text-[11px] font-black" style={{ color: "#000" }}>✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[7px] mb-[4px] flex-wrap">
                  <span className="inline-flex items-center gap-1 rounded-[5px] py-0.5 px-2 text-[10px] sm:text-xs font-bold" style={{ background: activeCellData.meta.color + "1a", border: `1px solid ${activeCellData.meta.color}35`, color: activeCellData.meta.color }}>
                    {activeCellData.meta.label}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono" style={{ color: "#4a5a6a" }}>{activeCellData.day.day} · {activeCellData.block.duration} min</span>
                </div>
                <p className={`text-[12px] sm:text-[14px] leading-relaxed m-0 ${weekChecked[activeCellData.key] ? "line-through" : ""}`} style={{ color: weekChecked[activeCellData.key] ? "#4a6070" : "#c0ccd8" }}>
                  {activeCellData.block.label}
                </p>
              </div>
              <button onClick={() => setActiveCell(null)} className="bg-transparent border-none cursor-pointer leading-none p-1 flex items-center shrink-0" style={{ color: "#5a6880" }}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* Principles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { icon: "🔁", title: "DSA diario", body: "30 min cada día > 3h esporádicas. La consistencia construye el patrón mental." },
              { icon: "🎯", title: "Una área profunda", body: "60 min concentrado vale más que 4×15 min saltando entre temas." },
              { icon: "📝", title: "Siempre un output", body: "Cada sesión debe producir algo: diagrama, commit, notebook, ADR." },
              { icon: "⚡", title: "Regla 25 min", body: "Si LeetCode no cede en 25 min, estudia la solución. Mañana desde cero." },
            ].map((p, i) => (
              <div key={i} className="principle-card p-3 rounded-[10px] cursor-default" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[15px]">{p.icon}</span>
                <div className="text-[11.5px] sm:text-[13px] font-semibold my-[5px] mb-[3px]" style={{ color: "#b0bcc8" }}>{p.title}</div>
                <div className="text-[11px] sm:text-[13px] leading-relaxed" style={{ color: "#4a5a6a" }}>{p.body}</div>
              </div>
            ))}
          </div>
        </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════
          VIEW: TOTAL ROADMAP
      ══════════════════════════════════════════════════════════ */}
      {view === "total" && (
        <div>
          {/* Per-area overview cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-7">
            {roadmapData.map(area => {
              const totalPh = area.phases.length;
              const donePh = area.phases.filter((_, pi) => phaseChecked[`${area.id}-${pi}`]).length;
              const pct = Math.round((donePh / totalPh) * 100);
              const circumference = 2 * Math.PI * 22;
              const dashOffset = circumference - (pct / 100) * circumference;
              return (
                <div key={area.id} className="rounded-xl p-3.5 px-3 flex flex-col items-center gap-2" style={{ background: area.color + "0c", border: `1px solid ${area.color}30` }}>
                  {/* Circular progress */}
                  <div className="relative w-[54px] h-[54px]">
                    <svg width="54" height="54" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="27" cy="27" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                      <circle cx="27" cy="27" r="22" fill="none" stroke={area.color} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s" }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[13px] sm:text-[15px] font-bold font-mono" style={{ color: area.color }}>{pct}%</span>
                    </div>
                  </div>
                  <span className="text-[11px] sm:text-[13px] font-semibold text-center leading-tight" style={{ color: "#dde6f0" }}>{area.title}</span>
                  <span className="text-[10px] sm:text-xs font-mono" style={{ color: "#4a5a6a" }}>{donePh}/{totalPh} fases</span>
                </div>
              );
            })}
          </div>

          {/* Per-area phase checklists */}
          {roadmapData.map(area => {
            const totalPh = area.phases.length;
            const donePh = area.phases.filter((_, pi) => phaseChecked[`${area.id}-${pi}`]).length;
            const areaPct = Math.round((donePh / totalPh) * 100);
            return (
              <div key={area.id} className="mb-4 rounded-[14px] overflow-hidden" style={{ border: `1px solid ${area.color}25`, background: "rgba(255,255,255,0.015)" }}>
                {/* Area header */}
                <div className="p-3.5 px-5 flex items-center justify-between flex-wrap gap-2.5" style={{ background: area.color + "0a", borderBottom: `1px solid ${area.color}20` }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{area.icon}</span>
                    <div>
                      <div className="text-sm sm:text-base font-bold" style={{ color: area.color }}>{area.title}</div>
                      <div className="text-[11px] sm:text-[13px]" style={{ color: "#4a5a6a" }}>{area.period} · {area.subtitle}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-20 sm:w-[120px] h-1.5 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-sm transition-[width] duration-400" style={{ width: `${areaPct}%`, background: area.color }} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold font-mono min-w-[36px] text-right" style={{ color: area.color }}>{areaPct}%</span>
                  </div>
                </div>

                {/* Phase rows */}
                <div className="p-2 px-3">
                  {area.phases.map((phase, pi) => {
                    const key = `${area.id}-${pi}`;
                    const done = !!phaseChecked[key];
                    return (
                      <div key={pi} onClick={() => togglePhase(key)} className="flex items-start gap-3 p-2.5 px-3 rounded-[9px] cursor-pointer transition-colors duration-200"
                        style={{
                          marginBottom: pi < area.phases.length - 1 ? "4px" : "0",
                          background: done ? area.color + "10" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${done ? area.color + "40" : "rgba(255,255,255,0.04)"}`,
                          borderLeft: `3px solid ${done ? area.color : "rgba(255,255,255,0.08)"}`,
                          opacity: done ? 0.72 : 1,
                        }}>
                        {/* Checkbox */}
                        <div className="w-5 h-5 rounded-md shrink-0 mt-px flex items-center justify-center transition-colors duration-200" style={{ border: `2px solid ${done ? area.color : "rgba(255,255,255,0.18)"}`, background: done ? area.color : "transparent" }}>
                          {done && <span className="check-pop text-[11px] font-black" style={{ color: "#000" }}>✓</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-[3px] flex-wrap">
                            <span className="rounded-[5px] py-px px-2 text-[10px] sm:text-xs font-mono font-semibold whitespace-nowrap" style={{ background: area.color + "22", color: area.color, border: `1px solid ${area.color}40` }}>
                              {phase.label}
                            </span>
                            {phase.isPremodule && (
                              <span className="rounded-[5px] py-px px-[7px] text-[9px] sm:text-[11px] font-bold" style={{ background: "rgba(120,180,255,0.12)", color: "#78b4ff", border: "1px solid rgba(120,180,255,0.3)" }}>PRE-MÓDULO</span>
                            )}
                          </div>
                          <p className={`text-xs sm:text-[15px] font-semibold m-0 mb-[3px] leading-tight ${done ? "line-through" : ""}`} style={{ color: done ? "#4a6070" : "#c0ccd8" }}>
                            {phase.title}
                          </p>
                          <p className={`text-[11.5px] sm:text-[13px] m-0 leading-snug ${done ? "line-through" : ""}`} style={{ color: done ? "#3a5060" : "#5a6880" }}>
                            {phase.deliverable}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="mt-2 p-3 px-4 rounded-[10px] text-xs sm:text-sm leading-relaxed" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "#4a5a6a" }}>
            <strong style={{ color: "#6a7888" }}>Cómo usar:</strong> Marca una fase como completada cuando hayas terminado su entregable y puedas cumplir su métrica de éxito — no antes.
          </div>
        </div>
      )}
    </div>
  );
};

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tracker",
  component: TrackerPage,
});
