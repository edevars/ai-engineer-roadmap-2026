import { Hono } from "hono";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";

const weekly = new Hono<Env>();
weekly.use("/*", authMiddleware);

// GET /progress/weekly/range/:from/:to — returns all weeks in range
weekly.get("/range/:from/:to", async (c) => {
  const userId = c.get("user").id;
  const from = c.req.param("from");
  const to = c.req.param("to");

  const { results } = await c.env.DB.prepare(
    "SELECT week_key, cell_key FROM weekly_progress WHERE user_id = ? AND week_key >= ? AND week_key <= ? ORDER BY week_key ASC",
  ).bind(userId, from, to).all();

  const weeks: Record<string, Record<string, boolean>> = {};
  for (const row of results) {
    const wk = row.week_key as string;
    if (!weeks[wk]) weeks[wk] = {};
    weeks[wk][row.cell_key as string] = true;
  }

  return c.json({ from, to, weeks });
});

// GET /progress/weekly/:weekKey
weekly.get("/:weekKey", async (c) => {
  const userId = c.get("user").id;
  const weekKey = c.req.param("weekKey");

  const { results } = await c.env.DB.prepare(
    "SELECT cell_key FROM weekly_progress WHERE user_id = ? AND week_key = ?",
  ).bind(userId, weekKey).all();

  const cells: Record<string, boolean> = {};
  for (const row of results) {
    cells[row.cell_key as string] = true;
  }

  return c.json({ weekKey, cells });
});

// PUT /progress/weekly/:weekKey/:cellKey — toggle
weekly.put("/:weekKey/:cellKey", async (c) => {
  const userId = c.get("user").id;
  const weekKey = c.req.param("weekKey");
  const cellKey = c.req.param("cellKey");

  const existing = await c.env.DB.prepare(
    "SELECT id FROM weekly_progress WHERE user_id = ? AND week_key = ? AND cell_key = ?",
  ).bind(userId, weekKey, cellKey).first();

  if (existing) {
    await c.env.DB.prepare(
      "DELETE FROM weekly_progress WHERE id = ?",
    ).bind(existing.id).run();
    return c.json({ checked: false });
  }

  await c.env.DB.prepare(
    "INSERT INTO weekly_progress (user_id, week_key, cell_key) VALUES (?, ?, ?)",
  ).bind(userId, weekKey, cellKey).run();
  return c.json({ checked: true });
});

export default weekly;
