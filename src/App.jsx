import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./supabase";

const LANG = {
  zh: {
    title: "XMUM 截止日期追踪",
    signOut: "退出",
    startMon: "周一开始",
    startSun: "周日开始",
    selectDate: "← 点击日期或周标签查看事项",
    add: "+ 添加",
    save: "保存",
    update: "更新",
    cancel: "取消",
    location: "地点（如 A3_620、线上）",
    course: "课程代码（如 EEE3001）",
    title_: "标题 / 描述 *",
    noEvents: "暂无事项 — 点添加创建",
    holiday: "🎉 公共假期",
    midnight: "⚠️ 凌晨截止 — 请前一天完成！",
    midnightTag: " ⚠️ 请前一天完成",
    midnightTransfer: "⚠️ 前一天完成",
    dueToday: "· 今天截止",
    daysLeft: (n) => `· 还有 ${n} 天`,
    daysAgo: (n) => `· 已过 ${n} 天`,
    weekPanel: (l) => `${l} · 周事项`,
    weekNoEvents: "暂无事项 — 点添加创建",
    weekPending: "📌 待定具体日期",
    transferTitle: "📌 转移到具体日期",
    transferDay: "选择周几",
    transferLocation: "地点",
    transferConfirm: "确认转移",
    login: "登录账号",
    register: "创建账号",
    noAccount: "没有账号？",
    hasAccount: "已有账号？",
    toRegister: "注册",
    toLogin: "登录",
    loading: "加载中...",
    email: "邮箱",
    password: "密码（至少6位）",
    signIn: "登录",
    createAccount: "创建账号",
    holidayLegend: "假期",
    countdown1d: "倒计时1天",
    countdown3d: "倒计时≤3天",
    upcoming: (n, title) => `📅 ${title} 还有 ${n} 天截止`,
  },
  en: {
    title: "XMUM Deadline Tracker",
    signOut: "Sign Out",
    startMon: "Week starts Mon",
    startSun: "Week starts Sun",
    selectDate: "← Select a date or week to view events",
    add: "+ Add",
    save: "Save",
    update: "Update",
    cancel: "Cancel",
    location: "Location (e.g. A3_620, Online)",
    course: "Course (e.g. EEE3001)",
    title_: "Title / Description *",
    noEvents: "No events — click + Add to create one",
    holiday: "🎉 Public Holiday",
    midnight: "⚠️ Midnight — finish the night before!",
    midnightTag: " ⚠️ finish night before",
    midnightTransfer: "⚠️ finish night before",
    dueToday: "· Due today",
    daysLeft: (n) => `· ${n}d left`,
    daysAgo: (n) => `· ${n}d ago`,
    weekPanel: (l) => `${l} · Week Events`,
    weekNoEvents: "No events — click + Add to create one",
    weekPending: "📌 Date TBD",
    transferTitle: "📌 Transfer to Specific Date",
    transferDay: "Select day",
    transferLocation: "Location",
    transferConfirm: "Confirm",
    login: "Sign in to your account",
    register: "Create a new account",
    noAccount: "No account? ",
    hasAccount: "Have an account? ",
    toRegister: "Register",
    toLogin: "Sign In",
    loading: "Loading...",
    email: "Email",
    password: "Password (min 6 chars)",
    signIn: "Sign In",
    createAccount: "Create Account",
    holidayLegend: "Holiday",
    countdown1d: "Due in 1d",
    countdown3d: "Due in ≤3d",
    upcoming: (n, title) => `📅 ${title} due in ${n} day${n > 1 ? "s" : ""}`,
  }
};

const SEMESTERS = [
  {
    id: "2026-Apr",
    label: "2026/04",
    start: "2026-04-07",
    totalWeeks: 17,
    specialRanges: [
      { start: "2026-07-13", end: "2026-07-19", type: "revision" },
      { start: "2026-07-20", end: "2026-07-31", type: "exam" },
    ],
    holidays: ["2026-05-01", "2026-05-27", "2026-06-01", "2026-06-17"],
  },
  {
    id: "2026-Sep",
    label: "2026/09",
    start: "2026-09-29",
    totalWeeks: 17,
    specialRanges: [
      { start: "2027-01-04", end: "2027-01-10", type: "revision" },
      { start: "2027-01-11", end: "2027-01-21", type: "exam" },
    ],
    holidays: [
      "2026-09-16", "2026-11-08", "2026-11-09",
      "2026-12-11", "2026-12-25", "2027-01-01",
      "2027-01-22"
    ],
  },
];

const EVENT_TYPES = [
  { id: "exam",    label: "Exam",              color: "#ef4444" },
  { id: "midterm", label: "Midterm",           color: "#f97316" },
  { id: "project", label: "Project",           color: "#eab308" },
  { id: "asm",     label: "Assignment",        color: "#22c55e" },
  { id: "quiz",    label: "Quiz",              color: "#3b82f6" },
  { id: "pre",     label: "Presentation",      color: "#a855f7" },
  { id: "replace", label: "Replacement Class", color: "#06b6d4" },
  { id: "other",   label: "Other",             color: "#94a3b8" },
];

const DAYS_MON = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAYS_SUN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const WEEKENDS_MON = [5, 6];
const WEEKENDS_SUN = [0, 6];

function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function formatDate(dateStr, style) {
  const d = new Date(dateStr + "T00:00:00");
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const mon = MONTHS[d.getMonth()];
  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");
  if (style === "Apr10")  return `${mon}${dd}`;
  if (style === "10/04")  return `${dd}/${mm}`;
  if (style === "04/10")  return `${mm}/${dd}`;
  if (style === "10 Apr") return `${day} ${mon}`;
  if (style === "M月D日") return `${month}月${day}日`;
  return `${mon}${dd}`;
}

function getCellType(dateStr, specialRanges) {
  const dow = new Date(dateStr + "T00:00:00").getDay();
  for (const r of specialRanges) {
    if (dateStr >= r.start && dateStr <= r.end) {
      if (r.type === "exam" && (dow === 0 || dow === 6)) return "normal";
      return r.type;
    }
  }
  return "normal";
}

function getTodayUTC8() {
  const now = new Date();
  const utc8 = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return utc8.toISOString().split("T")[0];
}

function isMidnight(t) { return t >= "00:00" && t <= "05:59"; }

/**
 * Calculate effective days remaining, accounting for midnight deadlines.
 * If an event has a midnight time (00:00–05:59), it effectively needs to be
 * done the night before, so we subtract 1 from the raw diff.
 */
function getEffectiveDiff(dateStr, timeStr, today) {
  const rawDiff = Math.ceil(
    (new Date(dateStr + "T00:00:00") - new Date(today + "T00:00:00")) / 86400000
  );
  return isMidnight(timeStr) ? rawDiff - 1 : rawDiff;
}

/**
 * Returns urgency level for a set of events on a given cell date:
 *   1  → at least one event is due in exactly 1 effective day (orange)
 *   3  → at least one event is due in 2–3 effective days (green)
 *   0  → no urgency
 */
function getCellUrgency(dayEvents, date, today) {
  const rawDiff = Math.ceil(
    (new Date(date + "T00:00:00") - new Date(today + "T00:00:00")) / 86400000
  );
  let level = 0;
  for (const ev of dayEvents) {
    if (ev.done) continue;
    const effectiveDiff = isMidnight(ev.time) ? rawDiff - 1 : rawDiff;
    if (effectiveDiff === 1) return 1;           // most urgent — stop immediately
    if (effectiveDiff >= 2 && effectiveDiff <= 3) level = 3;
  }
  return level;
}

export default function App() {
  const today = getTodayUTC8();
  const [user, setUser] = useState(undefined);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [semId, setSemId]         = useState(() => localStorage.getItem("xmum_semId") || "2026-Apr");
  const [startDay, setStartDay]   = useState(() => localStorage.getItem("xmum_startDay") || "Mon");
  const [dateStyle, setDateStyle] = useState(() => localStorage.getItem("xmum_dateStyle") || "Apr10");
  const [lang, setLang]           = useState(() => localStorage.getItem("xmum_lang") || "zh");
  const [events, setEvents]       = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ type: "asm", course: "", title: "", location: "", time: "23:59" });
  const [transferring, setTransferring] = useState(null);
  const [transferForm, setTransferForm] = useState({ dayIndex: 0, location: "", time: "23:59" });

  const T = LANG[lang];

  useEffect(() => { localStorage.setItem("xmum_semId", semId); }, [semId]);
  useEffect(() => { localStorage.setItem("xmum_startDay", startDay); }, [startDay]);
  useEffect(() => { localStorage.setItem("xmum_dateStyle", dateStyle); }, [dateStyle]);
  useEffect(() => { localStorage.setItem("xmum_lang", lang); }, [lang]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setEvents([]); return; }
    supabase.from("events").select("*").eq("user_id", user.id)
      .then(({ data }) => setEvents(data || []));
  }, [user]);

  useEffect(() => {
    if (!user || events.length === 0) return;
    const overdue = events.filter(e =>
      !e.done &&
      e.date &&
      !e.date.startsWith("WEEK:") &&
      e.date < today
    );
    overdue.forEach(e => toggleDone(e.id, false));
  }, [events, today]);

  async function handleAuth() {
    setAuthError("");
    try {
      const fn = authMode === "register"
        ? supabase.auth.signUp
        : supabase.auth.signInWithPassword;
      const { error } = await fn.call(supabase.auth, { email: authEmail, password: authPassword });
      if (error) setAuthError(error.message);
    } catch (e) {
      setAuthError(e.message);
    }
  }

  async function addEvent() {
    if (!form.title.trim() || !user) return;
    if (editingId) {
      await supabase.from("events").update({ ...form }).eq("id", editingId);
      setEvents(prev => prev.map(e => e.id === editingId ? { ...e, ...form } : e));
      setEditingId(null);
    } else {
      const newEvent = { user_id: user.id, date: selectedDate, ...form, done: false };
      const { data } = await supabase.from("events").insert(newEvent).select().single();
      if (data) setEvents(prev => [...prev, data]);
    }
    setForm({ type: "asm", course: "", title: "", location: "", time: "23:59" });
    setShowForm(false);
  }

  async function toggleDone(id, currentDone) {
    await supabase.from("events").update({ done: !currentDone }).eq("id", id);
    setEvents(prev => prev.map(e => e.id === id ? { ...e, done: !currentDone } : e));
  }

  async function deleteEvent(id) {
    await supabase.from("events").delete().eq("id", id);
    setEvents(prev => prev.filter(e => e.id !== id));
  }

  const sem = SEMESTERS.find(s => s.id === semId) || SEMESTERS[0];
  const dayLabels  = startDay === "Mon" ? DAYS_MON : DAYS_SUN;
  const weekendCols = startDay === "Mon" ? WEEKENDS_MON : WEEKENDS_SUN;

  function getWeekDates(wi) {
    const base = wi * 7;
    if (startDay === "Mon")
      return Array.from({ length: 7 }, (_, i) => addDays(sem.start, base + i));
    else
      return Array.from({ length: 7 }, (_, i) => addDays(sem.start, base + i - 1));
  }

  const rows = [];
  let normalCount = 0;
  for (let wi = 0; wi < sem.totalWeeks; wi++) {
    const dates = getWeekDates(wi);
    const wed = dates.find(d => new Date(d + "T00:00:00").getDay() === 3) || dates[2];
    const rowType = getCellType(wed, sem.specialRanges);
    let label, labelClass;
    if (rowType === "revision") { label = "REV"; labelClass = "rev"; }
    else if (rowType === "exam") { label = "EXAM"; labelClass = "exam"; }
    else { normalCount++; label = `Week ${normalCount}`; labelClass = ""; }
    rows.push({ dates, label, labelClass, rowType });
  }

  function getWeekEventKey(sid, weekLabel) { return `WEEK:${sid}:${weekLabel}`; }
  function getEventsForWeek(weekLabel) { return events.filter(e => e.date === getWeekEventKey(semId, weekLabel)); }
  function getEventsForDate(d) { return events.filter(e => e.date === d); }
  function getTypeInfo(tid) { return EVENT_TYPES.find(t => t.id === tid) || EVENT_TYPES[EVENT_TYPES.length - 1]; }
  function getTypesForDate(date) {
    const tp = getCellType(date, sem.specialRanges);
    if (tp === "exam") return EVENT_TYPES;
    return EVENT_TYPES.filter(e => e.id !== "exam");
  }

  useEffect(() => {
    if (!user || events.length === 0) return;
    if (!("Notification" in window)) return;
    Notification.requestPermission().then(perm => {
      if (perm !== "granted") return;
      const soon = events.filter(e => {
        if (e.done || !e.date || e.date.startsWith("WEEK:")) return false;
        const effectiveDiff = getEffectiveDiff(e.date, e.time, today);
        return effectiveDiff === 1 || effectiveDiff === 3;
      });
      soon.forEach(e => {
        const effectiveDiff = getEffectiveDiff(e.date, e.time, today);
        new Notification(T.upcoming(effectiveDiff, e.title));
      });
    });
  }, [user, today]);

  const selEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const isHoliday = selectedDate ? sem.holidays.includes(selectedDate) : false;
  const panelOpen = !!selectedDate;

  // ── 加载中 ──
  if (user === undefined) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"#888"}}>
      {T.loading}
    </div>
  );

  // ── 未登录 ──
  if (!user) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#f5f4f0"}}>
      <div style={{background:"white",padding:"40px",borderRadius:"12px",width:"360px",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
          <h2 style={{fontSize:"20px"}}>📅 XMUM</h2>
          <button onClick={() => setLang(l => l === "zh" ? "en" : "zh")}
            style={{background:"none",border:"1px solid #ddd",borderRadius:"6px",padding:"4px 10px",fontSize:"13px",cursor:"pointer",fontWeight:600}}>
            {lang === "zh" ? "EN" : "中"}
          </button>
        </div>
        <p style={{color:"#888",fontSize:"13px",marginBottom:"24px"}}>
          {authMode === "login" ? T.login : T.register}
        </p>
        <input type="email" placeholder={T.email} value={authEmail}
          onChange={e => setAuthEmail(e.target.value)}
          style={{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1px solid #ddd",marginBottom:"10px",fontSize:"14px"}} />
        <input type="password" placeholder={T.password} value={authPassword}
          onChange={e => setAuthPassword(e.target.value)}
          style={{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1px solid #ddd",marginBottom:"16px",fontSize:"14px"}} />
        {authError && <p style={{color:"#e53e3e",fontSize:"12px",marginBottom:"12px"}}>{authError}</p>}
        <button onClick={handleAuth}
          style={{width:"100%",padding:"11px",background:"#2563eb",color:"white",border:"none",borderRadius:"8px",fontSize:"14px",fontWeight:"600",cursor:"pointer",marginBottom:"12px"}}>
          {authMode === "login" ? T.signIn : T.createAccount}
        </button>
        <p style={{textAlign:"center",fontSize:"13px",color:"#888"}}>
          {authMode === "login" ? T.noAccount : T.hasAccount}
          <span onClick={() => { setAuthMode(m => m === "login" ? "register" : "login"); setAuthError(""); }}
            style={{color:"#2563eb",cursor:"pointer",fontWeight:"500"}}>
            {authMode === "login" ? T.toRegister : T.toLogin}
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="app">
      {/* TOP BAR */}
      <div className="topbar">
        <div className="topbar-title">
          <span className="logo">📅</span>
          <span>{T.title}</span>
        </div>
        <div className="topbar-controls">
          <select value={semId} onChange={e => setSemId(e.target.value)}>
            {SEMESTERS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <select value={startDay} onChange={e => setStartDay(e.target.value)}>
            <option value="Mon">{T.startMon}</option>
            <option value="Sun">{T.startSun}</option>
          </select>
          <select value={dateStyle} onChange={e => setDateStyle(e.target.value)}>
            <option value="Apr10">Apr10</option>
            <option value="10/04">10/04</option>
            <option value="04/10">04/10</option>
            <option value="10 Apr">10 Apr</option>
            <option value="M月D日">M月D日</option>
          </select>
          <button onClick={() => setLang(l => l === "zh" ? "en" : "zh")}
            style={{background:"none",border:"1px solid var(--border)",borderRadius:"6px",padding:"6px 12px",fontSize:"13px",cursor:"pointer",color:"var(--text-muted)",fontWeight:600}}>
            {lang === "zh" ? "EN" : "中"}
          </button>
          <button onClick={() => supabase.auth.signOut()}
            style={{background:"none",border:"1px solid var(--border)",borderRadius:"6px",padding:"6px 12px",fontSize:"13px",cursor:"pointer",color:"var(--text-muted)"}}>
            {T.signOut}
          </button>
        </div>
      </div>

      {/* LEGEND */}
      <div className="legend">
        {EVENT_TYPES.map(tp => (
          <span key={tp.id} className="legend-item">
            <span className="legend-dot" style={{ background: tp.color }} />{tp.label}
          </span>
        ))}
        <span className="legend-item">
          <span style={{ display:"inline-block", width:"14px", height:"4px", borderRadius:"2px", background:"#f59e0b" }} />{T.holidayLegend}
        </span>
        {/* Countdown warning legend items */}
        <span className="legend-item">
          <span className="legend-dot" style={{ background: "#f97316" }} />
          <span style={{ color: "#f97316", fontWeight: 600 }}>{T.countdown1d}</span>
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: "#22c55e" }} />
          <span style={{ color: "#22c55e", fontWeight: 600 }}>{T.countdown3d}</span>
        </span>
      </div>

      <div className={`main ${panelOpen || selectedWeek ? "panel-open" : "panel-closed"}`}>
        {/* CALENDAR */}
        <div className="calendar-wrap">
          <table className="cal-table">
            <thead>
              <tr>
                <th className="week-col" />
                {dayLabels.map((d, i) => (
                  <th key={d} className={weekendCols.includes(i) ? "weekend-head" : "weekday-head"}>
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  <td
                    className={`week-label ${row.labelClass}`}
                    style={{ cursor: "pointer", position: "relative" }}
                    onClick={() => { setSelectedWeek({ ...row, weekIndex: ri }); setSelectedDate(null); setShowForm(false); setTransferring(null); }}
                  >
                    {row.label}
                    {getEventsForWeek(row.label).length > 0 && (
                      <span style={{ display:"block", width:"5px", height:"5px", borderRadius:"50%", background:"#94a3b8", margin:"2px auto 0" }} />
                    )}
                  </td>
                  {row.dates.map((date, di) => {
                    const cellType = getCellType(date, sem.specialRanges);
                    const isWknd = weekendCols.includes(di);
                    const dayEvents = getEventsForDate(date);
                    const holiday = sem.holidays.includes(date);
                    const isSelected = selectedDate === date;
                    const isToday = date === today;
                    // Determine urgency badge level for this cell
                    const urgency = getCellUrgency(dayEvents, date, today);
                    let cls = "cal-cell";
                    if (isWknd)                  cls += " weekend";
                    if (cellType === "revision")  cls += " revision";
                    else if (cellType === "exam") cls += " exam-day";
                    if (holiday)                  cls += " holiday";
                    if (isSelected)               cls += " selected";
                    return (
                      <td key={di} className={cls}
                        onClick={() => { setSelectedDate(date); setSelectedWeek(null); setShowForm(false); setTransferring(null); }}>
                        <div className="cell-content">
                          {/* Urgency corner badge */}
                          {urgency > 0 && (
                            <span className={`urgency-badge urgency-${urgency}`} title={urgency === 1 ? T.countdown1d : T.countdown3d} />
                          )}
                          <span className={`date-num${isToday ? " today-num" : ""}`}>
                            {formatDate(date, dateStyle)}
                          </span>
                          <div className="dot-row">
                            {dayEvents.map(ev => (
                              <span key={ev.id} className="event-dot"
                                style={{ background: getTypeInfo(ev.type).color, opacity: ev.done ? 0.3 : 1 }} />
                            ))}
                            {holiday && <span style={{
                              display:"inline-block", width:"14px", height:"4px",
                              borderRadius:"2px", background:"#f59e0b", marginTop:"3px"
                            }} />}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT PANEL */}
        <div className="panel">
          <div className="mobile-handle" />

          {/* 转移弹窗 */}
          {transferring && (
            <div style={{ padding:"16px", borderBottom:"1px solid var(--border)", background:"#fffbeb" }}>
              <div style={{ fontWeight:600, fontSize:"13px", marginBottom:"12px" }}>
                {T.transferTitle}
              </div>
              <div style={{ marginBottom:"8px", fontSize:"12px", color:"var(--text-muted)" }}>{T.transferDay}</div>
              <select
                value={transferForm.dayIndex}
                onChange={e => setTransferForm(f => ({ ...f, dayIndex: parseInt(e.target.value) }))}
                style={{ width:"100%", padding:"7px 10px", borderRadius:"7px", border:"1px solid var(--border)", marginBottom:"8px", fontSize:"13px" }}
              >
                {selectedWeek && selectedWeek.dates.map((date, i) => (
                  <option key={i} value={i}>
                    {dayLabels[i]}（{formatDate(date, dateStyle)}）
                  </option>
                ))}
              </select>
              <input placeholder={T.transferLocation} value={transferForm.location}
                onChange={e => setTransferForm(f => ({ ...f, location: e.target.value }))}
                style={{ width:"100%", padding:"7px 10px", borderRadius:"7px", border:"1px solid var(--border)", marginBottom:"8px", fontSize:"13px" }} />
              <div style={{ display:"flex", gap:"6px", marginBottom:"8px" }}>
                <input type="time" value={transferForm.time}
                  onChange={e => setTransferForm(f => ({ ...f, time: e.target.value }))}
                  style={{ flex:1, padding:"7px 10px", borderRadius:"7px", border:"1px solid var(--border)", fontSize:"13px" }} />
                {isMidnight(transferForm.time) && <span style={{ fontSize:"11px", color:"#ea580c", alignSelf:"center" }}>⚠️ {T.midnightTransfer}</span>}
              </div>
              <div style={{ display:"flex", gap:"8px" }}>
                <button onClick={async () => {
                  const newDate = selectedWeek.dates[transferForm.dayIndex];
                  await supabase.from("events").update({ date: newDate, location: transferForm.location, time: transferForm.time }).eq("id", transferring.id);
                  setEvents(prev => prev.map(e => e.id === transferring.id ? { ...e, date: newDate, location: transferForm.location, time: transferForm.time } : e));
                  setTransferring(null);
                  setSelectedDate(newDate);
                  setSelectedWeek(null);
                }} style={{ flex:1, padding:"8px", background:"#2563eb", color:"white", border:"none", borderRadius:"7px", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
                  {T.transferConfirm}
                </button>
                <button onClick={() => setTransferring(null)}
                  style={{ padding:"8px 14px", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:"7px", fontSize:"13px", cursor:"pointer" }}>
                  {T.cancel}
                </button>
              </div>
            </div>
          )}

          {/* 周面板 */}
          {selectedWeek && !transferring && (
            <>
              <div className="panel-header">
                <div className="panel-date">{T.weekPanel(selectedWeek.label)}</div>
                <div style={{ display:"flex", gap:"6px" }}>
                  <button className="add-btn" onClick={() => {
                    setShowForm(f => !f);
                    setEditingId(null);
                    setForm({ type: "asm", course: "", title: "", location: "", time: "23:59" });
                  }}>{showForm ? "✕" : T.add}</button>
                  <button className="close-btn" onClick={() => { setSelectedWeek(null); setShowForm(false); }}>✕</button>
                </div>
              </div>

              {showForm && (
                <div className="add-form">
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {getTypesForDate(selectedWeek.dates[2]).map(tp => (
                      <option key={tp.id} value={tp.id}>{tp.label}</option>
                    ))}
                  </select>
                  <input placeholder={T.course} value={form.course}
                    onChange={e => setForm(f => ({ ...f, course: e.target.value }))} />
                  <input placeholder={T.title_} value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                  <button className="save-btn" onClick={async () => {
                    if (!form.title.trim() || !user) return;
                    const weekKey = getWeekEventKey(semId, selectedWeek.label);
                    if (editingId) {
                      await supabase.from("events").update({ type: form.type, course: form.course, title: form.title }).eq("id", editingId);
                      setEvents(prev => prev.map(e => e.id === editingId ? { ...e, type: form.type, course: form.course, title: form.title } : e));
                      setEditingId(null);
                    } else {
                      const newEv = { user_id: user.id, date: weekKey, type: form.type, course: form.course, title: form.title, location: "", time: "", done: false };
                      const { data } = await supabase.from("events").insert(newEv).select().single();
                      if (data) setEvents(prev => [...prev, data]);
                    }
                    setForm({ type: "asm", course: "", title: "", location: "", time: "23:59" });
                    setShowForm(false);
                  }}>{editingId ? T.update : T.save}</button>
                </div>
              )}

              <div className="event-list">
                {getEventsForWeek(selectedWeek.label).length === 0 && !showForm && (
                  <div className="no-events">{T.weekNoEvents}</div>
                )}
                {getEventsForWeek(selectedWeek.label).map(ev => {
                  const tp = getTypeInfo(ev.type);
                  return (
                    <div key={ev.id} className="event-card">
                      <div className="event-card-left" style={{ borderColor: tp.color }}>
                        <span className="event-type-badge" style={{ background: tp.color + "22", color: tp.color }}>{tp.label}</span>
                        <div className="event-title">{ev.title}</div>
                        {ev.course && <div className="event-meta">📚 {ev.course}</div>}
                        <div style={{ fontSize:"11px", color:"#f59e0b", marginTop:"4px" }}>{T.weekPending}</div>
                      </div>
                      <div className="event-actions">
                        <button title={T.transferTitle} onClick={() => {
                          setTransferring(ev);
                          setTransferForm({ dayIndex: 0, location: "", time: "23:59" });
                        }}>📅</button>
                        <button title={T.update} onClick={() => {
                          setForm({ type: ev.type, course: ev.course, title: ev.title, location: "", time: "" });
                          setEditingId(ev.id);
                          setShowForm(true);
                        }}>✏️</button>
                        <button onClick={() => deleteEvent(ev.id)}>🗑</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* 日期面板 */}
          {!selectedWeek && !transferring && (
            <>
              {!panelOpen ? (
                <div className="no-events" style={{ padding:"40px 20px", textAlign:"center", color:"var(--text-faint, #a8a29e)", fontSize:"13px" }}>
                  {T.selectDate}
                </div>
              ) : (
                <>
                  <div className="panel-header">
                    <div>
                      <div className="panel-date">
                        {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                          lang === "zh" ? "zh-CN" : "en-GB",
                          { weekday: "long", year: "numeric", month: "long", day: "numeric" }
                        )}
                      </div>
                      {isHoliday && <div className="holiday-badge">{T.holiday}</div>}
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button className="add-btn" onClick={() => { setShowForm(f => !f); setEditingId(null); setForm({ type: "asm", course: "", title: "", location: "", time: "23:59" }); }}>
                        {showForm ? "✕" : T.add}
                      </button>
                      <button className="close-btn" onClick={() => { setSelectedDate(null); setShowForm(false); }}>✕</button>
                    </div>
                  </div>

                  {showForm && (
                    <div className="add-form">
                      <select value={form.type} onChange={e => {
                        const newType = e.target.value;
                        setForm(f => {
                          const match = events.find(ev => ev.type === newType && ev.course.trim().toLowerCase() === f.course.trim().toLowerCase() && f.course.trim() !== "" && ev.id !== editingId);
                          return { ...f, type: newType, location: match ? match.location : f.location, time: match ? match.time : f.time };
                        });
                      }}>
                        {getTypesForDate(selectedDate).map(tp => (
                          <option key={tp.id} value={tp.id}>{tp.label}</option>
                        ))}
                      </select>
                      <input placeholder={T.course} value={form.course}
                        onChange={e => {
                          const newCourse = e.target.value;
                          setForm(f => {
                            const match = events.find(ev => ev.type === f.type && ev.course.trim().toLowerCase() === newCourse.trim().toLowerCase() && ev.id !== editingId);
                            return { ...f, course: newCourse, location: match ? match.location : f.location, time: match ? match.time : f.time };
                          });
                        }} />
                      <input placeholder={T.title_} value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                      <input placeholder={T.location} value={form.location}
                        onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                      <div className="time-row">
                        <input type="time" value={form.time}
                          onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                        {isMidnight(form.time) && (
                          <span className="midnight-warn">{T.midnight}</span>
                        )}
                      </div>
                      <button className="save-btn" onClick={addEvent}>{editingId ? T.update : T.save}</button>
                    </div>
                  )}

                  <div className="event-list">
                    {selEvents.length === 0 && !showForm && (
                      <div className="no-events">{T.noEvents}</div>
                    )}
                    {selEvents.map(ev => {
                      const tp = getTypeInfo(ev.type);
                      const effectiveDiff = getEffectiveDiff(ev.date, ev.time, today);
                      return (
                        <div key={ev.id} className={`event-card ${ev.done ? "done" : ""}`}>
                          <div className="event-card-left" style={{ borderColor: tp.color }}>
                            <span className="event-type-badge" style={{ background: tp.color + "22", color: tp.color }}>{tp.label}</span>
                            <div className="event-title">{ev.title}</div>
                            {ev.course   && <div className="event-meta">📚 {ev.course}</div>}
                            {ev.location && <div className="event-meta">📍 {ev.location}</div>}
                            <div className="event-time">
                              🕐 {ev.time}
                              {isMidnight(ev.time) && <span className="midnight-tag">{T.midnightTag}</span>}
                              {/* Countdown with midnight-adjusted diff and color coding */}
                              {!ev.done && (() => {
                                if (effectiveDiff === 1) return (
                                  <span className="countdown countdown-1d">⚠️ {T.daysLeft(1)}</span>
                                );
                                if (effectiveDiff >= 2 && effectiveDiff <= 3) return (
                                  <span className="countdown countdown-3d">✅ {T.daysLeft(effectiveDiff)}</span>
                                );
                                if (effectiveDiff > 3) return (
                                  <span className="countdown countdown-ok">{T.daysLeft(effectiveDiff)}</span>
                                );
                                if (effectiveDiff === 0) return (
                                  <span className="countdown countdown-today">{T.dueToday}</span>
                                );
                                return (
                                  <span className="countdown countdown-past">{T.daysAgo(Math.abs(effectiveDiff))}</span>
                                );
                              })()}
                            </div>
                          </div>
                          <div className="event-actions">
                            <button onClick={() => toggleDone(ev.id, ev.done)}>{ev.done ? "↩" : "✓"}</button>
                            <button onClick={() => {
                              setForm({ type: ev.type, course: ev.course, title: ev.title, location: ev.location, time: ev.time });
                              setEditingId(ev.id);
                              setShowForm(true);
                            }}>✏️</button>
                            <button onClick={() => deleteEvent(ev.id)}>🗑</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
