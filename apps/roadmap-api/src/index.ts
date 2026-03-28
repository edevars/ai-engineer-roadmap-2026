import { Hono } from "hono";
import type { Env } from "./types";
import { corsMiddleware } from "./middleware/cors";
import authRoutes from "./routes/auth";
import weeklyRoutes from "./routes/weekly";
import phasesRoutes from "./routes/phases";
import settingsRoutes from "./routes/settings";
import streaksRoutes from "./routes/streaks";

const app = new Hono<Env>();

app.use("/*", corsMiddleware);

app.route("/api/v1/auth", authRoutes);
app.route("/api/v1/progress/weekly", weeklyRoutes);
app.route("/api/v1/progress/phases", phasesRoutes);
app.route("/api/v1/settings", settingsRoutes);
app.route("/api/v1/streaks", streaksRoutes);

app.get("/", (c) => c.json({ status: "ok", service: "roadmap-api" }));

export default app;
