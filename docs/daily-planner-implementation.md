# Daily Planner implementation

## Architecture found

The application is a React and Vite client. `src/App.jsx` owns the monthly calendar, selected-date panel, event records, course/custom labels, and the existing dual-mode To-do modal. Calendar events and labels use Supabase tables (`events` and `user_labels`) with account-scoped queries. Event records include course/custom labels and an event type; planner tasks are intentionally separate from this hierarchy.

The old To-do feature stores short-term planned tasks and an un-dated pool in the `todos` table. Its planned tasks are automatically removed after their date, while completed pool items expire after twelve hours. These behaviors remain for the legacy To-do feature. Daily Planner tasks use a new table and are never cleared based on age. Existing To-do records are neither deleted nor migrated.

The month grid selects a date to open the existing right-side detail panel; the panel already contains the calendar event editing actions. The new Daily Planner follows those event cards in a distinct section. The seven-day view replaces only the calendar grid, shares the same task state, and opens the existing daily detail panel when a day or event is clicked.

## Data model and persistence

`daily_planner_tasks` stores `user_id`, `task_date`, `period`, `title`, `is_completed`, `sort_order`, `created_at`, and `updated_at`. RLS policies limit each operation to the authenticated owner. The browser loads the signed-in user's planner rows once and uses the same in-memory records for the daily panel, monthly progress, and rolling overview. Mutations are written to Supabase before local state is updated.

Date values are plain `YYYY-MM-DD` calendar dates. Date range calculations construct local calendar dates and do not parse or serialize task dates through UTC. The current date is refreshed while the page is open and on window focus.

## Supabase setup required

The remote schema has not been changed by this code task. Before using the planner, apply [`../supabase/migrations/20261016_daily_planner_tasks.sql`](../supabase/migrations/20261016_daily_planner_tasks.sql) to the project's Supabase database, for example in the Supabase SQL Editor. The migration creates the table, index, ownership policies, grants, and `updated_at` trigger. No existing rows are modified.

If the migration has not been applied, the planner shows an unavailable status and writes will fail. Existing calendar and legacy To-do tables are untouched.

## Verification performed

- `npm run build` — passed.
- `npm run test` — passed (4 helper tests for seven-day ranges, date boundaries, completion counts, and ordering).
- `npm run lint` — passed. The integration also removed dead legacy helpers and an unused, incomplete custom-type state path that had caused the existing lint run to fail; no stored data or visible custom-item behavior was removed.
- Supabase CRUD and RLS were not exercised against the remote database. The migration must be applied first, and no remote schema changes were claimed.
- Interactive desktop/mobile acceptance was not run in a browser in this workspace; use the checklist in [`daily-planner-acceptance.md`](daily-planner-acceptance.md).

## Files

- `src/DailyPlanner.jsx` — reusable Morning/Afternoon planner controls and responsive rolling overview.
- `src/dailyPlannerApi.js` — Supabase data access for the new table.
- `src/dailyPlannerUtils.js` — local date, range, ordering, and completion helpers.
- `src/dailyPlannerUtils.test.js` — date boundary, range, ordering, and progress tests.
- `supabase/migrations/20261016_daily_planner_tasks.sql` — manual database migration.
- `docs/daily-planner-acceptance.md` — manual acceptance checklist.
