import test from "node:test";
import assert from "node:assert/strict";
import {
  addLocalDays,
  getCompletionCounts,
  getRollingDates,
  sortPlannerTasks,
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
