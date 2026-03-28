# Roadmap 2026 — Skill Upgrade Plan

A personal 6-month skill upgrade roadmap built as a static single-page app. Browse learning areas, track weekly schedules, and check off objectives as you go.

## Features

- **Roadmap Browser** — Navigate 5 learning areas (System Design, Observabilidad, AI Engineering, Algoritmos, Inglés), each broken into phases with objectives, resources, and LeetCode problems
- **Weekly Tracker** — 7-day calendar with time blocks per area and a progress checklist
- **Dark theme** with color-coded areas
- **Mobile responsive** (640px breakpoint)

## Tech Stack

- [React 19](https://react.dev/)
- [Vite 6](https://vite.dev/)
- [TanStack Router v1](https://tanstack.com/router) (code-based routing)
- [Lucide React](https://lucide.dev/) (icons)

No backend — all content is hardcoded in `src/data/`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `npm run dev`       | Start dev server with HMR        |
| `npm run build`     | Production build to `dist/`      |
| `npm run preview`   | Preview production build locally |

## Project Structure

```
src/
├── main.jsx              # Router setup and app entry
├── routes/
│   ├── __root.jsx        # Root layout (header + navigation)
│   ├── index.jsx         # / — Roadmap browser
│   └── tracker.jsx       # /tracker — Weekly calendar + progress
├── components/
│   ├── PhaseCard.jsx
│   ├── ObjectiveItem.jsx
│   ├── ResourceChip.jsx
│   └── LCChip.jsx
└── data/
    ├── roadmap-data.jsx  # Learning areas, phases, objectives
    ├── area-meta.js      # Area colors, icons, labels
    └── calendar-data.js  # Weekly schedule
```

## License

Private project.
