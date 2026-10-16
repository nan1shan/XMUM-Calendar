import { supabase } from "./supabase";

const TABLE = "daily_planner_tasks";
const COLUMNS = "id,user_id,task_date,period,title,is_completed,sort_order,created_at,updated_at";

export async function fetchDailyPlannerTasks(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLUMNS)
    .eq("user_id", userId)
    .order("task_date", { ascending: true })
    .order("period", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return { data: data || [], error };
}

export async function createDailyPlannerTask(userId, task) {
  return supabase.from(TABLE).insert({ user_id: userId, ...task }).select(COLUMNS).single();
}

export async function updateDailyPlannerTask(userId, taskId, changes) {
  return supabase.from(TABLE)
    .update(changes)
    .eq("user_id", userId)
    .eq("id", taskId)
    .select(COLUMNS)
    .single();
}

export async function deleteDailyPlannerTask(userId, taskId) {
  return supabase.from(TABLE).delete().eq("user_id", userId).eq("id", taskId);
}

export async function updateDailyPlannerTaskOrder(userId, updates) {
  const results = await Promise.all(updates.map(({ id, sort_order }) =>
    supabase.from(TABLE).update({ sort_order }).eq("user_id", userId).eq("id", id)
  ));
  const error = results.find(result => result.error)?.error || null;
  return { error };
}
