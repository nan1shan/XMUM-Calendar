-- Independent, persistent tasks for the Morning / Afternoon Daily Planner.
-- Apply this migration in the Supabase project before using the planner.
create table if not exists public.daily_planner_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_date date not null,
  period text not null check (period in ('morning', 'afternoon')),
  title text not null check (length(trim(title)) between 1 and 300),
  is_completed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists daily_planner_tasks_user_date_order_idx
  on public.daily_planner_tasks (user_id, task_date, period, sort_order, created_at);

alter table public.daily_planner_tasks enable row level security;

drop policy if exists "Users can read their own planner tasks" on public.daily_planner_tasks;
create policy "Users can read their own planner tasks"
  on public.daily_planner_tasks for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can add their own planner tasks" on public.daily_planner_tasks;
create policy "Users can add their own planner tasks"
  on public.daily_planner_tasks for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own planner tasks" on public.daily_planner_tasks;
create policy "Users can update their own planner tasks"
  on public.daily_planner_tasks for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own planner tasks" on public.daily_planner_tasks;
create policy "Users can delete their own planner tasks"
  on public.daily_planner_tasks for delete
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.set_daily_planner_task_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists daily_planner_tasks_set_updated_at on public.daily_planner_tasks;
create trigger daily_planner_tasks_set_updated_at
  before update on public.daily_planner_tasks
  for each row execute function public.set_daily_planner_task_updated_at();

grant select, insert, update, delete on public.daily_planner_tasks to authenticated;
revoke all on table public.daily_planner_tasks from anon;
