import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCurrentWeekKey, getWeekKeyOffset, formatWeekLabel } from "../../lib/week";

export function WeekNavigator({ weekKey, startWeekKey, onWeekChange }) {
  const currentWeek = getCurrentWeekKey();
  const isCurrentWeek = weekKey === currentWeek;
  const canGoBack = startWeekKey ? weekKey > startWeekKey : true;
  const canGoForward = weekKey < currentWeek;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <button
        onClick={() => canGoBack && onWeekChange(getWeekKeyOffset(weekKey, -1))}
        disabled={!canGoBack}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.08)",
          background: canGoBack ? "rgba(255,255,255,0.04)" : "transparent",
          color: canGoBack ? "#7a8898" : "#2a3040",
          cursor: canGoBack ? "pointer" : "default",
          padding: 0,
        }}
      >
        <ChevronLeft size={16} />
      </button>

      <div style={{ flex: 1, textAlign: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#c0ccd8", fontFamily: "'Space Mono', monospace" }}>
          {formatWeekLabel(weekKey)}
        </span>
        {isCurrentWeek && (
          <span style={{
            marginLeft: 8, fontSize: 10, fontWeight: 700,
            padding: "2px 8px", borderRadius: 10,
            background: "rgba(124,58,237,0.2)", color: "#a78bfa",
            border: "1px solid rgba(124,58,237,0.4)",
            verticalAlign: "middle",
          }}>
            ESTA SEMANA
          </span>
        )}
      </div>

      <button
        onClick={() => canGoForward && onWeekChange(getWeekKeyOffset(weekKey, 1))}
        disabled={!canGoForward}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.08)",
          background: canGoForward ? "rgba(255,255,255,0.04)" : "transparent",
          color: canGoForward ? "#7a8898" : "#2a3040",
          cursor: canGoForward ? "pointer" : "default",
          padding: 0,
        }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
