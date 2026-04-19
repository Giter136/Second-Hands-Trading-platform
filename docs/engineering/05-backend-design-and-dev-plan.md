# 05. 后端架构与开发规划 (Backend Design & Dev Plan)

更新时间: 2026-04-19

本文档基于 01-tech-stack-and-deployment.md 确定的 Python + FastAPI + SQLAlchemy 技术栈，为后端开发界定严格的架构模式、实现边界与验收标准。遵守本规范可确保和 planning/api 文档一致，且代码具备可持续迭代能力。

## 1. 架构分层设计 (Router-Service-Repository)

后端代码统一存放于 apps/api/app，强制三层隔离：

- API 路由层 (Routers/Controllers)
  - 目录: api/
  - 职责: 解析 HTTP 请求、注入鉴权依赖、调用 Service、返回统一响应结构。
  - 禁止项: 直接写数据库 SQL 或承载业务状态判断。

- 业务逻辑层 (Services)
  - 目录: services/
  - 职责: 承接业务规则、状态机流转、权限细分、事务编排。
  - 禁止项: 直接处理 HTTP 细节(如 Query/Path 解析)。

- 数据访问层 (Repositories)
  - 目录: repositories/
  - 职责: 封装 ORM 查询与持久化，输出可复用的数据访问方法。
  - 禁止项: 写跨领域业务规则。

推荐补充目录：
- models/: SQLAlchemy 模型
- schemas/: Pydantic 请求与响应模型
- core/: 配置、鉴权、异常、数据库会话、中间件

## 2. 模块与路由边界

根据 docs/api/01-api-specs.md 与 MVP 范围，后端按业务域拆分为以下路由模块：

1. auth_router: 登录、注册、当前用户信息
2. items_router: 商品列表、详情、发布、状态更新
3. conversations_router: 会话列表、消息列表、发送消息
4. trades_router: 创建交易、确认、取消、完成
5. upload_router: 图片上传
6. admin_router: 商品审核、用户冻结、交易监控

约束：
- 所有 /admin/* 路由必须挂载管理员依赖。
- 仅保留 /api/v1 前缀，不在 MVP 阶段引入多版本路由策略。

## 3. 身份鉴权与权限模型 (Auth & RBAC)

### 3.1 鉴权管线
1. 密码存储: 使用 bcrypt 加盐哈希，数据库仅保存 password_hash。
2. 登录发 token: JWT 负载至少包含 sub(user_id)、role、exp。
3. 通用依赖: get_current_user 负责校验 token 结构、签名、有效期、用户状态(status=1)。
4. 管理员依赖: get_current_admin 在 get_current_user 基础上断言 role=1。

### 3.2 安全基线
1. 登录错误信息统一返回“账号或密码错误”，禁止区分账号不存在与密码错误。
2. 冻结用户(status=0)禁止登录和业务写操作。
3. 上传接口限制文件类型与大小，禁止可执行脚本扩展名。

## 4. 数据契约与错误处理规范

### 4.1 统一响应结构
成功响应：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

失败响应：

```json
{
  "code": 40001,
  "message": "invalid params",
  "data": null
}
```

### 4.2 建议业务码(最小集)
1. 200: success
2. 40001: 参数错误
3. 40101: 未登录或 token 无效
4. 40301: 无权限
5. 40401: 资源不存在
6. 40901: 状态冲突(例如商品已进入交易中)
7. 50001: 服务内部错误

### 4.3 Pydantic 模型命名
1. 入参使用 XxxRequest 或 XxxCreateRequest
2. 出参使用 XxxResponse 或 XxxDTO
3. ORM 转换统一开启 from_attributes=True

## 5. 状态机落地规则 (与 PRD/数据库对齐)

### 5.1 商品状态 item.status
0待审核, 1在售, 2交易中, 3已售出, 4已下架, 5审核拒绝

允许流转：
1. 0 -> 1 或 5 (管理员审核)
2. 1 -> 2 (买家发起有效交易)
3. 2 -> 1 (交易取消回滚)
4. 2 -> 3 (交易完成)
5. 1 -> 4 (卖家主动下架)

### 5.2 交易状态 trade.status
0已发起, 1待卖家确认, 2进行中, 3已完成, 4已取消

允许流转：
1. 0 -> 1 (创建后进入待确认)
2. 1 -> 2 (卖家确认)
3. 0/1/2 -> 4 (任一方取消)
4. 2 -> 3 (双方完成确认)

### 5.3 会话状态 conversations.status
1进行中, 0已关闭

约束：
1. 商品已售出时，会话只读。
2. 管理员可关闭违规会话。

## 6. 事务与并发控制

交易相关接口必须放在同一数据库事务中，推荐规则：

1. 创建交易时，对商品行执行 select ... for update，确保同一时刻仅一条有效交易。
2. 确认/取消/完成交易时，同时更新 trade.status 与 item.status，必须原子提交。
3. 发生异常必须 rollback，并返回统一错误码。
4. 对重复提交场景做幂等防护：若目标状态已达成，返回 success 或显式冲突码。

## 7. Repository 实现约定 (SQLAlchemy 2.x Async)

1. 使用 AsyncSession + asyncmy(或 aiomysql)。
2. Repository 方法命名要表达业务语义，如 get_active_trade_by_item_id。
3. 不在 Service 外部直接访问 session。
4. 单方法尽量单职责，复杂查询拆为组合方法。

## 8. 上传与静态文件规范

1. 上传目录固定为 apps/api/uploads/images。
2. 仅允许 jpg/jpeg/png/webp。
3. 单文件大小限制建议 5MB，单商品图片数量限制 1-9。
4. 返回可访问路径格式: /uploads/images/{filename}。

## 9. 环境变量与启动规范

工作目录固定 apps/api，推荐最小环境变量：

1. APP_ENV=local
2. APP_HOST=127.0.0.1
3. APP_PORT=8000
4. DATABASE_URL=mysql+asyncmy://user:password@127.0.0.1:3306/second_hand
5. JWT_SECRET=replace_me
6. JWT_EXPIRE_MINUTES=10080
7. CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

启动命令：
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

## 10. 测试与验收标准 (MVP)

最低测试覆盖建议：

1. Service 层单测: 关键状态机流转与权限判断
2. API 集成测试: 鉴权、商品发布、交易闭环、管理员审核
3. 并发场景测试: 同一商品并发发起交易只能成功一次

关键验收清单：

1. 普通用户不可访问 /admin/*
2. 冻结用户不能登录和发布商品
3. 交易完成后商品必须为已售出且不可再次发起新交易
4. 交易取消后商品可回到在售

## 11. 实施顺序建议

1. 第1阶段: 完成 models/schemas/core，打通 auth 与基础鉴权
2. 第2阶段: 完成 items + upload + 审核流转
3. 第3阶段: 完成 conversations + messages
4. 第4阶段: 完成 trades 闭环 + 并发控制
5. 第5阶段: 补齐 admin 监控接口 + 测试 + 文档更新
