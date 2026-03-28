import { Hono } from "hono";
import type { Env } from "../types";
import { hashPassword, verifyPassword } from "../lib/password";
import { signToken } from "../lib/jwt";
import { authMiddleware } from "../middleware/auth";

const auth = new Hono<Env>();

// POST /auth/register
auth.post("/register", async (c) => {
  const body = await c.req.json<{ email: string; password: string; name: string }>();
  const { email, password, name } = body;

  if (!email || !password || !name) {
    return c.json({ error: "email, password y name son requeridos" }, 400);
  }

  const existing = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existing) {
    return c.json({ error: "El email ya está registrado" }, 409);
  }

  const id = crypto.randomUUID();
  const { hash, salt } = await hashPassword(password);

  await c.env.DB.prepare(
    "INSERT INTO users (id, email, name, password, salt) VALUES (?, ?, ?, ?, ?)",
  ).bind(id, email, name, hash, salt).run();

  const user = { id, email, name };
  const token = await signToken(user, c.env.JWT_SECRET);
  return c.json({ token, user }, 201);
});

// POST /auth/login
auth.post("/login", async (c) => {
  const body = await c.req.json<{ email: string; password: string }>();
  const { email, password } = body;

  if (!email || !password) {
    return c.json({ error: "email y password son requeridos" }, 400);
  }

  const row = await c.env.DB.prepare(
    "SELECT id, email, name, password, salt FROM users WHERE email = ?",
  ).bind(email).first();

  if (!row) {
    return c.json({ error: "Credenciales inválidas" }, 401);
  }

  const valid = await verifyPassword(password, row.password as string, row.salt as string);
  if (!valid) {
    return c.json({ error: "Credenciales inválidas" }, 401);
  }

  const user = { id: row.id as string, email: row.email as string, name: row.name as string };
  const token = await signToken(user, c.env.JWT_SECRET);
  return c.json({ token, user });
});

// GET /auth/me
auth.get("/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const row = await c.env.DB.prepare(
    "SELECT id, email, name, created_at FROM users WHERE id = ?",
  ).bind(user.id).first();

  if (!row) {
    return c.json({ error: "Usuario no encontrado" }, 404);
  }

  return c.json(row);
});

export default auth;
