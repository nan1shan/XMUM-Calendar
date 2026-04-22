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
    share: "分享",
    shareTitle: "分享事项给他人",
    shareEmail: "对方邮箱",
    shareRange: "选择范围",
    shareAll: "全部学期",
    shareSem: "当前学期",
    shareWeek: "指定日期段",
    shareFrom: "从",
    shareTo: "到",
    shareAddRange: "+ 添加时间段",
    shareRemoveRange: "删除",
    shareTypes: "筛选类型（不选则全部）",
    shareCourses: "筛选课程（不选则全部）",
    courseNameHint: (name) => `💡 已有相似课程名：${name}，建议保持一致`,
    shareConfirm: "确认分享",
    shareSuccess: "分享成功！",
    shareNotFound: "找不到该用户",
    shareError: "分享失败，请重试",
    shareSelf: "不能分享给自己",
    inbox: "收件箱",
    inboxEmpty: "暂无待处理的分享",
    inboxFrom: "来自",
    inboxCount: (n) => `${n} 项事项`,
    inboxAccept: "接受",
    inboxReject: "拒绝",
    inboxAccepted: "已接受",
    inboxRejected: "已拒绝",
    sharePending: "等待对方确认",
    shareNote: "留言（可选）",
    customTypes: "自定义类型",
    customTypesTitle: "管理自定义类型",
    customTypeLabel: "类型名称",
    customTypeAdd: "添加",
    customTypeLimit: "最多5个自定义类型",
    customTypeDelete: "删除",
    customTypeSaved: "已保存",
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
    share: "Share",
    shareTitle: "Share Events",
    shareEmail: "Recipient email",
    shareRange: "Select range",
    shareAll: "All semesters",
    shareSem: "Current semester",
    shareWeek: "Date ranges",
    shareFrom: "From",
    shareTo: "To",
    shareAddRange: "+ Add range",
    shareRemoveRange: "Remove",
    shareTypes: "Filter by type (leave empty = all)",
    shareCourses: "Filter by course (leave empty = all)",
    courseNameHint: (name) => `💡 Similar course exists: ${name} — keep naming consistent`,
    shareConfirm: "Share",
    shareSuccess: "Shared successfully!",
    shareNotFound: "User not found",
    shareError: "Failed to share, please try again",
    shareSelf: "Cannot share with yourself",
    inbox: "Inbox",
    inboxEmpty: "No pending shares",
    inboxFrom: "From",
    inboxCount: (n) => `${n} event${n > 1 ? "s" : ""}`,
    inboxAccept: "Accept",
    inboxReject: "Reject",
    inboxAccepted: "Accepted",
    inboxRejected: "Rejected",
    sharePending: "Waiting for recipient",
    shareNote: "Note (optional)",
    customTypes: "Custom Types",
    customTypesTitle: "Manage Custom Types",
    customTypeLabel: "Type name",
    customTypeAdd: "Add",
    customTypeLimit: "Max 5 custom types",
    customTypeDelete: "Delete",
    customTypeSaved: "Saved",
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
  { id: "quiz",    label: "Quiz",              color: "#60a5fa" },
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

function getCacheKey(userId, semId) {
  return `xmum_events_${userId}_${semId}`;
}
function loadCache(userId, semId) {
  try {
    const raw = localStorage.getItem(getCacheKey(userId, semId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveCache(userId, semId, data) {
  try {
    localStorage.setItem(getCacheKey(userId, semId), JSON.stringify(data));
    localStorage.setItem(`${getCacheKey(userId, semId)}_ts`, Date.now().toString());
  } catch {}
}
function getCacheTs(userId, semId) {
  const ts = localStorage.getItem(`${getCacheKey(userId, semId)}_ts`);
  return ts ? parseInt(ts) : 0;
}

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
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem("xmum_remember") === "true");
  const [resetMode, setResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetStatus, setResetStatus] = useState("");

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
  const [showShare, setShowShare] = useState(false);
  const [customTypes, setCustomTypes] = useState([]);
  const [showCustomTypes, setShowCustomTypes] = useState(false);
  const [newTypeLabel, setNewTypeLabel] = useState("");
  const [newTypeColor, setNewTypeColor] = useState("#8b5cf6");
  const [shareEmail, setShareEmail] = useState("");
  const [shareRange, setShareRange] = useState("sem");
  const [shareDateRanges, setShareDateRanges] = useState([{ from: "", to: "" }]);
  const [shareSelectedTypes, setShareSelectedTypes] = useState([]);
  const [shareSelectedCourses, setShareSelectedCourses] = useState([]);
  const [shareStatus, setShareStatus] = useState("");
  const [shareNote, setShareNote] = useState("");
  const [showInbox, setShowInbox] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarYear, setCalendarYear] = useState("2026");
  const [inboxItems, setInboxItems] = useState([]);

  const T = LANG[lang];

  useEffect(() => {
    localStorage.setItem("xmum_semId", semId);
    setEvents([]);
  }, [semId]);
  useEffect(() => { localStorage.setItem("xmum_startDay", startDay); }, [startDay]);
  useEffect(() => { localStorage.setItem("xmum_dateStyle", dateStyle); }, [dateStyle]);
  useEffect(() => { localStorage.setItem("xmum_lang", lang); }, [lang]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "PASSWORD_RECOVERY") {
        setResetMode(true);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setEvents([]); return; }
    const sem_ = SEMESTERS.find(s => s.id === semId) || SEMESTERS[0];
    const semEnd = addDays(sem_.start, sem_.totalWeeks * 7);

    // 先读缓存，立即显示
    const cached = loadCache(user.id, semId);
    if (cached) setEvents(cached);

    // 判断是否需要重新拉取（缓存超过 5 分钟才请求）
    const cacheAge = Date.now() - getCacheTs(user.id, semId);
    if (cached && cacheAge < 5 * 60 * 1000) return;

    // 后台静默拉取最新数据
    supabase.from("events")
      .select("id,date,type,course,title,location,time,done")
      .eq("user_id", user.id)
      .or(`date.gte.${sem_.start},date.like.WEEK:${semId}:%`)
      .lte("date", semEnd)
      .then(({ data }) => {
        const filtered = (data || []).filter(e =>
          e.date.startsWith(`WEEK:${semId}:`) ||
          (e.date >= sem_.start && e.date <= semEnd)
        );
        setEvents(filtered);
        saveCache(user.id, semId, filtered);
      });
  }, [user, semId]);

  useEffect(() => {
    if (!user) { setCustomTypes([]); return; }
    supabase.from("custom_types").select("*").eq("user_id", user.id)
      .then(({ data }) => setCustomTypes(data || []));
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
      if (error) { setAuthError(error.message); return; }
      if (rememberMe) {
        localStorage.setItem("xmum_remember", "true");
        localStorage.setItem("xmum_saved_email", authEmail);
      } else {
        localStorage.removeItem("xmum_remember");
        localStorage.removeItem("xmum_saved_email");
      }
    } catch (e) {
      setAuthError(e.message);
    }
  }

  async function addEvent() {
    if (!form.title.trim() || !user) return;
    let updated;
    if (editingId) {
      await supabase.from("events").update({ ...form }).eq("id", editingId);
      updated = events.map(e => e.id === editingId ? { ...e, ...form } : e);
      setEditingId(null);
    } else {
      const newEvent = { user_id: user.id, date: selectedDate, ...form, done: false };
      const { data } = await supabase.from("events").insert(newEvent).select("id,date,type,course,title,location,time,done").single();
      updated = data ? [...events, data] : events;
    }
    setEvents(updated);
    saveCache(user.id, semId, updated);
    setForm({ type: "asm", course: "", title: "", location: "", time: "23:59", date: "" });
    setShowForm(false);
  }

  async function toggleDone(id, currentDone) {
    await supabase.from("events").update({ done: !currentDone }).eq("id", id);
    const updated = events.map(e => e.id === id ? { ...e, done: !currentDone } : e);
    setEvents(updated);
    saveCache(user.id, semId, updated);
  }

  async function deleteEvent(id) {
    await supabase.from("events").delete().eq("id", id);
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    saveCache(user.id, semId, updated);
  }

  async function toggleDone(id, currentDone) {
    await supabase.from("events").update({ done: !currentDone }).eq("id", id);
    setEvents(prev => prev.map(e => e.id === id ? { ...e, done: !currentDone } : e));
  }

  async function deleteEvent(id) {
    await supabase.from("events").delete().eq("id", id);
    setEvents(prev => prev.filter(e => e.id !== id));
  }

  useEffect(() => {
    if (!user) return;
    supabase.from("shared_events")
      .select("*")
      .eq("to_user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setInboxItems(data || []));
  }, [user]);

  async function shareEvents() {
    setShareStatus("loading");
    if (shareEmail.trim().toLowerCase() === user.email.toLowerCase()) {
      setShareStatus("self"); return;
    }
    const { data: profile } = await supabase
      .from("profiles").select("id").eq("email", shareEmail.trim()).single();
    if (!profile) { setShareStatus("notfound"); return; }
    let toShare = events.filter(e => !e.date.startsWith("WEEK:"));
    if (shareRange === "sem") {
      const sem_ = SEMESTERS.find(s => s.id === semId);
      toShare = toShare.filter(e => e.date >= sem_.start);
    } else if (shareRange === "week") {
      const validRanges = shareDateRanges.filter(r => r.from && r.to && r.from <= r.to);
      if (validRanges.length > 0) {
        toShare = toShare.filter(e => validRanges.some(r => e.date >= r.from && e.date <= r.to));
      }
    }
    if (shareSelectedTypes.length > 0) {
      toShare = toShare.filter(e => shareSelectedTypes.includes(e.type));
    }
    if (shareSelectedCourses.length > 0) {
      toShare = toShare.filter(e => shareSelectedCourses.includes(e.course?.trim().toLowerCase()));
    }
    if (toShare.length === 0) { setShareStatus("error"); return; }
    const { error } = await supabase.from("shared_events").insert({
      from_user_id: user.id,
      to_user_id: profile.id,
      from_email: user.email,
      note: shareNote.trim(),
      events_data: toShare.map(e => ({
        date: e.date, type: e.type, course: e.course,
        title: e.title, location: e.location, time: e.time,
      })),
    });
    setShareStatus(error ? "error" : "success");
  }

  async function acceptShare(item) {
    const copies = toShare.map(e => ({
      user_id: profile.id,
      date: e.date, type: e.type, course: e.course,
      title: e.title, location: e.location, time: e.time, done: false,
      shared_from: user.id,
      source_event_id: e.id,
    }));

    // 先删掉对方账号里来自我的、这次要覆盖的旧副本
    const sourceIds = toShare.map(e => e.id);
    await supabase.from("events")
      .delete()
      .eq("user_id", profile.id)
      .eq("shared_from", user.id)
      .in("source_event_id", sourceIds);

    // 再插入新的
    const { error } = await supabase.from("events").insert(copies);
    if (!error) {
      await supabase.from("shared_events").update({ status: "accepted" }).eq("id", item.id);
      setInboxItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "accepted" } : i));
      setEvents(prev => [...prev, ...copies.map((e, idx) => ({ ...e, id: `tmp_${idx}` }))]);
      supabase.from("events").select("*").eq("user_id", user.id)
        .then(({ data }) => setEvents(data || []));
    }
  }

  async function rejectShare(item) {
    await supabase.from("shared_events").update({ status: "rejected" }).eq("id", item.id);
    setInboxItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "rejected" } : i));
  }

  const PRESET_COLORS = [
    "#8b5cf6","#ec4899","#14b8a6","#f59e0b",
    "#6366f1","#84cc16","#f43f5e","#0ea5e9"
  ];

  async function addCustomType() {
    if (!newTypeLabel.trim() || !user) return;
    if (customTypes.length >= 5) return;
    const { data } = await supabase.from("custom_types")
      .insert({ user_id: user.id, label: newTypeLabel.trim(), color: newTypeColor })
      .select().single();
    if (data) setCustomTypes(prev => [...prev, data]);
    setNewTypeLabel("");
  }

  async function deleteCustomType(id) {
    await supabase.from("custom_types").delete().eq("id", id);
    setCustomTypes(prev => prev.filter(t => t.id !== id));
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
  function getAllTypes() { return [...EVENT_TYPES, ...customTypes.map(t => ({ id: t.id, label: t.label, color: t.color }))]; }
  function getTypeInfo(tid) { return getAllTypes().find(t => t.id === tid) || EVENT_TYPES[EVENT_TYPES.length - 1]; }
  function getTypesForDate(date) {
    const tp = getCellType(date, sem.specialRanges);
    const all = getAllTypes();
    if (tp === "exam") return all;
    return all.filter(e => e.id !== "exam");
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
  if (resetMode) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#f5f4f0"}}>
      <div style={{background:"white",padding:"40px",borderRadius:"12px",width:"360px",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <h2 style={{fontSize:"18px",marginBottom:"8px"}}>
          {lang === "zh" ? "🔑 设置新密码" : "🔑 Set New Password"}
        </h2>
        <p style={{fontSize:"12px",color:"#aaa",marginBottom:"20px"}}>
          {lang === "zh" ? "请输入你的新密码（至少 6 位）" : "Enter your new password (min. 6 chars)"}
        </p>
        <input type="password"
          placeholder={lang === "zh" ? "新密码" : "New password"}
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          style={{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1px solid #ddd",marginBottom:"14px",fontSize:"14px"}} />
        {resetStatus && (
          <p style={{fontSize:"12px",marginBottom:"12px",color: resetStatus.startsWith("✓") ? "#16a34a" : "#e53e3e"}}>
            {resetStatus}
          </p>
        )}
        <button onClick={async () => {
          if (newPassword.length < 6) {
            setResetStatus(lang === "zh" ? "密码至少 6 位" : "Min. 6 characters");
            return;
          }
          const { error } = await supabase.auth.updateUser({ password: newPassword });
          if (error) {
            setResetStatus(lang === "zh" ? "设置失败，请重试" : "Failed, please try again");
          } else {
            setResetStatus(lang === "zh" ? "✓ 密码已更新，正在跳转…" : "✓ Password updated, redirecting…");
            setTimeout(() => setResetMode(false), 1500);
          }
        }} style={{width:"100%",padding:"11px",background:"#2563eb",color:"white",border:"none",borderRadius:"8px",fontSize:"14px",fontWeight:"600",cursor:"pointer"}}>
          {lang === "zh" ? "确认设置" : "Confirm"}
        </button>
      </div>
    </div>
  );

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
        <input type="email" placeholder={T.email}
          value={authEmail || (rememberMe ? localStorage.getItem("xmum_saved_email") || "" : "")}
          onChange={e => setAuthEmail(e.target.value)}
          style={{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1px solid #ddd",marginBottom:"6px",fontSize:"14px"}} />
        <p style={{fontSize:"11px",color:"#aaa",marginBottom:"10px",lineHeight:"1.5"}}>
          {lang === "zh"
            ? "邮箱无需验证，建议使用学校邮箱（@xmu.edu.my）"
            : "No email verification required. School email (@xmu.edu.my) recommended."}
        </p>
        <input type="password" placeholder={T.password} value={authPassword}
          onChange={e => setAuthPassword(e.target.value)}
          style={{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1px solid #ddd",marginBottom:"6px",fontSize:"14px"}} />
        <p style={{fontSize:"11px",color:"#f59e0b",marginBottom:"14px",lineHeight:"1.5"}}>
          {lang === "zh"
            ? "⚠️ 请牢记密码，找回需通过注册邮箱"
            : "⚠️ Remember your password — recovery is via your registered email."}
        </p>
        <label style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",color:"#555",marginBottom:"14px",cursor:"pointer",userSelect:"none"}}>
          <input type="checkbox" checked={rememberMe}
            onChange={e => {
              setRememberMe(e.target.checked);
              localStorage.setItem("xmum_remember", e.target.checked);
              if (!e.target.checked) {
                localStorage.removeItem("xmum_saved_email");
              }
            }}
            style={{width:"15px",height:"15px",cursor:"pointer",accentColor:"#2563eb"}} />
          {lang === "zh" ? "记住我，下次自动登录" : "Remember me — skip login next time"}
        </label>
        {authError && <p style={{color:"#e53e3e",fontSize:"12px",marginBottom:"12px"}}>{authError}</p>}
        <button onClick={handleAuth}
          style={{width:"100%",padding:"11px",background:"#2563eb",color:"white",border:"none",borderRadius:"8px",fontSize:"14px",fontWeight:"600",cursor:"pointer",marginBottom:"12px"}}>
          {authMode === "login" ? T.signIn : T.createAccount}
        </button>
        {authMode === "login" && (
          <p style={{textAlign:"center",fontSize:"12px",marginBottom:"10px"}}>
            <span onClick={async () => {
              if (!authEmail) { setAuthError(lang === "zh" ? "请先填写邮箱" : "Please enter your email first"); return; }
              const { error } = await supabase.auth.resetPasswordForEmail(authEmail);
              setAuthError(error ? (lang === "zh" ? "发送失败，请检查邮箱" : "Failed, check your email") : (lang === "zh" ? "✓ 重置邮件已发送，请查收" : "✓ Reset email sent, check your inbox"));
            }} style={{color:"#2563eb",cursor:"pointer"}}>
              {lang === "zh" ? "忘记密码？" : "Forgot password?"}
            </span>
          </p>
        )}
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
          <button onClick={() => setShowInbox(s => !s)}
            style={{background:"none",border:"1px solid var(--border)",borderRadius:"6px",padding:"6px 12px",fontSize:"13px",cursor:"pointer",color:"var(--text-muted)",position:"relative"}}>
            {T.inbox}
            {inboxItems.filter(i => i.status === "pending").length > 0 && (
              <span style={{position:"absolute",top:"-4px",right:"-4px",width:"8px",height:"8px",borderRadius:"50%",background:"#ef4444"}} />
            )}
          </button>
          <button onClick={() => setShowCustomTypes(s => !s)}
            style={{background:"none",border:"1px solid var(--border)",borderRadius:"6px",padding:"6px 12px",fontSize:"13px",cursor:"pointer",color:"var(--text-muted)"}}>
            {T.customTypes}
          </button>
          <button onClick={() => { setShowShare(s => !s); setShareStatus(""); }}
            style={{background:"none",border:"1px solid var(--border)",borderRadius:"6px",padding:"6px 12px",fontSize:"13px",cursor:"pointer",color:"var(--text-muted)"}}>
            {T.share}
          </button>
          <a href="https://github.com/nan1shan/XMUM-Calendar#readme" target="_blank" rel="noreferrer"
            style={{background:"none",border:"1px solid var(--border)",borderRadius:"6px",padding:"6px 12px",
              fontSize:"13px",cursor:"pointer",color:"var(--text-muted)",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"4px"}}>
            {lang === "zh" ? "📖 使用说明" : "📖 Help"}
          </a>
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
          <span className="legend-dot" style={{ background:"#d97706" }} />
          <span style={{ color:"#d97706", fontWeight:600 }}>{T.holidayLegend}</span>
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
        <span className="legend-item" style={{marginLeft:"auto"}}>
          <button onClick={() => setShowCalendar(true)}
            style={{background:"none",border:"1px solid var(--border)",borderRadius:"6px",
              padding:"3px 10px",fontSize:"12px",cursor:"pointer",color:"var(--text-muted)",fontWeight:600}}>
            {lang === "zh" ? "📅 校历" : "📅 Academic Calendar"}
          </button>
        </span>
        
      {showCustomTypes && (
        <div className="share-overlay" onClick={e => { if (e.target === e.currentTarget) setShowCustomTypes(false); }}>
          <div className="share-modal">
            <div style={{fontWeight:700,fontSize:"15px",marginBottom:"16px"}}>{T.customTypesTitle}</div>
            <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"16px"}}>
              {customTypes.length === 0 && (
                <div style={{fontSize:"13px",color:"var(--text-faint)",textAlign:"center",padding:"12px 0"}}>—</div>
              )}
              {customTypes.map(t => (
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 10px",background:"var(--surface2)",borderRadius:"8px",border:"1px solid var(--border)"}}>
                  <span style={{width:"12px",height:"12px",borderRadius:"50%",background:t.color,flexShrink:0}} />
                  <span style={{flex:1,fontSize:"13px",fontWeight:500}}>{t.label}</span>
                  <button onClick={() => deleteCustomType(t.id)}
                    style={{background:"none",border:"none",cursor:"pointer",fontSize:"12px",color:"var(--text-muted)",padding:"2px 6px"}}>
                    {T.customTypeDelete}
                  </button>
                </div>
              ))}
            </div>
            {customTypes.length < 5 ? (
              <>
                <input placeholder={T.customTypeLabel} value={newTypeLabel}
                  onChange={e => setNewTypeLabel(e.target.value)}
                  style={{width:"100%",padding:"8px 10px",borderRadius:"7px",border:"1px solid var(--border)",marginBottom:"10px",fontSize:"13px"}} />
                <div style={{display:"flex",gap:"8px",marginBottom:"14px",flexWrap:"wrap"}}>
                  {PRESET_COLORS.map(c => (
                    <div key={c} onClick={() => setNewTypeColor(c)}
                      style={{width:"24px",height:"24px",borderRadius:"50%",background:c,cursor:"pointer",
                        outline: newTypeColor === c ? `3px solid ${c}` : "none",
                        outlineOffset:"2px",transition:"outline 0.1s"}} />
                  ))}
                </div>
                <div style={{display:"flex",gap:"8px"}}>
                  <button onClick={addCustomType}
                    style={{flex:1,padding:"9px",background:"var(--accent)",color:"white",border:"none",borderRadius:"7px",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>
                    {T.customTypeAdd}
                  </button>
                  <button onClick={() => setShowCustomTypes(false)}
                    style={{padding:"9px 14px",background:"none",border:"1px solid var(--border)",borderRadius:"7px",fontSize:"13px",cursor:"pointer"}}>
                    {T.cancel}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{fontSize:"12px",color:"#ea580c",textAlign:"center",marginBottom:"12px"}}>{T.customTypeLimit}</div>
                <button onClick={() => setShowCustomTypes(false)}
                  style={{width:"100%",padding:"9px",background:"none",border:"1px solid var(--border)",borderRadius:"7px",fontSize:"13px",cursor:"pointer"}}>
                  {T.cancel}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showCalendar && (
        <div className="share-overlay" onClick={e => { if (e.target === e.currentTarget) setShowCalendar(false); }}>
          <div style={{background:"var(--surface)",borderRadius:"14px",padding:"20px",
            width:"100%",maxWidth:"860px",boxShadow:"0 8px 32px rgba(0,0,0,0.15)",maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px",flexShrink:0}}>
              <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                <span style={{fontWeight:700,fontSize:"15px"}}>
                  {lang === "zh" ? "校历" : "Academic Calendar"}
                </span>
                {["2026"].map(y => (
                  <button key={y} onClick={() => setCalendarYear(y)}
                    style={{padding:"4px 12px",borderRadius:"6px",border:"1px solid var(--border)",
                      fontSize:"12px",cursor:"pointer",fontWeight:600,
                      background: calendarYear === y ? "var(--accent)" : "none",
                      color: calendarYear === y ? "white" : "var(--text-sub)"}}>
                    {y}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",gap:"8px"}}>
                <a href={`/calendar-${calendarYear}.jpg`} download={`XMUM-calendar-${calendarYear}.jpg`}
                  style={{padding:"6px 14px",background:"var(--accent)",color:"white",borderRadius:"7px",
                    fontSize:"13px",fontWeight:600,textDecoration:"none"}}>
                  {lang === "zh" ? "⬇ 下载" : "⬇ Download"}
                </a>
                <button onClick={() => setShowCalendar(false)}
                  style={{padding:"6px 12px",background:"none",border:"1px solid var(--border)",
                    borderRadius:"7px",fontSize:"13px",cursor:"pointer"}}>✕</button>
              </div>
            </div>
            <div style={{overflow:"auto",flex:1,borderRadius:"8px",border:"1px solid var(--border)"}}>
              <img src={`/calendar-${calendarYear}.jpg`} alt={`Academic Calendar ${calendarYear}`}
                style={{width:"100%",display:"block"}} />
            </div>
          </div>
        </div>
      )}
      </div>

      {showShare && (
        <div className="share-overlay" onClick={e => { if (e.target === e.currentTarget) setShowShare(false); }}>
          <div className="share-modal">
            <div style={{fontWeight:700, fontSize:"15px", marginBottom:"16px"}}>{T.shareTitle}</div>
            <input placeholder={T.shareEmail} value={shareEmail}
              onChange={e => { setShareEmail(e.target.value); setShareStatus(""); }}
              style={{width:"100%",padding:"8px 10px",borderRadius:"7px",border:"1px solid var(--border)",marginBottom:"10px",fontSize:"13px"}} />
            <div style={{fontSize:"12px",color:"var(--text-muted)",marginBottom:"6px"}}>{T.shareRange}</div>
            <div style={{display:"flex",gap:"6px",marginBottom:"10px"}}>
              {["all","sem","week"].map(r => (
                <button key={r} onClick={() => setShareRange(r)}
                  style={{flex:1,padding:"6px",borderRadius:"6px",border:"1px solid var(--border)",cursor:"pointer",fontSize:"12px",
                    background: shareRange === r ? "var(--accent)" : "none",
                    color: shareRange === r ? "white" : "var(--text-sub)"}}>
                  {T[`share${r.charAt(0).toUpperCase()+r.slice(1)}`]}
                </button>
              ))}
            </div>
            {shareRange === "week" && (
              <div style={{marginBottom:"10px"}}>
                {shareDateRanges.map((range, idx) => (
                  <div key={idx} style={{display:"flex",gap:"6px",alignItems:"center",marginBottom:"6px",flexWrap:"wrap"}}>
                    <span style={{fontSize:"12px",color:"var(--text-muted)",whiteSpace:"nowrap"}}>{T.shareFrom}</span>
                    <input type="date" value={range.from}
                      onChange={e => setShareDateRanges(prev => prev.map((r,i) => i===idx ? {...r, from: e.target.value} : r))}
                      style={{flex:1,minWidth:"120px",padding:"5px 8px",borderRadius:"6px",border:"1px solid var(--border)",fontSize:"12px"}} />
                    <span style={{fontSize:"12px",color:"var(--text-muted)",whiteSpace:"nowrap"}}>{T.shareTo}</span>
                    <input type="date" value={range.to}
                      onChange={e => setShareDateRanges(prev => prev.map((r,i) => i===idx ? {...r, to: e.target.value} : r))}
                      style={{flex:1,minWidth:"120px",padding:"5px 8px",borderRadius:"6px",border:"1px solid var(--border)",fontSize:"12px"}} />
                    {shareDateRanges.length > 1 && (
                      <button onClick={() => setShareDateRanges(prev => prev.filter((_,i) => i!==idx))}
                        style={{padding:"4px 8px",borderRadius:"6px",border:"1px solid var(--border)",fontSize:"11px",cursor:"pointer",color:"#e53e3e",background:"none",whiteSpace:"nowrap"}}>
                        {T.shareRemoveRange}
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => setShareDateRanges(prev => [...prev, { from: "", to: "" }])}
                  style={{fontSize:"12px",color:"var(--accent)",background:"none",border:"none",cursor:"pointer",padding:"2px 0",fontWeight:600}}>
                  {T.shareAddRange}
                </button>
              </div>
            )}
            {(() => {
              const allCourses = [...new Set(
                events
                  .filter(e => e.course?.trim() && !e.date.startsWith("WEEK:"))
                  .map(e => e.course.trim())
              )].sort();
              return allCourses.length > 0 ? (
                <>
                  <div style={{fontSize:"12px",color:"var(--text-muted)",marginBottom:"6px"}}>{T.shareCourses}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"14px"}}>
                    {allCourses.map(c => {
                      const key = c.toLowerCase();
                      const selected = shareSelectedCourses.includes(key);
                      return (
                        <button key={c} onClick={() => setShareSelectedCourses(prev =>
                          selected ? prev.filter(x => x !== key) : [...prev, key]
                        )} style={{padding:"3px 10px",borderRadius:"12px",fontSize:"11px",fontWeight:600,cursor:"pointer",
                          border:"1px solid var(--border-strong)",
                          background: selected ? "var(--text)" : "none",
                          color: selected ? "white" : "var(--text-sub)"}}>
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null;
            })()}
            <div style={{fontSize:"12px",color:"var(--text-muted)",marginBottom:"6px"}}>{T.shareTypes}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"14px"}}>
              {EVENT_TYPES.filter(t => t.id !== "exam").map(t => (
                <button key={t.id} onClick={() => setShareSelectedTypes(prev =>
                  prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id]
                )} style={{padding:"3px 8px",borderRadius:"12px",border:`1px solid ${t.color}`,cursor:"pointer",fontSize:"11px",fontWeight:600,
                  background: shareSelectedTypes.includes(t.id) ? t.color : "none",
                  color: shareSelectedTypes.includes(t.id) ? "white" : t.color}}>
                  {t.label}
                </button>
              ))}
            </div>
            <textarea placeholder={T.shareNote} value={shareNote}
              onChange={e => setShareNote(e.target.value)}
              rows={2}
              style={{width:"100%",padding:"8px 10px",borderRadius:"7px",border:"1px solid var(--border)",
                marginBottom:"12px",fontSize:"13px",resize:"none",fontFamily:"inherit"}} />
            {shareStatus === "success"  && <div style={{color:"#16a34a",fontSize:"12px",marginBottom:"8px"}}>✓ {T.shareSuccess}</div>}
            {shareStatus === "notfound" && <div style={{color:"#e53e3e",fontSize:"12px",marginBottom:"8px"}}>✕ {T.shareNotFound}</div>}
            {shareStatus === "error"    && <div style={{color:"#e53e3e",fontSize:"12px",marginBottom:"8px"}}>✕ {T.shareError}</div>}
            {shareStatus === "self"     && <div style={{color:"#e53e3e",fontSize:"12px",marginBottom:"8px"}}>✕ {T.shareSelf}</div>}
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={shareEvents} disabled={shareStatus==="loading"}
                style={{flex:1,padding:"9px",background:"var(--accent)",color:"white",border:"none",borderRadius:"7px",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>
                {shareStatus === "loading" ? "..." : T.shareConfirm}
              </button>
              <button onClick={() => setShowShare(false)}
                style={{padding:"9px 14px",background:"none",border:"1px solid var(--border)",borderRadius:"7px",fontSize:"13px",cursor:"pointer"}}>
                {T.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {showInbox && (
        <div className="share-overlay" onClick={e => { if (e.target === e.currentTarget) setShowInbox(false); }}>
          <div className="share-modal">
            <div style={{fontWeight:700, fontSize:"15px", marginBottom:"16px"}}>{T.inbox}</div>
            {inboxItems.length === 0 && (
              <div style={{color:"var(--text-faint)",fontSize:"13px",textAlign:"center",padding:"20px 0"}}>{T.inboxEmpty}</div>
            )}
            {inboxItems.map(item => (
              <div key={item.id} style={{padding:"12px",borderRadius:"9px",border:"1px solid var(--border)",marginBottom:"8px",background:"var(--surface2)"}}>
                <div style={{fontSize:"12px",color:"var(--text-muted)",marginBottom:"4px"}}>
                  {T.inboxFrom} <strong>{item.from_email}</strong>
                </div>
                {item.note && (
                  <div style={{fontSize:"12px",color:"var(--text-sub)",background:"var(--surface)",
                    border:"1px solid var(--border)",borderRadius:"6px",padding:"6px 10px",marginBottom:"8px",
                    fontStyle:"italic"}}>
                    "{item.note}"
                  </div>
                )}
                <div style={{fontSize:"13px",fontWeight:600,marginBottom:"8px"}}>
                  {T.inboxCount(item.events_data.length)}
                  <span style={{marginLeft:"8px",fontSize:"11px",color:"var(--text-muted)"}}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"8px"}}>
                  {item.events_data.slice(0,5).map((e,i) => (
                    <span key={i} style={{fontSize:"10px",padding:"2px 6px",borderRadius:"4px",
                      background: getTypeInfo(e.type).color + "22", color: getTypeInfo(e.type).color, fontWeight:600}}>
                      {e.course || e.title}
                    </span>
                  ))}
                  {item.events_data.length > 5 && (
                    <span style={{fontSize:"10px",color:"var(--text-muted)"}}>+{item.events_data.length - 5}</span>
                  )}
                </div>
                {item.status === "pending" ? (
                  <div style={{display:"flex",gap:"8px"}}>
                    <button onClick={() => acceptShare(item)}
                      style={{flex:1,padding:"7px",background:"#16a34a",color:"white",border:"none",borderRadius:"6px",fontSize:"12px",fontWeight:600,cursor:"pointer"}}>
                      {T.inboxAccept}
                    </button>
                    <button onClick={() => rejectShare(item)}
                      style={{flex:1,padding:"7px",background:"none",border:"1px solid #e53e3e",color:"#e53e3e",borderRadius:"6px",fontSize:"12px",fontWeight:600,cursor:"pointer"}}>
                      {T.inboxReject}
                    </button>
                  </div>
                ) : (
                  <div style={{fontSize:"12px",fontWeight:600,color: item.status === "accepted" ? "#16a34a" : "#94a3b8"}}>
                    {item.status === "accepted" ? `✓ ${T.inboxAccepted}` : `✕ ${T.inboxRejected}`}
                  </div>
                )}
              </div>
            ))}
            <button onClick={() => setShowInbox(false)}
              style={{width:"100%",marginTop:"8px",padding:"9px",background:"none",border:"1px solid var(--border)",borderRadius:"7px",fontSize:"13px",cursor:"pointer"}}>
              {T.cancel}
            </button>
          </div>
        </div>
      )}

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
                  {(() => {
                    const weekEvs = getEventsForWeek(row.label).filter(e => !e.done);
                    const weekColor = weekEvs.length > 0 ? getTypeInfo(weekEvs[0].type).color : null;
                    return (
                      <td
                        className={`week-label ${row.labelClass}`}
                        style={{
                          cursor: "pointer", position: "relative",
                          ...(weekColor ? {
                            background: weekColor + "22",
                            border: `1.5px solid ${weekColor}88`,
                            borderRadius: "4px",
                          } : {})
                        }}
                        onClick={() => { setSelectedWeek({ ...row, weekIndex: ri }); setSelectedDate(null); setShowForm(false); setTransferring(null); }}
                      >
                        {row.label}
                        {weekEvs.length > 1 && (
                          <span style={{ display:"block", fontSize:"8px", color: weekColor, fontWeight:800, marginTop:"1px" }}>
                            ×{weekEvs.length}
                          </span>
                        )}
                      </td>
                    );
                  })()}
                  {row.dates.map((date, di) => {
                    const cellType = getCellType(date, sem.specialRanges);
                    const isWknd = weekendCols.includes(di);
                    const dayEvents = getEventsForDate(date);
                    const undoneEvents = dayEvents.filter(ev => !ev.done);
                    const hasEvents = undoneEvents.length > 0;
                    const holiday = sem.holidays.includes(date);
                    const isSelected = selectedDate === date;
                    const isToday = date === today;
                    const isExam = cellType === "exam";
                    const isRevision = cellType === "revision";
                    const urgency = getCellUrgency(dayEvents, date, today);

                    // Classes: exam always red; revision only when no events; holiday bg removed
                    let cls = "cal-cell";
                    if (isWknd)     cls += " weekend";
                    if (isExam)     cls += " exam-day";
                    else if (isRevision && !hasEvents) cls += " revision";
                    if (isSelected) cls += " selected";

                    // Event-tinted background (non-exam, non-selected)
                    let cellStyle = {};
                    if (!isExam && !isSelected && hasEvents) {
                      cellStyle = { background: getTypeInfo(undoneEvents[0].type).color + "26" };
                    }

                    // Top-left labels
                    const specialLabel = holiday
                      ? { text: lang === "zh" ? "假期" : "Holiday", cls: "label-holiday" }
                      : (isRevision && undoneEvents.length > 1)
                      ? { text: "REV", cls: "label-rev" }
                      : null;
                    const multiLabel = undoneEvents.length > 1
                      ? { text: lang === "zh" ? "多项" : "Multi", cls: "label-multi" }
                      : null;

                    return (
                      <td key={di} className={cls} style={cellStyle}
                        onClick={() => { setSelectedDate(date); setSelectedWeek(null); setShowForm(false); setTransferring(null); }}>
                        <div className="cell-content">
                          {urgency > 0 && (
                            <span className={`urgency-badge urgency-${urgency}`} title={urgency === 1 ? T.countdown1d : T.countdown3d} />
                          )}
                          <div className="cell-top-row">
                            <div className="cell-labels">
                              <div>
                                {specialLabel && <span className={`cell-label ${specialLabel.cls}`}>{specialLabel.text}</span>}
                                {multiLabel && !specialLabel && <span className={`cell-label ${multiLabel.cls}`}>{multiLabel.text}</span>}
                              </div>
                              {multiLabel && specialLabel && (
                                <div><span className={`cell-label ${multiLabel.cls}`}>{multiLabel.text}</span></div>
                              )}
                            </div>
                            <span className="date-num">
                              {isToday
                                ? <span className="today-pill">{formatDate(date, dateStyle)}</span>
                                : formatDate(date, dateStyle)
                              }
                            </span>
                          </div>
                          <div className="dot-row">
                            {dayEvents.map(ev => (
                              <span key={ev.id} className="event-dot"
                                style={{ background: getTypeInfo(ev.type).color, opacity: ev.done ? 0.3 : 1 }} />
                            ))}
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
                  {(() => {
                    const input = form.course.trim().toLowerCase();
                    if (!input || input.length < 2) return null;
                    const existing = [...new Set(events.map(e => e.course?.trim()).filter(Boolean))];
                    const similar = existing.find(c =>
                      c.toLowerCase() !== input &&
                      (c.toLowerCase().includes(input) || input.includes(c.toLowerCase()) ||
                      [...input].filter((ch, i) => c.toLowerCase()[i] === ch).length >= input.length * 0.8)
                    );
                    return similar ? (
                      <div style={{fontSize:"11px",color:"#d97706",marginTop:"-4px",
                        padding:"4px 8px",background:"#fef3c7",borderRadius:"5px",cursor:"pointer"}}
                        onClick={() => setForm(f => ({ ...f, course: similar }))}>
                        {T.courseNameHint(similar)}
                      </div>
                    ) : null;
                  })()}
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
                      {(() => {
                        const input = form.course.trim().toLowerCase();
                        if (!input || input.length < 2) return null;
                        const existing = [...new Set(events.map(e => e.course?.trim()).filter(Boolean))];
                        const similar = existing.find(c =>
                          c.toLowerCase() !== input &&
                          (c.toLowerCase().includes(input) || input.includes(c.toLowerCase()) ||
                          [...input].filter((ch, i) => c.toLowerCase()[i] === ch).length >= input.length * 0.8)
                        );
                        return similar ? (
                          <div style={{fontSize:"11px",color:"#d97706",marginTop:"-4px",
                            padding:"4px 8px",background:"#fef3c7",borderRadius:"5px",cursor:"pointer"}}
                            onClick={() => setForm(f => ({ ...f, course: similar }))}>
                            {T.courseNameHint(similar)}
                          </div>
                        ) : null;
                      })()}
                      <input placeholder={T.title_} value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                      <input placeholder={T.location} value={form.location}
                        onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                      {editingId && (
                        <input type="date" value={form.date}
                          onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                      )}
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
                              setForm({ type: ev.type, course: ev.course, title: ev.title, location: ev.location, time: ev.time, date: ev.date });
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
