import { Hono } from "hono";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";

const phases = new Hono<Env>();
phases.use("/*", authMiddleware);

// GET /progress/phases/:roadmap
phases.get("/:roadmap", async (c) => {
  const userId = c.get("user").id;
  const roadmap = c.req.param("roadmap");

  const { results } = await c.env.DB.prepare(
    "SELECT phase_key FROM phase_progress WHERE user_id = ? AND roadmap = ?",
  ).bind(userId, roadmap).all();

  const phasesMap: Record<string, boolean> = {};
  for (const row of results) {
    phasesMap[row.phase_key as string] = true;
  }

  return c.json({ roadmap, phases: phasesMap });
});

// PUT /progress/phases/:roadmap/:phaseKey — toggle
phases.put("/:roadmap/:phaseKey", async (c) => {
  const userId = c.get("user").id;
  const roadmap = c.req.param("roadmap");
  const phaseKey = c.req.param("phaseKey");

  const existing = await c.env.DB.prepare(
    "SELECT id FROM phase_progress WHERE user_id = ? AND roadmap = ? AND phase_key = ?",
  ).bind(userId, roadmap, phaseKey).first();

  if (existing) {
    await c.env.DB.prepare(
      "DELETE FROM phase_progress WHERE id = ?",
    ).bind(existing.id).run();
    return c.json({ checked: false });
  }

  await c.env.DB.prepare(
    "INSERT INTO phase_progress (user_id, roadmap, phase_key) VALUES (?, ?, ?)",
  ).bind(userId, roadmap, phaseKey).run();
  return c.json({ checked: true });
});

export default phases;
