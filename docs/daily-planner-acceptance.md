# Daily Planner acceptance checklist

## Automated checks

- `npm run test` checks seven-day date ranges, month/year/leap-day arithmetic, task ordering, and completion counts.
- `npm run lint` checks the React application and helper modules.
- `npm run build` checks the production Vite bundle.

## Manual acceptance

First apply `supabase/migrations/20261016_daily_planner_tasks.sql` in Supabase and sign in to the app.

- [ ] Select a date; confirm Calendar Events and Daily Planner appear as separate sections.
- [ ] Add tasks to Morning and Afternoon, edit text, toggle complete/incomplete, delete, and reorder within a period.
- [ ] Move a task to another period and another date; confirm it appears once in the destination.
- [ ] Refresh, sign out and back in, and confirm planner tasks and completion state persist.
- [ ] Confirm old To-do planned items and the task pool remain available with their existing behavior.
- [ ] Add and complete tasks; confirm the month cell shows completed/total with no indicator on empty dates.
- [ ] Confirm a month-cell planner reminder disappears on the date three days after its task date while the task record remains accessible in the planner.
- [ ] Open Upcoming 7 Days; confirm the default range is today through today plus six days.
- [ ] Navigate backward and forward by seven days, then return to today.
- [ ] Confirm all calendar entries and planner tasks are visible; open a day and verify the existing event controls still work.
- [ ] Toggle tasks in the overview and verify the daily panel and month indicator update.
- [ ] Check narrow/mobile width: day cards stack vertically and month cells remain horizontally scrollable.
- [ ] Test dates across a month boundary, year boundary, and leap day.
- [ ] Verify that past Daily Planner tasks remain after their dates pass.
