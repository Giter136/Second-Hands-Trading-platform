# 01. 核心接口规范 (API Specs)

更新时间: 2026-04-18

本规范旨在为前后端同学提供明确的数据交互契约，以保障《04. 前端设计与开发规划》中定义的前端页面拥有完整的底层数据支持。

## 1. 约定说明
- **基础 URL**: `/api/v1`
- **内容类型**: `application/json`
- **鉴权方式**: 请求头携带 `Authorization: Bearer <token>`
- **统数据结构**:
  ```json
  {
    "code": 200,          // 业务响应码 (200成功)
    "message": "success", // 简短说明消息
    "data": { ... }      // 实际 payload 数据体
  }
  ```

## 2. 账号与鉴权 (`/auth`)

### 2.1 登录获取 Token
- **POST** `/auth/login`
- **请求体**: 
  - `phone` (string, 必填) 或 `username` (string, 必填)
  - `password_hash` (string, 必填) - 前端传输加密哈希
- **响应数据**:
  ```json
  {
    "code": 200,
    "data": {
      "token": "jwt_token_string",
      "user": {
        "id": 1,
        "phone": "13800000000",
        "role": 1, // 0为普通用户，1为系统管理员
        "nickname": "Cloud Admin"
      }
    }
  }
  ```
  *说明：前端将严格依赖返回的 `user.role` 字段来隐式决定是否挂载或开启管理控制台入口。普通用户登录仅返回 `role: 0`。*

### 2.2 获取当前信息
- **GET** `/auth/me`
- **响应数据**: 当前用户实体 `User`（包含角色、状态、展示头像等），用于驱动前端左下角用户徽章悬浮面板。

### 2.3 用户安全登出
- **POST** `/auth/logout`
- **请求头**: 请求携带 Bearer Token
- **说明**: 退出登录入口。后端需作废该 Token，断开现有会话；前端通过该接口响应成功后，在此处执行页面跳转并清空本地 Storage 及 Cookie。
- **响应数据**: 空或 `{ "message": "success" }`

---

## 3. 商品核心 (`/items`)

### 3.1 拉取市场/瀑布流商品列表
- **GET** `/items`
- **查询参数**:
  - `category` (选填): 用于匹配如“数码极客”等 Pill 筛选器。
  - `page` / `size` (选填，分页)
- **响应数据**:
  - `items`: `Item[]`（包含主图 `ItemImage` 的第一张作为瀑布流封面）
  - `total`: 记录数

### 3.2 查询单商品详情
- **GET** `/items/{id}`
- **响应数据**: `Item` 实体详情，需级联加载所有 `ItemImage` 图片数组、卖家简单信息，以支撑 `/[id]` 详情巨幕渲染。

### 3.3 发布新商品
- **POST** `/items`
- **请求体 (参照 publishPage 收集表单)**:
  - `title`, `category`, `condition_level`, `price`, `description`, `city`
  - `image_urls`: `string[]`（预上传到文件系统的存储路径，见下文文件上传）
- **响应数据**: 新创建的 `Item` 实体。

---

## 4. 会话与消息 (`/messages`)

### 4.1 拉取我的侧滑会话栏
- **GET** `/conversations`
- **响应数据**: 会话实体列表 `Conversation[]`。

### 4.2 获取具体聊天流
- **GET** `/conversations/{id}/messages`
- **响应数据**: `Message[]` 聊天窗口双向气泡记录。

### 4.3 发起意向或回复文本
- **POST** `/conversations/{id}/messages`
- **请求体**: 
  - `content` (string): 文本回复内容。

---

## 5. 交易流转 (`/trades`)

### 5.1 【买家】向卖家发起实质交易
- **POST** `/trades`
- **请求体**:
  - `item_id`, `conversation_id`
  - `agreed_price` (可以跟挂牌价不同的“屠龙刀”价格)
  - `meetup_location` (约定当面交易地点)

### 5.2 状态扭转
- **POST** `/trades/{id}/confirm` (卖家确认)
- **POST** `/trades/{id}/cancel` (多方或平台取消)
- **POST** `/trades/{id}/complete` (成交通知并更新 Item 下架状态)

---

## 6. 通用上传 (`/upload`)

### 6.1 图片持久化
- **POST** `/upload/image`
- **Body**: `multipart/form-data`
- **响应数据**: 
  - `url`: 返回本地静态资源的访问路径（如：`/uploads/images/abc.jpg`）。用于商品发布的第 1 步提前预览回显。

---

## 7. 管理员专用接口 (`/admin`)

所有 `/admin` 开头的路由必须在后端网关或鉴权依赖防线中进行强拦截校验：仅允许 `user.role == 1` 的身份访问。

### 7.1 获取商品管理与审核列表
- **GET** `/admin/items`
- **查询参数**: 
  - `status` (选填): 0代表待审核，1代表已上架，5代表审核拒绝。不传则拉取全部。
  - `page` (number, 选填默认 1)
  - `size` (number, 选填默认 20)
- **响应数据**: 
  ```json
  {
    "code": 200,
    "data": {
      "total": 12,
      "items": [
        {
          "id": 101,
          "title": "索尼 WH-1000XM4",
          "price": 1450.00,
          "status": 0,
          "seller": { "id": 5, "nickname": "ZeroCoder" },
          "created_at": "2026-04-18T10:00:00Z"
        }
      ]
    }
  }
  ```

### 7.2 审核单条商品
- **POST** `/admin/items/{id}/audit`
- **请求体**:
  ```json
  {
    "result": 1, 
    "reason": "合规" 
  }
  ```
  *(注：`result` 1通过, 2拒绝；拒绝时 `reason` 必填提供违规原因)*
- **响应数据**: 审核记录 `ItemAudit`，引擎同步自动扭转商品状态为在售(1)或审核拒绝(5)。

### 7.3 用户管控与冻结
- **POST** `/admin/users/{id}/freeze`
- **请求体**:
  ```json
  {
    "reason": "发布违规广告内容"
  }
  ```
- **响应数据**: 成功标识。后端更新用户状态属性为 `status=0` 并断开其前端所有会话及操作权。

### 7.4 交易记录全景监控
- **GET** `/admin/trades`
- **查询参数**: `status`, `page`, `size`
- **响应数据**: 包含买卖双方信息、交易快照及当前流转状态的 `Trade` 全集对象分页列表。