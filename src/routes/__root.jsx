import { createRootRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { BookText, BarChart2 } from "lucide-react";
import { useIsMobile } from "../hooks/use-is-mobile";

const RootLayout = () => {
  const isMobile = useIsMobile();
  const { location } = useRouterState();
  const currentPath = location.pathname;

  const navBtnStyle = (isActive, accent) => ({
    display: "flex", alignItems: "center", gap: "6px",
    padding: isMobile ? "7px 14px" : "8px 20px",
    background: isActive ? (accent || "rgba(255,255,255,0.1)") : "transparent",
    border: `1px solid ${isActive ? "rgba(255,255,255,0.2)" : "transparent"}`,
    borderRadius: "8px",
    color: isActive ? "#e0e6f0" : "#5a6880",
    fontSize: isMobile ? "12px" : "13px", fontWeight: isActive ? 700 : 500,
    cursor: "pointer", fontFamily: "'DM Sans', system-ui, sans-serif",
    whiteSpace: "nowrap",
    textDecoration: "none",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0d12", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#e0e6f0" }}>
      {/* ── HEADER with top-level page nav ── */}
      <div className="sticky-header" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: isMobile ? "20px 16px" : "24px 40px", background: "rgba(10,13,18,0.82)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", color: "#4a90b8", fontSize: isMobile ? "9px" : "11px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>
              Roadmap 2026 — Ingeniero de Clase Mundial
            </div>
            <h1 style={{ fontSize: isMobile ? "20px" : "26px", fontWeight: 700, background: "linear-gradient(135deg, #ffffff 0%, #8899bb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>
              Skill Upgrade Plan
            </h1>
          </div>
          {/* Page switcher */}
          <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "4px" }}>
            <Link to="/" className="nav-btn" style={navBtnStyle(currentPath === "/")}>
              <BookText size={14} />
              {!isMobile && "Roadmap"}
            </Link>
            <Link to="/tracker" className="nav-btn" style={navBtnStyle(currentPath === "/tracker", "rgba(167,139,250,0.18)")}>
              <BarChart2 size={14} />
              {!isMobile && "Tracker"}
            </Link>
          </div>
        </div>
      </div>

      <div className="fade-up">
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
