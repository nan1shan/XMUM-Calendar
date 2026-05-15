# 📅 XMUM Deadline Tracker

**[中文](#中文)　|　[English](#english)**

🔗 **[xmum-calendar.vercel.app](https://xmum-calendar.vercel.app)**

---

<a name="中文"></a>

## 中文

### 项目简介

XMUM Deadline Tracker 是一个面向厦门大学马来西亚分校学生的学期事项追踪工具。它不采用传统月历，而是以学期周次为主轴，在一个视图内展示整学期的作业、测验、考试、展示、补课和其他事项，帮助学生更清楚地管理截止日期与学习安排。

### 快速开始

1. 打开网站，点击 **Register** 注册账号（邮箱 + 至少 6 位密码）
2. 在右上角选择学期、语言、日期格式等偏好设置
3. 点击 **课程 / 自定义**，添加本学期需要追踪的课程或自定义项
4. 点击日历上任意一天，右侧打开详情面板
5. 点击 **+ 添加** 创建事项，依次选择课程 / 自定义项、事项类型、标题、地点和时间
6. 点击 **✓** 标记完成，**✏️** 编辑，**🗑** 删除

### 核心概念

本项目把“对象”和“事项类型”分开处理：

| 层级 | 作用 | 示例 |
|---|---|---|
| 课程 / 自定义项 | 决定日历主颜色，用于区分事项归属 | 用户自行添加 |
| 事项类型 | 描述任务性质，只作为标签显示 | Exam、Quiz、Assignment、Other |

也就是说，日历格、事项卡片、完成圆点的主色来自 **课程 / 自定义项**；事项类型颜色只保留在类型标签上。自定义项与课程处于同一层级，不会出现在事项类型下拉框里。

### 课程 / 自定义项管理

点击顶栏 **课程 / 自定义** 可管理当前学期的项目：

1. 在 **课程** 分区添加本学期课程
2. 在 **自定义** 分区添加非课程但需要同样追踪的项目
3. 两个分区分别输入名称、选择颜色并点击添加保存

说明：

- 每个学期最多保存 **8 门课程** 和 **8 个自定义项**，两个上限分开计算
- 课程和自定义项在管理弹窗中分区显示，但在添加事项时处于同一层级
- 课程和自定义项从一开始就使用不同颜色池：课程使用常规色系，自定义项使用独立的紫 / 粉等色系
- 视觉上课程使用圆点，自定义项使用菱形 / 虚线风格，以避免和课程混淆
- 每个用户、每个学期的列表互相独立
- 添加事项时，第一栏会从当前学期的课程 / 自定义项中下拉选择

### 日历视图

| 标签 | 含义 |
|---|---|
| Week 1–n | 正课周 |
| REV | 复习周 |
| EXAM | 考试周 |

- 有事项的日期格会显示对应课程 / 自定义项的浅色背景
- 日期格内会显示未完成事项的简短预览
- 已完成事项会以保留原主色的小圆点和数量显示
- 已过去日期会以日期划线方式低调标识
- 时间设在 00:00–05:59 时触发凌晨截止预警，提示前一天完成
- 距截止 1 天时，日期右上角出现橙色三角；3 天内出现绿色三角
- 同一天有多项未完成事项时，左上角显示 **Multi / 多项** 标记
- 假期日期左上角显示 **Holiday / 假期** 标记
- 今天日期以蓝色胶囊高亮显示

### 智能自动填充

添加新事项时，如果当前选择的课程 / 自定义项和事项类型与历史记录匹配，地点和时间会自动填充。名称匹配不区分大小写，但内容需要一致。

### 周事项（待定日期）

如果只知道某周有事项但还不知道具体日期，可以先记录到周标签下。

1. 点击左侧周标签，例如 Week 8
2. 点击 **+ 添加**，选择课程 / 自定义项、事项类型并填写标题
3. 日期确定后，点击 **📅** 转移到具体日期

转移后事项会出现在对应日期，原周事项会更新为普通日期事项。

### 分享事项

用户可以将自己的事项分享给其他注册用户。

1. 点击顶栏 **分享**
2. 填写对方注册邮箱
3. 选择分享范围：全部 / 当前学期 / 指定日期段
4. 可选：按事项类型或课程 / 自定义项筛选，并添加留言
5. 对方在收件箱中选择接受或拒绝

分享内容是副本。接受后双方数据互不影响。待定周事项不会被分享。

### 校历查看

点击 Legend 栏右侧的 **📅 校历** 按钮，可在弹窗中查看对应学年的完整校历图，并支持下载。

### 隐私说明

账号仅用于区分不同用户数据。项目只存储用户填写的事项数据，例如课程 / 自定义项、标题、地点、时间和完成状态。

### 更新说明

- 目前支持：**2026/04**、**2026/09**
- 校历数据会按需要更新
- 本站使用 Supabase 免费版，存在一定额度限制
- 作者计划毕业前将项目交接或重建，以尽量延续后续学期支持
- 如发现错误或有功能建议，欢迎提 Issue 或留言

---

<a name="english"></a>

## English

### About

XMUM Deadline Tracker is a semester-based deadline and study-task tracker for Xiamen University Malaysia students. Instead of using a conventional monthly calendar, it organizes the semester by week number so assignments, quizzes, exams, presentations, replacement classes, and other tasks can be viewed in one semester-oriented layout.

### Getting Started

1. Open the site and click **Register** to create an account with an email and a password of at least 6 characters
2. Select semester, language, and date style from the top bar
3. Click **Courses / Custom** and add the courses or custom items you want to track this semester
4. Click a date on the calendar to open the side panel
5. Click **+ Add** to create an event, then choose course / custom item, event type, title, location, and time
6. Use **✓** to mark done, **✏️** to edit, and **🗑** to delete

### Core Model

The project separates tracked objects from event types:

| Level | Purpose | Examples |
|---|---|---|
| Course / Custom item | Controls the main calendar color and event ownership | Added by the user |
| Event type | Describes the task nature and appears as a label only | Exam, Quiz, Assignment, Other |

Calendar cells, event cards, and completed-event dots use the color of the selected **course / custom item**. Event type colors remain on the small type badge only. Custom items are on the same level as courses and do not appear in the event type dropdown.

### Courses / Custom Items

Click **Courses / Custom** in the top bar to manage the current semester list:

1. Choose whether the new item is a **Course** or **Custom** item
2. Enter the name
3. Pick a color
4. Click Add

Notes:

- Each semester supports up to **8 courses** and **8 custom items**; the two limits are counted separately
- Courses and custom items are displayed in separate management sections, but appear at the same selector level when creating events
- Courses and custom items use different color pools from the beginning: courses use regular colors, while custom items use a separate purple/pink-style palette
- Courses use circular markers; custom items use diamond/dashed styling to avoid confusion with courses
- Each user and semester has an independent list
- When adding an event, the first dropdown selects from the current semester's courses / custom items

### Calendar View

| Label | Meaning |
|---|---|
| Week 1–n | Normal teaching weeks |
| REV | Revision week |
| EXAM | Examination week |

- Dates with events use a light background based on the selected course / custom item
- Calendar cells show compact previews of unfinished events
- Completed events are shown as small colored dots with a count
- Past dates are subtly marked with a strikethrough date style
- Deadlines between 00:00 and 05:59 trigger a midnight warning
- A deadline due in 1 day shows an orange triangle; deadlines within 3 days show a green triangle
- Dates with multiple unfinished events show a **Multi** label
- Public holidays show a **Holiday** label
- Today's date is highlighted with a blue pill

### Smart Auto-fill

When adding a new event, if the selected course / custom item and event type match a previous entry, the location and time are pre-filled automatically. Matching is case-insensitive, but the name must otherwise be consistent.

### Week-level Events

If an event is known by week but not by exact date, it can be stored on the week label first.

1. Click a week label such as Week 8
2. Click **+ Add**, choose course / custom item and event type, then enter the title
3. Once the exact date is known, click **📅** to transfer it to a specific date

After transfer, the event appears on the selected date.

### Share Events

Users can share their events with another registered user.

1. Click **Share** in the top bar
2. Enter the recipient's registered email
3. Choose a range: all events, current semester, or custom date ranges
4. Optionally filter by event type or course / custom item and add a note
5. The recipient accepts or rejects the request in the inbox

Shared events are copies. Changes by either user do not affect the other. Week-level pending events are not shared.

### Academic Calendar

Click **📅 Academic Calendar** on the right side of the legend bar to view the official calendar image in a pop-up and download it if needed.

### Privacy

Accounts are used only to separate user data. The project stores only user-entered event information such as course / custom item, title, location, time, and completion status.

### Updates

- Currently supported semesters: **2026/04**, **2026/09**
- Academic calendar data will be updated when needed
- The site uses Supabase's free tier, so capacity is limited
- The author plans to hand over or rebuild the project before graduation to support later semesters where possible
- For bugs or feature suggestions, feel free to open an Issue or leave a comment
