import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: ["http://localhost:5173", "http://localhost:4173", "https://topengineer.netlify.app"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
});
