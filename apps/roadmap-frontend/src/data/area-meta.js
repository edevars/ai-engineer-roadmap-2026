import { Layers, Activity, Cpu, Code2, Globe, Wand2 } from "lucide-react";
import { HIDDEN_AREA_IDS } from "./roadmap-data.jsx";

// Metadatos completos (se preservan aunque algunas áreas estén ocultas del UI).
const _AREA_META_ALL = {
  "system-design":  { color: "#00D4FF", label: "System Design",  IconC: Layers },
  "observabilidad": { color: "#FFB800", label: "Observabilidad", IconC: Activity },
  "ai-engineering": { color: "#7C3AED", label: "AI Engineering", IconC: Cpu },
  "algoritmos":     { color: "#FF6B35", label: "DSA / LeetCode", IconC: Code2 },
  "ingles-tecnico": { color: "#00C896", label: "Inglés Técnico C1", IconC: Globe },
  "ai-code-tools": { color: "#E91E63", label: "IA para Código", IconC: Wand2 },
};

// AREA_META visible en el frontend: excluye las áreas ocultas declaradas en roadmap-data.jsx.
export const AREA_META = Object.fromEntries(
  Object.entries(_AREA_META_ALL).filter(([id]) => !HIDDEN_AREA_IDS.has(id)),
);

export { _AREA_META_ALL };
