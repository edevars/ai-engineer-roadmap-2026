import { Hono } from "hono";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";

const settings = new Hono<Env>();
settings.use("/*", authMiddleware);

// GET /settings — get user's roadmap_start_date
settings.get("/", async (c) => {
  const userId = c.get("user").id;

  const row = await c.env.DB.prepare(
    "SELECT roadmap_start_date, updated_at FROM user_settings WHERE user_id = ?",
  ).bind(userId).first();

  if (!row) {
    return c.json({ roadmap_start_date: null });
  }

  return c.json({
    roadmap_start_date: row.roadmap_start_date as string,
    updated_at: row.updated_at as string,
  });
});

// PUT /settings — upsert roadmap_start_date
settings.put("/", async (c) => {
  const userId = c.get("user").id;
  const body = await c.req.json<{ roadmap_start_date: string }>();
  const { roadmap_start_date } = body;

  if (!roadmap_start_date) {
    return c.json({ error: "roadmap_start_date es requerido" }, 400);
  }

  await c.env.DB.prepare(
    `INSERT INTO user_settings (user_id, roadmap_start_date, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET roadmap_start_date = excluded.roadmap_start_date, updated_at = datetime('now')`,
  ).bind(userId, roadmap_start_date).run();

  return c.json({ roadmap_start_date });
});

// POST /settings/restart — delete all progress + reset start date to today
settings.post("/restart", async (c) => {
  const userId = c.get("user").id;

  const today = new Date().toISOString().split("T")[0];

  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM weekly_progress WHERE user_id = ?").bind(userId),
    c.env.DB.prepare("DELETE FROM phase_progress WHERE user_id = ?").bind(userId),
    c.env.DB.prepare("DELETE FROM streaks WHERE user_id = ?").bind(userId),
    c.env.DB.prepare(
      `INSERT INTO user_settings (user_id, roadmap_start_date, updated_at)
       VALUES (?, ?, datetime('now'))
       ON CONFLICT(user_id) DO UPDATE SET roadmap_start_date = excluded.roadmap_start_date, updated_at = datetime('now')`,
    ).bind(userId, today),
  ]);

  return c.json({ roadmap_start_date: today, cleared: true });
});

export default settings;
