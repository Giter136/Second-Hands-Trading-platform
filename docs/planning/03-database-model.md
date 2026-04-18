# 03. 数据库模型设计(最精简)

更新时间: 2026-04-18

当前目标数据库引擎: MySQL 8.4.3 LTS

## 1. 设计原则

1. 只支撑发布-浏览-沟通-交易闭环。
2. 采用关系型建模，保障交易与状态一致性。
3. 用少量状态字段驱动业务，避免过度拆表。

## 2. 数据表设计

## 2.1 users

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| id | BIGINT | PK, 自增 | 用户ID |
| phone | VARCHAR(20) | NOT NULL, UNIQUE | 登录账号 |
| password_hash | VARCHAR(255) | NOT NULL | 密码哈希 |
| nickname | VARCHAR(20) | NOT NULL | 展示昵称 |
| avatar_url | VARCHAR(255) | NULL | 头像地址 |
| role | TINYINT | NOT NULL, DEFAULT 0 | 0普通用户, 1管理员 |
| status | TINYINT | NOT NULL, DEFAULT 1 | 1正常, 0冻结 |
| created_at | DATETIME | NOT NULL | 创建时间 |
| updated_at | DATETIME | NOT NULL | 更新时间 |

## 2.2 items

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| id | BIGINT | PK, 自增 | 商品ID |
| seller_id | BIGINT | NOT NULL, FK->users.id | 卖家ID |
| title | VARCHAR(60) | NOT NULL | 标题 |
| category | VARCHAR(30) | NOT NULL | 分类 |
| condition_level | TINYINT | NOT NULL | 成色1-5 |
| price | DECIMAL(10,2) | NOT NULL | 挂牌价 |
| description | TEXT | NOT NULL | 描述 |
| city | VARCHAR(30) | NOT NULL | 所在城市 |
| status | TINYINT | NOT NULL, DEFAULT 0 | 0待审核,1在售,2交易中,3已售出,4已下架,5审核拒绝 |
| reject_reason | VARCHAR(200) | NULL | 拒绝原因 |
| published_at | DATETIME | NULL | 上架时间 |
| sold_at | DATETIME | NULL | 售出时间 |
| created_at | DATETIME | NOT NULL | 创建时间 |
| updated_at | DATETIME | NOT NULL | 更新时间 |

## 2.3 item_images

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| id | BIGINT | PK, 自增 | 图片ID |
| item_id | BIGINT | NOT NULL, FK->items.id | 商品ID |
| image_url | VARCHAR(255) | NOT NULL | 图片地址 |
| sort_order | INT | NOT NULL, DEFAULT 0 | 排序(越小越前) |
| created_at | DATETIME | NOT NULL | 创建时间 |

## 2.4 conversations

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| id | BIGINT | PK, 自增 | 会话ID |
| item_id | BIGINT | NOT NULL, FK->items.id | 关联商品 |
| buyer_id | BIGINT | NOT NULL, FK->users.id | 买家ID |
| seller_id | BIGINT | NOT NULL, FK->users.id | 卖家ID |
| status | TINYINT | NOT NULL, DEFAULT 1 | 1进行中,0已关闭 |
| created_at | DATETIME | NOT NULL | 创建时间 |
| updated_at | DATETIME | NOT NULL | 更新时间 |

补充约束: UNIQUE(item_id, buyer_id, seller_id)

## 2.5 messages

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| id | BIGINT | PK, 自增 | 消息ID |
| conversation_id | BIGINT | NOT NULL, FK->conversations.id | 会话ID |
| sender_id | BIGINT | NOT NULL, FK->users.id | 发送者 |
| content | VARCHAR(1000) | NOT NULL | 消息内容 |
| created_at | DATETIME | NOT NULL | 发送时间 |

## 2.6 trades

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| id | BIGINT | PK, 自增 | 交易ID |
| item_id | BIGINT | NOT NULL, FK->items.id | 商品ID |
| buyer_id | BIGINT | NOT NULL, FK->users.id | 买家ID |
| seller_id | BIGINT | NOT NULL, FK->users.id | 卖家ID |
| conversation_id | BIGINT | NOT NULL, FK->conversations.id | 来源会话 |
| agreed_price | DECIMAL(10,2) | NOT NULL | 约定价格 |
| meetup_location | VARCHAR(120) | NOT NULL | 交易地点 |
| meetup_time | DATETIME | NULL | 交易时间 |
| status | TINYINT | NOT NULL, DEFAULT 0 | 0已发起,1待卖家确认,2进行中,3已完成,4已取消 |
| cancel_reason | VARCHAR(200) | NULL | 取消原因 |
| buyer_confirmed_at | DATETIME | NULL | 买家确认时间 |
| seller_confirmed_at | DATETIME | NULL | 卖家确认时间 |
| completed_at | DATETIME | NULL | 完成时间 |
| created_at | DATETIME | NOT NULL | 创建时间 |
| updated_at | DATETIME | NOT NULL | 更新时间 |

业务约束: 同一商品同一时刻仅允许1条未取消且未完成的有效交易。

## 2.7 item_audits

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| id | BIGINT | PK, 自增 | 记录ID |
| item_id | BIGINT | NOT NULL, FK->items.id | 商品ID |
| admin_id | BIGINT | NOT NULL, FK->users.id | 审核管理员 |
| result | TINYINT | NOT NULL | 1通过,2拒绝 |
| reason | VARCHAR(200) | NULL | 审核说明 |
| created_at | DATETIME | NOT NULL | 审核时间 |

## 3. 表关系说明

1. users 与 items: 一对多(用户可发布多个商品)
2. items 与 item_images: 一对多(商品可有多张图片)
3. items 与 conversations: 一对多(同一商品可有多个会话)
4. conversations 与 messages: 一对多(会话包含多条消息)
5. items 与 trades: 一对多(历史可多条, 但同时仅1条有效交易)
6. users 与 trades: 一对多(可作为买家或卖家参与多笔交易)
7. users(管理员) 与 item_audits: 一对多(管理员产生多条审核记录)
8. item_audits 与 items: 多对一(一条审核记录对应一个商品)
