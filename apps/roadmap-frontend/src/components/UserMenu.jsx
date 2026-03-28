import { useState } from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [hover, setHover] = useState(false);

  if (!user) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)" }}>
        <User size={13} style={{ color: "#a78bfa" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa", fontFamily: "'DM Sans', sans-serif" }}>
          {user.name}
        </span>
      </div>
      <button
        onClick={logout}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "5px 10px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.08)",
          background: hover ? "rgba(255,100,100,0.1)" : "rgba(255,255,255,0.04)",
          color: hover ? "#ff6b6b" : "#5a6880",
          fontSize: 12,
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <LogOut size={12} />
      </button>
    </div>
  );
}
