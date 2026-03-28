import { useState } from "react";
import { AREA_META } from "../../data/area-meta";
import { computeWeeklyAreaStats, TOTAL_WEEK_BLOCKS } from "../../lib/stats";
import { getAllWeekKeysSince, formatWeekLabel } from "../../lib/week";

export function HistoryHeatmap({ historyData, startWeekKey, streaks }) {
  const [tooltip, setTooltip] = useState(null);

  if (!historyData || !startWeekKey) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#4a5a6a", fontSize: 14 }}>
        No hay datos de historial todavía.
      </div>
    );
  }

  const weekKeys = getAllWeekKeysSince(startWeekKey);
  const areaIds = Object.keys(AREA_META);

  // Precompute per-week per-area stats
  const weekAreaStats = {};
  for (const wk of weekKeys) {
    weekAreaStats[wk] = computeWeeklyAreaStats(historyData[wk] || {});
  }

  // Opacity: 0% → "18", 25% → "40", 50% → "70", 75% → "AA", 100% → "DD"
  function pctToOpacity(pct) {
    if (pct === 0) return "10";
    if (pct <= 25) return "40";
    if (pct <= 50) return "70";
    if (pct <= 75) return "AA";
    return "DD";
  }

  const cellSize = 18;
  const cellGap = 3;
  const labelWidth = 120;

  return (
    <div>
      {/* Summary stats */}
      {streaks && (
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {streaks.global?.weekly_completion && (
            <div style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", fontSize: 13 }}>
              <span style={{ color: "#a78bfa", fontWeight: 700 }}>🔥 {streaks.global.weekly_completion.current}</span>
              <span style={{ color: "#5a6880", marginLeft: 4 }}>semanas racha</span>
              <span style={{ color: "#3a4a5a", marginLeft: 8, fontSize: 11 }}>mejor: {streaks.global.weekly_completion.best}</span>
            </div>
          )}
          {streaks.global?.perfect_week && streaks.global.perfect_week.best > 0 && (
            <div style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(0,200,150,0.08)", border: "1px solid rgba(0,200,150,0.25)", fontSize: 13 }}>
              <span style={{ color: "#00C896", fontWeight: 700 }}>⭐ {streaks.global.perfect_week.current}</span>
              <span style={{ color: "#5a6880", marginLeft: 4 }}>semanas perfectas</span>
              <span style={{ color: "#3a4a5a", marginLeft: 8, fontSize: 11 }}>mejor: {streaks.global.perfect_week.best}</span>
            </div>
          )}
        </div>
      )}

      {/* Heatmap grid */}
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div style={{ display: "inline-block", minWidth: "100%" }}>
          {/* Week number headers */}
          <div style={{ display: "flex", marginLeft: labelWidth, marginBottom: 4 }}>
            {weekKeys.map(wk => {
              const num = parseInt(wk.split("-W")[1]);
              return (
                <div key={wk} style={{ width: cellSize, marginRight: cellGap, textAlign: "center", fontSize: 8, color: "#3a4a5a", fontFamily: "'Space Mono', monospace" }}>
                  {num}
                </div>
              );
            })}
          </div>

          {/* Area rows */}
          {areaIds.map(areaId => {
            const meta = AREA_META[areaId];
            return (
              <div key={areaId} style={{ display: "flex", alignItems: "center", marginBottom: cellGap }}>
                <div style={{ width: labelWidth, paddingRight: 8, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <meta.IconC size={11} style={{ color: meta.color }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: meta.color, whiteSpace: "nowrap" }}>{meta.label}</span>
                </div>
                <div style={{ display: "flex" }}>
                  {weekKeys.map(wk => {
                    const stats = weekAreaStats[wk]?.[areaId] || { pct: 0, completed: 0, expected: 0 };
                    const opacity = pctToOpacity(stats.pct);
                    return (
                      <div
                        key={wk}
                        style={{
                          width: cellSize,
                          height: cellSize,
                          marginRight: cellGap,
                          borderRadius: 3,
                          background: stats.pct > 0 ? meta.color + opacity : "rgba(255,255,255,0.04)",
                          border: `1px solid ${stats.pct > 0 ? meta.color + "30" : "rgba(255,255,255,0.04)"}`,
                          cursor: "default",
                          position: "relative",
                        }}
                        onMouseEnter={() => setTooltip({ wk, areaId, stats, meta })}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Global row */}
          <div style={{ display: "flex", alignItems: "center", marginTop: 4, paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ width: labelWidth, paddingRight: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#5a6880" }}>Total</span>
            </div>
            <div style={{ display: "flex" }}>
              {weekKeys.map(wk => {
                const cells = historyData[wk] || {};
                const done = Object.values(cells).filter(Boolean).length;
                const pct = Math.round((done / TOTAL_WEEK_BLOCKS) * 100);
                const opacity = pctToOpacity(pct);
                return (
                  <div
                    key={wk}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      marginRight: cellGap,
                      borderRadius: 3,
                      background: pct > 0 ? "#a78bfa" + opacity : "rgba(255,255,255,0.04)",
                      border: `1px solid ${pct > 0 ? "#a78bfa30" : "rgba(255,255,255,0.04)"}`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          marginTop: 8, padding: "8px 14px", borderRadius: 8,
          background: tooltip.meta.color + "0c",
          border: `1px solid ${tooltip.meta.color}30`,
          fontSize: 12, color: "#c0ccd8",
        }}>
          <strong style={{ color: tooltip.meta.color }}>{tooltip.meta.label}</strong>
          <span style={{ color: "#5a6880", margin: "0 8px" }}>·</span>
          <span style={{ fontFamily: "'Space Mono', monospace" }}>{formatWeekLabel(tooltip.wk)}</span>
          <span style={{ color: "#5a6880", margin: "0 8px" }}>·</span>
          <span style={{ fontWeight: 700 }}>{tooltip.stats.completed}/{tooltip.stats.expected} bloques ({tooltip.stats.pct}%)</span>
        </div>
      )}
    </div>
  );
}
