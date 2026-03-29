import { eq, and } from "drizzle-orm";
import type { Database } from "../db";
import { phaseProgress } from "../db/schema";

export async function getByRoadmap(db: Database, userId: string, roadmap: string) {
  return db
    .select({ phaseKey: phaseProgress.phaseKey })
    .from(phaseProgress)
    .where(and(eq(phaseProgress.userId, userId), eq(phaseProgress.roadmap, roadmap)))
    .all();
}

export async function find(db: Database, userId: string, roadmap: string, phaseKey: string) {
  return db
    .select({ id: phaseProgress.id })
    .from(phaseProgress)
    .where(
      and(
        eq(phaseProgress.userId, userId),
        eq(phaseProgress.roadmap, roadmap),
        eq(phaseProgress.phaseKey, phaseKey),
      ),
    )
    .get();
}

export async function deleteById(db: Database, id: number) {
  await db.delete(phaseProgress).where(eq(phaseProgress.id, id)).run();
}

export async function create(
  db: Database,
  data: { userId: string; roadmap: string; phaseKey: string },
) {
  await db.insert(phaseProgress).values(data).run();
}

export function deleteAllForUserQuery(db: Database, userId: string) {
  return db.delete(phaseProgress).where(eq(phaseProgress.userId, userId));
}
