export function getLocalDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDateInTimeZone(date = new Date(), timeZone = "Asia/Kuala_Lumpur") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function getWeekdayIndex(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function getAlignedWeekDates(semesterStart, weekStartsOn, rowIndex) {
  const firstWeekday = weekStartsOn === "Mon" ? 1 : 0;
  const leadingDays = (getWeekdayIndex(semesterStart) - firstWeekday + 7) % 7;
  return Array.from({ length: 7 }, (_, index) =>
    addLocalDays(semesterStart, rowIndex * 7 + index - leadingDays)
  );
}

export function getAlignedWeekRowCount(semesterStart, totalWeeks, weekStartsOn) {
  const firstWeekday = weekStartsOn === "Mon" ? 1 : 0;
  const leadingDays = (getWeekdayIndex(semesterStart) - firstWeekday + 7) % 7;
  return Math.ceil((leadingDays + totalWeeks * 7) / 7);
}

export function addLocalDays(dateString, amount) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + amount);
  return getLocalDate(date);
}

export function getRollingDates(startDate, count = 7) {
  return Array.from({ length: count }, (_, index) => addLocalDays(startDate, index));
}

export function shouldShowPlannerReminder(taskDate, today, graceDays = 3) {
  return taskDate > addLocalDays(today, -graceDays);
}

export function sortPlannerTasks(tasks) {
  const periodOrder = { morning: 0, afternoon: 1 };
  return [...tasks].sort((a, b) =>
    (periodOrder[a.period] ?? 2) - (periodOrder[b.period] ?? 2) ||
    (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
    (a.created_at || "").localeCompare(b.created_at || "")
  );
}

export function getCompletionCounts(tasks = []) {
  return tasks.reduce((counts, task) => {
    counts.total += 1;
    if (task.is_completed) counts.completed += 1;
    return counts;
  }, { completed: 0, total: 0 });
}
