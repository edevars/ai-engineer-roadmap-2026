import { Hono } from "hono";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";
import * as SettingsService from "../services/settings";

const settings = new Hono<Env>();
settings.use("/*", authMiddleware);

// GET /settings
settings.get("/", async (c) => {
  const result = await SettingsService.getSettings(c.get("db"), c.get("user").id);
  return c.json(result);
});

// PUT /settings
settings.put("/", async (c) => {
  const { roadmap_start_date } = await c.req.json<{ roadmap_start_date: string }>();

  if (!roadmap_start_date) {
    return c.json({ error: "roadmap_start_date es requerido" }, 400);
  }

  const result = await SettingsService.updateStartDate(c.get("db"), c.get("user").id, roadmap_start_date);
  return c.json(result);
});

// POST /settings/restart
settings.post("/restart", async (c) => {
  const result = await SettingsService.restart(c.get("db"), c.get("user").id);
  return c.json(result);
});

export default settings;
