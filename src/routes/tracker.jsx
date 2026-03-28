import { useState } from "react";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { BarChart2, CalendarDays, Map, Check, X } from "lucide-react";
import { roadmapData } from "../data/roadmap-data";
import { AREA_META } from "../data/area-meta";
import { calendarWeek } from "../data/calendar-data";
import { useIsMobile } from "../hooks/use-is-mobile";

const TrackerPage = () => {
  const isMobile = useIsMobile();
  const [view, setView] = useState("weekly");
  const [weekChecked, setWeekChecked] = useState({});
  const [phaseChecked, setPhaseChecked] = useState({});

  // ── Weekly helpers ──
  const toggleWeek = (key) => setWeekChecked(p => ({ ...p, [key]: !p[key] }));
  const [activeDay, setActiveDay] = useState(null);
  const totalWeekBlocks = calendarWeek.reduce((s, d) => s + d.blocks.length, 0);
  const weekDone = Object.values(weekChecked).filter(Boolean).length;
  const weekPct = Math.round((weekDone / totalWeekBlocks) * 100);
  const totalWeekMin = calendarWeek.reduce((s, d) => s + d.totalMin, 0);
  const hoursPerArea = {};
  calendarWeek.forEach(d => d.blocks.forEach(b => { hoursPerArea[b.area] = (hoursPerArea[b.area] || 0) + b.duration; }));

  // ── Total helpers ──
  const togglePhase = (key) => setPhaseChecked(p => ({ ...p, [key]: !p[key] }));
  const allPhases = roadmapData.flatMap(area => area.phases.map((ph, pi) => ({ areaId: area.id, phaseIdx: pi, key: `${area.id}-${pi}` })));
  const totalPhases = allPhases.length;
  const totalDonePhases = allPhases.filter(p => phaseChecked[p.key]).length;
  const totalPct = Math.round((totalDonePhases / totalPhases) * 100);

  const subBtnStyle = (active) => ({
    display: "flex", alignItems: "center", gap: "6px",
    padding: isMobile ? "7px 14px" : "8px 20px",
    background: active ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: "8px", color: active ? "#a78bfa" : "#5a6880",
    fontSize: isMobile ? "12px" : "13px", fontWeight: active ? 700 : 400,
    cursor: "pointer", fontFamily: "'DM Sans', system-ui, sans-serif",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ minHeight: "60vh", padding: isMobile ? "24px 16px 60px" : "36px 40px 60px", maxWidth: "960px", margin: "0 auto" }}>

      {/* ── Tracker header ── */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <BarChart2 size={22} style={{ color: "#a78bfa" }} />
              <h2 style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: 700, color: "#e0e6f0" }}>Progress Tracker</h2>
            </div>
            <p style={{ color: "#5a6880", fontSize: "13px", marginLeft: "30px" }}>Seguimiento semanal y total del roadmap</p>
          </div>
          {/* Sub-view switcher */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="nav-btn" style={subBtnStyle(view === "weekly")} onClick={() => setView("weekly")}>
              <CalendarDays size={13} /> Esta semana
            </button>
            <button className="nav-btn" style={subBtnStyle(view === "total")} onClick={() => setView("total")}>
              <Map size={13} /> Total roadmap
            </button>
          </div>
        </div>

        {/* Master progress bar — always visible */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#7a8898", fontSize: "12px", display:"flex", alignItems:"center", gap:"5px" }}><CalendarDays size={12}/> Esta semana</span>
              <span style={{ color: "#e0e6f0", fontSize: "12px", fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>{weekDone}/{totalWeekBlocks} · {weekPct}%</span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${weekPct}%`, background: "linear-gradient(90deg,#7C3AED,#00D4FF)", borderRadius: "3px", transition: "width 0.4s" }} />
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#7a8898", fontSize: "12px", display:"flex", alignItems:"center", gap:"5px" }}><Map size={12}/> Total roadmap</span>
              <span style={{ color: "#e0e6f0", fontSize: "12px", fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>{totalDonePhases}/{totalPhases} fases · {totalPct}%</span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${totalPct}%`, background: "linear-gradient(90deg,#FF6B35,#FFB800)", borderRadius: "3px", transition: "width 0.4s" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          VIEW: ESTA SEMANA
      ══════════════════════════════════════════════════════════ */}
      {view === "weekly" && (
        <div>
          {/* Legend + total hours */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px", alignItems: "center" }}>
            {Object.entries(hoursPerArea).map(([id, mins]) => {
              const m = AREA_META[id];
              return (
                <div key={id} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 9px", background: m.color + "14", border: `1px solid ${m.color}30`, borderRadius: "20px" }}>
                  <m.IconC size={10} style={{ color: m.color, flexShrink: 0 }} />
                  <span style={{ color: m.color, fontSize: "10px", fontWeight: 600 }}>{m.label}</span>
                  <span style={{ color: "#4a5060", fontSize: "10px" }}>{Math.floor(mins/60) > 0 ? `${Math.floor(mins/60)}h` : ""}{mins%60 > 0 ? `${mins%60}m` : ""}</span>
                </div>
              );
            })}
            <span style={{ color: "#3a4a5a", fontSize: "11px", fontFamily: "'Space Mono',monospace", marginLeft: "auto" }}>{Math.floor(totalWeekMin/60)}h {totalWeekMin%60}m / semana</span>
          </div>

          {/* 7-day grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: isMobile ? "6px" : "10px", marginBottom: "16px" }}>
            {calendarWeek.map((day, di) => {
              const dayDone = day.blocks.every((_, bi) => weekChecked[`${di}-${bi}`]);
              const isOpen = activeDay === di;
              return (
                <div key={di} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {/* 1:1 square */}
                  <div onClick={() => setActiveDay(isOpen ? null : di)} className="day-square" style={{
                    position: "relative", width: "100%", paddingBottom: "100%",
                    borderRadius: isMobile ? "8px" : "12px", cursor: "pointer",
                    background: dayDone ? "rgba(0,200,150,0.12)" : isOpen ? "rgba(167,139,250,0.1)" : "rgba(255,255,255,0.03)",
                    border: dayDone ? "2px solid rgba(0,200,150,0.45)" : isOpen ? "2px solid rgba(167,139,250,0.55)" : "1px solid rgba(255,255,255,0.07)",
                  }}>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isMobile ? "3px" : "6px", padding: isMobile ? "4px" : "8px" }}>
                      <span style={{ color: dayDone ? "#00c896" : isOpen ? "#a78bfa" : "#6a7888", fontSize: isMobile ? "9px" : "11px", fontWeight: 700, fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>{day.shortDay}</span>
                      {/* Color dots */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "2px", justifyContent: "center" }}>
                        {day.blocks.map((b, bi) => {
                          const m = AREA_META[b.area];
                          const done = !!weekChecked[`${di}-${bi}`];
                          return <div key={bi} style={{ width: isMobile ? "6px" : "8px", height: isMobile ? "6px" : "8px", borderRadius: "2px", background: done ? m.color : m.color + "40", border: `1px solid ${done ? m.color : m.color + "60"}`, transition: "background-color 0.2s" }} />;
                        })}
                      </div>
                      {dayDone
                        ? <span style={{ color: "#00c896", fontSize: isMobile ? "13px" : "17px" }}>✓</span>
                        : <span style={{ color: "#3a4050", fontSize: isMobile ? "8px" : "9px", fontFamily: "'Space Mono',monospace" }}>{Math.floor(day.totalMin/60)}h{day.totalMin%60 > 0 ? `${day.totalMin%60}m` : ""}</span>
                      }
                    </div>
                  </div>

                  {/* Task chips — desktop */}
                  {!isMobile && day.blocks.map((b, bi) => {
                    const m = AREA_META[b.area];
                    const done = !!weekChecked[`${di}-${bi}`];
                    return (
                      <div key={bi} onClick={() => toggleWeek(`${di}-${bi}`)} className="task-chip" style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 7px", borderRadius: "6px", cursor: "pointer", background: done ? m.color + "18" : "rgba(255,255,255,0.02)", border: `1px solid ${done ? m.color + "40" : "rgba(255,255,255,0.05)"}` }}
                        onMouseEnter={e => e.currentTarget.style.background = done ? m.color + "25" : "rgba(255,255,255,0.05)"}
                        onMouseLeave={e => e.currentTarget.style.background = done ? m.color + "18" : "rgba(255,255,255,0.02)"}
                      >
                        <div style={{ width: "9px", height: "9px", borderRadius: "2px", flexShrink: 0, background: done ? m.color : "transparent", border: `1.5px solid ${done ? m.color : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {done && <Check size={6} strokeWidth={3} style={{ color: "#000" }} />}
                        </div>
                        <m.IconC size={9} style={{ color: m.color, flexShrink: 0 }} />
                        <span style={{ color: "#3a4a5a", fontSize: "9px", fontFamily: "'Space Mono',monospace" }}>{b.duration}m</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Day detail panel — accordion */}
          <div className={`accordion-wrapper${activeDay !== null ? " open" : ""}`} style={{ marginBottom: "20px" }}>
            <div className="accordion-inner">
              {activeDay !== null && (
                <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(167,139,250,0.3)", background: "rgba(167,139,250,0.04)" }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: "#a78bfa", fontWeight: 700, fontSize: "15px", fontFamily: "'Space Mono',monospace" }}>{calendarWeek[activeDay].day}</span>
                      <span style={{ color: "#5a6880", fontSize: "12px" }}>{calendarWeek[activeDay].focus}</span>
                    </div>
                    <button onClick={() => setActiveDay(null)} style={{ background: "none", border: "none", color: "#5a6880", cursor: "pointer", lineHeight: 1, padding: "4px", display:"flex", alignItems:"center" }}>
                      <X size={16} />
                    </button>
                  </div>
                  <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {calendarWeek[activeDay].blocks.map((block, bi) => {
                      const meta = AREA_META[block.area];
                      const key = `${activeDay}-${bi}`;
                      const done = !!weekChecked[key];
                      return (
                        <div key={bi} onClick={() => toggleWeek(key)} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 14px", borderRadius: "10px", cursor: "pointer", background: done ? meta.color + "12" : "rgba(255,255,255,0.03)", border: `1px solid ${done ? meta.color + "45" : "rgba(255,255,255,0.06)"}`, borderLeft: `3px solid ${done ? meta.color : "rgba(255,255,255,0.1)"}`, transition: "background-color 0.2s, border-color 0.2s" }}>
                          <div style={{ width: "20px", height: "20px", borderRadius: "6px", flexShrink: 0, marginTop: "1px", border: `2px solid ${done ? meta.color : "rgba(255,255,255,0.2)"}`, background: done ? meta.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.2s, border-color 0.2s" }}>
                            {done && <span className="check-pop" style={{ color: "#000", fontSize: "11px", fontWeight: 900 }}>✓</span>}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px", flexWrap: "wrap" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: meta.color + "1a", border: `1px solid ${meta.color}35`, borderRadius: "5px", padding: "2px 8px", fontSize: "10px", color: meta.color, fontWeight: 700 }}>{meta.icon} {meta.label}</span>
                              <span style={{ color: "#4a5a6a", fontSize: "10px", fontFamily: "'Space Mono',monospace" }}>{block.duration} min</span>
                            </div>
                            <p style={{ color: done ? "#4a6070" : "#c0ccd8", fontSize: "13px", lineHeight: 1.55, margin: 0, textDecoration: done ? "line-through" : "none" }}>{block.label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {isMobile && activeDay === null && (
            <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", marginBottom: "16px" }}>
              <p style={{ color: "#4a5a6a", fontSize: "12px", textAlign: "center" }}>Toca un día para ver y marcar sus tareas</p>
            </div>
          )}

          {/* Principles */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: "8px" }}>
            {[
              { icon: "🔁", title: "DSA diario", body: "30 min cada día > 3h esporádicas. La consistencia construye el patrón mental." },
              { icon: "🎯", title: "Una área profunda", body: "60 min concentrado vale más que 4×15 min saltando entre temas." },
              { icon: "📝", title: "Siempre un output", body: "Cada sesión debe producir algo: diagrama, commit, notebook, ADR." },
              { icon: "⚡", title: "Regla 25 min", body: "Si LeetCode no cede en 25 min, estudia la solución. Mañana desde cero." },
            ].map((p, i) => (
              <div key={i} className="principle-card" style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", cursor: "default" }}>
                <span style={{ fontSize: "15px" }}>{p.icon}</span>
                <div style={{ color: "#b0bcc8", fontSize: "11.5px", fontWeight: 600, margin: "5px 0 3px" }}>{p.title}</div>
                <div style={{ color: "#4a5a6a", fontSize: "11px", lineHeight: 1.55 }}>{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          VIEW: TOTAL ROADMAP
      ══════════════════════════════════════════════════════════ */}
      {view === "total" && (
        <div>
          {/* Per-area overview cards */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5,1fr)", gap: "8px", marginBottom: "28px" }}>
            {roadmapData.map(area => {
              const totalPh = area.phases.length;
              const donePh = area.phases.filter((_, pi) => phaseChecked[`${area.id}-${pi}`]).length;
              const pct = Math.round((donePh / totalPh) * 100);
              const circumference = 2 * Math.PI * 22;
              const dashOffset = circumference - (pct / 100) * circumference;
              return (
                <div key={area.id} style={{ background: area.color + "0c", border: `1px solid ${area.color}30`, borderRadius: "12px", padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  {/* Circular progress */}
                  <div style={{ position: "relative", width: "54px", height: "54px" }}>
                    <svg width="54" height="54" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="27" cy="27" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                      <circle cx="27" cy="27" r="22" fill="none" stroke={area.color} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s" }} />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: area.color, fontSize: "13px", fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>{pct}%</span>
                    </div>
                  </div>
                  <span style={{ color: "#dde6f0", fontSize: "11px", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>{area.title}</span>
                  <span style={{ color: "#4a5a6a", fontSize: "10px", fontFamily: "'Space Mono',monospace" }}>{donePh}/{totalPh} fases</span>
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
              <div key={area.id} style={{ marginBottom: "16px", borderRadius: "14px", overflow: "hidden", border: `1px solid ${area.color}25`, background: "rgba(255,255,255,0.015)" }}>
                {/* Area header */}
                <div style={{ padding: "14px 20px", background: area.color + "0a", borderBottom: `1px solid ${area.color}20`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "18px" }}>{area.icon}</span>
                    <div>
                      <div style={{ color: area.color, fontWeight: 700, fontSize: "14px" }}>{area.title}</div>
                      <div style={{ color: "#4a5a6a", fontSize: "11px" }}>{area.period} · {area.subtitle}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: isMobile ? "80px" : "120px", height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${areaPct}%`, background: area.color, borderRadius: "3px", transition: "width 0.4s" }} />
                    </div>
                    <span style={{ color: area.color, fontSize: "12px", fontWeight: 700, fontFamily: "'Space Mono',monospace", minWidth: "36px", textAlign: "right" }}>{areaPct}%</span>
                  </div>
                </div>

                {/* Phase rows */}
                <div style={{ padding: "8px 12px" }}>
                  {area.phases.map((phase, pi) => {
                    const key = `${area.id}-${pi}`;
                    const done = !!phaseChecked[key];
                    return (
                      <div key={pi} onClick={() => togglePhase(key)} style={{
                        display: "flex", alignItems: "flex-start", gap: "12px",
                        padding: "10px 12px", marginBottom: pi < area.phases.length - 1 ? "4px" : "0",
                        borderRadius: "9px", cursor: "pointer",
                        background: done ? area.color + "10" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${done ? area.color + "40" : "rgba(255,255,255,0.04)"}`,
                        borderLeft: `3px solid ${done ? area.color : "rgba(255,255,255,0.08)"}`,
                        transition: "background-color 0.2s, border-color 0.2s", opacity: done ? 0.72 : 1,
                      }}>
                        {/* Checkbox */}
                        <div style={{ width: "20px", height: "20px", borderRadius: "6px", flexShrink: 0, marginTop: "1px", border: `2px solid ${done ? area.color : "rgba(255,255,255,0.18)"}`, background: done ? area.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.2s, border-color 0.2s" }}>
                          {done && <span className="check-pop" style={{ color: "#000", fontSize: "11px", fontWeight: 900 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                            <span style={{ background: area.color + "22", color: area.color, border: `1px solid ${area.color}40`, borderRadius: "5px", padding: "1px 8px", fontSize: "10px", fontFamily: "'Space Mono',monospace", fontWeight: 600, whiteSpace: "nowrap" }}>
                              {phase.label}
                            </span>
                            {phase.isPremodule && (
                              <span style={{ background: "rgba(120,180,255,0.12)", color: "#78b4ff", border: "1px solid rgba(120,180,255,0.3)", borderRadius: "5px", padding: "1px 7px", fontSize: "9px", fontWeight: 700 }}>PRE-MÓDULO</span>
                            )}
                          </div>
                          <p style={{ color: done ? "#4a6070" : "#c0ccd8", fontSize: isMobile ? "12px" : "13px", fontWeight: 600, margin: "0 0 3px", textDecoration: done ? "line-through" : "none", lineHeight: 1.3 }}>
                            {phase.title}
                          </p>
                          <p style={{ color: done ? "#3a5060" : "#5a6880", fontSize: "11.5px", margin: 0, lineHeight: 1.45, textDecoration: done ? "line-through" : "none" }}>
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

          <div style={{ marginTop: "8px", padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", color: "#4a5a6a", fontSize: "12px", lineHeight: 1.6 }}>
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
