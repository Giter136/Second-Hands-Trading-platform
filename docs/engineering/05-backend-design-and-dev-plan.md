# 05. 后端架构与开发规划 (Backend Design & Dev Plan)

更新时间: 2026-04-18

本文档基于 `01-tech-stack-and-deployment.md` 确定的 Python + FastAPI + SQLAlchemy 技术栈，为后端开发界定严格的架构模式与代码组织要求。遵守本规范可确保逻辑高度解耦。

## 1. 架构分层设计 (Controller-Service-Repository)

为保证代码可维护性，强制将后端业务进行三层防腐隔离（存放于 `apps/api/app/` 下）：

- **API 路由层 (Routers/Controllers)**
  - 目录: `api/`
  - 职责: 仅负责解析前端 HTTP 请求、验证 Token 鉴权依赖 (Dependency Injection)、提取与校验参数 (Pydantic)、调用下层 Service 方法，并将结果包装为标准 JSON 格式返回。
  - 约束: 绝对禁止在此层直接执行数据库 `session.execute()` 或写具体的判定逻辑。

- **业务逻辑层 (Services)**
  - 目录: `services/`
  - 职责: 承接路由层指令，编排核心业务规则与状态机流转。例如：处理交易单发起前判断“商品是否已被买走”、密码比对、执行商品状态流转变迁。
  - 约束: 所有与“业务对错”相关的 `if-else` 都只能存在于此。

- **数据访问层 (Repositories)**
  - 目录: `repositories/`
  - 职责: 内聚所有的 CRUD 操作，封装 SQLAlchemy 的 `select()`, `insert()`, `update()` 语句。
  - 约束: 给 Service 层提供高度可读的方法（如 `get_item_by_id`, `update_trade_status`），向上屏蔽数据库底层的方言或 ORM 复杂操作。

## 2. 身份与鉴权设计 (Auth & RBAC)

系统目前设定两类角色：普通用户（买卖双方）与系统管理员。
权限控制将由 FastAPI 的 `Depends()` 机制全局接管：

### 2.1 鉴权管线 (Auth Pipeline)
1. **密码学**: 录入的密码采用 `bcrypt` 加盐哈希存储至 `password_hash` 字段。
2. **令牌派发**: 登录成功颁发 JWT (JSON Web Token)，包含 `sub` (user_id) 和 `role` 声明。不使用外部 Redis 缓存 session，采用无状态验签满足 MVP 轻量需求。
3. **普通校验依赖**: `get_current_user` 检查 JWT 格式及其有效期。
4. **管理员防线**: `get_current_admin` 在前者的基础上，进一步断言 `user.role == 1`，并将该依赖注入到所有的 `/admin/*` 路由中，实现物理级越权防御。

## 3. Pydantic 模型契约 (Schemas)

- 目录: `schemas/`
- 在 FastAPI 中，所有出入参严格通过 Pydantic v2 模型进行声明验证。
- 区分入参和出参：
  - 前缀 `Create` 或后缀 `Request`: 如 `ItemCreateRequest`，用于接收并强校验前端传来的 Payload。
  - 后缀 `Response` 或 `DTO`: 如 `ItemResponse`，利用 `from_attributes=True` 将 ORM 模型转为 JSON 对象脱敏吐出，禁止把含密码哈希的对象直接推给前端。

## 4. MVP 数据库连线规范 (SQLAlchemy 2.x)

- 使用异步驱动（`aiomysql` 或 `asyncmy`）保障并发性能。
- 由于不引入 MQ 等异步中间件，所有状态流转（例如管理员审核拒绝同时需要通知卖家商品变更）利用 MySQL 事务 (`session.commit()`) 强力保障一致性。若中途出错（如网络断绝），依靠抛出异常配合统一中间件完成 `session.rollback()`。

## 5. 项目环境与启动

- 工作目录必须锁定在 `apps/api`。
- 本地依赖清单使用 `requirements.txt` 或 `Pipfile` 提供。
- 使用 `uvicorn app.main:app --reload --port 8000` 启动，全局挂载 CORS 跨域规避前端开发时的 3000/3001 端口拦截请求限制。
