import { AREA_META } from "../../data/area-meta";

/**
 * Per-area card showing expected vs actual progress with status badge.
 */
export function PaceCard({ areaId, schedule, multiWeekStats, globalStats }) {
  const meta = AREA_META[areaId];
  if (!meta || !schedule) return null;

  const phases = schedule[areaId] || [];
  const areaStats = multiWeekStats?.perArea?.[areaId];
  const consistency = areaStats?.consistency ?? 0;

  // Determine status
  const overdueCount = phases.filter(p => p.status === "overdue").length;
  const completedCount = phases.filter(p => p.status === "completed").length;
  const behindCount = overdueCount; // overdue phases that should have been done

  let statusLabel, statusColor, statusBg;
  if (behindCount === 0 && consistency >= 75) {
    statusLabel = "EN RITMO";
    statusColor = "#00C896";
    statusBg = "rgba(0,200,150,0.1)";
  } else if (consistency >= 50 || behindCount <= 1) {
    statusLabel = "LIGERAMENTE ATRASADO";
    statusColor = "#FFB800";
    statusBg = "rgba(255,184,0,0.1)";
  } else {
    statusLabel = "NECESITA ATENCIÓN";
    statusColor = "#ff6b6b";
    statusBg = "rgba(255,100,100,0.1)";
  }

  // Phase timeline bar
  const totalPhases = phases.length;

  return (
    <div style={{
      borderRadius: 12,
      padding: 16,
      background: meta.color + "08",
      border: `1px solid ${meta.color}20`,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <meta.IconC size={16} style={{ color: meta.color }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: meta.color }}>{meta.label}</span>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
          background: statusBg, color: statusColor,
          border: `1px solid ${statusColor}40`,
          fontFamily: "'Space Mono', monospace",
          letterSpacing: "0.5px",
        }}>
          {statusLabel}
        </span>
      </div>

      {/* Phase timeline bar */}
      <div style={{ display: "flex", gap: 3, marginBottom: 12, height: 8, borderRadius: 4, overflow: "hidden" }}>
        {phases.map((p, i) => {
          let bg;
          if (p.status === "completed") bg = meta.color;
          else if (p.status === "current") bg = meta.color + "70";
          else if (p.status === "overdue") bg = "#ff6b6b90";
          else bg = "rgba(255,255,255,0.06)";

          return (
            <div key={i} style={{
              flex: 1, background: bg, borderRadius: 2,
              position: "relative",
            }}>
              {p.status === "current" && (
                <div style={{
                  position: "absolute", right: 0, top: -2, bottom: -2,
                  width: 2, background: "#fff", borderRadius: 1,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
        <div>
          <span style={{ color: "#5a6880" }}>Fases: </span>
          <span style={{ color: "#c0ccd8", fontWeight: 600, fontFamily: "'Space Mono', monospace" }}>
            {completedCount}/{totalPhases}
          </span>
        </div>
        <div>
          <span style={{ color: "#5a6880" }}>Consistencia: </span>
          <span style={{ color: consistency >= 75 ? "#00C896" : consistency >= 50 ? "#FFB800" : "#ff6b6b", fontWeight: 600, fontFamily: "'Space Mono', monospace" }}>
            {consistency}%
          </span>
        </div>
        {areaStats && (
          <>
            <div>
              <span style={{ color: "#5a6880" }}>Promedio: </span>
              <span style={{ color: "#c0ccd8", fontWeight: 600, fontFamily: "'Space Mono', monospace" }}>
                {areaStats.avgPerWeek}/sem
              </span>
            </div>
            <div>
              <span style={{ color: "#5a6880" }}>Total: </span>
              <span style={{ color: "#c0ccd8", fontWeight: 600, fontFamily: "'Space Mono', monospace" }}>
                {areaStats.totalCompleted} bloques
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
