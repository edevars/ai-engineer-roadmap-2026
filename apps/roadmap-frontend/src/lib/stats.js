/**
 * Aggregation utilities for weekly and multi-week stats.
 */
import { calendarWeek } from "../data/calendar-data";
import { AREA_META } from "../data/area-meta";

// Total expected blocks per week
export const TOTAL_WEEK_BLOCKS = calendarWeek.reduce((s, d) => s + d.blocks.length, 0);

// Build a mapping: cell key "di-bi" → area ID
const CELL_AREA_MAP = {};
calendarWeek.forEach((day, di) => {
  day.blocks.forEach((block, bi) => {
    CELL_AREA_MAP[`${di}-${bi}`] = block.area;
  });
});

// Build expected blocks per area per week
const AREA_EXPECTED = {};
Object.keys(AREA_META).forEach(id => { AREA_EXPECTED[id] = 0; });
calendarWeek.forEach(day => {
  day.blocks.forEach(block => {
    AREA_EXPECTED[block.area] = (AREA_EXPECTED[block.area] || 0) + 1;
  });
});

/**
 * Get area ID for a cell key "di-bi"
 */
export function cellKeyToArea(cellKey) {
  return CELL_AREA_MAP[cellKey] || null;
}

/**
 * Get expected block count per area
 */
export function getAreaExpected() {
  return { ...AREA_EXPECTED };
}

/**
 * Compute per-area stats for a single week's checked cells.
 * @param {Record<string, boolean>} weekCells
 * @returns {Record<string, {completed, expected, pct}>}
 */
export function computeWeeklyAreaStats(weekCells) {
  const stats = {};
  for (const areaId of Object.keys(AREA_META)) {
    stats[areaId] = { completed: 0, expected: AREA_EXPECTED[areaId], pct: 0 };
  }

  for (const [cellKey, checked] of Object.entries(weekCells)) {
    if (!checked) continue;
    const area = CELL_AREA_MAP[cellKey];
    if (area && stats[area]) {
      stats[area].completed++;
    }
  }

  for (const areaId of Object.keys(stats)) {
    const s = stats[areaId];
    s.pct = s.expected > 0 ? Math.round((s.completed / s.expected) * 100) : 0;
  }

  return stats;
}

/**
 * Compute multi-week aggregated stats.
 * @param {Record<string, Record<string, boolean>>} weeksData - { weekKey: { cellKey: true } }
 * @returns {{ perArea, global }}
 */
export function computeMultiWeekStats(weeksData) {
  const weekKeys = Object.keys(weeksData).sort();
  const totalWeeks = weekKeys.length;

  if (totalWeeks === 0) {
    return {
      perArea: {},
      global: { avgCompletion: 0, bestWeek: null, worstWeek: null, totalWeeks: 0 },
    };
  }

  // Per-area accumulation
  const areaAccum = {};
  for (const areaId of Object.keys(AREA_META)) {
    areaAccum[areaId] = { totalCompleted: 0, weeksWithActivity: 0, totalExpected: AREA_EXPECTED[areaId] * totalWeeks };
  }

  let bestWeek = null;
  let bestWeekPct = -1;
  let worstWeek = null;
  let worstWeekPct = 101;
  let globalTotalDone = 0;

  for (const wk of weekKeys) {
    const cells = weeksData[wk] || {};
    const weekStats = computeWeeklyAreaStats(cells);
    let weekDone = 0;

    for (const areaId of Object.keys(AREA_META)) {
      const s = weekStats[areaId];
      areaAccum[areaId].totalCompleted += s.completed;
      if (s.completed > 0) areaAccum[areaId].weeksWithActivity++;
      weekDone += s.completed;
    }

    globalTotalDone += weekDone;
    const weekPct = Math.round((weekDone / TOTAL_WEEK_BLOCKS) * 100);

    if (weekPct > bestWeekPct) { bestWeekPct = weekPct; bestWeek = { weekKey: wk, pct: weekPct, done: weekDone }; }
    if (weekPct < worstWeekPct) { worstWeekPct = weekPct; worstWeek = { weekKey: wk, pct: weekPct, done: weekDone }; }
  }

  const perArea = {};
  for (const areaId of Object.keys(AREA_META)) {
    const a = areaAccum[areaId];
    perArea[areaId] = {
      totalCompleted: a.totalCompleted,
      totalExpected: a.totalExpected,
      consistency: totalWeeks > 0 ? Math.round((a.weeksWithActivity / totalWeeks) * 100) : 0,
      avgPerWeek: totalWeeks > 0 ? Math.round((a.totalCompleted / totalWeeks) * 10) / 10 : 0,
    };
  }

  const avgCompletion = Math.round((globalTotalDone / (TOTAL_WEEK_BLOCKS * totalWeeks)) * 100);

  return {
    perArea,
    global: { avgCompletion, bestWeek, worstWeek, totalWeeks },
  };
}
