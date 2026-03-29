import type { Database } from "../db";
import * as WeeklyModel from "../models/weekly-progress";

export async function getRange(db: Database, userId: string, from: string, to: string) {
  const results = await WeeklyModel.getCellsInRange(db, userId, from, to);

  const weeks: Record<string, Record<string, boolean>> = {};
  for (const row of results) {
    if (!weeks[row.weekKey]) weeks[row.weekKey] = {};
    weeks[row.weekKey][row.cellKey] = true;
  }

  return { from, to, weeks };
}

export async function getWeek(db: Database, userId: string, weekKey: string) {
  const results = await WeeklyModel.getCellsForWeek(db, userId, weekKey);

  const cells: Record<string, boolean> = {};
  for (const row of results) {
    cells[row.cellKey] = true;
  }

  return { weekKey, cells };
}

export async function toggleCell(
  db: Database,
  userId: string,
  weekKey: string,
  cellKey: string,
) {
  const existing = await WeeklyModel.findCell(db, userId, weekKey, cellKey);

  if (existing) {
    await WeeklyModel.deleteById(db, existing.id);
    return { checked: false };
  }

  await WeeklyModel.createCell(db, { userId, weekKey, cellKey });
  return { checked: true };
}
