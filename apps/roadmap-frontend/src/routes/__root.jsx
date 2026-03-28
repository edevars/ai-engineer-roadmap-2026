import { createRootRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { BookText, BarChart2, Cloud, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { UserMenu } from "../components/UserMenu";
import { AuthModal } from "../components/AuthModal";

const RootLayout = () => {
  const { location } = useRouterState();
  const currentPath = location.pathname;
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const isRoadmap = currentPath === "/";
  const isTracker = currentPath === "/tracker";
  const isCloudAws = currentPath === "/cloud-aws";

  return (
    <div className="min-h-screen bg-[#0a0d12] font-sans text-[#e0e6f0]">
      {/* ── HEADER with top-level page nav ── */}
      <div className="sticky-header py-5 px-4 sm:py-6 sm:px-10" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(10,13,18,0.82)" }}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="font-mono text-[9px] sm:text-[13px] tracking-widest uppercase mb-1.5" style={{ color: "#4a90b8" }}>
              Roadmap 2026 — Ingeniero de Clase Mundial
            </div>
            <h1 className="text-xl sm:text-[30px] font-bold tracking-tight bg-gradient-to-br from-white to-[#8899bb] bg-clip-text" style={{ WebkitTextFillColor: "transparent" }}>
              Skill Upgrade Plan
            </h1>
          </div>
          {/* Page switcher + Auth */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-1 rounded-[10px] p-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Link to="/" className={`nav-btn flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-5 rounded-lg cursor-pointer font-sans whitespace-nowrap no-underline text-xs sm:text-[15px] ${isRoadmap ? "font-bold" : "font-medium"}`}
                style={{ background: isRoadmap ? "rgba(255,255,255,0.1)" : "transparent", border: `1px solid ${isRoadmap ? "rgba(255,255,255,0.2)" : "transparent"}`, color: isRoadmap ? "#e0e6f0" : "#5a6880" }}>
                <BookText size={14} />
                <span className="hidden sm:inline">Roadmap</span>
              </Link>
              <Link to="/tracker" className={`nav-btn flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-5 rounded-lg cursor-pointer font-sans whitespace-nowrap no-underline text-xs sm:text-[15px] ${isTracker ? "font-bold" : "font-medium"}`}
                style={{ background: isTracker ? "rgba(167,139,250,0.18)" : "transparent", border: `1px solid ${isTracker ? "rgba(255,255,255,0.2)" : "transparent"}`, color: isTracker ? "#e0e6f0" : "#5a6880" }}>
                <BarChart2 size={14} />
                <span className="hidden sm:inline">Tracker</span>
              </Link>
              <Link to="/cloud-aws" className={`nav-btn flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-5 rounded-lg cursor-pointer font-sans whitespace-nowrap no-underline text-xs sm:text-[15px] ${isCloudAws ? "font-bold" : "font-medium"}`}
                style={{ background: isCloudAws ? "rgba(255,149,0,0.18)" : "transparent", border: `1px solid ${isCloudAws ? "rgba(255,255,255,0.2)" : "transparent"}`, color: isCloudAws ? "#e0e6f0" : "#5a6880" }}>
                <Cloud size={14} />
                <span className="hidden sm:inline">Cloud AWS</span>
              </Link>
            </div>
            {user ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="nav-btn flex items-center gap-1.5 py-[7px] px-3.5 sm:py-2 sm:px-4 rounded-lg cursor-pointer font-sans whitespace-nowrap text-xs sm:text-[14px] font-medium"
                style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa" }}
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
