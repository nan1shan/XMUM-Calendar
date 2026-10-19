import test from "node:test";
import assert from "node:assert/strict";
import {
  addLocalDays,
  getAlignedWeekDates,
  getAlignedWeekRowCount,
  getDateInTimeZone,
  getCompletionCounts,
  getRollingDates,
  sortPlannerTasks,
  shouldShowPlannerReminder,
  getWeekdayIndex,
} from "./dailyPlannerUtils.js";

test("rolling dates cover seven consecutive local calendar days", () => {
  assert.deepEqual(getRollingDates("2026-10-16"), [
    "2026-10-16", "2026-10-17", "2026-10-18", "2026-10-19",
    "2026-10-20", "2026-10-21", "2026-10-22",
  ]);
});

test("date arithmetic handles month, year, and leap-day boundaries", () => {
  assert.equal(addLocalDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addLocalDays("2028-02-28", 1), "2028-02-29");
  assert.equal(addLocalDays("2028-02-29", 1), "2028-03-01");
});

test("19 October 2026 is Monday and Kuala Lumpur's local date is independent of host timezone", () => {
  assert.equal(getWeekdayIndex("2026-10-19"), 1);
  assert.equal(getDateInTimeZone(new Date("2026-10-18T16:30:00.000Z")), "2026-10-19");
});

test("semester rows align dates with Monday or Sunday headings and retain the trailing partial row", () => {
  assert.deepEqual(getAlignedWeekDates("2026-09-29", "Mon", 3), [
    "2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23", "2026-10-24", "2026-10-25",
  ]);
  assert.deepEqual(getAlignedWeekDates("2026-09-29", "Sun", 3), [
    "2026-10-18", "2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23", "2026-10-24",
  ]);
  assert.equal(getAlignedWeekRowCount("2026-09-29", 17, "Mon"), 18);
  assert.equal(getAlignedWeekRowCount("2026-09-29", 17, "Sun"), 18);
});

test("completion counts include only planner tasks", () => {
  assert.deepEqual(getCompletionCounts([
    { is_completed: true }, { is_completed: false }, { is_completed: true },
  ]), { completed: 2, total: 3 });
  assert.deepEqual(getCompletionCounts([]), { completed: 0, total: 0 });
});

test("planner ordering is stable within each period", () => {
  const tasks = [
    { id: "b", period: "morning", sort_order: 2 },
    { id: "c", period: "afternoon", sort_order: 0 },
    { id: "a", period: "morning", sort_order: 0 },
  ];
  assert.deepEqual(sortPlannerTasks(tasks).map(task => task.id), ["a", "b", "c"]);
});

test("monthly planner reminders disappear after three elapsed calendar days without deleting tasks", () => {
  assert.equal(shouldShowPlannerReminder("2026-10-19", "2026-10-19"), true);
  assert.equal(shouldShowPlannerReminder("2026-10-18", "2026-10-19"), true);
  assert.equal(shouldShowPlannerReminder("2026-10-17", "2026-10-19"), true);
  assert.equal(shouldShowPlannerReminder("2026-10-16", "2026-10-19"), false);
  assert.equal(shouldShowPlannerReminder("2026-10-16", "2026-10-19", 4), true);
});
