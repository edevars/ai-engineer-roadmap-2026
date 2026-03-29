import { createRoute, Link } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import {
  Layers, Activity, Cpu, Code2, Globe, Cloud, Wand2,
  Target, Zap, BookOpen, TrendingUp, ArrowRight,
  Clock, Brain, Flame, CheckCircle2, BarChart2,
} from "lucide-react";
import { roadmapData } from "../data/roadmap-data";
import { AREA_META } from "../data/area-meta";

const AREAS = [
  {
    id: "system-design", icon: Layers,
    headline: "System Design",
    desc: "Aprende a diseñar sistemas completos y tomar decisiones de arquitectura con criterio. Libros de referencia, diagramas reales y documentos de decisión técnica (ADR).",
    months: "6 meses", phases: 3,
  },
  {
    id: "observabilidad", icon: Activity,
    headline: "Observabilidad & SRE",
    desc: "Registros, métricas y trazas con OpenTelemetry para entender qué pasa dentro de tus sistemas. Objetivos de confiabilidad, presupuestos de error y análisis de incidentes.",
    months: "3 meses", phases: 3,
  },
  {
    id: "ai-engineering", icon: Cpu,
    headline: "AI Engineering",
    desc: "Desde los fundamentos del aprendizaje profundo hasta sistemas de IA en producción: búsqueda semántica, evaluación de modelos, agentes autónomos y artículos de referencia.",
    months: "8 meses", phases: 4,
  },
  {
    id: "algoritmos", icon: Code2,
    headline: "Algoritmos & LeetCode",
    desc: "Más de 150 problemas seleccionados con dificultad progresiva. Estructuras de datos, grafos y programación dinámica — los patrones clave en entrevistas técnicas.",
    months: "6 meses", phases: 3,
  },
  {
    id: "ingles-tecnico", icon: Globe,
    headline: "Inglés Técnico",
    desc: "Escribir artículos técnicos, publicar en redes profesionales y participar en comunidades globales. Construir presencia y hábito de comunicación en inglés.",
    months: "3 meses", phases: 3,
  },
  {
    id: "ai-code-tools", icon: Wand2,
    headline: "IA para Código",
    desc: "Dominar Copilot, Cursor, Claude Code y Windsurf. Construir MCP servers, diseñar flujos agénticos y dominar prompt engineering para resultados predecibles.",
    months: "4 meses", phases: 4,
  },
];

const PRINCIPLES = [
  { icon: Clock, title: "Consistencia > Intensidad", body: "30 minutos diarios superan 4 horas esporádicas. El cerebro construye conexiones con repetición espaciada, no con maratones." },
  { icon: Target, title: "Producir es obligatorio", body: "Cada sesión genera algo tangible: un diagrama, un commit, un documento de decisión, una solución. Leer sin producir es ilusión de progreso." },
  { icon: Brain, title: "Profundidad antes que amplitud", body: "60 minutos de concentración en un solo tema superan cuatro sesiones de 15 saltando entre áreas. Dominar algo requiere inmersión." },
  { icon: Flame, title: "Entregables verificables", body: "Cada fase incluye mini-entregables que prueban que el conocimiento es real. Si no puedes explicarlo sin notas, aún no lo dominas." },
];

const METHODOLOGY = [
  { num: "01", title: "Calendario semanal estructurado", body: "Cada día tiene bloques asignados a áreas específicas. 10.5 horas semanales en sesiones de 15 a 60 minutos, optimizadas para retención a largo plazo.", color: "#00D4FF" },
  { num: "02", title: "Progreso automático medible", body: "Cada bloque completado se registra en el tracker automáticamente. Consulta tu consistencia, rachas y ritmo por área — sin marcas manuales, solo trabajo real.", color: "#7C3AED" },
  { num: "03", title: "Fases con fechas definidas", body: "Cada área se divide en fases con fechas concretas. Siempre sabes qué estudiar en cada momento y si vas al ritmo esperado.", color: "#FFB800" },
  { num: "04", title: "Recursos seleccionados y propios", body: "Cada tema incluye un recurso específico (capítulo, video, documentación) y un mini-entregable. Sin ambigüedad: sabes qué estudiar y cómo verificar tu aprendizaje.", color: "#FF6B35" },
];

const HomePage = () => {
  const totalObjectives = roadmapData.reduce((acc, area) =>
    acc + area.phases.reduce((a, p) => a + p.objectives.length, 0), 0
  );
  const totalPhases = roadmapData.reduce((acc, area) => acc + area.phases.length, 0);
  const totalResources = roadmapData.reduce((acc, area) =>
    acc + area.phases.reduce((a, p) => a + p.resources.length, 0), 0
  );

  return (
    <div className="fade-up">
      {/* ════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 70%)",
        }} />

        <div className="relative z-10 max-w-[860px] mx-auto px-4 sm:px-10 pt-12 sm:pt-20 pb-10 sm:pb-16 text-center">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full mb-6" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <Zap size={13} style={{ color: "#a78bfa" }} />
            <span className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase" style={{ color: "#a78bfa" }}>Roadmap de 6–8 meses</span>
          </div>

          <h1 className="text-[28px] sm:text-[48px] font-bold leading-tight mb-4" style={{
            background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #00D4FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Lleva tu ingeniería<br className="hidden sm:block" /> al siguiente nivel
          </h1>

          <p className="text-[15px] sm:text-lg leading-relaxed mb-8 max-w-[600px] mx-auto" style={{ color: "#7a8898" }}>
            Un plan de estudio estructurado y medible para dominar diseño de sistemas, algoritmos, inteligencia artificial aplicada, observabilidad e inglés técnico — con seguimiento semanal y progreso automático.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-3 sm:gap-5 flex-wrap mb-8">
            {[
              { value: "6", label: "áreas", color: "#a78bfa" },
              { value: String(totalPhases), label: "fases", color: "#00D4FF" },
              { value: String(totalObjectives), label: "temas", color: "#FFB800" },
              { value: String(totalResources), label: "recursos", color: "#00C896" },
              { value: "150+", label: "LeetCode", color: "#FF6B35" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl sm:text-3xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] sm:text-xs" style={{ color: "#4a5a6a" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex justify-center gap-3 flex-wrap">
            <Link to="/roadmap" className="inline-flex items-center gap-2 py-3 px-6 rounded-lg font-semibold text-sm sm:text-base no-underline"
              style={{ background: "linear-gradient(135deg, #7C3AED, #00D4FF)", color: "#fff", border: "none" }}>
              <BookOpen size={16} /> Explorar el roadmap
            </Link>
            <Link to="/tracker" className="inline-flex items-center gap-2 py-3 px-6 rounded-lg font-semibold text-sm sm:text-base no-underline"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#c0ccd8" }}>
              <BarChart2 size={16} /> Ver el tracker
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          6 AREAS
      ════════════════════════════════════════════════ */}
      <section className="max-w-[960px] mx-auto px-4 sm:px-10 py-10 sm:py-16">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-[32px] font-bold mb-2" style={{ color: "#e0e6f0" }}>6 áreas + 1 opcional, un solo objetivo</h2>
          <p className="text-[13px] sm:text-base" style={{ color: "#5a6880" }}>Cada área desarrolla una competencia clave para el crecimiento profesional senior.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {AREAS.map(a => {
            const meta = AREA_META[a.id];
            return (
              <Link to="/roadmap" key={a.id} className="card-hover rounded-[14px] p-5 sm:p-6 no-underline group" style={{
                background: meta.color + "08",
                border: `1px solid ${meta.color}20`,
              }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: meta.color + "18" }}>
                    <a.icon size={20} style={{ color: meta.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold m-0" style={{ color: meta.color }}>{a.headline}</h3>
                    <span className="text-[10px] sm:text-xs font-mono" style={{ color: "#4a5a6a" }}>{a.months} · {a.phases} fases</span>
                  </div>
                  <ArrowRight size={14} className="ml-auto" style={{ color: meta.color + "60" }} />
                </div>
                <p className="text-[12px] sm:text-[13px] leading-relaxed m-0" style={{ color: "#6a7888" }}>
                  {a.desc}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Cloud AWS — Optional */}
        <div className="mt-6 sm:mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ flex: 1, height: 1, background: "rgba(255,149,0,0.2)" }} />
            <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold font-mono uppercase tracking-wider" style={{ color: "#FF9500" }}>
              <Cloud size={12} /> Roadmap Opcional
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,149,0,0.2)" }} />
          </div>

          <Link to="/roadmap" className="card-hover rounded-[14px] p-5 sm:p-6 no-underline group block" style={{
            background: "#FF950008",
            border: "1px solid #FF950020",
          }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: "#FF950018" }}>
                <Cloud size={20} style={{ color: "#FF9500" }} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold m-0" style={{ color: "#FF9500" }}>
                  Cloud AWS
                  <span className="ml-2 text-[9px] sm:text-[10px] font-mono py-0.5 px-1.5 rounded" style={{ background: "#FF950018", border: "1px solid #FF950044", color: "#FF9500" }}>OPCIONAL</span>
                </h3>
                <span className="text-[10px] sm:text-xs font-mono" style={{ color: "#4a5a6a" }}>8 meses · 5 áreas · 15 fases</span>
              </div>
              <ArrowRight size={14} className="ml-auto" style={{ color: "#FF950060" }} />
            </div>
            <p className="text-[12px] sm:text-[13px] leading-relaxed m-0" style={{ color: "#6a7888" }}>
              Desde los fundamentos hasta la arquitectura de alta disponibilidad en AWS: redes, cómputo, almacenamiento y preparación para certificación cloud.
            </p>
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          METHODOLOGY
      ════════════════════════════════════════════════ */}
      <section style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-[960px] mx-auto px-4 sm:px-10 py-10 sm:py-16">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-[32px] font-bold mb-2" style={{ color: "#e0e6f0" }}>Cómo funciona</h2>
            <p className="text-[13px] sm:text-base" style={{ color: "#5a6880" }}>Un sistema diseñado para construir hábito y medir progreso real.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {METHODOLOGY.map((m, i) => (
              <div key={i} className="rounded-[14px] p-5 sm:p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-start gap-4">
                  <span className="text-2xl sm:text-3xl font-bold font-mono shrink-0 leading-none" style={{ color: m.color + "40" }}>{m.num}</span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold mb-1.5 m-0" style={{ color: m.color }}>{m.title}</h3>
                    <p className="text-[12px] sm:text-[13px] leading-relaxed m-0" style={{ color: "#6a7888" }}>{m.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          PRINCIPLES
      ════════════════════════════════════════════════ */}
      <section className="max-w-[960px] mx-auto px-4 sm:px-10 py-10 sm:py-16">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-[32px] font-bold mb-2" style={{ color: "#e0e6f0" }}>Principios fundamentales</h2>
          <p className="text-[13px] sm:text-base" style={{ color: "#5a6880" }}>Las reglas que separan estudiar de aprender de verdad.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {PRINCIPLES.map((p, i) => (
            <div key={i} className="rounded-[14px] p-5 flex items-start gap-4" style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.12)" }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(167,139,250,0.12)" }}>
                <p.icon size={18} style={{ color: "#a78bfa" }} />
              </div>
              <div>
                <h3 className="text-sm sm:text-[15px] font-bold mb-1 m-0" style={{ color: "#c0ccd8" }}>{p.title}</h3>
                <p className="text-[12px] sm:text-[13px] leading-relaxed m-0" style={{ color: "#5a6880" }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          WEEKLY SCHEDULE PREVIEW
      ════════════════════════════════════════════════ */}
      <section style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-[960px] mx-auto px-4 sm:px-10 py-10 sm:py-16">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-[32px] font-bold mb-2" style={{ color: "#e0e6f0" }}>Una semana típica</h2>
            <p className="text-[13px] sm:text-base" style={{ color: "#5a6880" }}>10.5 horas distribuidas en 7 días. Cada sesión tiene un propósito claro.</p>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {[
              { day: "Lun", blocks: [{ area: "algoritmos", min: 30 }, { area: "system-design", min: 60 }] },
              { day: "Mar", blocks: [{ area: "algoritmos", min: 30 }, { area: "ai-engineering", min: 60 }] },
              { day: "Mié", blocks: [{ area: "algoritmos", min: 30 }, { area: "observabilidad", min: 45 }, { area: "ingles-tecnico", min: 15 }] },
              { day: "Jue", blocks: [{ area: "algoritmos", min: 30 }, { area: "system-design", min: 45 }, { area: "ai-engineering", min: 15 }] },
              { day: "Vie", blocks: [{ area: "algoritmos", min: 30 }, { area: "observabilidad", min: 30 }, { area: "ingles-tecnico", min: 30 }] },
              { day: "Sáb", blocks: [{ area: "algoritmos", min: 60 }, { area: "ai-engineering", min: 60 }] },
              { day: "Dom", blocks: [{ area: "ingles-tecnico", min: 30 }, { area: "system-design", min: 30 }] },
            ].map((d, i) => (
              <div key={i} className="rounded-[10px] p-2 sm:p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="text-[9px] sm:text-[11px] font-bold font-mono uppercase text-center mb-2" style={{ color: "#4a5a6a" }}>{d.day}</div>
                <div className="flex flex-col gap-1">
                  {d.blocks.map((b, j) => {
                    const meta = AREA_META[b.area];
                    return (
                      <div key={j} className="rounded-[4px] py-0.5 sm:py-1 px-1" style={{ background: meta.color + "18" }}>
                        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                          <meta.IconC size={8} style={{ color: meta.color }} />
                          <span className="text-[7px] sm:text-[9px] font-mono font-bold" style={{ color: meta.color }}>{b.min}m</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <span className="text-xs sm:text-sm font-mono" style={{ color: "#3a4a5a" }}>630 min/semana · Algoritmos todos los días · Sesiones largas los fines de semana</span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          WHAT YOU'LL BUILD
      ════════════════════════════════════════════════ */}
      <section className="max-w-[960px] mx-auto px-4 sm:px-10 py-10 sm:py-16">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-[32px] font-bold mb-2" style={{ color: "#e0e6f0" }}>Qué vas a construir</h2>
          <p className="text-[13px] sm:text-base" style={{ color: "#5a6880" }}>Entregables concretos que demuestran competencia real, no solo horas de estudio.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Layers, color: "#00D4FF", title: "Portafolio de diseño de sistemas", items: ["8+ diagramas comentados", "5+ documentos de decisión (ADR) publicados", "Diseños de arquitectura completos en Excalidraw"] },
            { icon: Code2, color: "#FF6B35", title: "Repositorio de algoritmos", items: ["150+ soluciones documentadas", "Patrones categorizados", "Complejidad analizada por problema"] },
            { icon: Cpu, color: "#7C3AED", title: "Proyectos de inteligencia artificial", items: ["Pipeline de búsqueda semántica (RAG) funcional", "Sistema con agentes autónomos y evaluación", "Artículos de investigación resumidos y replicados"] },
            { icon: Activity, color: "#FFB800", title: "Stack de observabilidad", items: ["Dashboards con indicadores de confiabilidad reales", "Guías de respuesta a incidentes documentadas", "Alertas y presupuestos de error configurados"] },
            { icon: Globe, color: "#00C896", title: "Presencia en inglés", items: ["Artículos técnicos publicados", "Publicaciones en X con interacción real", "Participación activa en comunidades"] },
            { icon: Wand2, color: "#E91E63", title: "Ecosistema IA para código", items: ["MCP servers publicados en GitHub", "Workflows agénticos productivos documentados", "Post técnico con métricas de ROI reales"] },
            { icon: TrendingUp, color: "#a78bfa", title: "Historial de progreso medible", items: ["Registro de consistencia semanal", "Rachas de estudio documentadas", "Línea de tiempo de progreso por fase"] },
          ].map((d, i) => (
            <div key={i} className="rounded-[14px] p-5" style={{ background: d.color + "06", border: `1px solid ${d.color}15` }}>
              <d.icon size={20} style={{ color: d.color, marginBottom: 10 }} />
              <h3 className="text-sm sm:text-[15px] font-bold mb-2 m-0" style={{ color: d.color }}>{d.title}</h3>
              <ul className="m-0 pl-0 list-none flex flex-col gap-1.5">
                {d.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-[11px] sm:text-[13px]" style={{ color: "#5a6880" }}>
                    <CheckCircle2 size={12} className="shrink-0 mt-0.5" style={{ color: d.color + "80" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════ */}
      <section className="max-w-[960px] mx-auto px-4 sm:px-10 pb-16 sm:pb-24">
        <div className="rounded-2xl p-8 sm:p-12 text-center" style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(0,212,255,0.06))",
          border: "1px solid rgba(124,58,237,0.2)",
        }}>
          <h2 className="text-xl sm:text-[28px] font-bold mb-3" style={{ color: "#e0e6f0" }}>El mejor momento para empezar fue ayer.<br />El segundo mejor es hoy.</h2>
          <p className="text-[13px] sm:text-base mb-6" style={{ color: "#5a6880" }}>
            Explora el roadmap completo, crea tu cuenta y activa el tracker para comenzar tu transformación.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link to="/roadmap" className="inline-flex items-center gap-2 py-3 px-6 rounded-lg font-semibold text-sm sm:text-base no-underline"
              style={{ background: "linear-gradient(135deg, #7C3AED, #00D4FF)", color: "#fff", border: "none" }}>
              <BookOpen size={16} /> Explorar el roadmap
            </Link>
            <Link to="/tracker" className="inline-flex items-center gap-2 py-3 px-6 rounded-lg font-semibold text-sm sm:text-base no-underline"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#c0ccd8" }}>
              <BarChart2 size={16} /> Comenzar tracking
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
