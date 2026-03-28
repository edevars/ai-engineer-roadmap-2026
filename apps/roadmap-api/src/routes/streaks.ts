import { Hono } from "hono";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";

const streaks = new Hono<Env>();
streaks.use("/*", authMiddleware);

// GET /streaks — return all streak records for user
streaks.get("/", async (c) => {
  const userId = c.get("user").id;

  const { results } = await c.env.DB.prepare(
    "SELECT area_id, streak_type, current_count, best_count, last_week_key, updated_at FROM streaks WHERE user_id = ?",
  ).bind(userId).all();

  const streakMap: Record<string, Record<string, { current: number; best: number; lastWeek: string | null }>> = {};
  for (const row of results) {
    const areaId = row.area_id as string;
    const type = row.streak_type as string;
    if (!streakMap[areaId]) streakMap[areaId] = {};
    streakMap[areaId][type] = {
      current: row.current_count as number,
      best: row.best_count as number,
      lastWeek: row.last_week_key as string | null,
    };
  }

  return c.json({ streaks: streakMap });
});

// POST /streaks/compute — recompute streaks from raw weekly_progress data
streaks.post("/compute", async (c) => {
  const userId = c.get("user").id;

  // Get user's start date
  const settingsRow = await c.env.DB.prepare(
    "SELECT roadmap_start_date FROM user_settings WHERE user_id = ?",
  ).bind(userId).first();

  if (!settingsRow) {
    return c.json({ error: "No hay fecha de inicio configurada" }, 400);
  }

  // Get all weekly progress
  const { results: weeklyRows } = await c.env.DB.prepare(
    "SELECT week_key, cell_key FROM weekly_progress WHERE user_id = ? ORDER BY week_key ASC",
  ).bind(userId).all();

  // Group by week
  const weekMap: Record<string, Set<string>> = {};
  for (const row of weeklyRows) {
    const wk = row.week_key as string;
    if (!weekMap[wk]) weekMap[wk] = new Set();
    weekMap[wk].add(row.cell_key as string);
  }

  // Cell key to area mapping (based on calendar structure)
  // cell_key = "di-bi" → day index, block index
  // We need the calendar structure, but on the backend we just count total cells per week
  const weekKeys = Object.keys(weekMap).sort();

  // Compute global weekly completion streak
  let globalCurrent = 0;
  let globalBest = 0;
  let lastGlobalWeek: string | null = null;

  for (const wk of weekKeys) {
    const cellCount = weekMap[wk].size;
    // Consider a week "completed" if at least 50% of expected blocks done (23 total blocks)
    if (cellCount >= 12) {
      globalCurrent++;
      if (globalCurrent > globalBest) globalBest = globalCurrent;
      lastGlobalWeek = wk;
    } else {
      globalCurrent = 0;
    }
  }

  // Upsert global streak
  await c.env.DB.prepare(
    `INSERT INTO streaks (user_id, area_id, streak_type, current_count, best_count, last_week_key, updated_at)
     VALUES (?, 'global', 'weekly_completion', ?, ?, ?, datetime('now'))
     ON CONFLICT(user_id, area_id, streak_type) DO UPDATE SET
       current_count = excluded.current_count,
       best_count = MAX(streaks.best_count, excluded.best_count),
       last_week_key = excluded.last_week_key,
       updated_at = datetime('now')`,
  ).bind(userId, globalCurrent, globalBest, lastGlobalWeek).run();

  // Compute perfect week streak (all blocks completed)
  let perfectCurrent = 0;
  let perfectBest = 0;
  let lastPerfectWeek: string | null = null;

  for (const wk of weekKeys) {
    if (weekMap[wk].size >= 23) {
      perfectCurrent++;
      if (perfectCurrent > perfectBest) perfectBest = perfectCurrent;
      lastPerfectWeek = wk;
    } else {
      perfectCurrent = 0;
    }
  }

  await c.env.DB.prepare(
    `INSERT INTO streaks (user_id, area_id, streak_type, current_count, best_count, last_week_key, updated_at)
     VALUES (?, 'global', 'perfect_week', ?, ?, ?, datetime('now'))
     ON CONFLICT(user_id, area_id, streak_type) DO UPDATE SET
       current_count = excluded.current_count,
       best_count = MAX(streaks.best_count, excluded.best_count),
       last_week_key = excluded.last_week_key,
       updated_at = datetime('now')`,
  ).bind(userId, perfectCurrent, perfectBest, lastPerfectWeek).run();

  return c.json({
    computed: true,
    global: { weekly_completion: { current: globalCurrent, best: globalBest }, perfect_week: { current: perfectCurrent, best: perfectBest } },
  });
});

export default streaks;
