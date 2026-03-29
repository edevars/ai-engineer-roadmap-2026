import type { Database } from "../db";
import * as StreakModel from "../models/streak";
import * as WeeklyModel from "../models/weekly-progress";
import * as SettingsModel from "../models/settings";

export async function getStreaks(db: Database, userId: string) {
  const results = await StreakModel.getByUserId(db, userId);

  const streakMap: Record<string, Record<string, { current: number; best: number; lastWeek: string | null }>> = {};
  for (const row of results) {
    if (!streakMap[row.areaId]) streakMap[row.areaId] = {};
    streakMap[row.areaId][row.streakType] = {
      current: row.currentCount!,
      best: row.bestCount!,
      lastWeek: row.lastWeekKey,
    };
  }

  return { streaks: streakMap };
}

export async function computeStreaks(db: Database, userId: string) {
  const settingsRow = await SettingsModel.getByUserId(db, userId);
  if (!settingsRow) return null;

  const weeklyRows = await WeeklyModel.getAllForUser(db, userId);

  // Group by week
  const weekMap: Record<string, Set<string>> = {};
  for (const row of weeklyRows) {
    if (!weekMap[row.weekKey]) weekMap[row.weekKey] = new Set();
    weekMap[row.weekKey].add(row.cellKey);
  }

  const weekKeys = Object.keys(weekMap).sort();

  // Compute global weekly completion streak
  let globalCurrent = 0;
  let globalBest = 0;
  let lastGlobalWeek: string | null = null;

  for (const wk of weekKeys) {
    const cellCount = weekMap[wk].size;
    if (cellCount >= 12) {
      globalCurrent++;
      if (globalCurrent > globalBest) globalBest = globalCurrent;
      lastGlobalWeek = wk;
    } else {
      globalCurrent = 0;
    }
  }

  await StreakModel.upsert(db, {
    userId,
    areaId: "global",
    streakType: "weekly_completion",
    currentCount: globalCurrent,
    bestCount: globalBest,
    lastWeekKey: lastGlobalWeek,
  });

  // Compute perfect week streak
  let perfectCurrent = 0;
  let perfectBest = 0;
  let lastPerfectWeek: string | null = null;

  for (const wk of weekKeys) {
    if (weekMap[wk].size >= 23) {
      perfectCurrent++;
      if (perfectCurrent > perfectBest) perfectBest = perfectCurrent;
      lastPerfectWeek = wk;
    } else {
      perfectCurrent = 0;
    }
  }

  await StreakModel.upsert(db, {
    userId,
    areaId: "global",
    streakType: "perfect_week",
    currentCount: perfectCurrent,
    bestCount: perfectBest,
    lastWeekKey: lastPerfectWeek,
  });

  return {
    computed: true,
    global: {
      weekly_completion: { current: globalCurrent, best: globalBest },
      perfect_week: { current: perfectCurrent, best: perfectBest },
    },
  };
}
