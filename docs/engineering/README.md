# 工程实施基线文档

更新时间: 2026-04-18

## 文档定位

本目录接续 docs/planning 的产品与数据基线，固化网页项目(Web)的技术选型、项目结构与 AI 开发约束，作为进入编码阶段前的统一工程标准。

## 文档索引

1. [技术栈选型与本地运行架构](./01-tech-stack-and-deployment.md)
2. [项目架构与目录规范](./02-project-structure-standard.md)
3. [VibeCoding全局约束规则(System Prompt)](./03-vibecoding-system-prompt.md)
4. [Git协作基线文档(跨目录)](../collaboration/README.md)

## 与前置文档关系

1. 产品范围来源: ../planning/01-mvp-core.md
2. 字段和状态来源: ../planning/02-light-prd.md
3. 数据模型来源: ../planning/03-database-model.md

## 执行顺序建议

1. 先锁定技术栈与本地运行边界。
2. 再按目录规范创建项目骨架。
3. 最后将系统Prompt粘贴到AI编码会话的系统层，作为强约束执行。
