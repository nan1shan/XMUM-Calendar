# 📅 XMUM Deadline Tracker

**[中文](#中文)　|　[English](#english)**

🔗 **[xmum-calendar.vercel.app](https://xmum-calendar.vercel.app)**

---

<a name="中文"></a>

## 中文

### 项目简介

针对厦大马校课业任务繁多、市面缺乏适配本校特色日历工具的现状，本项目旨在为厦马学生打造合适的学期截止日期追踪工具。该工具摒弃传统月历形式，以学期周次为核心轴线，可在单一视图内清晰呈现全学期作业、测验、考试、展示、补课等各类事项安排，实现日程一站式掌握。

本项目同时支持课程 / 自定义项管理、事项分享、收件箱确认、双模式待办清单和跨设备账号同步。

### 快速开始

1. 打开网站，点击 **Register** 注册账号（邮箱 + 至少 6 位密码）
2. 右上角选择学期、语言、日期样式等偏好设置
3. 点击顶栏 **课程 / 自定义**，添加本学期课程或自定义项
4. 点击日历上任意一天，右侧弹出详情面板
5. 点击 **+ 添加** 创建事项，依次选择课程 / 自定义项、事项类型、标题、地点和时间
6. 点击 **✓** 标记完成，**✏️** 编辑（含修改日期），**🗑** 删除
7. 点击顶栏 **待办清单**，记录不适合放入正式日历的临时任务

### 功能说明

#### 日历视图

| 标签 | 含义 |
|---|---|
| Week 1–n | 正课周 |
| REV | 复习周 |
| EXAM | 考试周 |

- 日期格中的主颜色按 **课程 / 自定义项** 区分，而不是按事项类型区分
- 同一课程或自定义项在整个学期内保持一致颜色
- 事项类型作为标签显示，例如 Exam、Quiz、Assignment、Presentation、Other 等
- 有事项的日期格背景会显示对应的课程 / 自定义项颜色
- 未完成事项会在日期格中显示简要预览
- 已完成事项会以保留主色的小圆点显示，并在旁边标记数量（需要手动选择已完成）
- 过去日期会以日期划线方式低调标识
- 时间设在 00:00–05:59 时触发 **凌晨截止预警**，提示前一天完成
- 距截止 1 天时，日期右上角出现 **橙色三角**
- 距截止 3 天内时，日期右上角出现 **绿色三角**
- 同一天有多项事项时，左上角显示 **Multi / 多项** 标记
- 假期日期左上角显示 **Holiday / 假期** 标记
- 今天日期以蓝色胶囊高亮显示

#### 课程 / 自定义项管理

添加事项时，第一栏为 **课程 / 自定义项**。课程和自定义项属于同一层级，都会作为事项的主要归属来源，并决定日历格、事项卡片、完成圆点等主视觉颜色。

课程和自定义项在管理界面中分区显示，并分别计算上限。

- **课程**：用于正式课程、实验课、课程项目等课内任务
- **自定义项**：用于非课程但仍需要独立追踪的任务来源
- 每个学期最多可设置 **8 门课程** 和 **8 个自定义项**
- 课程使用蓝、绿、橙等常规色系
- 自定义项使用紫、粉等独立色系，避免与课程颜色混淆
- 事项类型只表示任务性质，不再承担主分类功能
- 同一账号在电脑和手机端可同步查看

#### 事项类型

事项类型用于说明任务性质，而不是决定主颜色。

系统内置类型包括：

| 类型 | 含义 |
|---|---|
| Exam | 考试 |
| Midterm | 期中 |
| Project | 项目 |
| Assignment | 作业 |
| Quiz | 测验 |
| Presentation | 展示 |
| Replacement Class | 补课 |
| Other | 其他 |

事项类型会显示为小标签，用于快速识别任务性质。主颜色由课程 / 自定义项决定。

#### 智能自动填充

添加新事项时，若所选课程 / 自定义项与事项类型和历史记录一致，系统会自动填充地点与时间。

匹配逻辑以课程 / 自定义项名称为基础，大小写不敏感，但名称本身需要保持一致。例如：

- `math5` 与 `Math5` 视为同一项
- `Math V` 与 `Math5` 不视为同一项

#### 周事项（待定日期）

只知道某周有事项但尚未确定具体日期时，可先记录在周标签下。

1. 点击左侧周标签（如 Week 8）打开该周事项面板
2. 点击 **+ 添加**
3. 选择课程 / 自定义项、事项类型，并填写标题
4. 日期确定后，点击 **📅** 选择具体日期并补全信息完成转移

> 转移后事项会出现在对应日期，原周条目自动移除。周标签背景色块代表该周存在待定事项。

#### 待办清单

除正式日历事项外，系统还提供独立的 **待办清单**。待办清单用于记录临时执行任务，不会进入正式日历事项，不会参与课程 deadline 管理，也不会被作为分享事项发送给他人。

待办清单分为两类：

##### 近日计划

近日计划用于规划每日任务，按日期安排三天内的任务。

- 支持 **今天 / 明天 / 后天** 三个日期视图
- 每一天有独立任务列表
- 到期日次日凌晨 **4:00** 后，不管任务是否完成，都会自动清理
- 适合短期执行安排，不用于长期保存记录
- 同一账号可跨设备同步

##### 待办池

待办池用于存放没有固定日期的任务。

- 不按日期分组
- 不会因为日期变化自动删除
- 手动勾选完成后，任务会先划掉
- 完成后 **12 小时内** 可以撤销
- 超过 12 小时后自动清理
- 同一账号可跨设备同步

#### 分享事项

将自己已设置好的事项分享给课程相同的同学，对方可选择接受或拒绝。

1. 点击顶栏 **分享** 按钮
2. 填写对方的注册邮箱
3. 选择分享范围：全部 / 当前学期 / 自定义日期段（支持多段）
4. 可选：按类型 / 课程筛选，并附上留言
5. 对方收件箱收到请求后自行决定是否接受

> 分享内容为副本，接受后双方数据互不影响。待定周事项不会被分享。
>
> 若对同一人重复分享，原有来自该发送方的旧副本会被新版本覆盖，不会产生重复。
>
> 分享事项时，系统会同时携带这些事项涉及的课程 / 自定义项信息。对方接受后，若缺少对应课程 / 自定义项，系统会在额度允许的情况下自动补充。若对方已有同名课程 / 自定义项，则保留对方原有设置，不覆盖颜色。
>
> 如果对方课程或自定义项数量已达到上限，事项仍会导入，但对应课程 / 自定义项可能不会自动添加。

#### 收件箱

别人分享给你的事项会进入顶栏 **收件箱**。

- 可查看发送方邮箱、事项数量和留言
- 可选择接受或拒绝
- 接受后事项会复制到你的账号下
- 拒绝后不会导入任何事项
- 接受后的事项与发送方数据互不影响

#### 校历查看

点击 Legend 栏右侧的 **📅 校历** 按钮，可在弹窗中查看对应学年的完整校历图，并支持一键下载保存。

### 数据同步说明

同一账号在不同设备登录时，可同步以下内容：

| 数据 | 存储位置 | 是否跨设备同步 |
|---|---|---|
| 日历事项 | `events` | 是 |
| 课程 / 自定义项 | `user_labels` | 是 |
| 分享请求 | `shared_events` | 是 |
| 用户邮箱映射 | `profiles` | 是 |
| 待办清单 | `todos` | 是 |
| 语言 / 日期样式等本地偏好 | localStorage | 仅当前浏览器 |

### 隐私说明

账号仅用于区分不同用户数据。存储内容包括你主动填写的截止日期信息、课程 / 自定义项、待办清单和分享请求等。

每个用户只能读取和修改自己的数据。分享功能只有在你主动填写对方注册邮箱并发送后，才会生成分享请求。

### 更新说明

- 目前支持：**2026/04**、**2026/09**
- 校历数据每年更新
- **更新政策**：本站使用 Supabase 免费版以存储用户信息等，存在一定限额；同时本站作者将在两年后毕业。因此计划毕业前将项目交接给新一届同学并重新搭建网站，以提供 2028 年后的内容。届时存储在本站的数据可能无法迁移，请见谅。
- 如发现错误或有功能建议，欢迎提 Issue 或留言

---

<a name="english"></a>

## English

### About

A semester deadline tracker built for XMUM students. Unlike conventional monthly calendars, it organizes the semester by week number, allowing assignments, quizzes, exams, presentations, replacement classes, and other academic tasks to be viewed clearly in one semester-based layout.

The app also supports course / custom item management, event sharing, inbox confirmation, a two-mode to-do list, and account-based cross-device synchronization.

### Getting Started

1. Open the site and click **Register** to create an account with an email and a password of at least 6 characters
2. Select your semester, language, and date style from the top-right controls
3. Click **Courses / Custom** in the top bar to add semester courses or custom items
4. Click any date on the calendar to open the side panel
5. Click **+ Add** to create an event, then select a course / custom item, event type, title, location, and time
6. Click **✓** to mark done, **✏️** to edit including date changes, and **🗑** to delete
7. Click **To-do List** in the top bar to manage temporary tasks that should not be added to the formal calendar

### Features

#### Calendar View

| Label | Meaning |
|---|---|
| Week 1–n | Normal teaching weeks |
| REV | Revision week |
| EXAM | Examination week |

- The main calendar color is assigned by **course / custom item**, not by event type
- The same course or custom item keeps a consistent color throughout the semester
- Event types are still shown as small labels, such as Exam, Quiz, Assignment, Presentation, and Other
- Dates with events show a tinted background based on the related course / custom item
- Undone events are shown as short previews inside the calendar cell
- Completed events are displayed as small colored dots with a count
- Past dates are subtly marked with a strikethrough date style
- Times set between 00:00 and 05:59 trigger a **midnight warning**, reminding you to finish the night before
- A date with a deadline in **1 day** shows an **orange triangle** in the top-right corner
- A date with a deadline within **3 days** shows a **green triangle**
- Dates with multiple events show a **Multi** label in the top-left corner
- Public holidays show a **Holiday** label in the top-left corner
- Today's date is highlighted with a blue pill

#### Courses / Custom Items

The first selector when creating an event is shared by courses and custom items. They are on the same level and define the main visual color of the event, including the calendar cell, event card, and completed-event dot.

Courses and custom items are managed in separate sections and counted separately.

- **Courses** are used for course-related tasks, labs, projects, and formal academic work
- **Custom items** are used for non-course task sources that still need independent tracking
- Each semester supports up to **8 courses** and **8 custom items**
- Courses use a regular blue / green / orange-style palette
- Custom items use a separate purple / pink-style palette to avoid confusion with course colors
- Event types describe task nature only and do not control the main event color
- Sync across devices under the same account

#### Event Types

Event types describe the nature of a task, instead of controlling the main color.

Built-in event types include:

| Type | Meaning |
|---|---|
| Exam | Examination |
| Midterm | Midterm test |
| Project | Project |
| Assignment | Assignment |
| Quiz | Quiz |
| Presentation | Presentation |
| Replacement Class | Replacement class |
| Other | Other tasks |

Event types appear as small labels for quick identification. The main color is controlled by the selected course / custom item.

#### Smart Auto-fill

When adding a new event, if the selected course / custom item and event type match a previous entry, location and time are pre-filled automatically.

Matching is based on the course / custom item name. It is case-insensitive, but the name itself should remain consistent. For example:

- `math5` matches `Math5`
- `Math V` does not match `Math5`

#### Week-level Events (Date TBD)

When a deadline is announced by week but not yet assigned to a specific day, you can log it at the week level first.

1. Click a week label on the left, such as Week 8, to open the week panel
2. Click **+ Add**
3. Select a course / custom item, event type, and title
4. Once the date is confirmed, click **📅** to transfer it to a specific day and complete the details

> After transfer, the event moves to the selected date and is removed from the week panel. A colored background on a week label indicates pending week-level events.

#### To-do List

In addition to formal calendar events, the app includes a separate **To-do List** for temporary execution tasks. To-do items are not added to calendar events, do not affect course deadline tracking, and are not included when sharing events.

The to-do list has two modes:

##### Recent Plan

Recent Plan is used for daily task planning within the next three days.

- Supports **Today / Tomorrow / The Day After Tomorrow**
- Each date has an independent task list
- Items are automatically cleared after **4:00 AM on the day after their planned date**, whether completed or not
- Designed for short-term execution planning rather than long-term record keeping
- Syncs across devices under the same account

##### Task Pool

Task Pool is used for tasks without a fixed date.

- Not grouped by date
- Not removed just because the date changes
- Completed items are crossed out first
- Completed items can be undone within **12 hours**
- Completed items are automatically cleared after 12 hours
- Syncs across devices under the same account

#### Share Events

Share your events directly to a classmate's account. The recipient can choose to accept or reject the incoming share.

1. Click the **Share** button in the top bar
2. Enter the recipient's registered email
3. Choose a range: all events / current semester / custom date ranges, with multiple ranges supported
4. Optional: filter by event type / courses, and add a message
5. The recipient reviews the request in the inbox and decides whether to accept

> Shared events are copies. Changes by either party do not affect the other. Week-level pending events are not included in shares.
>
> If you share with the same person again, old copies from the same sender are replaced by the new version, avoiding duplicates.
>
> When events are shared, the related courses and custom items are shared together with the event data. After accepting, if the recipient does not have the related course / custom item, it will be added automatically when capacity allows. If the recipient already has a label with the same name, their existing setting and color are preserved.
>
> If the recipient has reached the course or custom item limit, the events are still imported, but the related labels may not be added.

#### Inbox

Events shared by others appear in the **Inbox** in the top bar.

- Shows sender email, event count, and optional message
- The recipient can accept or reject the share
- Accepted events are copied into the recipient's account
- Rejected shares do not import any events
- Accepted events remain independent from the sender's data

#### Academic Calendar

Click the **📅 Academic Calendar** button on the right side of the Legend bar to view the full academic calendar for the selected year in a pop-up. You can also download the image directly.

### Data Synchronization

When the same account is used across devices, the following data can sync:

| Data | Storage | Cross-device sync |
|---|---|---|
| Calendar events | `events` | Yes |
| Courses / custom items | `user_labels` | Yes |
| Shared event requests | `shared_events` | Yes |
| User email mapping | `profiles` | Yes |
| To-do list | `todos` | Yes |
| Language / date style and other local preferences | localStorage | Current browser only |

### Privacy

Your account is used only to keep your data separate from other users. Stored content includes only the data you actively enter, such as calendar events, courses / custom items, to-do items, and sharing requests.

Each user can only read and modify their own data. Sharing requests are created only when you manually enter another registered email and send a share.

### Updates

- Currently supported semesters: **2026/04**, **2026/09**
- Academic calendar images are updated annually
- **Update Policy**: This site uses Supabase’s free tier with limited storage. The author will graduate in two years, so the project is planned to be handed over and rebuilt to continue service after 2028. Stored data may not be transferable. We apologize for any inconvenience.
- For calendar errors or feature suggestions, feel free to open an Issue or leave a comment