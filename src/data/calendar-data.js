export const calendarWeek = [
  {
    day: "Lunes", shortDay: "Lun", totalMin: 90,
    focus: "System Design + DSA",
    blocks: [
      { area: "algoritmos",    label: "LeetCode — 1 problema del tema actual. Sin ver solución hasta intentarlo 20 min.", duration: 30 },
      { area: "system-design", label: "Lectura activa de DDIA o SDI: subraya, toma notas en tu propio lenguaje. Al terminar, dibuja el concepto en Excalidraw.", duration: 60 },
    ],
  },
  {
    day: "Martes", shortDay: "Mar", totalMin: 90,
    focus: "AI Engineering + DSA",
    blocks: [
      { area: "algoritmos",    label: "LeetCode — 1 problema del tema actual. Si no lo resuelves en 25 min, estudia la solución y resuélvelo desde cero al día siguiente.", duration: 30 },
      { area: "ai-engineering", label: "Avanzar en Fast.ai, Hugging Face Course, o construir en el proyecto agéntico / RAG actual.", duration: 60 },
    ],
  },
  {
    day: "Miércoles", shortDay: "Mié", totalMin: 90,
    focus: "Observabilidad + Inglés",
    blocks: [
      { area: "algoritmos",    label: "LeetCode — 1 problema. Priorizar el patrón más débil de la semana.", duration: 30 },
      { area: "observabilidad", label: "Instrumentar, ajustar dashboards, o estudiar el SRE Book. Siempre con el sistema de práctica abierto.", duration: 45 },
      { area: "ingles-tecnico", label: "Escribir un thread técnico en X (5 tweets) o el primer borrador de un párrafo del post en progreso.", duration: 15 },
    ],
  },
  {
    day: "Jueves", shortDay: "Jue", totalMin: 90,
    focus: "System Design + AI",
    blocks: [
      { area: "algoritmos",    label: "LeetCode — 1 problema. Documentar el patrón usado en tu repositorio de soluciones.", duration: 30 },
      { area: "system-design", label: "Resolver un system design challenge completo en Excalidraw: back-of-envelope, componentes, trade-offs.", duration: 45 },
      { area: "ai-engineering", label: "Leer 1 post de Latent Space, Anthropic o AI Engineer community. Escribir 3 bullet points de lo aprendido.", duration: 15 },
    ],
  },
  {
    day: "Viernes", shortDay: "Vie", totalMin: 90,
    focus: "Observabilidad + Inglés",
    blocks: [
      { area: "algoritmos",    label: "LeetCode — 1 problema. Si ya terminaste los del tema actual, avanza al siguiente.", duration: 30 },
      { area: "observabilidad", label: "Revisar alertas, ajustar SLIs, o escribir/actualizar el runbook de la semana.", duration: 30 },
      { area: "ingles-tecnico", label: "Editar o continuar el post técnico en inglés. Meta: publicar 1 post cada 2 semanas.", duration: 30 },
    ],
  },
  {
    day: "Sábado", shortDay: "Sáb", totalMin: 120,
    focus: "DSA intensivo + AI proyecto",
    blocks: [
      { area: "algoritmos",    label: "Sesión intensiva: 2 problemas LeetCode + revisar todas las soluciones de la semana. Identificar el patrón que más cuesta.", duration: 60 },
      { area: "ai-engineering", label: "Sesión hands-on larga: construir, iterar y evaluar el proyecto agéntico o RAG actual. Sin saltar entre temas.", duration: 60 },
    ],
  },
  {
    day: "Domingo", shortDay: "Dom", totalMin: 60,
    focus: "Review + Inglés",
    blocks: [
      { area: "ingles-tecnico", label: "Leer 2 posts técnicos en inglés de referentes. Analizar su estructura y tomar notas del estilo.", duration: 30 },
      { area: "system-design", label: "Revisión semanal: actualizar ADRs, notas de system design, o agenda del roadmap de la semana siguiente.", duration: 30 },
    ],
  },
];
