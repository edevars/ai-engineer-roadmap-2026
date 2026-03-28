export function getCurrentWeekKey() {
  const now = new Date();
  const year = now.getFullYear();

  // ISO week calculation: week starts on Monday
  const jan4 = new Date(year, 0, 4);
  const start = new Date(jan4);
  start.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7)); // Monday of week containing Jan 4

  const diff = now - start;
  const weekNum = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;

  return `${year}-W${String(weekNum).padStart(2, "0")}`;
}
