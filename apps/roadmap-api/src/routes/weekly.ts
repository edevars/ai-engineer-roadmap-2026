import { Hono } from "hono";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";
import * as WeeklyService from "../services/weekly";

const weekly = new Hono<Env>();
weekly.use("/*", authMiddleware);

// GET /progress/weekly/range/:from/:to
weekly.get("/range/:from/:to", async (c) => {
  const userId = c.get("user").id;
  const result = await WeeklyService.getRange(c.get("db"), userId, c.req.param("from"), c.req.param("to"));
  return c.json(result);
});

// GET /progress/weekly/:weekKey
weekly.get("/:weekKey", async (c) => {
  const result = await WeeklyService.getWeek(c.get("db"), c.get("user").id, c.req.param("weekKey"));
  return c.json(result);
});

// PUT /progress/weekly/:weekKey/:cellKey
weekly.put("/:weekKey/:cellKey", async (c) => {
  const result = await WeeklyService.toggleCell(
    c.get("db"),
    c.get("user").id,
    c.req.param("weekKey"),
    c.req.param("cellKey"),
  );
  return c.json(result);
});

export default weekly;
