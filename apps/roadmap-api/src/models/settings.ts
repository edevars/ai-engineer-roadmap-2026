import { eq, sql } from "drizzle-orm";
import type { Database } from "../db";
import { userSettings } from "../db/schema";

export async function getByUserId(db: Database, userId: string) {
  return db
    .select({
      roadmap_start_date: userSettings.roadmapStartDate,
      updated_at: userSettings.updatedAt,
    })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .get();
}

export async function upsert(db: Database, userId: string, roadmapStartDate: string) {
  await db
    .insert(userSettings)
    .values({ userId, roadmapStartDate, updatedAt: sql`datetime('now')` })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        roadmapStartDate,
        updatedAt: sql`datetime('now')`,
      },
    })
    .run();
}

export function upsertQuery(db: Database, userId: string, roadmapStartDate: string) {
  return db
    .insert(userSettings)
    .values({ userId, roadmapStartDate, updatedAt: sql`datetime('now')` })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        roadmapStartDate,
        updatedAt: sql`datetime('now')`,
      },
    });
}
