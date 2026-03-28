import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { AREA_META } from "../../data/area-meta";
import { computeWeeklyAreaStats, TOTAL_WEEK_BLOCKS } from "../../lib/stats";

/**
 * Summary card shown when viewing a past (non-current) week.
 */
export function WeekReviewCard({ weekCells, prevWeekCells }) {
  const done = Object.values(weekCells || {}).filter(Boolean).length;
  const pct = Math.round((done / TOTAL_WEEK_BLOCKS) * 100);
  const areaStats = computeWeeklyAreaStats(weekCells || {});

  // Delta vs previous week
  const prevDone = prevWeekCells ? Object.values(prevWeekCells).filter(Boolean).length : null;
  const delta = prevDone !== null ? done - prevDone : null;

  // Best and worst area
  const areaEntries = Object.entries(areaStats).filter(([, s]) => s.expected > 0);
  areaEntries.sort((a, b) => b[1].pct - a[1].pct);
  const bestArea = areaEntries[0];
  const worstArea = areaEntries[areaEntries.length - 1];

  // Circular progress
  const circumference = 2 * Math.PI * 30;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div style={{
      borderRadius: 12, padding: 16,
      background: "rgba(124,58,237,0.06)",
      border: "1px solid rgba(124,58,237,0.2)",
      marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        {/* Circular progress */}
        <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
          <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
            <circle cx="36" cy="36" r="30" fill="none" stroke="#a78bfa" strokeWidth="5"
              strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.5s" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: "#a78bfa" }}>{pct}%</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#c0ccd8", marginBottom: 4 }}>
            <span style={{ fontFamily: "'Space Mono', monospace" }}>{done}/{TOTAL_WEEK_BLOCKS}</span> bloques
          </div>

          {delta !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, marginBottom: 8 }}>
              {delta > 0 ? <ArrowUp size={13} style={{ color: "#00C896" }} /> :
               delta < 0 ? <ArrowDown size={13} style={{ color: "#ff6b6b" }} /> :
               <Minus size={13} style={{ color: "#5a6880" }} />}
              <span style={{
                color: delta > 0 ? "#00C896" : delta < 0 ? "#ff6b6b" : "#5a6880",
                fontWeight: 600,
                fontFamily: "'Space Mono', monospace",
              }}>
                {delta > 0 ? "+" : ""}{delta} vs semana anterior
              </span>
            </div>
          )}

          {/* Per-area mini bars */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(areaStats).map(([areaId, s]) => {
              const meta = AREA_META[areaId];
              if (!meta || s.expected === 0) return null;
              return (
                <div key={areaId} style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "2px 8px", borderRadius: 6,
                  background: meta.color + "10",
                  border: `1px solid ${meta.color}25`,
                }}>
                  <meta.IconC size={9} style={{ color: meta.color }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: meta.color, fontFamily: "'Space Mono', monospace" }}>
                    {s.completed}/{s.expected}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best/worst area */}
        <div style={{ fontSize: 11, color: "#5a6880", minWidth: 120 }}>
          {bestArea && (
            <div style={{ marginBottom: 4 }}>
              Mejor: <strong style={{ color: AREA_META[bestArea[0]]?.color || "#c0ccd8" }}>
                {AREA_META[bestArea[0]]?.label} ({bestArea[1].pct}%)
              </strong>
            </div>
          )}
          {worstArea && worstArea[0] !== bestArea?.[0] && (
            <div>
              Débil: <strong style={{ color: AREA_META[worstArea[0]]?.color || "#c0ccd8" }}>
                {AREA_META[worstArea[0]]?.label} ({worstArea[1].pct}%)
              </strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
