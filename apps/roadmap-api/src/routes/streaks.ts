import { Hono } from "hono";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";
import * as StreaksService from "../services/streaks";

const streaks = new Hono<Env>();
streaks.use("/*", authMiddleware);

// GET /streaks
streaks.get("/", async (c) => {
  const result = await StreaksService.getStreaks(c.get("db"), c.get("user").id);
  return c.json(result);
});

// POST /streaks/compute
streaks.post("/compute", async (c) => {
  const result = await StreaksService.computeStreaks(c.get("db"), c.get("user").id);

  if (!result) {
    return c.json({ error: "No hay fecha de inicio configurada" }, 400);
  }

  return c.json(result);
});

export default streaks;
