import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./supabase";

const SEMESTERS = [
  {
    id: "2026-Apr",
    label: "2026/04",
    start: "2026-04-07", // Monday Apr 6
    totalWeeks: 17,
    specialRanges: [
      { start: "2026-07-13", end: "2026-07-19", type: "revision" }, // Mon–Fri only
      { start: "2026-07-20", end: "2026-07-31", type: "exam" },     // Mon–Fri only
    ],
    holidays: ["2026-05-01", "2026-05-27", "2026-06-01", "2026-06-17"],
  },
  {
    id: "2026-Sep",
    label: "2026/09",
    start: "2026-09-29", // Week 1 Monday
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

// Only weekdays (Mon–Fri) get special coloring
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

export default function App() {
  const [user, setUser] = useState(undefined);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [semId, setSemId]         = useState(() => localStorage.getItem("xmum_semId") || "2026-Apr");
  const [startDay, setStartDay]   = useState(() => localStorage.getItem("xmum_startDay") || "Mon");
  const [dateStyle, setDateStyle] = useState(() => localStorage.getItem("xmum_dateStyle") || "Apr10");
  const [events, setEvents]       = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ type: "asm", course: "", title: "", location: "", time: "23:59" });

  useEffect(() => { localStorage.setItem("xmum_semId", semId); }, [semId]);
  useEffect(() => { localStorage.setItem("xmum_startDay", startDay); }, [startDay]);
  useEffect(() => { localStorage.setItem("xmum_dateStyle", dateStyle); }, [dateStyle]);

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

  function getEventsForDate(d) { return events.filter(e => e.date === d); }
  function getTypeInfo(tid) { return EVENT_TYPES.find(t => t.id === tid) || EVENT_TYPES[EVENT_TYPES.length - 1]; }
  function getTypesForDate(date) {
    const t = getCellType(date, sem.specialRanges);
    if (t === "exam") return EVENT_TYPES;
    return EVENT_TYPES.filter(e => e.id !== "exam");
  }

  const today = getTodayUTC8();
  const selEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const isHoliday = selectedDate ? sem.holidays.includes(selectedDate) : false;
  const panelOpen = !!selectedDate;

  // ── 加载中 ──
  if (user === undefined) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"#888"}}>
      Loading...
    </div>
  );

  // ── 未登录 ──
  if (!user) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#f5f4f0"}}>
      <div style={{background:"white",padding:"40px",borderRadius:"12px",width:"360px",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <h2 style={{marginBottom:"8px",fontSize:"20px"}}>📅 XMUM Deadline Tracker</h2>
        <p style={{color:"#888",fontSize:"13px",marginBottom:"24px"}}>
          {authMode === "login" ? "Sign in to your account" : "Create a new account"}
        </p>
        <input type="email" placeholder="Email" value={authEmail}
          onChange={e => setAuthEmail(e.target.value)}
          style={{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1px solid #ddd",marginBottom:"10px",fontSize:"14px"}} />
        <input type="password" placeholder="Password (min 6 chars)" value={authPassword}
          onChange={e => setAuthPassword(e.target.value)}
          style={{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1px solid #ddd",marginBottom:"16px",fontSize:"14px"}} />
        {authError && <p style={{color:"#e53e3e",fontSize:"12px",marginBottom:"12px"}}>{authError}</p>}
        <button onClick={handleAuth}
          style={{width:"100%",padding:"11px",background:"#2563eb",color:"white",border:"none",borderRadius:"8px",fontSize:"14px",fontWeight:"600",cursor:"pointer",marginBottom:"12px"}}>
          {authMode === "login" ? "Sign In" : "Create Account"}
        </button>
        <p style={{textAlign:"center",fontSize:"13px",color:"#888"}}>
          {authMode === "login" ? "No account? " : "Have an account? "}
          <span onClick={() => { setAuthMode(m => m === "login" ? "register" : "login"); setAuthError(""); }}
            style={{color:"#2563eb",cursor:"pointer",fontWeight:"500"}}>
            {authMode === "login" ? "Register" : "Sign In"}
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
          XMUM Deadline Tracker
        </div>
        <div className="topbar-controls">
          <select value={semId} onChange={e => setSemId(e.target.value)}>
            {SEMESTERS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <select value={startDay} onChange={e => setStartDay(e.target.value)}>
            <option value="Mon">Week starts Mon</option>
            <option value="Sun">Week starts Sun</option>
          </select>
          <select value={dateStyle} onChange={e => setDateStyle(e.target.value)}>
            <option value="Apr10">Apr10</option>
            <option value="10/04">10/04</option>
            <option value="04/10">04/10</option>
            <option value="10 Apr">10 Apr</option>
            <option value="M月D日">M月D日</option>
          </select>
          <button onClick={() => supabase.auth.signOut()}
            style={{background:"none",border:"1px solid var(--border)",borderRadius:"6px",padding:"6px 12px",fontSize:"13px",cursor:"pointer",color:"var(--text-muted)"}}>
            Sign Out
          </button>
        </div>
      </div>

      {/* LEGEND */}
      <div className="legend">
        {EVENT_TYPES.map(t => (
          <span key={t.id} className="legend-item">
            <span className="legend-dot" style={{ background: t.color }} />{t.label}
          </span>
        ))}
        <span className="legend-item">
          <span style={{ display:"inline-block", width:"14px", height:"4px", borderRadius:"2px", background:"#f59e0b" }} />Holiday
        </span>
      </div>

      <div className={`main ${panelOpen ? "panel-open" : "panel-closed"}`}>
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
                  <td className={`week-label ${row.labelClass}`}>{row.label}</td>
                  {row.dates.map((date, di) => {
                    const cellType = getCellType(date, sem.specialRanges);
                    const isWknd = weekendCols.includes(di);
                    const dayEvents = getEventsForDate(date);
                    const holiday = sem.holidays.includes(date);
                    const isSelected = selectedDate === date;
                    const isToday = date === today;
                    let cls = "cal-cell";
                    if (isWknd)                  cls += " weekend";
                    if (cellType === "revision")  cls += " revision";
                    else if (cellType === "exam") cls += " exam-day";
                    if (holiday)                  cls += " holiday";
                    if (isSelected)               cls += " selected";
                    return (
                      <td key={di} className={cls}
                        onClick={() => { setSelectedDate(date); setShowForm(false); }}>
                        <div className="cell-content">
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
          {!panelOpen ? (
            <div className="no-events" style={{padding:"40px 20px",textAlign:"center",color:"var(--text-faint, #a8a29e)",fontSize:"13px"}}>
              ← Select a date to view or add events
            </div>
          ) : (
            <>
              <div className="panel-header">
                <div>
                  <div className="panel-date">
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-GB",
                      { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </div>
                  {isHoliday && <div className="holiday-badge">🎉 Public Holiday</div>}
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button className="add-btn" onClick={() => { setShowForm(f => !f); setEditingId(null); setForm({ type: "asm", course: "", title: "", location: "", time: "23:59" }); }}>
                    {showForm ? "✕" : "+ Add"}
                  </button>
                  <button className="close-btn" onClick={() => { setSelectedDate(null); setShowForm(false); }}>✕</button>
                </div>
              </div>

              {showForm && (
                <div className="add-form">
                  <select value={form.type} onChange={e => {
                    const newType = e.target.value;
                    setForm(f => {
                      const match = events.find(ev =>
                        ev.type === newType &&
                        ev.course.trim().toLowerCase() === f.course.trim().toLowerCase() &&
                        f.course.trim() !== "" &&
                        ev.id !== editingId
                      );
                      return {
                        ...f,
                        type: newType,
                        location: match ? match.location : f.location,
                        time: match ? match.time : f.time,
                      };
                    });
                  }}>
                    {getTypesForDate(selectedDate).map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                  <input placeholder="Course (e.g. wpp)" value={form.course}
                    onChange={e => {
                      const newCourse = e.target.value;
                      setForm(f => {
                        const match = events.find(ev =>
                          ev.type === f.type &&
                          ev.course.trim().toLowerCase() === newCourse.trim().toLowerCase() &&
                          ev.id !== editingId
                        );
                        return {
                          ...f,
                          course: newCourse,
                          location: match ? match.location : f.location,
                          time: match ? match.time : f.time,
                        };
                      });
                    }} />
                  <input placeholder="Title / Description *" value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                  <input placeholder="Location (e.g. A3_620, Online)" value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                  <div className="time-row">
                    <input type="time" value={form.time}
                      onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                    {isMidnight(form.time) && (
                      <span className="midnight-warn">⚠️ Midnight — finish the night before!</span>
                    )}
                  </div>
                  <button className="save-btn" onClick={addEvent}>{editingId ? "Update" : "Save"}</button>
                </div>
              )}

              <div className="event-list">
                {selEvents.length === 0 && !showForm && (
                  <div className="no-events">No events — click + Add to create one</div>
                )}
                {selEvents.map(ev => {
                  const t = getTypeInfo(ev.type);
                  return (
                    <div key={ev.id} className={`event-card ${ev.done ? "done" : ""}`}>
                      <div className="event-card-left" style={{ borderColor: t.color }}>
                        <span className="event-type-badge"
                          style={{ background: t.color + "22", color: t.color }}>
                          {t.label}
                        </span>
                        <div className="event-title">{ev.title}</div>
                        {ev.course   && <div className="event-meta">📚 {ev.course}</div>}
                        {ev.location && <div className="event-meta">📍 {ev.location}</div>}
                        <div className="event-time">
                          🕐 {ev.time}
                          {isMidnight(ev.time) && <span className="midnight-tag"> ⚠️ finish night before</span>}
                          {(() => {
                            const diff = Math.ceil((new Date(ev.date + "T00:00:00") - new Date(today + "T00:00:00")) / 86400000);
                            if (diff > 0) return <span style={{marginLeft:"6px", color:"#2563eb", fontWeight:"600"}}>· {diff}d left</span>;
                            if (diff === 0) return <span style={{marginLeft:"6px", color:"#ea580c", fontWeight:"600"}}>· Due today</span>;
                            return <span style={{marginLeft:"6px", color:"#94a3b8", fontWeight:"600"}}>· {Math.abs(diff)}d ago</span>;
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
        </div>
      </div>
    </div>
  );
}