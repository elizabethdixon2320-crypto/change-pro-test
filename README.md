# CHANGE 三项训练系统（MVP）

> 打开就能练，不用思考。

极简健身 PWA，只做三件事：**跑一下 / 拉一下 / 蹲一下**。按文档 MVP 规范实现。

## 技术栈

- React 18 + TypeScript + Vite
- Tailwind CSS（纯黑极简 UI）
- Zustand + LocalStorage（完全本地，无账号）
- React Router（HashRouter，纯静态可托管）
- PWA manifest（可加到手机桌面）

## 运行

```bash
npm install
npm run dev
```

打开 http://localhost:5173 ，手机同局域网可访问 `http://<你电脑 IP>:5173`。

## 构建

```bash
npm run build
npm run preview
```

构建产物在 `dist/`，直接丢到任意静态托管（Vercel / Netlify / Cloudflare Pages 等）即可。

## 功能清单（对照 PRD）

- [x] 首次进入 3 问（频率 / 经验 / 偏好）
- [x] 首页三按钮 + 今日推荐
- [x] 跑一下 / 拉一下 / 蹲一下 训练页
- [x] 跑步 20 分钟计时器（10 分钟阶段切换 + 蜂鸣提示）
- [x] 拉/蹲 正计时 + 手动完成
- [x] 完成反馈页（轻松 / 正常 / 有点累）
- [x] 记录页（本周次数 / 连续天数 / 分项统计 / 最近 10 条）
- [x] 设置页（频率 / 偏好 / 经验 / 清空数据）
- [x] 轮换逻辑（run → pull → squat，3 天未训自动重置）
- [x] 本地持久化（localStorage）
- [x] PWA manifest

## 目录结构

```
src/
├── main.tsx            入口
├── App.tsx             路由
├── index.css           Tailwind + 样式
├── types.ts            类型定义（UserProfile/WorkoutRecord/SystemState）
├── store.ts            Zustand store（含轮换逻辑、统计函数）
└── pages/
    ├── Onboarding.tsx  首次 3 问
    ├── Home.tsx        首页
    ├── RunPage.tsx     跑一下说明页
    ├── PullPage.tsx    拉一下说明页
    ├── SquatPage.tsx   蹲一下说明页
    ├── RunTimer.tsx    通用计时页（跑=倒计时，拉/蹲=正计时）
    ├── Feedback.tsx    完成反馈页
    ├── Records.tsx     训练记录
    └── Settings.tsx    设置
```

## 设计原则

- 从打开到开始训练 **≤ 3 次点击**
- 大按钮 / 强对比 / 大留白
- 无注册、无登录、无手机号
- 响应 < 200ms，离线可用
