import type { Database } from "../db";
import * as PhaseModel from "../models/phase-progress";

export async function getPhases(db: Database, userId: string, roadmap: string) {
  const results = await PhaseModel.getByRoadmap(db, userId, roadmap);

  const phases: Record<string, boolean> = {};
  for (const row of results) {
    phases[row.phaseKey] = true;
  }

  return { roadmap, phases };
}

export async function togglePhase(
  db: Database,
  userId: string,
  roadmap: string,
  phaseKey: string,
) {
  const existing = await PhaseModel.find(db, userId, roadmap, phaseKey);

  if (existing) {
    await PhaseModel.deleteById(db, existing.id);
    return { checked: false };
  }

  await PhaseModel.create(db, { userId, roadmap, phaseKey });
  return { checked: true };
}
