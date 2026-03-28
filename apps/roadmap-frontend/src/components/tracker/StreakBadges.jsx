import { Flame, Sparkles } from "lucide-react";

/**
 * Inline streak badges for the tracker header.
 */
export function StreakBadges({ streaks }) {
  if (!streaks) return null;

  const global = streaks.global;
  const weeklyStreak = global?.weekly_completion?.current || 0;
  const perfectStreak = global?.perfect_week?.current || 0;

  if (weeklyStreak === 0 && perfectStreak === 0) return null;

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {weeklyStreak > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "4px 12px", borderRadius: 8,
          background: "rgba(255,140,0,0.1)",
          border: "1px solid rgba(255,140,0,0.3)",
          fontSize: 12, fontWeight: 700,
          animation: weeklyStreak >= 3 ? "pulse 2s ease-in-out infinite" : "none",
        }}>
          <Flame size={13} style={{ color: "#ff8c00" }} />
          <span style={{ color: "#ff8c00", fontFamily: "'Space Mono', monospace" }}>{weeklyStreak}</span>
          <span style={{ color: "#7a6840", fontWeight: 500 }}>semanas</span>
        </div>
      )}
      {perfectStreak > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "4px 12px", borderRadius: 8,
          background: "rgba(0,200,150,0.08)",
          border: "1px solid rgba(0,200,150,0.25)",
          fontSize: 12, fontWeight: 700,
        }}>
          <Sparkles size={13} style={{ color: "#00C896" }} />
          <span style={{ color: "#00C896", fontFamily: "'Space Mono', monospace" }}>{perfectStreak}</span>
          <span style={{ color: "#4a7868", fontWeight: 500 }}>perfectas</span>
        </div>
      )}
    </div>
  );
}
