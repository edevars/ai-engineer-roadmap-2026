import { createMiddleware } from "hono/factory";
import type { Env } from "../types";
import { verifyToken } from "../lib/jwt";

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const header = c.req.header("Authorization");
  if (!header?.startsWith("Bearer ")) {
    return c.json({ error: "Token requerido" }, 401);
  }

  try {
    const token = header.slice(7);
    const user = await verifyToken(token, c.env.JWT_SECRET);
    c.set("user", user);
    await next();
  } catch {
    return c.json({ error: "Token inválido o expirado" }, 401);
  }
});
