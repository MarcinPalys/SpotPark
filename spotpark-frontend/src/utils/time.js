const pad = (n) => String(n).padStart(2, '0');

/** Local date as YYYY-MM-DD (what <input type="date"> uses). */
export function toDateInput(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Half-hour slots: "00:00" … "23:30". */
export const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => `${pad(Math.floor(i / 2))}:${i % 2 ? '30' : '00'}`);

/** True for a complete "HH:MM" value (what <input type="time"> gives once filled in). */
export const isTime = (t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t ?? '');

export const timeToMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
export const minutesToTime = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;

/** Next full hour today (capped so a 2-hour window still fits), plus a 2-hour end. */
export function defaultTimeWindow(now = new Date()) {
  const startMin = Math.min((now.getHours() + 1) * 60, 21 * 60);
  return { start: minutesToTime(startMin), end: minutesToTime(startMin + 120) };
}

export function hoursBetween(start, end) {
  return Math.max(0, (timeToMinutes(end) - timeToMinutes(start)) / 60);
}

/** "20 listopada" style label for a YYYY-MM-DD string. */
export function formatDayLabel(dateStr) {
  const today = toDateInput();
  const tomorrow = toDateInput(new Date(Date.now() + 86400000));
  if (dateStr === today) return 'Dzisiaj';
  if (dateStr === tomorrow) return 'Jutro';
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
}
