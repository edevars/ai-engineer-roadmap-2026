import type { Database } from "../db";
import * as SettingsModel from "../models/settings";
import { deleteAllForUserQuery as deleteWeekly } from "../models/weekly-progress";
import { deleteAllForUserQuery as deletePhases } from "../models/phase-progress";
import { deleteAllForUserQuery as deleteStreaks } from "../models/streak";

export async function getSettings(db: Database, userId: string) {
  const row = await SettingsModel.getByUserId(db, userId);

  if (!row) {
    return { roadmap_start_date: null };
  }

  return {
    roadmap_start_date: row.roadmap_start_date,
    updated_at: row.updated_at,
  };
}

export async function updateStartDate(db: Database, userId: string, roadmapStartDate: string) {
  await SettingsModel.upsert(db, userId, roadmapStartDate);
  return { roadmap_start_date: roadmapStartDate };
}

export async function restart(db: Database, userId: string) {
  const today = new Date().toISOString().split("T")[0];

  await db.batch([
    deleteWeekly(db, userId),
    deletePhases(db, userId),
    deleteStreaks(db, userId),
    SettingsModel.upsertQuery(db, userId, today),
  ]);

  return { roadmap_start_date: today, cleared: true };
}
