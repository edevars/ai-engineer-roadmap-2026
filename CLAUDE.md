# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
```

No test runner, linter, or formatter is configured.

## Architecture

Static single-page app for a personal 6-month skill upgrade roadmap. Vite 6 + React 19 + TanStack Router v1 (code-based routing, no file-based plugin). All content is hardcoded — no backend or API.

### Routing

Manual route tree in `src/main.jsx` using `createRoute` + `createRootRoute` (not `createFileRoute`, which requires a vite plugin not installed here).

- `src/routes/__root.jsx` — Root layout with header and page navigation (`<Outlet />`)
- `src/routes/index.jsx` — `/` — Roadmap browser (area tabs → phase cards → expandable objectives)
- `src/routes/tracker.jsx` — `/tracker` — Weekly calendar + total roadmap progress checklist

### Data layer

All in `src/data/`, no database:

- `roadmap-data.jsx` (~950 lines) — 5 learning areas, each with phases containing objectives, resources, and LeetCode problems. Also exports `AreaIcon` component.
- `area-meta.js` — Maps area IDs → `{ color, icon, label, IconC }` used by the tracker.
- `calendar-data.js` — 7-day weekly schedule with time blocks per area.

### Components

`src/components/` — Small, presentational:
- `PhaseCard` → `ObjectiveItem` → `ResourceChip` / `LCChip`

### State

All local `useState` — no Context, no Redux, no persistence (tracker checkboxes reset on reload).

## Styling

100% inline styles via `style={}` objects. The only CSS file is `src/index.css` (reset, fonts, scrollbar, `.tab-nav`, `.fade-up` animation).

Key conventions:
- Dark theme: background `#0a0d12`, text `#e0e6f0`
- Area colors: `#00D4FF` (System Design), `#FFB800` (Observabilidad), `#7C3AED` (AI Engineering), `#FF6B35` (Algoritmos), `#00C896` (Inglés)
- Hex opacity suffix pattern: `area.color + "18"` for backgrounds, `+ "55"` for borders
- Fonts: `'DM Sans'` (body), `'Space Mono'` (monospace/numbers)
- Mobile breakpoint: 640px via `useIsMobile()` hook — conditionally adjusts grid columns, padding, and font sizes
- Hover states via `onMouseEnter`/`onMouseLeave` (not CSS `:hover`)

## Git

Use [gitmoji](https://gitmoji.dev/) prefixes in all commit messages (e.g. `✨ Add new feature`, `🐛 Fix bug`, `♻️ Refactor code`, `💄 Update styles`).

## Language

UI text is in Spanish. The `<html lang="es">` attribute is set in `index.html`.
