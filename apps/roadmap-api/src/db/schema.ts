import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  salt: text("salt").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const weeklyProgress = sqliteTable(
  "weekly_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    weekKey: text("week_key").notNull(),
    cellKey: text("cell_key").notNull(),
    checked: integer("checked").notNull().default(1),
  },
  (t) => [uniqueIndex("weekly_progress_user_week_cell").on(t.userId, t.weekKey, t.cellKey)],
);

export const phaseProgress = sqliteTable(
  "phase_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    roadmap: text("roadmap").notNull().default("main"),
    phaseKey: text("phase_key").notNull(),
    checked: integer("checked").notNull().default(1),
  },
  (t) => [uniqueIndex("phase_progress_user_roadmap_phase").on(t.userId, t.roadmap, t.phaseKey)],
);

export const userSettings = sqliteTable("user_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  roadmapStartDate: text("roadmap_start_date").notNull(),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const streaks = sqliteTable(
  "streaks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    areaId: text("area_id").notNull(),
    streakType: text("streak_type").notNull(),
    currentCount: integer("current_count").default(0),
    bestCount: integer("best_count").default(0),
    lastWeekKey: text("last_week_key"),
    updatedAt: text("updated_at").default(sql`(datetime('now'))`),
  },
  (t) => [uniqueIndex("streaks_user_area_type").on(t.userId, t.areaId, t.streakType)],
);
