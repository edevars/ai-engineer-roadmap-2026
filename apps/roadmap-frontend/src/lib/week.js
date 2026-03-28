export function getCurrentWeekKey() {
  return dateToWeekKey(new Date());
}

/**
 * Convert a Date to ISO week key "YYYY-WNN"
 */
export function dateToWeekKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();

  const jan4 = new Date(year, 0, 4);
  const start = new Date(jan4);
  start.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));

  const diff = d - start;
  const weekNum = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;

  // Handle edge case: if weekNum <= 0, it belongs to the previous year's last week
  if (weekNum <= 0) {
    return dateToWeekKey(new Date(year - 1, 11, 28));
  }

  return `${year}-W${String(weekNum).padStart(2, "0")}`;
}

/**
 * Get a week key shifted by `offset` weeks.
 */
export function getWeekKeyOffset(weekKey, offset) {
  const { start } = weekKeyToDateRange(weekKey);
  const shifted = new Date(start);
  shifted.setDate(shifted.getDate() + offset * 7);
  return dateToWeekKey(shifted);
}

/**
 * Convert a week key to its Monday–Sunday date range.
 */
export function weekKeyToDateRange(weekKey) {
  const [yearStr, weekStr] = weekKey.split("-W");
  const year = parseInt(yearStr);
  const week = parseInt(weekStr);

  // ISO: week 1 contains Jan 4
  const jan4 = new Date(year, 0, 4);
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (week - 1) * 7);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { start: monday, end: sunday };
}

/**
 * Get all week keys from startWeekKey to current week.
 */
export function getAllWeekKeysSince(startWeekKey) {
  const current = getCurrentWeekKey();
  const keys = [];
  let wk = startWeekKey;

  // Safety: max 200 weeks (~4 years)
  for (let i = 0; i < 200; i++) {
    keys.push(wk);
    if (wk >= current) break;
    wk = getWeekKeyOffset(wk, 1);
  }

  return keys;
}

/**
 * Format a week key into a human-readable label.
 * e.g. "2026-W13" → "Semana 13 · Mar 24–30, 2026"
 */
export function formatWeekLabel(weekKey) {
  const weekNum = parseInt(weekKey.split("-W")[1]);
  const { start, end } = weekKeyToDateRange(weekKey);

  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const startMonth = months[start.getMonth()];
  const endMonth = months[end.getMonth()];

  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  const range = startMonth === endMonth
    ? `${startMonth} ${startDay}–${endDay}, ${year}`
    : `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;

  return `Semana ${weekNum} · ${range}`;
}
