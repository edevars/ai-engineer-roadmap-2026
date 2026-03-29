# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                    # Start local dev server (wrangler dev)
pnpm deploy                 # Deploy to Cloudflare Workers
pnpm db:migrate:local       # Run all migrations on local D1
pnpm db:migrate:remote      # Run all migrations on remote D1
pnpm db:migrate:local:v2    # Run only 0002 migration locally
pnpm db:migrate:remote:v2   # Run only 0002 migration remotely
```

No test runner, linter, or formatter is configured.

## Stack

Hono v4 on Cloudflare Workers. Cloudflare D1 (SQLite) for persistence. JWT auth via `jose`. Password hashing via PBKDF2-SHA256 (Web Crypto API). TypeScript 5.7. Deployed with Wrangler.

## Architecture

### Entry point & routing

`src/index.ts` creates a Hono app typed with `Env` (from `src/types.ts`) and mounts routes under `/api/v1/`:

| Prefix | Route file | Description |
|--------|-----------|-------------|
| `/api/v1/auth` | `routes/auth.ts` | Register, login, `/me` |
| `/api/v1/progress/weekly` | `routes/weekly.ts` | Weekly cell-level progress (toggle, get by week/range) |
| `/api/v1/progress/phases` | `routes/phases.ts` | Phase completion tracking (toggle, get by roadmap) |
| `/api/v1/settings` | `routes/settings.ts` | User settings, roadmap start date, restart |
| `/api/v1/streaks` | `routes/streaks.ts` | Streak retrieval and computation |

### Type system

`src/types.ts` defines two key types:

- `Env` — Hono env with `Bindings: { DB: D1Database, JWT_SECRET: string }` and `Variables: { user: AuthUser }`
- `AuthUser` — `{ id, email, name }` extracted from JWT and set by auth middleware

### Auth flow

- `src/lib/password.ts` — PBKDF2-SHA256, 100k iterations, 16-byte random salt
- `src/lib/jwt.ts` — HS256 JWT via jose, 30-day expiration
- `src/middleware/auth.ts` — Validates `Authorization: Bearer <token>`, sets `c.get("user")`
- Public endpoints: `POST /auth/register`, `POST /auth/login`
- All other routes require auth middleware

### Middleware

- CORS (`src/middleware/cors.ts`) — Applied globally. Allows `localhost:5173` and `localhost:4173`.
- Auth (`src/middleware/auth.ts`) — Applied per-route on `/progress/*`, `/settings/*`, `/streaks/*`.

### Database

Cloudflare D1 via `c.env.DB`. Raw SQL with `prepare().bind()` — no ORM. Migrations in `migrations/`:

- `0001_initial.sql` — `users`, `weekly_progress`, `phase_progress`
- `0002_settings_and_streaks.sql` — `user_settings`, `streaks`

Key data patterns:
- `week_key`: ISO week format (e.g., `"2026-W13"`)
- `cell_key`: Calendar cell identifier (e.g., `"0-0"` for day-block)
- `phase_key`: Phase identifier matching frontend data
- Toggle pattern: PUT endpoints insert or delete rows (no boolean column flip)

### Streak computation (`POST /streaks/compute`)

- **Weekly completion**: ≥12/23 cells completed in a week (50% threshold)
- **Perfect week**: all 23/23 cells completed
- Both tracked with `area_id = 'global'`

## Environment

Configured in `wrangler.toml`:

- `JWT_SECRET` — Set via `[vars]` locally, must override in Cloudflare dashboard for production
- `DB` — D1 database binding (`roadmap-db`)

## Conventions

- API error responses: `{ error: "message" }` with appropriate HTTP status
- Error messages are in **Spanish**
- All D1 queries use parameterized `prepare().bind()` (never string interpolation)
- User IDs are UUIDs generated with `crypto.randomUUID()`
- Timestamps use SQLite `datetime('now')` defaults
