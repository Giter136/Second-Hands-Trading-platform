# 02. 项目架构与目录规范

更新时间: 2026-04-18

## 1. 架构原则

1. 单仓管理(monorepo)但前后端职责彻底分离。
2. 目录即边界: 任何新文件必须放入明确分层，不允许散落。
3. AI生成内容必须遵循该目录规范，不得自行发明层级。
4. 项目形态锁定为网页项目(Web，B/S)，禁止新增客户端工程目录。

## 2. 标准目录树(根目录)

1. apps/
2. infra/
3. docs/
4. scripts/
5. .env.example
6. README.md

## 3. 前端目录规范(apps/web)

1. apps/web/src/app
用途: 路由页面与布局(仅页面编排，不写业务数据访问)

2. apps/web/src/components
用途: 可复用UI组件

3. apps/web/src/features
用途: 按业务域组织前端逻辑(商品、会话、交易)

4. apps/web/src/services
用途: API请求封装，仅负责请求与响应映射

5. apps/web/src/types
用途: 前端类型定义，与后端DTO保持语义一致

6. apps/web/src/utils
用途: 无业务副作用的通用工具函数

7. apps/web/public
用途: 静态资源

8. apps/web/tests
用途: 前端测试文件

## 4. 后端目录规范(apps/api)

1. apps/api/app/main
用途: 应用启动与路由注册

2. apps/api/app/api
用途: 路由层(按模块拆分: auth、items、conversations、trades、admin)

3. apps/api/app/schemas
用途: 请求与响应的数据结构定义

4. apps/api/app/services
用途: 业务规则编排与状态流转

5. apps/api/app/repositories
用途: 数据访问层，仅负责数据库读写

6. apps/api/app/models
用途: 数据库实体定义

7. apps/api/app/core
用途: 配置、鉴权、中间件、异常基类

8. apps/api/app/logging
用途: 日志格式与日志上下文处理

9. apps/api/tests
用途: 后端测试文件

## 5. 基础设施目录规范(infra)

1. infra/local-runtime
用途: 本地运行参数、端口约定与环境模板

2. infra/db
用途: 数据库初始化与迁移管理脚本

## 6. 文档目录规范(docs)

1. docs/planning
用途: 产品与数据规划基线

2. docs/engineering
用途: 技术选型、目录规范、AI约束规则

3. docs/api
用途: 接口清单与字段契约

4. docs/operations
用途: 本地启动、备份、故障处理手册

## 7. 命名与放置强制规则

1. 页面文件仅放在 apps/web/src/app。
2. 可复用组件仅放在 apps/web/src/components。
3. 后端路由只能放在 apps/api/app/api。
4. 数据库读写代码只能放在 apps/api/app/repositories。
5. 业务规则只能放在 apps/api/app/services。
6. 文档必须写入 docs 下对应分类目录，禁止写到根目录散落。
7. 严禁新增 apps/client、apps/mobile、apps/desktop 等非网页端目录。
