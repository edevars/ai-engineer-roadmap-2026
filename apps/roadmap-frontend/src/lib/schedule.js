/**
 * Phase schedule engine — maps phase labels to absolute date ranges given a start date.
 */

// Áreas ocultas del tracker (duplicado intencional del set en roadmap-data.jsx
// para evitar imports desde un módulo .jsx en utilidades puras).
const HIDDEN_AREA_IDS = new Set(["observabilidad", "ingles-tecnico", "ai-code-tools"]);

// Static mapping: per area, each phase's relative month offsets (1-indexed from start)
const _PHASE_MONTHS_ALL = {
  "system-design":  [{ start: 1, end: 2 }, { start: 3, end: 4 }, { start: 5, end: 6 }],
  "observabilidad": [{ start: 1, end: 1 }, { start: 2, end: 2 }, { start: 3, end: 3 }],
  "ai-engineering": [{ start: 1, end: 2 }, { start: 3, end: 4 }, { start: 5, end: 6 }, { start: 7, end: 8 }],
  "algoritmos":     [{ start: 1, end: 2 }, { start: 3, end: 4 }, { start: 5, end: 6 }],
  "ingles-tecnico": [{ start: 1, end: 1 }, { start: 2, end: 2 }, { start: 3, end: 3 }],
};

const PHASE_MONTHS = Object.fromEntries(
  Object.entries(_PHASE_MONTHS_ALL).filter(([id]) => !HIDDEN_AREA_IDS.has(id)),
);

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

/**
 * Returns per-area schedule with absolute date ranges and status for each phase.
 * @param {string} startDateStr - ISO date string "2026-01-06"
 * @param {Record<string, boolean>} phaseChecked - map of "areaId-phaseIdx" → true
 * @returns {Record<string, Array<{phaseIdx, startDate, endDate, status}>>}
 */
export function getPhaseSchedule(startDateStr, phaseChecked = {}) {
  const startDate = new Date(startDateStr);
  const now = new Date();
  const schedule = {};

  for (const [areaId, phases] of Object.entries(PHASE_MONTHS)) {
    schedule[areaId] = phases.map((p, idx) => {
      const phaseStart = addMonths(startDate, p.start - 1);
      const phaseEnd = addMonths(startDate, p.end);
      phaseEnd.setDate(phaseEnd.getDate() - 1); // last day of the month

      const key = `${areaId}-${idx}`;
      const isChecked = !!phaseChecked[key];

      let status;
      if (isChecked) {
        status = "completed";
      } else if (now >= phaseEnd) {
        status = "overdue";
      } else if (now >= phaseStart) {
        status = "current";
      } else {
        status = "upcoming";
      }

      return {
        phaseIdx: idx,
        startDate: phaseStart,
        endDate: phaseEnd,
        status,
      };
    });
  }

  return schedule;
}

/**
 * Per-area status with expected phase index and consistency info.
 * @param {string} startDateStr
 * @param {Record<string, boolean>} phaseChecked
 * @returns {Record<string, {expectedPhaseIdx, totalPhases, completedPhases, status}>}
 */
export function getAreaStatus(startDateStr, phaseChecked = {}) {
  const schedule = getPhaseSchedule(startDateStr, phaseChecked);
  const result = {};

  for (const [areaId, phases] of Object.entries(schedule)) {
    const completedPhases = phases.filter(p => p.status === "completed").length;
    const currentOrOverdue = phases.findIndex(p => p.status === "current" || p.status === "overdue");
    const expectedPhaseIdx = currentOrOverdue >= 0 ? currentOrOverdue : phases.length - 1;

    // How many phases should be done by now
    const expectedDone = phases.filter(p => p.status === "overdue" || p.status === "completed").length;

    let status;
    if (completedPhases >= expectedDone && completedPhases > 0) {
      status = "on-track";
    } else if (expectedDone - completedPhases <= 1) {
      status = "slightly-behind";
    } else {
      status = "needs-attention";
    }

    result[areaId] = {
      expectedPhaseIdx,
      totalPhases: phases.length,
      completedPhases,
      expectedDone,
      status,
    };
  }

  return result;
}

/**
 * Auto-compute phase completion from weekly history data.
 * A phase is "completed" when >= 75% of expected area blocks were done
 * across the weeks that fall within the phase's date range.
 *
 * @param {string} startDateStr - ISO date string
 * @param {Record<string, Record<string, boolean>>} historyData - { weekKey: { cellKey: true } }
 * @param {Record<string, number>} areaExpected - blocks per area per week
 * @param {function} cellKeyToArea - maps "di-bi" → area ID
 * @param {function} weekKeyToDateRange - maps weekKey → { start, end }
 * @returns {{ phaseChecked: Record<string, boolean>, phasePct: Record<string, number> }}
 */
export function computePhaseProgress(startDateStr, historyData, areaExpected, cellKeyToArea, weekKeyToDateRange) {
  const startDate = new Date(startDateStr);
  const phaseChecked = {};
  const phasePct = {};

  if (!historyData) return { phaseChecked, phasePct };

  const weekKeys = Object.keys(historyData).sort();

  for (const [areaId, phases] of Object.entries(PHASE_MONTHS)) {
    phases.forEach((p, idx) => {
      const phaseStart = addMonths(startDate, p.start - 1);
      const phaseEnd = addMonths(startDate, p.end);
      phaseEnd.setDate(phaseEnd.getDate() - 1);

      // Find weeks that overlap with this phase's date range
      let expectedBlocks = 0;
      let completedBlocks = 0;

      for (const wk of weekKeys) {
        const range = weekKeyToDateRange(wk);
        // Week overlaps phase if week.start <= phaseEnd AND week.end >= phaseStart
        if (range.start <= phaseEnd && range.end >= phaseStart) {
          expectedBlocks += (areaExpected[areaId] || 0);
          const cells = historyData[wk] || {};
          for (const [cellKey, checked] of Object.entries(cells)) {
            if (checked && cellKeyToArea(cellKey) === areaId) {
              completedBlocks++;
            }
          }
        }
      }

      const key = `${areaId}-${idx}`;
      const pct = expectedBlocks > 0 ? Math.round((completedBlocks / expectedBlocks) * 100) : 0;
      phasePct[key] = pct;
      phaseChecked[key] = pct >= 75;
    });
  }

  return { phaseChecked, phasePct };
}

/**
 * Global timeline stats.
 * @param {string} startDateStr
 * @returns {{ weeksSinceStart, monthsSinceStart, totalMonths, timeElapsedPct }}
 */
export function getGlobalStats(startDateStr) {
  const startDate = new Date(startDateStr);
  const now = new Date();
  const diffMs = now - startDate;
  const weeksSinceStart = Math.max(0, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)));
  const monthsSinceStart = Math.max(0, (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth()));
  const totalMonths = 8; // longest area (AI Engineering)
  const totalWeeks = Math.round(totalMonths * 4.33);
  const timeElapsedPct = Math.min(100, Math.round((weeksSinceStart / totalWeeks) * 100));

  return {
    weeksSinceStart,
    monthsSinceStart,
    totalMonths,
    totalWeeks,
    timeElapsedPct,
  };
}
