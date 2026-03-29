import { Hono } from "hono";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";
import * as AuthService from "../services/auth";

const auth = new Hono<Env>();

// POST /auth/register
auth.post("/register", async (c) => {
  const { email, password, name } = await c.req.json<{ email: string; password: string; name: string }>();

  if (!email || !password || !name) {
    return c.json({ error: "email, password y name son requeridos" }, 400);
  }

  const result = await AuthService.register(c.get("db"), c.env.JWT_SECRET, { email, password, name });

  if ("conflict" in result) {
    return c.json({ error: "El email ya está registrado" }, 409);
  }

  return c.json(result, 201);
});

// POST /auth/login
auth.post("/login", async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>();

  if (!email || !password) {
    return c.json({ error: "email y password son requeridos" }, 400);
  }

  const result = await AuthService.login(c.get("db"), c.env.JWT_SECRET, { email, password });

  if (!result) {
    return c.json({ error: "Credenciales inválidas" }, 401);
  }

  return c.json(result);
});

// GET /auth/me
auth.get("/me", authMiddleware, async (c) => {
  const profile = await AuthService.getProfile(c.get("db"), c.get("user").id);

  if (!profile) {
    return c.json({ error: "Usuario no encontrado" }, 404);
  }

  return c.json(profile);
});

export default auth;
