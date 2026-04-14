# 📅 XMUM Deadline Tracker

**[中文](#中文)　|　[English](#english)**

🔗 **[xmum-calendar.vercel.app](https://xmum-calendar.vercel.app)**

---

<a name="中文"></a>

## 中文

### 项目简介

针对厦大马校课业任务繁多、市面缺乏适配本校特色日历工具的现状，本项目旨在为厦马学生打造合适的学期截止日期追踪工具。该工具摒弃传统月历形式，以学期周次为核心轴线，可在单一视图内清晰呈现全学期作业、测验、考试等各类事项安排，实现日程一站式掌握

### 快速开始

1. 打开网站，点击 **Register** 注册账号（邮箱 + 至少 6 位密码）
2. 右上角选择学期、语言、日期样式等偏好设置
3. 点击日历上任意一天，右侧弹出详情面板
4. 点击 **+ 添加** 创建事项，填写类型、课程、标题、地点和时间
5. 点击 **✓** 标记完成，**✏️** 编辑（含修改日期），**🗑** 删除

### 功能说明

#### 日历视图

| 标签 | 含义 |
|---|---|
| Week 1–n | 正课周 |
| REV | 复习周 |
| EXAM | 考试周 |

- 彩色圆点代表你设置的事项；有事项的日期格背景会显示对应颜色
- 时间设在 00:00–05:59 时触发**凌晨截止预警**，提示前一天完成
- 距截止 1 天时，日期右上角出现**橙色三角**；3 天内出现**绿色三角**
- 同一天有多项事项时，左上角显示 **Multi / 多项** 标记
- 假期日期左上角显示 **Holiday / 假期** 标记
- 今天日期以蓝色胶囊高亮显示

#### 智能自动填充

添加新事项时，若类型与课程代码与历史记录一致，地点与时间将自动填充。课程名称大小写不敏感，但须完全匹配（如 `math5` 与 `Math5` 视为同一门课，`Math V` 与 `Math5` 则不匹配）。

#### 周事项（待定日期）

只知道某周有事项但尚未确定具体日期时，可先记录在周标签下。

1. 点击左侧周标签（如 Week 8）打开该周事项面板
2. 点击 **+ 添加**，填写类型、课程和标题
3. 日期确定后，点击 **📅** 选择具体日期并补全信息完成转移

> 转移后事项出现在对应日期，原周条目自动移除。周标签背景色块代表该周存在待定事项。

#### 分享事项

将自己的事项分享给课程相同的同学，对方可选择接受或拒绝。

1. 点击顶栏 **分享** 按钮
2. 填写对方的注册邮箱
3. 选择分享范围：全部 / 当前学期 / 自定义日期段（支持多段）
4. 可选：按类型/课程筛选，并附上留言
5. 对方收件箱收到请求后自行决定是否接受

> 分享内容为副本，接受后双方数据互不影响。待定周事项不会被分享。

#### 校历查看

点击 Legend 栏右侧的 **📅 校历** 按钮，可在弹窗中查看对应学年的完整校历图，并支持一键下载保存。

### 隐私说明

账号仅用于区分不同用户数据，不收集任何个人信息。存储内容仅限你填写的截止日期信息（课程、标题、地点、时间等）。

### 更新说明

- 目前支持：**2026/04**、**2026/09**
- 校历数据每年更新
- **更新政策**：本站使用supabase免费版以存储用户信息等，存在一定限额，而本站作者将在两年后毕业。因此计划毕业前将项目交接给新一届同学并重新搭建网站，以提供2028年后的内容，届时存储在本站的数据可能无法迁移，请见谅。
- 如发现错误或有功能建议，欢迎提 Issue 或留言

---

<a name="english"></a>

## English

### About

A semester deadline tracker built for XMUM students. Unlike conventional monthly calendars, it organizes your entire semester by week number — so you can see all assignments, quizzes, exams, and more in a single view.

### Getting Started

1. Open the site and click **Register** to create an account (email + min. 6-char password)
2. Select your semester, language, and date style from the top-right controls
3. Click any date on the calendar to open the side panel
4. Click **+ Add** to create a deadline — fill in type, course, title, location, and time
5. Click **✓** to mark done, **✏️** to edit (including changing the date), **🗑** to delete

### Features

#### Calendar View

| Label | Meaning |
|---|---|
| Week 1–n | Normal teaching weeks |
| REV | Revision week |
| EXAM | Examination week |

- Colored dots represent your deadlines; cells with events show a tinted background
- Times set between 00:00–05:59 trigger a **midnight warning**, reminding you to finish the night before
- A date with a deadline in **1 day** shows an **orange triangle** in the top-right corner; **within 3 days** shows a **green triangle**
- Dates with multiple events show a **Multi** label in the top-left corner
- Public holidays show a **Holiday** label in the top-left corner
- Today's date is highlighted with a blue pill

#### Smart Auto-fill

When adding a new event, if the type and course code match a previous entry, location and time are pre-filled automatically. Course names are case-insensitive but must otherwise match exactly (e.g. `math5` matches `Math5`, but `Math V` does not match `Math5`).

#### Week-level Events (Date TBD)

When a deadline is announced by week but not yet assigned to a specific day, you can log it at the week level first.

1. Click a week label on the left (e.g. Week 8) to open the week panel
2. Click **+ Add** and fill in type, course, and title
3. Once the date is confirmed, click **📅** to transfer it to a specific day

> After transfer, the event moves to the selected date and is removed from the week panel. A colored background on a week label indicates pending week-level events.

#### Share Events

Share your events directly to a classmate's account. The recipient can choose to accept or reject the incoming share.

1. Click the **Share** button in the top bar
2. Enter the recipient's registered email
3. Choose a range: all events / current semester / custom date ranges (multiple ranges supported)
4. Optional: filter by event type / courses, and add a message
5. The recipient reviews the request in their inbox and decides whether to accept

> Shared events are copies — changes by either party do not affect the other. Week-level pending events are not included in shares.

#### Academic Calendar

Click the **📅 Academic Calendar** button on the right side of the Legend bar to view the full academic calendar for the selected year in a pop-up. You can also download the image directly.

### Privacy

Your account is used only to keep your data separate from other users. No personal information is collected. Only your deadline entries (course, title, location, time) are stored.

### Updates

- Currently supported semesters: **2026/04**, **2026/09**
- Academic calendar images are updated annually
- **Update Policy**: This site uses Supabase’s free tier with limited storage. And the author will graduate in two years, so the project will be handed over and rebuilt to continue service after 2028. Stored data may not be transferable. We apologize for any inconvenience.
- For calendar errors or feature suggestions, feel free to open an Issue or leave a comment