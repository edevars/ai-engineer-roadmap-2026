import { eq, and, gte, lte, asc } from "drizzle-orm";
import type { Database } from "../db";
import { weeklyProgress } from "../db/schema";

export async function getCellsInRange(db: Database, userId: string, from: string, to: string) {
  return db
    .select({ weekKey: weeklyProgress.weekKey, cellKey: weeklyProgress.cellKey })
    .from(weeklyProgress)
    .where(
      and(
        eq(weeklyProgress.userId, userId),
        gte(weeklyProgress.weekKey, from),
        lte(weeklyProgress.weekKey, to),
      ),
    )
    .all();
}

export async function getCellsForWeek(db: Database, userId: string, weekKey: string) {
  return db
    .select({ cellKey: weeklyProgress.cellKey })
    .from(weeklyProgress)
    .where(and(eq(weeklyProgress.userId, userId), eq(weeklyProgress.weekKey, weekKey)))
    .all();
}

export async function findCell(db: Database, userId: string, weekKey: string, cellKey: string) {
  return db
    .select({ id: weeklyProgress.id })
    .from(weeklyProgress)
    .where(
      and(
        eq(weeklyProgress.userId, userId),
        eq(weeklyProgress.weekKey, weekKey),
        eq(weeklyProgress.cellKey, cellKey),
      ),
    )
    .get();
}

export async function deleteById(db: Database, id: number) {
  await db.delete(weeklyProgress).where(eq(weeklyProgress.id, id)).run();
}

export async function createCell(
  db: Database,
  data: { userId: string; weekKey: string; cellKey: string },
) {
  await db.insert(weeklyProgress).values(data).run();
}

export async function getAllForUser(db: Database, userId: string) {
  return db
    .select({ weekKey: weeklyProgress.weekKey, cellKey: weeklyProgress.cellKey })
    .from(weeklyProgress)
    .where(eq(weeklyProgress.userId, userId))
    .orderBy(asc(weeklyProgress.weekKey))
    .all();
}

export function deleteAllForUserQuery(db: Database, userId: string) {
  return db.delete(weeklyProgress).where(eq(weeklyProgress.userId, userId));
}
