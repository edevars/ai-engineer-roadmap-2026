import { eq, sql } from "drizzle-orm";
import type { Database } from "../db";
import { streaks } from "../db/schema";

export async function getByUserId(db: Database, userId: string) {
  return db
    .select({
      areaId: streaks.areaId,
      streakType: streaks.streakType,
      currentCount: streaks.currentCount,
      bestCount: streaks.bestCount,
      lastWeekKey: streaks.lastWeekKey,
    })
    .from(streaks)
    .where(eq(streaks.userId, userId))
    .all();
}

export async function upsert(
  db: Database,
  data: {
    userId: string;
    areaId: string;
    streakType: string;
    currentCount: number;
    bestCount: number;
    lastWeekKey: string | null;
  },
) {
  await db
    .insert(streaks)
    .values({
      ...data,
      updatedAt: sql`datetime('now')`,
    })
    .onConflictDoUpdate({
      target: [streaks.userId, streaks.areaId, streaks.streakType],
      set: {
        currentCount: data.currentCount,
        bestCount: sql`MAX(${streaks.bestCount}, ${data.bestCount})`,
        lastWeekKey: data.lastWeekKey,
        updatedAt: sql`datetime('now')`,
      },
    })
    .run();
}

export function deleteAllForUserQuery(db: Database, userId: string) {
  return db.delete(streaks).where(eq(streaks.userId, userId));
}
