import { useState } from "react";
import { getCompletionCounts, getRollingDates, sortPlannerTasks } from "./dailyPlannerUtils";

const copy = {
  zh: {
    planner: "每日计划", morning: "上午", afternoon: "下午", add: "添加", addPlaceholder: "添加计划任务…",
    empty: "暂无计划任务", loading: "正在加载计划…", error: "计划数据暂时无法使用。请检查数据库迁移和网络连接。",
    edit: "编辑", save: "保存", cancel: "取消", remove: "删除", move: "移动", date: "日期",
    earlier: "上移", later: "下移", completed: "已完成", tasks: "项计划", today: "今天",
    overview: "未来7天", previous: "前7天", next: "后7天", month: "返回月历", openDay: "打开每日详情",
    calendar: "日历事项", noEvents: "没有日历事项", noTasks: "尚无计划任务", progress: "完成",
    deadline: "截止事项", weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  },
  en: {
    planner: "Daily Planner", morning: "Morning", afternoon: "Afternoon", add: "Add", addPlaceholder: "Add a planning task…",
    empty: "No planned tasks", loading: "Loading planner…", error: "Planner data is unavailable. Check the database migration and connection.",
    edit: "Edit", save: "Save", cancel: "Cancel", remove: "Delete", move: "Move", date: "Date",
    earlier: "Move up", later: "Move down", completed: "completed", tasks: "planned", today: "Today",
    overview: "Upcoming 7 Days", previous: "Previous 7 days", next: "Next 7 days", month: "Monthly calendar", openDay: "Open daily details",
    calendar: "Calendar events", noEvents: "No calendar events", noTasks: "No planner tasks yet", progress: "complete",
    deadline: "Deadline", weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
};

function TaskList({ date, period, tasks, lang, onToggle, onEdit, onDelete, onMove, onReorder }) {
  const t = copy[lang];
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [movingId, setMovingId] = useState(null);
  const [moveDate, setMoveDate] = useState(date);
  const [movePeriod, setMovePeriod] = useState(period);
  const ordered = sortPlannerTasks(tasks.filter(task => task.period === period));

  async function submitNew(event) {
    event.preventDefault();
    const title = newText.trim();
    if (!title || adding) return;
    setAdding(true);
    try {
      const saved = await onEdit(null, { task_date: date, period, title });
      if (saved) setNewText("");
    } finally {
      setAdding(false);
    }
  }

  return (
    <section className="planner-period">
      <div className="planner-period-title">
        <h3>{t[period]}</h3><span>{ordered.filter(task => task.is_completed).length}/{ordered.length}</span>
      </div>
      {ordered.length === 0 ? <div className="planner-empty-period">{t.empty}</div> : (
        <ul className="planner-task-list">
          {ordered.map((task, index) => (
            <li key={task.id} className={`planner-task ${task.is_completed ? "is-complete" : ""}`}>
              <div className="planner-task-content">
                <button className="planner-check" type="button" aria-label={task.is_completed ? "Mark incomplete" : "Mark complete"}
                  onClick={() => onToggle(task)}>{task.is_completed ? "✓" : ""}</button>
                {editingId === task.id ? (
                  <div className="planner-inline-editor">
                    <input autoFocus value={editText} maxLength={300} onChange={event => setEditText(event.target.value)}
                      onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); onEdit(task, { title: editText.trim() }).then(ok => ok && setEditingId(null)); } }} />
                    <button type="button" onClick={() => onEdit(task, { title: editText.trim() }).then(ok => ok && setEditingId(null))}>{t.save}</button>
                    <button type="button" className="quiet" onClick={() => setEditingId(null)}>{t.cancel}</button>
                  </div>
                ) : <span className="planner-task-title">{task.title}</span>}
              </div>
              <div className="planner-task-actions">
                <button type="button" title={t.earlier} aria-label={t.earlier} disabled={index === 0} onClick={() => onReorder(ordered, index, -1)}>↑</button>
                <button type="button" title={t.later} aria-label={t.later} disabled={index === ordered.length - 1} onClick={() => onReorder(ordered, index, 1)}>↓</button>
                <button type="button" title={t.move} onClick={() => {
                  setMovingId(movingId === task.id ? null : task.id);
                  setMoveDate(task.task_date);
                  setMovePeriod(task.period);
                }}>↗</button>
                <button type="button" title={t.edit} onClick={() => { setEditingId(task.id); setEditText(task.title); }}>✎</button>
                <button type="button" title={t.remove} onClick={() => onDelete(task)}>×</button>
              </div>
              {movingId === task.id && (
                <div className="planner-move-controls">
                  <label><span>{t.date}</span><input type="date" value={moveDate} onChange={event => setMoveDate(event.target.value)} /></label>
                  <select aria-label={t.planner} value={movePeriod} onChange={event => setMovePeriod(event.target.value)}>
                    <option value="morning">{t.morning}</option><option value="afternoon">{t.afternoon}</option>
                  </select>
                  <button type="button" onClick={() => onMove(task, moveDate, movePeriod).then(ok => ok && setMovingId(null))}>{t.save}</button>
                  <button type="button" className="quiet" onClick={() => setMovingId(null)}>{t.cancel}</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <form className="planner-add-row" onSubmit={submitNew}>
        <input value={newText} maxLength={300} placeholder={t.addPlaceholder} onChange={event => setNewText(event.target.value)} />
        <button type="submit" disabled={!newText.trim() || adding}>{adding ? "…" : t.add}</button>
      </form>
    </section>
  );
}

export function PlannerSections({ date, tasks, lang, loading, error, onCreate, onUpdate, onToggle, onDelete, onMove, onReorder }) {
  const t = copy[lang];
  const dateTasks = sortPlannerTasks(tasks.filter(task => task.task_date === date));
  const counts = getCompletionCounts(dateTasks);
  const addTask = async (_task, payload) => onCreate(payload);
  const editTask = (task, changes) => task ? onUpdate(task, changes) : addTask(null, changes);
  return (
    <div className="daily-planner">
      <div className="daily-planner-heading">
        <div><span className="planner-eyebrow">{t.planner}</span><strong>{counts.completed}/{counts.total} {t.completed}</strong></div>
        {counts.total > 0 && <div className="planner-progress-track"><span style={{ width: `${Math.round((counts.completed / counts.total) * 100)}%` }} /></div>}
      </div>
      {loading && <div className="planner-status">{t.loading}</div>}
      {error && <div className="planner-error" role="status">{t.error}</div>}
      <div className="planner-periods">
        {(["morning", "afternoon"]).map(period => <TaskList key={period} date={date} period={period} tasks={dateTasks} lang={lang}
          onToggle={onToggle} onEdit={editTask} onDelete={onDelete} onMove={onMove} onReorder={onReorder} />)}
      </div>
    </div>
  );
}

export default function RollingOverview({ startDate, today, events, tasks, lang, loading, error,
  getTypeInfo, getVisualColor, getSubjectClass, onStartDate, onOpenDate, onCreate, onUpdate, onToggle, onDelete, onMove, onReorder, onClose }) {
  const t = copy[lang];
  const days = getRollingDates(startDate);
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${days[6]}T00:00:00`);
  const rangeLabel = `${start.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-GB", { day: "numeric", month: "short", year: "numeric" })} – ${end.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
  return (
    <section className="rolling-overview" aria-label={t.overview}>
      <header className="rolling-header">
        <div><h2>{t.overview}</h2><p>{rangeLabel}</p></div>
        <div className="rolling-actions">
          <button onClick={() => onStartDate(days[0] && addDate(days[0], -7))}>{t.previous}</button>
          <button onClick={() => onStartDate(today)}>{t.today}</button>
          <button onClick={() => onStartDate(addDate(days[0], 7))}>{t.next}</button>
          <button className="rolling-close" onClick={onClose}>{t.month}</button>
        </div>
      </header>
      {loading && <div className="planner-status">{t.loading}</div>}
      {error && <div className="planner-error" role="status">{t.error}</div>}
      <div className="rolling-grid">
        {days.map(date => {
          const dateObject = new Date(`${date}T00:00:00`);
          const dayEvents = events.filter(event => event.date === date);
          const dayTasks = tasks.filter(task => task.task_date === date);
          const counts = getCompletionCounts(dayTasks);
          const isToday = date === today;
          return (
            <article key={date} className={`rolling-day-card ${isToday ? "is-today" : ""}`}>
              <button className="rolling-day-heading" onClick={() => onOpenDate(date)} title={t.openDay}>
                <span>{t.weekday[dateObject.getDay()]}</span><strong>{dateObject.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-GB", { day: "numeric", month: "short" })}</strong>
                {isToday && <em>{t.today}</em>}
              </button>
              <div className="rolling-day-content">
                <section className="rolling-events">
                  <h3>{t.calendar}</h3>
                  {dayEvents.length ? dayEvents.map(event => {
                    const type = getTypeInfo(event.type);
                    const deadline = ["asm", "exam", "midterm", "project", "quiz", "pre"].includes(event.type);
                    return <button key={event.id} className={`rolling-event ${deadline ? "is-deadline" : ""} ${event.done ? "is-done" : ""}`} onClick={() => onOpenDate(date)}>
                      <span className="rolling-event-type" style={{ color: type.color, backgroundColor: `${type.color}18` }}>{type.label}</span>
                      <span className="rolling-event-title" style={{ "--event-color": getVisualColor(event) }}>{event.title}</span>
                      {event.course && <small className={getSubjectClass(event.course)}>{event.course}</small>}
                      {event.time && <small>{event.time}</small>}
                    </button>;
                  }) : <p className="rolling-empty">{t.noEvents}</p>}
                </section>
                <div className="rolling-planner-summary">{counts.completed}/{counts.total} {t.completed}</div>
                <PlannerSections date={date} tasks={tasks} lang={lang} loading={false} error={null} onCreate={onCreate} onUpdate={onUpdate}
                  onToggle={onToggle} onDelete={onDelete} onMove={onMove} onReorder={onReorder} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function addDate(date, days) {
  const [year, month, day] = date.split("-").map(Number);
  const result = new Date(year, month - 1, day);
  result.setDate(result.getDate() + days);
  return `${result.getFullYear()}-${String(result.getMonth() + 1).padStart(2, "0")}-${String(result.getDate()).padStart(2, "0")}`;
}
