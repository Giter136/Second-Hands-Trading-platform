# 04. 前端设计与开发规划 (Frontend Design & Dev Plan)

更新时间: 2026-04-18

## 1. 核心视觉与交互设计语言 (Aesthetic Direction)

基于本项目要求，前端整体视觉风格定调为 **“云端浮岛” (Cloud & Glassmorphism)** 极简风格。主打**浅色色系、浮动界面元素、以及流畅的滑动特效**，并杜绝平庸的传统后台式UI，让基本页面与交互“眼前一亮”。

### 1.1 视觉风格定义
- **主题色调 (Light Color Scheme)**: 
  - 核心背景: 珍珠白 (`#FDFDFD`) 到极浅的冷灰 (`#F1F5F9`) 渐变，营造通透感。
  - 卡片与面板: 半透明白 `rgba(255, 255, 255, 0.7)`，搭配 `backdrop-filter: blur(16px)`（毛玻璃效果）。
  - 点缀色 (Accent): 鲜艳但柔和的克莱因蓝 (`#4361EE`) 或 治愈系薄荷绿 (`#10B981`)，用于按钮和关键高亮。
  - 文字呈现: 深炭黑 (`#0F172A`) 保证可读性，辅以中灰 (`#64748B`) 作为次要信息。
- **排版 (Typography)**:
  - 标题字体: 引入具有现代几何感的英文字体（如 `Cabinet Grotesk` 或 `Outfit`）搭配系统默认无衬线中黑体，增加视觉张力。
  - 大量使用留白（Negative Space），彻底打破紧凑拥挤的表格/列表刻板印象。
- **空间构成 (Spatial Composition)**:
  - **浮动界面 (Floating UI)**: 导航栏、交互面板、悬浮操作按钮（FAB）全部分离背景，四周留有间距，并通过平滑的 Drop Shadow (`shadow-sm` 到 `shadow-2xl`) 呈现层级深度。

### 1.2 动画与微交互 (Motion & Slides)
- **全局入场**: 页面加载时采用阶梯式上滑淡入（Staggered Fade-Up），元素以 50-100ms 的延迟依次进入视口。
- **悬停特效 (Hover States)**:
  - 商品卡片: 悬停时整体 Z 轴抬升（向上浮动 `translate-y-[-4px]`），边缘阴影扩散，图片内部轻微放大（Scale 1.05），过渡极度平滑 (`transition-all duration-300 ease-out`)。
- **页面切换与滑动**:
  - 弹窗/抽屉: 摒弃居中死板的弹窗，采用从底部顺滑抽出的“滑动面板”（Bottom Sheet / Sliding Sidebar），带有弹性缓冲（Spring Animation）。
  - 步骤表单（如商品发布与交易确认）采用左右滑动的无缝过渡。

---

## 2. 核心页面规划与布局

### 2.1 首页 (商品瀑布流) `/`
- **顶部**: 浮置（Sticky + Floating）的毛玻璃导航条。
- **分类区**: 横向滑动的 Pill（胶囊）形筛选器按钮。
- **主体**: 不规则瀑布流（Masonry）或大圆角流式网格展示商品。利用图片的天然长宽比构成错落感。
- **交互**: 滚动时触发视差和懒加载图片渐显。

### 2.2 商品详情页 `/[id]`
- **布局**: 左侧大图画廊（支持鼠标拖拽滑动切换），右侧浮动的信息卡片。
- **交互亮点**: 底部悬浮一条常驻动作栏（包含“价格”、点缀色高亮的“发起沟通”按钮），滚动时也始终吸附在视口底部，具有强烈的行动号召力（CTA）。

### 2.3 沟通与交易台 `/messages`
- **布局**: 左侧为联系人列表槽（Sliding List），右侧为对话气泡框。整个面板悬浮在主背景之上。
- **交互**: 点击“发起交易”时，右侧划出（Slide In）交易表单面板，输入“金额”和“地点”的输入框默认只显示底边框，聚焦时展开背景光晕。

### 2.4 商品发布页 `/publish`
- **布局**: 打破传统长表单，采用“横向视差滑动”的卡片进度（Multi-step sliding form）。
  - 第 1 步: 上传图片（支持拖拽，有呼吸动效的外发光虚线框）。
  - 第 2 步: 填写标题内容。
  - 第 3 步: 定价与擦亮发布。

### 2.5 管理员控制台 `/admin` (隐式路由)
- **权限与路由逻辑**: 未登录或普通用户访问根目录时，展示常规买卖C端界面；若使用具有特定权限（`role === 1`）的管理员账号登录成功，前端根据身份标识将用户重定向至 `/admin` 专属界面。
- **布局**: 保持“云端浮岛”的设计基调，但界面布局转为“全景仪表盘”（Dashboard）。左侧为悬浮导航侧边栏（审核商品、用户管理、交易监控），右侧为开阔的数据表格与瀑布流图文混排的待审核列表。
- **交互亮点**: 
  - 快速批量审核操作，采用卡片左右滑动（Swipe left/right）分别代表拒绝与通过。
  - 危险操作（如下架违规内容、封禁用户）具备醒目的克莱因红/橙色高亮与防呆二次确认弹窗。

---

## 3. 前端功能接口与 Service 规划

依据 `apps/web/src/services` 规范，前端将封装基于接口约定的 API 请求，保障数据流与 UI 渲染分离。下面是各业务模块的接口方法映射计划：

### 3.1 账号与鉴权服务 (`auth.service.ts`)
- `login(phone, password)`: 登录，存储 Token。
- `register(phone, password, nickname)`: 用户注册。
- `getProfile()`: 获取当前登录用户的浮动徽章数据和基础资料。

### 3.2 商品浏览与发布服务 (`item.service.ts`)
- `getItems(filters)`: 首页列表拉取（支持分页、按分类成色过滤）。返回列表驱动瀑布流动效。
- `getItemDetail(id)`: 获取单一商品全景信息。
- `publishItem(formData)`: 发起商品数据流与图片（基于 `FormData` 提交本地 `uploads`）。
- `updateItemStatus(id, status)`: 买家下架/上架商品状态机流转。

### 3.3 沟通与信息流服务 (`chat.service.ts`)
- `getConversations()`: 拉取用户的会话列表，用于渲染侧滑栏。
- `getMessages(conversationId)`: 拉取具体会话历史。
- `sendMessage(conversationId, content)`: 发送消息实体。
### 3.5 管理员专属服务 (`admin.service.ts`)
- `getPendingItems()`: 拉取待审核商品队列。
- `auditItem(itemId, result, reason)`: 提交商品审核结果（通过/拒绝）。
- `freezeUser(userId)`: 冻结违规用户。
- `getAllTrades()`: 获取全局交易监控列表。


### 3.4 交易引擎服务 (`trade.service.ts`)
- `createTrade(payload)`: 页面点击“发起交易”后提交价格与地点，生成待确认 Trade 订单。
- `confirmTrade(tradeId)`: 卖家同意交易。
- `cancelTrade(tradeId, reason)`: 任一方滑动取消交易。
- `completeTrade(tradeId)`: 交易完成闭环确认。

---

## 4. 技术栈应用与开发规范限制

- **框架基建**: `Next.js 15` (App Router) 控制页面路由，利用 server-side 预取关键商品数据以保障首屏极速加载。
- **样式构建**: `Tailwind CSS 4.x` 构建原子类。
  - 规定毛玻璃类名标准: `bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg`.
  - 所有的过渡必须带上 `transition-all duration-300 ease-out` 体系。
- **动画实现**: 推荐引入轻量级状态动画库（如 `Framer Motion`，可选，视团队确认而定，若无则使用纯 CSS Tailwind `@keyframes` 与 `group-hover` 处理所有滑动浮动特效）。
- **组件抽象**: 基础组件（Button, Input, Modal/SlideOver）必须位于 `apps/web/src/components` 内并具备高度一致的浮动阴影规范。

> 执行提醒：后续所有页面开发，均需严格参照此视觉标准进行，严禁平铺直叙拼接表单元素。
