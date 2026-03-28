import { useState } from "react";
import { X, Rocket, AlertTriangle } from "lucide-react";
import { api } from "../lib/api";

export function StartRoadmapModal({ open, onClose, onStarted, isRestart = false }) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [submitting, setSubmitting] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleStart = async () => {
    setError("");
    setSubmitting(true);
    try {
      if (isRestart) {
        await api.restartProgress();
      } else {
        await api.updateSettings({ roadmap_start_date: date });
      }
      onStarted(isRestart ? today : date);
      onClose();
    } catch (err) {
      setError(err.error || "Error inesperado");
    } finally {
      setSubmitting(false);
      setConfirmRestart(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#e0e6f0",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#111620", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 400, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: "#5a6880", cursor: "pointer", padding: 4 }}>
          <X size={18} />
        </button>

        {!isRestart ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Rocket size={24} style={{ color: "#7C3AED" }} />
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#e0e6f0" }}>Empezar mi roadmap</h2>
            </div>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#5a6880", lineHeight: 1.5 }}>
              Elige la fecha en la que empezaste (o empezarás) tu roadmap. Esto habilita el seguimiento de timeline, ritmo y rachas.
            </p>

            <label style={{ display: "block", fontSize: 13, color: "#7a8898", marginBottom: 6 }}>Fecha de inicio</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ ...inputStyle, colorScheme: "dark" }}
            />

            {error && <div style={{ fontSize: 13, color: "#ff6b6b", padding: "8px 0" }}>{error}</div>}

            <button
              onClick={handleStart}
              disabled={submitting}
              style={{
                width: "100%",
                marginTop: 16,
                padding: "12px 0",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg, #7C3AED, #00D4FF)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                cursor: submitting ? "wait" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "..." : "Empezar"}
            </button>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <AlertTriangle size={24} style={{ color: "#ff6b6b" }} />
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#ff6b6b" }}>Reiniciar progreso</h2>
            </div>

            {!confirmRestart ? (
              <>
                <p style={{ margin: "0 0 20px", fontSize: 13, color: "#5a6880", lineHeight: 1.5 }}>
                  Esto eliminará <strong style={{ color: "#e0e6f0" }}>todo tu progreso</strong>: checkboxes semanales, fases completadas y rachas. La fecha de inicio se establecerá a hoy.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={onClose} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "#7a8898", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Cancelar
                  </button>
                  <button onClick={() => setConfirmRestart(true)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid rgba(255,100,100,0.3)", background: "rgba(255,100,100,0.1)", color: "#ff6b6b", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Sí, reiniciar
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={{ margin: "0 0 16px", fontSize: 14, color: "#ff6b6b", fontWeight: 600 }}>
                  ¿Estás seguro? Esta acción no se puede deshacer.
                </p>
                {error && <div style={{ fontSize: 13, color: "#ff6b6b", padding: "6px 0" }}>{error}</div>}
                <button
                  onClick={handleStart}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    borderRadius: 8,
                    border: "none",
                    background: "#ff4444",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: submitting ? "wait" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? "..." : "Confirmar reinicio"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
