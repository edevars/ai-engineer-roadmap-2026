import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [logoutHover, setLogoutHover] = useState(false);
  const ref = useRef(null);

  // Close on click-outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (!user) return null;

  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 10px 5px 5px",
          borderRadius: 10,
          border: "1px solid rgba(124,58,237,0.25)",
          background: "rgba(124,58,237,0.08)",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Avatar circle */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7C3AED, #5b21b6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {initial}
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#c4b5fd",
            maxWidth: 100,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          className="hidden sm:inline"
        >
          {user.name}
        </span>
        <ChevronDown
          size={13}
          style={{
            color: "#8b7dcf",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0)",
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="user-dropdown"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            minWidth: 200,
            background: "#151a25",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "12px 0",
            zIndex: 100,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {/* User info */}
          <div style={{ padding: "0 16px 10px" }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#e0e6f0",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#5a6880",
                fontFamily: "'DM Sans', sans-serif",
                marginTop: 2,
              }}
            >
              {user.email}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.07)",
              margin: "0 12px 4px",
            }}
          />

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            onMouseEnter={() => setLogoutHover(true)}
            onMouseLeave={() => setLogoutHover(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "calc(100% - 16px)",
              margin: "4px 8px 0",
              padding: "8px 10px",
              borderRadius: 8,
              border: "none",
              background: logoutHover ? "rgba(255,80,80,0.1)" : "transparent",
              color: logoutHover ? "#ff6b6b" : "#8a95a8",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "background 0.15s, color 0.15s",
              textAlign: "left",
            }}
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
