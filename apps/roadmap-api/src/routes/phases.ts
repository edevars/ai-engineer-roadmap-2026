import { Hono } from "hono";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";
import * as PhasesService from "../services/phases";

const phases = new Hono<Env>();
phases.use("/*", authMiddleware);

// GET /progress/phases/:roadmap
phases.get("/:roadmap", async (c) => {
  const result = await PhasesService.getPhases(c.get("db"), c.get("user").id, c.req.param("roadmap"));
  return c.json(result);
});

// PUT /progress/phases/:roadmap/:phaseKey
phases.put("/:roadmap/:phaseKey", async (c) => {
  const result = await PhasesService.togglePhase(
    c.get("db"),
    c.get("user").id,
    c.req.param("roadmap"),
    c.req.param("phaseKey"),
  );
  return c.json(result);
});

export default phases;
