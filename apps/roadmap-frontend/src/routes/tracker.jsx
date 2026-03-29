import { useState, useEffect, useMemo } from "react";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { BarChart2, CalendarDays, Map, Clock, Check, X, Rocket, LogIn, Flame, TrendingUp, Target } from "lucide-react";
import { roadmapData } from "../data/roadmap-data";
import { AREA_META } from "../data/area-meta";
import { calendarWeek } from "../data/calendar-data";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { getCurrentWeekKey, dateToWeekKey, getWeekKeyOffset, weekKeyToDateRange } from "../lib/week";
import { getPhaseSchedule, getGlobalStats, computePhaseProgress } from "../lib/schedule";
import { computeMultiWeekStats, TOTAL_WEEK_BLOCKS, getAreaExpected, cellKeyToArea } from "../lib/stats";
import { AuthModal } from "../components/AuthModal";
import { StartRoadmapModal } from "../components/StartRoadmapModal";
import { WeekNavigator } from "../components/tracker/WeekNavigator";
import { WeekReviewCard } from "../components/tracker/WeekReviewCard";
import { HistoryHeatmap } from "../components/tracker/HistoryHeatmap";
import { PaceCard } from "../components/tracker/PaceCard";
import { StreakBadges } from "../components/tracker/StreakBadges";

const TrackerPage = () => {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [view, setView] = useState("weekly");
  const [weekChecked, setWeekChecked] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(() => getCurrentWeekKey());
  const [startDate, setStartDate] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [streaks, setStreaks] = useState(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);

  const currentWeek = getCurrentWeekKey();
  const isCurrentWeek = selectedWeek === currentWeek;

  // ── Fetch settings + streaks on mount ──
  useEffect(() => {
    if (!user) return;
    api.getSettings()
      .then(s => {
        setStartDate(s.roadmap_start_date);
        if (!s.roadmap_start_date) setShowStartModal(true);
      })
      .catch(() => {});
    api.getStreaks().then(setStreaks).catch(() => {});
  }, [user]);

  // ── Fetch history when startDate known ──
  useEffect(() => {
    if (!user || !startDate) return;
    const startWeek = dateToWeekKey(new Date(startDate));
    api.getWeeklyRange(startWeek, currentWeek)
      .then(d => setHistoryData(d.weeks))
      .catch(() => {});
  }, [user, startDate, currentWeek]);

  // ── Fetch week data when navigating ──
  useEffect(() => {
    if (!user) return;
    api.getWeekly(selectedWeek).then(d => setWeekChecked(d.cells)).catch(() => {});
  }, [user, selectedWeek]);

  // ── Weekly helpers ──
  const toggleWeek = async (key) => {
    if (!isCurrentWeek) return; // read-only on past weeks
    const prev = weekChecked[key];
    setWeekChecked(p => ({ ...p, [key]: !prev }));
    if (user) {
      try {
        await api.toggleWeeklyCell(selectedWeek, key);
        // Recompute streaks after toggle
        api.computeStreaks().then(() => api.getStreaks().then(setStreaks).catch(() => {})).catch(() => {});
      }
      catch { setWeekChecked(p => ({ ...p, [key]: prev })); }
    }
  };

  const [activeCell, setActiveCell] = useState(null);
  const totalWeekBlocks = calendarWeek.reduce((s, d) => s + d.blocks.length, 0);
  const weekDone = Object.values(weekChecked).filter(Boolean).length;
  const weekPct = Math.round((weekDone / totalWeekBlocks) * 100);
  const totalWeekMin = calendarWeek.reduce((s, d) => s + d.totalMin, 0);
  const hoursPerArea = {};
  calendarWeek.forEach(d => d.blocks.forEach(b => { hoursPerArea[b.area] = (hoursPerArea[b.area] || 0) + b.duration; }));

  // ── Auto-computed phase progress from weekly history ──
  const { phaseChecked, phasePct } = useMemo(() => {
    if (!startDate || !historyData) return { phaseChecked: {}, phasePct: {} };
    return computePhaseProgress(startDate, historyData, getAreaExpected(), cellKeyToArea, weekKeyToDateRange);
  }, [startDate, historyData]);

  const allPhases = roadmapData.flatMap(area => area.phases.map((_, pi) => ({ areaId: area.id, phaseIdx: pi, key: `${area.id}-${pi}` })));
  const totalPhases = allPhases.length;
  const totalDonePhases = allPhases.filter(p => phaseChecked[p.key]).length;
  const totalPct = Math.round((totalDonePhases / totalPhases) * 100);

  // ── Schedule + stats ──
  const schedule = startDate ? getPhaseSchedule(startDate, phaseChecked) : null;
  const globalStats = startDate ? getGlobalStats(startDate) : null;
  const multiWeekStats = historyData ? computeMultiWeekStats(historyData) : null;
  const startWeekKey = startDate ? dateToWeekKey(new Date(startDate)) : null;

  // Previous week data for review card
  const prevWeekKey = getWeekKeyOffset(selectedWeek, -1);
  const prevWeekCells = historyData?.[prevWeekKey] || null;

  const handleStarted = (date) => {
    setStartDate(date);
    setShowStartModal(false);
    setShowRestartModal(false);
    // Re-fetch data
    setWeekChecked({});
    setHistoryData(null);
    setStreaks(null);
  };

  // ── Tab button style helper ──
  const tabBtn = (tabId, icon, label) => {
    const active = view === tabId;
    return (
      <button
        key={tabId}
        className={`nav-btn flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-5 rounded-lg cursor-pointer font-sans whitespace-nowrap text-xs sm:text-[15px] ${active ? "font-bold" : "font-normal"}`}
        style={{
          background: active ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${active ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.08)"}`,
          color: active ? "#a78bfa" : "#5a6880",
        }}
        onClick={() => setView(tabId)}
      >
        {icon} {label}
      </button>
    );
  };

  // ── Auth gate ──
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm font-mono" style={{ color: "#4a5a6a" }}>Cargando...</div>
      </div>
    );
  }

  if (!user) {
    // Mock data for blurred preview
    const mockChecked = { "0-0": true, "0-1": true, "1-0": true, "2-0": true, "2-1": true, "3-0": true, "3-2": true, "4-0": true, "5-0": true };
    const mockWeekDone = Object.keys(mockChecked).length;
    const mockWeekPct = Math.round((mockWeekDone / totalWeekBlocks) * 100);
    const mockTotalPct = 34;
    const mockTotalDone = 7;
    const mockTotalPhases = 21;

    const areaIds = Object.keys(AREA_META);
    const mockAreaRows = areaIds.map(areaId => {
      const meta = AREA_META[areaId];
      const cells = calendarWeek.map((day, di) => {
        const bi = day.blocks.findIndex(b => b.area === areaId);
        return bi >= 0 ? { di, bi, block: day.blocks[bi], key: `${di}-${bi}` } : null;
      });
      const total = cells.filter(Boolean).length;
      const done = cells.filter(c => c && mockChecked[c.key]).length;
      return { areaId, meta, cells, total, done };
    });

    const todayJsDay = new Date().getDay();
    const mockTodayIdx = todayJsDay === 0 ? 6 : todayJsDay - 1;

    return (
      <div className="min-h-[60vh] py-6 px-4 pb-[60px] sm:py-9 sm:px-10 sm:pb-[60px] max-w-[960px] mx-auto" style={{ position: "relative", overflow: "hidden" }}>
        {/* ── Blurred mock preview ── */}
        <div style={{ filter: "blur(5px)", pointerEvents: "none", userSelect: "none", opacity: 0.7 }} aria-hidden="true">
          {/* Mock header */}
          <div className="mb-7">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BarChart2 size={22} style={{ color: "#a78bfa" }} />
                  <h2 className="text-xl sm:text-[28px] font-bold" style={{ color: "#e0e6f0" }}>Progress Tracker</h2>
                </div>
                <div className="flex items-center gap-3 ml-[30px]">
                  <p className="text-[13px] sm:text-[15px]" style={{ color: "#5a6880", margin: 0 }}>Seguimiento semanal y total del roadmap</p>
                  <span className="text-[11px] sm:text-xs font-mono" style={{ color: "#3a4a5a" }}>Semana 8 de ~26 (31% del tiempo)</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-5 rounded-lg text-xs sm:text-[15px] font-bold" style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.5)", color: "#a78bfa" }}>
                  <CalendarDays size={13} /> Esta semana
                </div>
                <div className="flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-5 rounded-lg text-xs sm:text-[15px]" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#5a6880" }}>
                  <Clock size={13} /> Historial
                </div>
                <div className="flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-5 rounded-lg text-xs sm:text-[15px]" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#5a6880" }}>
                  <Map size={13} /> Total roadmap
                </div>
              </div>
            </div>

            {/* Mock progress bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="rounded-xl p-3.5 px-[18px]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex justify-between mb-2">
                  <span className="flex items-center gap-[5px] text-xs sm:text-sm" style={{ color: "#7a8898" }}><CalendarDays size={14} /> Esta semana</span>
                  <span className="text-xs sm:text-sm font-bold font-mono" style={{ color: "#e0e6f0" }}>{mockWeekDone}/{totalWeekBlocks} · {mockWeekPct}%</span>
                </div>
                <div className="h-1.5 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-sm" style={{ width: `${mockWeekPct}%`, background: "linear-gradient(90deg,#7C3AED,#00D4FF)" }} />
                </div>
              </div>
              <div className="rounded-xl p-3.5 px-[18px]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex justify-between mb-2">
                  <span className="flex items-center gap-[5px] text-xs sm:text-sm" style={{ color: "#7a8898" }}><Map size={14} /> Total roadmap</span>
                  <span className="text-xs sm:text-sm font-bold font-mono" style={{ color: "#e0e6f0" }}>{mockTotalDone}/{mockTotalPhases} fases · {mockTotalPct}%</span>
                </div>
                <div className="h-1.5 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-sm" style={{ width: `${mockTotalPct}%`, background: "linear-gradient(90deg,#FF6B35,#FFB800)" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Mock area legend */}
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

          {/* Mock heatmap table */}
          <div className="rounded-[14px] overflow-hidden mb-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ width: "110px", padding: "10px 14px", textAlign: "left" }} className="hidden sm:table-cell" />
                  <th style={{ width: "36px", padding: "10px 6px", textAlign: "left" }} className="sm:hidden" />
                  {calendarWeek.map((day, di) => (
                    <th key={di} className="text-[9px] sm:text-[11px] font-bold font-mono uppercase tracking-wider" style={{
                      color: di === mockTodayIdx ? "#a78bfa" : "#4a5a6a",
                      padding: "10px 0",
                      textAlign: "center",
                      background: di === mockTodayIdx ? "rgba(167,139,250,0.06)" : "transparent",
                    }}>
                      {day.shortDay}
                      {di === mockTodayIdx && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#a78bfa", margin: "3px auto 0" }} />}
                    </th>
                  ))}
                  <th className="text-[9px] sm:text-[11px] font-mono" style={{ color: "#3a4a5a", padding: "10px 14px 10px 8px", textAlign: "right", width: "80px" }}>Progreso</th>
                </tr>
              </thead>
              <tbody>
                {mockAreaRows.map(({ areaId, meta, cells, total, done }) => {
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <tr key={areaId} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <td className="hidden sm:table-cell" style={{ padding: "8px 14px" }}>
                        <div className="flex items-center gap-[6px]">
                          <meta.IconC size={13} style={{ color: meta.color, flexShrink: 0 }} />
                          <span className="text-[12px] font-semibold whitespace-nowrap" style={{ color: meta.color }}>{meta.label}</span>
                        </div>
                      </td>
                      <td className="sm:hidden" style={{ padding: "6px 8px" }}>
                        <div className="flex items-center justify-center">
                          <meta.IconC size={14} style={{ color: meta.color }} />
                        </div>
                      </td>
                      {cells.map((cell, di) => (
                        <td key={di} style={{ padding: "6px 0", textAlign: "center", background: di === mockTodayIdx ? "rgba(167,139,250,0.06)" : "transparent" }}>
                          {cell ? (
                            <div
                              className="w-5 h-5 sm:w-7 sm:h-7 inline-flex items-center justify-center rounded-md sm:rounded-lg"
                              style={{
                                background: mockChecked[cell.key] ? meta.color : "transparent",
                                border: `2px solid ${mockChecked[cell.key] ? meta.color : meta.color + "45"}`,
                              }}
                            >
                              {mockChecked[cell.key] && <Check size={11} strokeWidth={3} style={{ color: "#000" }} />}
                            </div>
                          ) : (
                            <span className="inline-block text-[10px] sm:text-xs" style={{ color: "#2a3040" }}>—</span>
                          )}
                        </td>
                      ))}
                      <td style={{ padding: "6px 14px 6px 8px" }}>
                        <div className="flex flex-col items-end gap-[3px]">
                          <span className="text-[10px] sm:text-xs font-mono font-semibold" style={{ color: meta.color }}>{done}/{total}</span>
                          <div className="w-full max-w-[56px] h-[3px] rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-full rounded-sm" style={{ width: `${pct}%`, background: meta.color }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mock principles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { icon: "🔁", title: "DSA diario", body: "30 min cada día > 3h esporádicas." },
              { icon: "🎯", title: "Una área profunda", body: "60 min concentrado vale más que 4×15 min." },
              { icon: "📝", title: "Siempre un output", body: "Cada sesión debe producir algo." },
              { icon: "⚡", title: "Regla 25 min", body: "Si LeetCode no cede, estudia la solución." },
            ].map((p, i) => (
              <div key={i} className="p-3 rounded-[10px]" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[15px]">{p.icon}</span>
                <div className="text-[11.5px] sm:text-[13px] font-semibold my-[5px] mb-[3px]" style={{ color: "#b0bcc8" }}>{p.title}</div>
                <div className="text-[11px] sm:text-[13px] leading-relaxed" style={{ color: "#4a5a6a" }}>{p.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Login overlay ── */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, background: "radial-gradient(ellipse at center, rgba(10,13,18,0.4) 0%, rgba(10,13,18,0.75) 100%)" }}>
          <div className="rounded-2xl p-7 sm:p-9 max-w-[440px] w-full mx-4" style={{ background: "rgba(10,13,18,0.9)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
            {/* Header */}
            <div className="text-center mb-5">
              <BarChart2 size={32} style={{ color: "#a78bfa", margin: "0 auto 12px" }} />
              <h2 className="text-xl sm:text-2xl font-bold mb-1.5" style={{ color: "#e0e6f0" }}>Progress Tracker</h2>
              <p className="text-[13px] sm:text-sm" style={{ color: "#5a6880" }}>
                Tu centro de control para el roadmap de 6 meses.
              </p>
            </div>

            {/* Feature list */}
            <div className="flex flex-col gap-2.5 mb-6">
              {[
                { icon: CalendarDays, color: "#00D4FF", text: "Seguimiento semanal con heatmap interactivo" },
                { icon: Flame, color: "#FF6B35", text: "Rachas y estadísticas de consistencia" },
                { icon: TrendingUp, color: "#00C896", text: "Historial de progreso semana a semana" },
                { icon: Target, color: "#FFB800", text: "Timeline automático de fases por área" },
                { icon: Map, color: "#a78bfa", text: "Vista total del roadmap con % por fase" },
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg py-2 px-3" style={{ background: feat.color + "08", border: `1px solid ${feat.color}18` }}>
                  <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: feat.color + "18" }}>
                    <feat.icon size={14} style={{ color: feat.color }} />
                  </div>
                  <span className="text-[12.5px] sm:text-[13.5px]" style={{ color: "#b0bcc8" }}>{feat.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => setAuthOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg cursor-pointer font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #7C3AED, #00D4FF)", color: "#fff", border: "none", fontFamily: "'DM Sans', sans-serif" }}
            >
              <LogIn size={16} /> Iniciar sesión
            </button>
            <p className="text-center text-[11px] mt-2.5" style={{ color: "#3a4a5a" }}>Gratis — solo necesitas un email.</p>
          </div>
        </div>

        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] py-6 px-4 pb-[60px] sm:py-9 sm:px-10 sm:pb-[60px] max-w-[960px] mx-auto">

      {/* ── Tracker header ── */}
      <div className="mb-7">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <BarChart2 size={22} style={{ color: "#a78bfa" }} />
              <h2 className="text-xl sm:text-[28px] font-bold" style={{ color: "#e0e6f0" }}>Progress Tracker</h2>
              {user && streaks && <StreakBadges streaks={streaks} />}
            </div>
            <div className="flex items-center gap-3 ml-[30px] flex-wrap">
              <p className="text-[13px] sm:text-[15px]" style={{ color: "#5a6880", margin: 0 }}>Seguimiento semanal y total del roadmap</p>
              {user && startDate && globalStats && (
                <span className="text-[11px] sm:text-xs font-mono" style={{ color: "#3a4a5a" }}>
                  Semana {globalStats.weeksSinceStart} de ~{globalStats.totalWeeks} ({globalStats.timeElapsedPct}% del tiempo)
                </span>
              )}
              {user && !startDate && (
                <button
                  onClick={() => setShowStartModal(true)}
                  className="flex items-center gap-1 py-1 px-3 rounded-lg cursor-pointer text-xs font-semibold"
                  style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa" }}
                >
                  <Rocket size={12} /> Empezar
                </button>
              )}
            </div>
          </div>

          {/* 3-tab switcher */}
          <div className="flex gap-2">
            {tabBtn("weekly", <CalendarDays size={13} />, "Esta semana")}
            {tabBtn("history", <Clock size={13} />, "Historial")}
            {tabBtn("total", <Map size={13} />, "Total roadmap")}
          </div>
        </div>

        {/* Master progress bars */}
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
        // Today's day index (0=Mon → 6=Sun), only highlight on current week
        const todayJsDay = new Date().getDay(); // 0=Sun, 1=Mon, ...
        const todayIdx = isCurrentWeek ? (todayJsDay === 0 ? 6 : todayJsDay - 1) : -1;

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

        const activeCellData = activeCell ? (() => {
          const [di, bi] = activeCell.split("-").map(Number);
          const day = calendarWeek[di];
          const block = day?.blocks[bi];
          if (!block) return null;
          return { di, bi, day, block, meta: AREA_META[block.area], key: activeCell };
        })() : null;

        return (
        <div>
          {/* Week navigator */}
          {user && startDate && (
            <WeekNavigator
              weekKey={selectedWeek}
              startWeekKey={startWeekKey}
              onWeekChange={setSelectedWeek}
            />
          )}

          {/* Past week review card */}
          {!isCurrentWeek && (
            <WeekReviewCard weekCells={weekChecked} prevWeekCells={prevWeekCells} />
          )}

          {/* Read-only notice for past weeks */}
          {!isCurrentWeek && (
            <div className="mb-4 p-2.5 px-4 rounded-lg text-xs" style={{ background: "rgba(255,184,0,0.06)", border: "1px solid rgba(255,184,0,0.2)", color: "#b89840" }}>
              Vista de solo lectura — navega a la semana actual para marcar bloques.
            </div>
          )}

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
              <thead>
                <tr>
                  <th style={{ width: "110px", padding: "10px 14px", textAlign: "left" }} className="hidden sm:table-cell" />
                  <th style={{ width: "36px", padding: "10px 6px", textAlign: "left" }} className="sm:hidden" />
                  {calendarWeek.map((day, di) => (
                    <th key={di} className="text-[9px] sm:text-[11px] font-bold font-mono uppercase tracking-wider" style={{
                      color: di === todayIdx ? "#a78bfa" : "#4a5a6a",
                      padding: "10px 0",
                      textAlign: "center",
                      background: di === todayIdx ? "rgba(167,139,250,0.06)" : "transparent",
                    }}>
                      {day.shortDay}
                      {di === todayIdx && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#a78bfa", margin: "3px auto 0" }} />}
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
                      <td className="hidden sm:table-cell" style={{ padding: "8px 14px" }}>
                        <div className="flex items-center gap-[6px]">
                          <meta.IconC size={13} style={{ color: meta.color, flexShrink: 0 }} />
                          <span className="text-[12px] font-semibold whitespace-nowrap" style={{ color: meta.color }}>{meta.label}</span>
                        </div>
                      </td>
                      <td className="sm:hidden" style={{ padding: "6px 8px" }}>
                        <div className="flex items-center justify-center">
                          <meta.IconC size={14} style={{ color: meta.color }} />
                        </div>
                      </td>
                      {cells.map((cell, di) => (
                        <td key={di} style={{ padding: "6px 0", textAlign: "center", background: di === todayIdx ? "rgba(167,139,250,0.06)" : "transparent" }}>
                          {cell ? (
                            <div
                              className="heatmap-cell w-5 h-5 sm:w-7 sm:h-7 inline-flex items-center justify-center rounded-md sm:rounded-lg"
                              style={{
                                background: weekChecked[cell.key] ? meta.color : "transparent",
                                border: `2px solid ${weekChecked[cell.key] ? meta.color : meta.color + "45"}`,
                                boxShadow: activeCell === cell.key ? `0 0 0 2px ${meta.color}60` : "none",
                                cursor: isCurrentWeek ? "pointer" : "default",
                                opacity: !isCurrentWeek ? 0.7 : 1,
                              }}
                              onClick={() => {
                                if (!isCurrentWeek) return;
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

          {/* ── Today's study plan cards ── */}
          {isCurrentWeek && todayIdx >= 0 && (() => {
            const todayData = calendarWeek[todayIdx];
            const todayBlocks = todayData.blocks.map((block, bi) => {
              const key = `${todayIdx}-${bi}`;
              const meta = AREA_META[block.area];
              const done = !!weekChecked[key];
              return { block, key, meta, done, bi };
            });
            const todayDone = todayBlocks.filter(b => b.done).length;
            const todayTotal = todayBlocks.length;
            const allDone = todayDone === todayTotal;

            return (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-[13px] sm:text-sm font-bold" style={{ color: "#a78bfa" }}>Hoy · {todayData.day}</span>
                  <span className="text-[11px] sm:text-xs font-mono" style={{ color: "#4a5a6a" }}>{todayData.focus} · {todayData.totalMin} min</span>
                  <span className="text-[10px] sm:text-xs font-mono font-bold ml-auto" style={{ color: allDone ? "#00C896" : "#5a6880" }}>
                    {todayDone}/{todayTotal} {allDone ? "✓" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {todayBlocks.map(({ block, key, meta, done, bi }) => (
                    <div
                      key={key}
                      className="rounded-[11px] p-3 px-4 flex items-start gap-3 cursor-pointer transition-all duration-200"
                      style={{
                        background: done ? meta.color + "10" : meta.color + "08",
                        border: `1px solid ${done ? meta.color + "40" : meta.color + "20"}`,
                        borderLeft: `3px solid ${done ? meta.color : meta.color + "60"}`,
                        opacity: done ? 0.65 : 1,
                      }}
                      onClick={() => {
                        toggleWeek(key);
                        setActiveCell(activeCell === key ? null : key);
                      }}
                    >
                      {/* Checkbox */}
                      <div className="w-[22px] h-[22px] rounded-md shrink-0 mt-0.5 flex items-center justify-center transition-colors duration-200" style={{
                        border: `2px solid ${done ? meta.color : meta.color + "50"}`,
                        background: done ? meta.color : "transparent",
                      }}>
                        {done && <Check size={12} strokeWidth={3} style={{ color: "#000" }} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <meta.IconC size={12} style={{ color: meta.color }} />
                            <span className="text-[11px] sm:text-xs font-bold" style={{ color: meta.color }}>{meta.label}</span>
                          </div>
                          <span className="text-[10px] sm:text-[11px] font-mono py-px px-1.5 rounded" style={{ background: "rgba(255,255,255,0.04)", color: "#5a6880" }}>
                            {block.duration} min
                          </span>
                        </div>
                        <p className={`text-[11.5px] sm:text-[13px] leading-snug m-0 ${done ? "line-through" : ""}`} style={{ color: done ? "#4a6070" : "#b0bcc8" }}>
                          {block.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ── Cell detail row ── */}
          {activeCellData && isCurrentWeek && (
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
          VIEW: HISTORIAL
      ══════════════════════════════════════════════════════════ */}
      {view === "history" && (
        <div>
          {!user ? (
            <div className="text-center py-12" style={{ color: "#4a5a6a" }}>
              <p className="text-sm mb-2">Inicia sesión para ver tu historial de progreso.</p>
            </div>
          ) : !startDate ? (
            <div className="text-center py-12" style={{ color: "#4a5a6a" }}>
              <p className="text-sm mb-3">Configura tu fecha de inicio para habilitar el historial.</p>
              <button
                onClick={() => setShowStartModal(true)}
                className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg cursor-pointer font-semibold text-sm"
                style={{ background: "linear-gradient(135deg, #7C3AED, #00D4FF)", color: "#fff", border: "none" }}
              >
                <Rocket size={16} /> Empezar mi roadmap
              </button>
            </div>
          ) : (
            <>
              {/* History heatmap */}
              <div className="rounded-[14px] p-4 mb-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "#7a8898" }}>Mapa de actividad</h3>
                <HistoryHeatmap historyData={historyData || {}} startWeekKey={startWeekKey} streaks={streaks} />
              </div>

              {/* Multi-week summary stats */}
              {multiWeekStats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                  <div className="rounded-xl p-3.5 text-center" style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
                    <div className="text-lg sm:text-xl font-bold font-mono" style={{ color: "#a78bfa" }}>{multiWeekStats.global.avgCompletion}%</div>
                    <div className="text-[11px] sm:text-xs" style={{ color: "#5a6880" }}>Promedio semanal</div>
                  </div>
                  <div className="rounded-xl p-3.5 text-center" style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)" }}>
                    <div className="text-lg sm:text-xl font-bold font-mono" style={{ color: "#00D4FF" }}>{multiWeekStats.global.totalWeeks}</div>
                    <div className="text-[11px] sm:text-xs" style={{ color: "#5a6880" }}>Semanas registradas</div>
                  </div>
                  {multiWeekStats.global.bestWeek && (
                    <div className="rounded-xl p-3.5 text-center" style={{ background: "rgba(0,200,150,0.06)", border: "1px solid rgba(0,200,150,0.2)" }}>
                      <div className="text-lg sm:text-xl font-bold font-mono" style={{ color: "#00C896" }}>{multiWeekStats.global.bestWeek.pct}%</div>
                      <div className="text-[11px] sm:text-xs" style={{ color: "#5a6880" }}>Mejor semana</div>
                    </div>
                  )}
                  {multiWeekStats.global.worstWeek && (
                    <div className="rounded-xl p-3.5 text-center" style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)" }}>
                      <div className="text-lg sm:text-xl font-bold font-mono" style={{ color: "#FF6B35" }}>{multiWeekStats.global.worstWeek.pct}%</div>
                      <div className="text-[11px] sm:text-xs" style={{ color: "#5a6880" }}>Semana más baja</div>
                    </div>
                  )}
                </div>
              )}

              {/* Pace cards per area */}
              {schedule && (
                <>
                  <h3 className="text-sm font-bold mb-3" style={{ color: "#7a8898" }}>Ritmo por área</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    {Object.keys(AREA_META).map(areaId => (
                      <PaceCard
                        key={areaId}
                        areaId={areaId}
                        schedule={schedule}
                        multiWeekStats={multiWeekStats}
                        globalStats={globalStats}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          VIEW: TOTAL ROADMAP
      ══════════════════════════════════════════════════════════ */}
      {view === "total" && (
        <div>
          {/* Global timeline summary */}
          {user && startDate && globalStats && (
            <div className="rounded-xl p-3.5 px-5 mb-5 flex items-center justify-between flex-wrap gap-2" style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
              <span className="text-xs sm:text-sm" style={{ color: "#7a8898" }}>Timeline del roadmap</span>
              <span className="text-xs sm:text-sm font-bold font-mono" style={{ color: "#a78bfa" }}>
                Semana {globalStats.weeksSinceStart} de ~{globalStats.totalWeeks} · Mes {globalStats.monthsSinceStart + 1} de {globalStats.totalMonths} · {globalStats.timeElapsedPct}% del tiempo
              </span>
            </div>
          )}

          {/* Per-area overview cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-7">
            {roadmapData.map(area => {
              const totalPh = area.phases.length;
              const donePh = area.phases.filter((_, pi) => phaseChecked[`${area.id}-${pi}`]).length;
              // Blended area % from individual phase pcts
              let pctSum = 0;
              area.phases.forEach((_, pi) => { pctSum += (phasePct[`${area.id}-${pi}`] || 0); });
              const pct = totalPh > 0 ? Math.round(pctSum / totalPh) : 0;
              const circumference = 2 * Math.PI * 22;
              const dashOffset = circumference - (pct / 100) * circumference;
              return (
                <div key={area.id} className="rounded-xl p-3.5 px-3 flex flex-col items-center gap-2" style={{ background: area.color + "0c", border: `1px solid ${area.color}30` }}>
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

          {/* Per-area phase progress */}
          {roadmapData.map(area => {
            const totalPh = area.phases.length;
            const donePh = area.phases.filter((_, pi) => phaseChecked[`${area.id}-${pi}`]).length;
            const areaPct = Math.round((donePh / totalPh) * 100);
            const areaSchedule = schedule?.[area.id];

            // Compute a blended area % from individual phase pcts
            const areaBlockPct = (() => {
              let sum = 0;
              area.phases.forEach((_, pi) => { sum += (phasePct[`${area.id}-${pi}`] || 0); });
              return totalPh > 0 ? Math.round(sum / totalPh) : 0;
            })();

            return (
              <div key={area.id} className="mb-4 rounded-[14px] overflow-hidden" style={{ border: `1px solid ${area.color}25`, background: "rgba(255,255,255,0.015)" }}>
                {/* Area header */}
                <div className="p-3.5 px-5 flex items-center justify-between flex-wrap gap-2.5" style={{ background: area.color + "0a", borderBottom: `1px solid ${area.color}20` }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{area.icon}</span>
                    <div>
                      <div className="text-sm sm:text-base font-bold" style={{ color: area.color }}>{area.title}</div>
                      <div className="text-[11px] sm:text-[13px]" style={{ color: "#4a5a6a" }}>
                        {area.period} · {area.subtitle}
                        {areaSchedule && (() => {
                          const currentIdx = areaSchedule.findIndex(p => p.status === "current");
                          if (currentIdx >= 0) {
                            return <span style={{ marginLeft: 8, color: "#5a6880" }}>· Fase {currentIdx + 1} de {areaSchedule.length} esperada</span>;
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-20 sm:w-[120px] h-1.5 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-sm transition-[width] duration-400" style={{ width: `${areaBlockPct}%`, background: area.color }} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold font-mono min-w-[36px] text-right" style={{ color: area.color }}>{areaBlockPct}%</span>
                  </div>
                </div>

                {/* Phase rows */}
                <div className="p-2 px-3">
                  {area.phases.map((phase, pi) => {
                    const key = `${area.id}-${pi}`;
                    const done = !!phaseChecked[key];
                    const pct = phasePct[key] || 0;
                    const phaseStatus = areaSchedule?.[pi]?.status;

                    // Status badge
                    let badge = null;
                    if (done) {
                      badge = { label: "COMPLETADA", color: "#00C896", bg: "rgba(0,200,150,0.1)", border: "rgba(0,200,150,0.3)", pulse: false };
                    } else if (phaseStatus === "current") {
                      badge = { label: "EN CURSO", color: area.color, bg: area.color + "18", border: area.color + "40", pulse: true };
                    } else if (phaseStatus === "overdue") {
                      badge = { label: "COMPLETAR", color: "#FFB800", bg: "rgba(255,184,0,0.1)", border: "rgba(255,184,0,0.3)", pulse: false };
                    } else if (phaseStatus === "upcoming") {
                      badge = { label: "PENDIENTE", color: "#4a5a6a", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)", pulse: false };
                    }

                    return (
                      <div key={pi} className="flex items-start gap-3 p-2.5 px-3 rounded-[9px] transition-colors duration-200"
                        style={{
                          marginBottom: pi < area.phases.length - 1 ? "4px" : "0",
                          background: done ? area.color + "10" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${done ? area.color + "40" : "rgba(255,255,255,0.04)"}`,
                          borderLeft: `3px solid ${done ? area.color : phaseStatus === "current" ? area.color + "80" : phaseStatus === "overdue" ? "#FFB80080" : "rgba(255,255,255,0.08)"}`,
                        }}>
                        {/* Circular mini progress */}
                        <div className="relative w-[28px] h-[28px] shrink-0 mt-0.5">
                          <svg width="28" height="28" style={{ transform: "rotate(-90deg)" }}>
                            <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                            <circle cx="14" cy="14" r="11" fill="none"
                              stroke={done ? "#00C896" : pct > 0 ? area.color : "transparent"}
                              strokeWidth="2.5"
                              strokeDasharray={2 * Math.PI * 11}
                              strokeDashoffset={2 * Math.PI * 11 - (Math.min(pct, 100) / 100) * 2 * Math.PI * 11}
                              strokeLinecap="round"
                              style={{ transition: "stroke-dashoffset 0.5s" }} />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            {done
                              ? <Check size={12} strokeWidth={3} style={{ color: "#00C896" }} />
                              : <span className="text-[8px] font-bold font-mono" style={{ color: pct > 0 ? area.color : "#3a4a5a" }}>{pct}</span>
                            }
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-[3px] flex-wrap">
                            <span className="rounded-[5px] py-px px-2 text-[10px] sm:text-xs font-mono font-semibold whitespace-nowrap" style={{ background: area.color + "22", color: area.color, border: `1px solid ${area.color}40` }}>
                              {phase.label}
                            </span>
                            {phase.isPremodule && (
                              <span className="rounded-[5px] py-px px-[7px] text-[9px] sm:text-[11px] font-bold" style={{ background: "rgba(120,180,255,0.12)", color: "#78b4ff", border: "1px solid rgba(120,180,255,0.3)" }}>PRE-MÓDULO</span>
                            )}
                            {badge && (
                              <span className="rounded-[5px] py-px px-[7px] text-[9px] sm:text-[11px] font-bold font-mono" style={{
                                background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
                                animation: badge.pulse ? "pulse 2s ease-in-out infinite" : "none",
                              }}>
                                {badge.label}
                              </span>
                            )}
                            <span className="text-[9px] sm:text-[11px] font-mono font-semibold ml-auto" style={{ color: done ? "#00C896" : pct > 0 ? area.color : "#3a4a5a" }}>
                              {pct}%
                            </span>
                          </div>
                          <p className={`text-xs sm:text-[15px] font-semibold m-0 mb-[3px] leading-tight ${done ? "line-through" : ""}`} style={{ color: done ? "#4a6070" : "#c0ccd8" }}>
                            {phase.title}
                          </p>
                          <p className={`text-[11.5px] sm:text-[13px] m-0 mb-1.5 leading-snug ${done ? "line-through" : ""}`} style={{ color: done ? "#3a5060" : "#5a6880" }}>
                            {phase.deliverable}
                          </p>
                          {/* Phase progress bar */}
                          <div className="h-1 rounded-sm overflow-hidden max-w-[200px]" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-full rounded-sm" style={{ width: `${Math.min(pct, 100)}%`, background: done ? "#00C896" : area.color, transition: "width 0.5s" }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="flex gap-3 flex-wrap mt-2">
            <div className="flex-1 p-3 px-4 rounded-[10px] text-xs sm:text-sm leading-relaxed" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "#4a5a6a" }}>
              <strong style={{ color: "#6a7888" }}>Progreso automático:</strong> Las fases se completan cuando alcanzas ≥75% de los bloques semanales esperados para esa área durante el periodo de la fase.
            </div>
            {user && startDate && (
              <button
                onClick={() => setShowRestartModal(true)}
                className="self-start py-2.5 px-4 rounded-lg cursor-pointer text-xs font-semibold whitespace-nowrap"
                style={{ background: "rgba(255,100,100,0.08)", border: "1px solid rgba(255,100,100,0.2)", color: "#ff6b6b" }}
              >
                Reiniciar progreso
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <StartRoadmapModal
        open={showStartModal}
        onClose={() => setShowStartModal(false)}
        onStarted={handleStarted}
        isRestart={false}
      />
      <StartRoadmapModal
        open={showRestartModal}
        onClose={() => setShowRestartModal(false)}
        onStarted={handleStarted}
        isRestart={true}
      />
    </div>
  );
};

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tracker",
  component: TrackerPage,
});
