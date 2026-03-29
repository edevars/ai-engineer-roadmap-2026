import { createRootRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Home, BookText, BarChart2, LogIn, Rocket } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { UserMenu } from "../components/UserMenu";
import { AuthModal } from "../components/AuthModal";
import { api } from "../lib/api";

const RootLayout = () => {
  const { location } = useRouterState();
  const currentPath = location.pathname;
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [hasStartDate, setHasStartDate] = useState(null);

  useEffect(() => {
    if (!user) { setHasStartDate(null); return; }
    api.getSettings()
      .then(s => setHasStartDate(!!s.roadmap_start_date))
      .catch(() => setHasStartDate(null));
  }, [user]);

  const isHome = currentPath === "/";
  const isRoadmap = currentPath === "/roadmap";
  const isTracker = currentPath === "/tracker";
  return (
    <div className="min-h-screen bg-[#0a0d12] font-sans text-[#e0e6f0]">
      {/* ── HEADER with top-level page nav ── */}
      <div className="sticky-header py-5 px-4 sm:py-6 sm:px-10" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(10,13,18,0.82)" }}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <Link to="/" className="no-underline">
            <div className="font-mono text-[9px] sm:text-[13px] tracking-widest uppercase mb-1.5" style={{ color: "#4a90b8" }}>
              Roadmap 2026 — Ingeniería de Clase Mundial
            </div>
            <h1 className="text-xl sm:text-[30px] font-bold tracking-tight bg-gradient-to-br from-white to-[#8899bb] bg-clip-text" style={{ WebkitTextFillColor: "transparent" }}>
              Skill Upgrade Plan
            </h1>
          </Link>
          {/* Page switcher + Auth */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-1 rounded-[10px] p-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Link to="/" className={`nav-btn flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-5 rounded-lg cursor-pointer font-sans whitespace-nowrap no-underline text-xs sm:text-[15px] ${isHome ? "font-bold" : "font-medium"}`}
                style={{ background: isHome ? "rgba(255,255,255,0.1)" : "transparent", border: `1px solid ${isHome ? "rgba(255,255,255,0.2)" : "transparent"}`, color: isHome ? "#e0e6f0" : "#5a6880" }}>
                <Home size={14} />
                <span className="hidden sm:inline">Inicio</span>
              </Link>
              <Link to="/roadmap" className={`nav-btn flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-5 rounded-lg cursor-pointer font-sans whitespace-nowrap no-underline text-xs sm:text-[15px] ${isRoadmap ? "font-bold" : "font-medium"}`}
                style={{ background: isRoadmap ? "rgba(255,255,255,0.1)" : "transparent", border: `1px solid ${isRoadmap ? "rgba(255,255,255,0.2)" : "transparent"}`, color: isRoadmap ? "#e0e6f0" : "#5a6880" }}>
                <BookText size={14} />
                <span className="hidden sm:inline">Roadmap</span>
              </Link>
              <Link to="/tracker" className={`nav-btn flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-5 rounded-lg cursor-pointer font-sans whitespace-nowrap no-underline text-xs sm:text-[15px] ${isTracker ? "font-bold" : "font-medium"}`}
                style={{ background: isTracker ? "rgba(167,139,250,0.18)" : "transparent", border: `1px solid ${isTracker ? "rgba(255,255,255,0.2)" : "transparent"}`, color: isTracker ? "#e0e6f0" : "#5a6880" }}>
                <BarChart2 size={14} />
                <span className="hidden sm:inline">Tracker</span>
              </Link>
            </div>
            {user && hasStartDate === false && (
              <Link to="/tracker"
                className="nav-btn flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-4 rounded-lg cursor-pointer font-sans whitespace-nowrap no-underline text-xs sm:text-[14px] font-semibold"
                style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.5)", color: "#a78bfa" }}>
                <Rocket size={13} /> Empezar
              </Link>
            )}
            {user ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="auth-btn flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-4 rounded-lg cursor-pointer font-sans whitespace-nowrap text-xs sm:text-[14px] font-semibold"
                style={{ background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.45)", color: "#a78bfa" }}
              >
                <LogIn size={13} />
                <span className="hidden sm:inline">Entrar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="fade-up">
        <Outlet />
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
