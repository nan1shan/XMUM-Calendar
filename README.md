# 📅 XMUM Deadline Tracker

本项目为针对厦门大学马来西亚分校学生课业场景而设计的截止日期追踪工具。有别于传统月份日历，以学期周次为轴线，让你在一个视图内掌握全学期的作业、测验、考试等各类事项，同时可充当以学期划分的校历。

A deadline tracker built for XMUM students. Unlike conventional monthly calendars, it organizes your semester by week number — so you can see assignments, quizzes, exams, and more across the entire semester at a glance.

🔗 **直接使用 / Live site: [xmum-calendar.vercel.app](https://xmum-calendar.vercel.app)**

---

## 快速开始 / Getting Started

无需安装，打开链接即可使用。
No installation needed. Just open the link and you're good to go.

1. 打开网站，点 **Register** 注册账号（填邮箱 + 至少6位密码）
   Open the site, click **Register** to create an account (email + min. 6-char password)

2. 右上角选择你的学期、日期样式等
   Select your semester and date styles from the top-right dropdown

3. 点击日历上任意一天，右边会弹出详情栏
   Click any date on the calendar to open the side panel

4. 点 **+ Add** 添加事项，填写类型、课程、标题、地点、时间
   Click **+ Add** to create a deadline — fill in type, course, title, location and time

5. 点 **✓** 标记完成，点 🗑 删除。如果不小心设错了日期，也可以在编辑功能中重新更改日期。
   Click **✓** to mark done, 🗑 to delete. If you accidentally set the wrong date, you can change it in the editing function. 

---

## 日历说明 / Calendar Guide

| 标签 / Label | 含义 / Meaning |
|---|---|
| Week 1–n | 正课周 / Normal teaching weeks |
| REV | 复习周 / Revision week |
| EXAM | 考试周 / Examination week |

- 可点击右上角的“中/En”切换语言 / You can click "中/En" in the upper right corner to switch languages.
- 🟡 黄色横条 = 当天是公共假期 / Yellow bar = Public holiday
- 彩色圆点 = 你设置的事项 / Colored dots = your deadlines
- ⚠️ 时间设在 00:00–05:59 时会提示 **"前一天完成"**  / **Midnight warning** if due time is 00:00–05:59
- 蓝色数字 = 距截止还有几天 / Blue number = days remaining
- DDL在1/3天内时，日期右上角会出现橙色/蓝色三角标签 / When the deadline is within 1/3 day(s), an orange/blue triangle will appear in the upper right corner of the date.
- **自动填充功能**：添加新事项时，若类型与课程代码与历史记录完全一致，地点与时间将自动填充。课程名称需完全相同（如同一门课填写了"Math5"与"math5"会被识别为同一门课，但"Math V"与"Math5"则不会匹配）。
  **Auto-fill**: When the event type and course name exactly match a previous entry, location and time will be pre-filled. Course names must be identical to match.


---

## 隐私说明 / Privacy

- 账号**仅用于区分不同用户的数据**，不会收集任何个人信息
- Your account is used **only to keep your data separate from other users**. No personal data is collected or shared.
- 存储内容仅包括你填写的课程、标题、地点、时间等截止日期信息
- Only your deadline entries (course, title, location, time) are stored.

---

## 周事项（待定日期）/ Week-level Events

当只知道某一周会安排某一事项，不知道具体时间而又想提前记录时，可以点击周标签先行编辑，等确定后再转移到具体某天。

Sometimes a deadline is announced by week but not yet scheduled to a specific day. You can log it at the week level first, then transfer it later.

**如何使用 / How to use:**
1. 点击日历左侧的周标签（如 Week 8）即可打开该周的事项面板
   Click the week label on the left (e.g. Week 8) to open the week panel
2. 点 **+ Add** 填写类型、课程和标题，无需填写地点与时间
   Click **+ Add** and fill in type, course and title — no location or time needed
3. 周标签上出现灰色小点代表该周有待定事项
   A grey dot on the week label means there are pending events for that week
4. 事项确定日期后，点 **📅** 按钮，选择具体周几并补全地点与时间，完成转移
   Once the date is confirmed, click **📅**, select the day of the week, fill in location and time to transfer

**注意 / Note:** 转移后事项将出现在对应日期，原周事项自动移除。
After transfer, the event will appear on the specific date and be removed from the week panel.

## 更新说明 / Updates

- 每年更新校历数据 / Academic calendar updated each year
- 目前支持 / Currently supported: **2026/04**, **2026/09**
- 如有校历错误或建议请留言 / For calendar errors or suggestions, you can just leave a comment
- **数据保留政策**：为方便定位新学期，本站仅保留最近三年的学期数据，超出范围的历史学期将从日历中移除。如有需要请自行记录旧学期事项。
  **Data retention**: Only the most recent 3 years of semester data will be maintained. Please keep your own records of older entries if needed.