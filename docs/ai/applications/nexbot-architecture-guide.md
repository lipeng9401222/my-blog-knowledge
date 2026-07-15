---
title: 生产级 Agent 平台架构全景（FastAPI + LangGraph 实战解析）
date: 2026-06-29
category: ai
tags:
  - AI
  - Agent
  - LangGraph
  - FastAPI
  - 架构
---

# EClaw / Nexbot 项目架构全景文档

> **文档定位**：面向希望从事 Agent 开发的工程师，从零开始全面理解 Nexbot 项目的背景、架构、前后端核心逻辑和扩展机制。
>
> **阅读建议**：先通读"项目概述"和"整体架构"建立全局认知，再按兴趣深入各子系统。代码路径均相对于项目根目录 `/Users/juanjuan/Workspace/epoint/nextbot`。

---

## 目录

- [一、项目概述](#一项目概述)
  - [1.1 项目背景与定位](#11-项目背景与定位)
  - [1.2 技术栈总览](#12-技术栈总览)
  - [1.3 双轨命名机制](#13-双轨命名机制)
  - [1.4 项目目录结构](#14-项目目录结构)
- [二、整体架构设计](#二整体架构设计)
  - [2.1 五层分层架构](#21-五层分层架构)
  - [2.2 核心设计原则](#22-核心设计原则)
  - [2.3 请求生命周期](#23-请求生命周期)
- [三、后端核心逻辑](#三后端核心逻辑)
  - [3.1 应用入口与配置体系](#31-应用入口与配置体系)
  - [3.2 API 路由层](#32-api-路由层)
  - [3.3 Gateway 控制面](#33-gateway-控制面)
  - [3.4 AgentService 门面与四大领域](#34-agentservice-门面与四大领域)
  - [3.5 LangGraph 运行时](#35-langgraph-运行时)
  - [3.6 模型输入的四层分层设计](#36-模型输入的四层分层设计)
  - [3.7 工具系统](#37-工具系统)
  - [3.8 终端沙箱机制](#38-终端沙箱机制)
  - [3.9 存储层与持久化](#39-存储层与持久化)
  - [3.10 流式事件链路](#310-流式事件链路)
  - [3.11 记忆系统](#311-记忆系统)
  - [3.12 定时任务与外部通道](#312-定时任务与外部通道)
  - [3.13 认证与 SSO 全链路](#33-认证与-sso-全链路)
- [四、前端核心逻辑](#四前端核心逻辑)
  - [4.1 应用入口与依赖](#41-应用入口与依赖)
  - [4.2 状态管理体系](#42-状态管理体系)
  - [4.3 流式通信体系](#43-流式通信体系)
  - [4.4 聊天运行时控制器](#44-聊天运行时控制器)
  - [4.5 卡片渲染系统](#45-卡片渲染系统)
  - [4.6 前端插件系统](#46-前端插件系统)
  - [4.7 视图与组件组织](#47-视图与组件组织)
- [五、扩展机制](#五扩展机制)
  - [5.1 后端插件体系](#51-后端插件体系)
  - [5.2 A2A 协议](#52-a2a-协议)
  - [5.3 应用接入体系](#53-应用接入体系)
  - [5.4 Agent OS 多专家协作](#54-agent-os-多专家协作)
- [六、部署与运维](#六部署与运维)
- [七、测试体系](#七测试体系)
- [八、关键设计决策与演进路线](#八关键设计决策与演进路线)

---

## 一、项目概述

### 1.1 项目背景与定位

Nexbot（内部代号 EClaw）是一套基于 **FastAPI + LangGraph** 的企业级多租户 Agent 平台。它不是一个简单的聊天机器人，而是一个可扩展的 Agent 运行时工作台，具备以下核心能力：

**多租户隔离**：所有数据按 `tenant_id / user_id` 维度隔离，不同租户的用户数据、Agent 配置、工具注册表、会话历史完全独立。

**多入口驱动**：HTTP REST API、SSE 流式接口、WebSocket、钉钉 Stream 消息通道、定时任务调度——这些入口都能驱动同一套 Agent 执行链路，统一经过 Gateway 的鉴权、准入、限流处理。

**可扩展工具系统**：API 调用、Skill（技能）、Python 脚本、MCP（Model Context Protocol）工具、内置工具（文件读写、终端命令、记忆读取等）——所有工具统一通过 `DynamicToolLoader` 注入到 LangGraph 运行时，模型可以像调用函数一样使用它们。

**沙箱化执行**：终端命令支持 Docker 容器、Linux bubblewrap 命名空间、Windows AppContainer 等多种隔离后端，默认 fail-closed（沙箱不可用时拒绝降级到本地 shell），保证生产环境安全。

**流式输出**：后端通过 SSE/WebSocket 实时推送模型的思考过程、内容增量、工具调用状态、卡片渲染等事件，前端增量渲染，提供流畅的对话体验。

**插件体系**：后端插件可以注册 API 路由、Gateway 命令、预览类型、设置面板；前端插件可以注册自定义卡片类型、预览面板。插件独立打包、独立部署，支持热发现。

**多专家协作（Agent OS）**：支持主专家派发子专家、本地专家与远程 A2A Agent 协作，通过 Mission/Job/Mailbox/Blackboard 等对象模型实现复杂的多 Agent 协作场景。

### 1.2 技术栈总览

| 层面 | 技术选型 | 说明 |
|------|---------|------|
| 后端框架 | FastAPI + Uvicorn | 异步 ASGI 框架，性能优异 |
| Agent 编排 | LangGraph >= 1.1.0 | 基于 StateGraph 的有状态图编排 |
| 模型接入 | LangChain Core + OpenAI Compatible | 支持 OpenAI/Azure/Anthropic/Google/Ollama |
| 存储层 | 文件仓库（JSON/JSONL）+ SQLAlchemy 2.x | 双模可切换，正在向 SQL 迁移 |
| SQL 后端 | MySQL 8.0/5.7、达梦 DM8、金仓 KingbaseES | 支持国产数据库 |
| 工具协议 | MCP (Model Context Protocol) >= 1.26.0 | 标准化工具接入协议 |
| 调度系统 | APScheduler 3.x | 进程内单 leader 模式 |
| 文档处理 | Apache Tika 3.3.0 + OpenJDK 17 | 文档内容提取 |
| 前端框架 | Vue 3.5 + TypeScript + Vite 5 | SPA 单页应用 |
| 状态管理 | Pinia 3 | Composition API 风格 |
| UI 组件库 | Element Plus 2.13 + Epoint UI | 企业级 UI |
| 代码编辑器 | Monaco Editor 0.55 | Skill Studio 内嵌编辑 |
| 图表 | ECharts 6 | 数据可视化 |
| 部署 | Docker 3 阶段构建 + Nginx | 容器化部署 |

### 1.3 双轨命名机制

项目中存在两套命名体系，理解这一点很重要：

- **nexbot**：包名（`pyproject.toml` 中的 `name = "nexbot"`）、产品对外名称、前端 `package.json` 名称。`eclaw.json` 内部的存储目录写作 `.nexbot-data`。
- **eclaw / ECLAW_**：环境变量前缀（所有 `ECLAW_*` 配置项）、数据目录（`./eclaw_data`、`./eclaw_logs`）、主配置文件名（`eclaw.json`）、Python 模块中的一些类名（`EClawJsonConfig`）。

这种双轨制是历史演进的结果——项目最初叫 EClaw，后改名为 Nexbot，但环境变量和部分配置文件保留了原名。

### 1.4 项目目录结构

```
nextbot/
├── backend/                    # Python 后端
│   └── app/                    # 33 个子模块目录
│       ├── core/               # 配置、认证、权限、租户模型
│       ├── api/                # REST API 路由层
│       │   └── routes/         # 16 个路由文件
│       ├── gateway/            # 网关控制面（26 个文件）
│       ├── services/           # 业务服务层
│       ├── agents/             # LangGraph Agent 定义与图运行时
│       │   ├── graph_runtime/  # 图工厂、节点、路由
│       │   └── tools/          # 工具加载器
│       ├── runtime/            # 运行时核心（工具执行、沙箱、上下文）
│       ├── storage/            # 存储抽象层（file/sql 双模）
│       ├── a2a/                # A2A 协议（~25 个文件，最大子模块）
│       ├── agent_os/           # Agent OS 多专家协作
│       ├── plugin_runtime/     # 插件运行时
│       ├── plugin_host/        # 插件宿主实现
│       ├── plugin_sdk/         # 插件 SDK（兼容 re-export）
│       ├── tooling/            # 工具运行时契约与实现
│       ├── document_context/   # 文档上下文引擎
│       ├── taskscheduler/      # APScheduler 调度后端
│       ├── taskexecutor/       # 任务执行分发
│       ├── mcp/                # MCP 工具加载器
│       ├── client_interaction/ # 客户端交互协议
│       ├── app_integrations/   # 应用集成
│       ├── fast_app/           # 快速接入应用
│       ├── hosted_apps/        # 平台托管应用
│       └── ...
├── frontend/                   # Vue 3 前端
│   ├── src/
│   │   ├── vue-main.ts         # 应用入口
│   │   ├── App.vue             # 根组件
│   │   ├── stores/             # Pinia 状态管理
│   │   ├── composables/        # 组合式函数（含 streaming/、user-chat/ 子目录）
│   │   ├── api/                # API 客户端
│   │   ├── views/              # 18 个页面视图
│   │   ├── components/         # 组件库（chat/ 48 个文件最大）
│   │   ├── plugin-runtime/     # 前端插件加载与注册
│   │   ├── utils/              # 工具函数
│   │   ├── a2ui/               # A2A UI 适配
│   │   └── packages/           # Monorepo 子包（plugin-host, plugin-vite, boot 等）
│   └── package.json
├── plugins/                    # 内置插件
│   ├── onlyoffice_preview/     # OnlyOffice 文档预览插件
│   └── customer_bid_context/   # 招标上下文插件
├── docs/                       # 88 项文档
│   ├── architecture/           # 架构设计文档
│   ├── guide/                  # 使用指南
│   ├── spec/db/                # 数据库设计文档
│   ├── adr/                    # 架构决策记录
│   └── research/               # 技术调研
├── scripts/                    # 36 项脚本（构建、部署、迁移、审计）
├── tests/                      # 98 项 pytest 测试
├── docker/                     # Docker 相关（nginx 模板、entrypoint）
├── pyproject.toml              # Python 项目定义
├── .env.example                # 环境变量示例（12KB，覆盖全部子系统）
├── eclaw.json                  # 平台运行时配置
├── Dockerfile                  # 3 阶段多阶段构建
└── CLAUDE.md / AGENTS.md       # AI 协作指南（互为符号链接）
```

---

## 二、整体架构设计

### 2.1 五层分层架构

系统从上到下分为五层，每一层职责清晰、边界明确：

**第一层：入口层**

这是请求进入系统的第一站。FastAPI 路由（`backend/app/api/routes/`）处理 HTTP 请求；WebSocket 端点处理实时双向通信；钉钉 Stream Dispatcher 监听企业 IM 事件；APScheduler 定时触发任务。所有入口最终都会构造 `AgentRunRequest` 或 `GatewayRunCommand`，交给下层统一处理。

**第二层：Gateway 控制面**

`AppGateway`（`backend/app/gateway/facade.py`）是所有请求的统一入口。它不包含业务逻辑，而是横切关注点的集合：鉴权（Authorization/Session Cookie/受信头）、准入控制（限流、并发控制、幂等性、熔断）、超时保护、流式编排、用户展示层过滤。Gateway 由 14 个子网关组成，每个负责一个业务域（Agent、A2A、Channel、Memory、Task、System 等），全部继承 `GatewayServiceBase`，通过统一的 `_invoke()` 方法执行。

**第三层：AgentService 门面**

`AgentService`（`backend/app/services/agent_service.py`）是业务逻辑的聚合点。它本身几乎不做任何事，而是通过组合四大领域（Domain）来委托执行：`AgentResourceDomain`（账号/工具注册表/技能/Bootstrap）、`AgentContextDomain`（会话上下文/内存/持久化）、`AgentRuntimeDomain`（Provider/图工厂/运行协调/流式服务）、`AgentChannelDomain`（外部通道/入站派发）。这种设计确保了业务逻辑的模块化——修改某个领域不会影响其他领域。

**第四层：LangGraph Runtime**

这是 Agent 执行的核心引擎。`AgentGraphFactory.build()` 构建一个 LangGraph StateGraph，包含三个节点：`oracle`（模型决策）、`action`（普通工具执行）、`terminal`（沙箱终端命令执行）。状态在 `AgentState` TypedDict 中流转，节点间通过路由函数决定走向。工具执行下沉到 `ToolExecutor`，后者从 `DynamicToolLoader` 构建的工具集中查找并调用具体工具。

**第五层：Storage 层**

所有持久化数据的落脚点。当前支持两种模式：文件仓库模式（JSON/JSONL 文件，无数据库依赖）和 SQL 模式（SQLAlchemy 2.x，支持 MySQL/达梦/金仓）。所有路径通过 `FileRepoLayout` 统一管理，按 `tenant_<id>/users/user_<id>/...` 层级隔离。SQL 模式采用三层归属设计（etrobot 既有表复用 / 平台通用扩展 / Nexbot 专属），正在逐步替换文件实现。

### 2.2 核心设计原则

理解以下原则，就理解了整个项目的架构哲学：

**Gateway 是唯一入口**：任何请求都必须经过 `AppGateway._invoke()`，确保鉴权、限流、幂等、审计等横切关注点不被绕过。路由层不直接调用 AgentService。

**AgentService 只做门面**：AgentService 组合了约 40 个仓储/服务，但它自身不持有运行时状态——任何需要跨请求存活的数据都通过 Repository 持久化，绝不放在模块级字典里。

**运行时与执行解耦**：LangGraph 节点只负责状态流转和事件发射，不直接写磁盘。节点通过 `runtime_events`（带 `operator.add` reducer）和 `stream_writer` 输出副作用，持久化由上层处理。

**展示层与执行层解耦**：模型看到的是 `result_envelope`（工具结果信封），用户看到的是经过 `GatewayUserDisplayService` + `presenter` + `display_strategies` 过滤后的产物。同一个工具调用，模型和用户看到的信息粒度不同。

**沙箱默认 fail-closed**：终端命令默认在隔离环境中执行。如果沙箱不可用，系统拒绝降级到本地 shell（除非显式设置 `ECLAW_TERMINAL_SANDBOX_FAIL_CLOSED=false`）。测试中才使用本地 fallback。

**模型输入分层组装**：每次调用模型前，系统从四个独立层组装输入（系统提示、运行时负载、会话消息、工具列表），各层独立变化、独立裁剪，互不干扰。

### 2.3 请求生命周期

一个典型的聊天请求从用户发送消息到收到回复，经历以下完整链路：

```
用户在前端发送消息
  → POST /api/v1/agent/runs/stream (SSE)
    → AgentGateway.run() 或 start_stream_run()
      → GatewayServiceBase._invoke()
        → GatewayAdmissionController.admit_run()  # 鉴权、限流、幂等、并发控制
        → AgentService.start_stream_run()
          → AgentRunCoordinator
            → AgentGraphFactory.build()           # 构建 LangGraph 图
              → DynamicToolLoader.build_runtime_toolset()  # 装配工具
              → StateGraph: oracle ⇄ action/terminal
                → oracle 节点: 模型决策（流式输出 content_delta/tool_calls）
                → router: 根据 tool_calls 选择 action/terminal/END
                → action/terminal 节点: ToolExecutor.execute()
                  → 调用具体工具（API/Skill/Script/MCP/Builtin）
                  → 返回 ToolMessage + runtime_events
                → post_tool_router: 回 oracle 还是 END
              → 循环直到模型不再调工具或达到 max_iterations
          → AgentStreamService
            → SSE 事件流: progress/content_delta/tool_call/card_rendered/result
            → GatewayUserDisplayService: 过滤用户可见事件
        → GatewayAdmissionController: 完成幂等 lease
    → SSE 流关闭
  → 前端渲染最终结果
```

---

## 三、后端核心逻辑

### 3.1 应用入口与配置体系

**应用入口**（`backend/app/main.py`）

`create_app()` 是 FastAPI 应用的工厂函数。它做了以下几件事：

1. 注册异常处理器：`GatewayError`（网关错误）、`CodedServiceError`（带错误码的服务错误）、`ServiceForbiddenError`、`ServiceNotFoundError`、`ServiceConflictError`、`ServiceValidationError`、`StarletteHTTPException`——每种错误都有对应的 HTTP 状态码和 JSON 响应格式。

2. 配置 CORS 中间件 + `UntrustedOriginCorsHeaderMiddleware`：允许的请求方法包括 GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS，允许的头包括 `Authorization`、`A2A-Version`、`X-ECLAW-TENANT-ID`、`X-ECLAW-USER-ID`、`X-Nexbot-*` 系列。

3. 挂载路由：`a2a_well_known_router`（`.well-known/agent-card.json`）和 `api_router`（前缀 `/api/v1`）。

4. 定义生命周期（`lifespan`）：启动时调用 `_start_gateway_runtime()`，依次启动通道运行时、认证会话刷新、任务调度器、Agent OS 运行时、运行事件保留。关闭时反向停止。

5. `_mount_plugin_routers()`：将已发现插件的 API 路由挂载到 `/api/v1/plugins/{plugin_id}/...`。

**配置体系**（`backend/app/core/settings_models.py`）

`Settings` 类是全局配置的中心，继承自 `pydantic_settings.BaseSettings`，从环境变量和 `.env` 文件加载。主要配置分组：

| 分组 | 代表字段 | 默认值 |
|------|---------|--------|
| 应用基础 | `app_name`, `api_prefix`, `external_base_url` | `"EClaw"`, `"/api/v1"`, 无 |
| 认证 | `jwt_secret`, `jwt_algorithm`, `jwt_expiration_hours` | 随机, `"HS256"`, 24 |
| 网关鉴权 | `gateway_auth_enabled`, `gateway_auth_strict`, `gateway_auth_shared_secret` | 控制受信头注入 |
| 网关运行时 | `gateway_run_timeout_seconds`, `gateway_max_concurrent_runs_per_tenant`, `gateway_run_rate_limit_count`, `gateway_idempotency_ttl_seconds` | 90s, 4, 20次/10s, 300s |
| Agent OS | `agent_os_max_missions_per_user`, `agent_os_max_agents_per_mission`, `agent_os_max_jobs_per_mission` | 8, 8, 24 |
| 存储 | `storage_provider`, `database_url`, `db_dialect` | `"file"`, 无, 无 |
| 沙箱 | `terminal_sandbox_mode`, `terminal_timeout_seconds`, `terminal_memory_limit_mb` | `"auto"`, 120s, 1024MB |
| 模型 | `openai_compat_base_url`, `openai_compat_model` | 阿里云 DashScope, `qwen3.5-plus` |
| 记忆 | `memory_capture_workers`, `memory_retrieval_mode`, `memory_transcript_max_messages` | 2, `"bm25"`, 24 |
| 任务调度 | `task_scheduler_enabled`, `task_scheduler_default_timezone`, `task_scheduler_role` | `true`, `"Asia/Shanghai"`, `"leader"` |
| 客户端工具 | `client_tools_enabled`, `client_tools_max_per_run` | 无, 64 |
| 插件 | `plugin_paths`, `plugin_disable`, `plugin_only` | `["plugins"]`, 无, 无 |

除了 `Settings`，同文件还定义了 `EClawJsonConfig`（`eclaw.json` 的 Python 映射，包含 system/sso/frontend/plugins 四部分）、`AdminConfig`（管理员列表）、`SSOSettings`（SSO 配置）等配置类。

配置加载工厂函数包括 `get_settings()`（lru_cache 缓存）、`get_eclaw_json_config()`、`get_admin_config()` 等，还有 `ensure_default_super_admin()` 等引导函数。

**环境变量文件**（`.env.example`）

这是一个 12KB 的详尽文件，覆盖全部子系统。所有变量以 `ECLAW_` 前缀统一命名。关键配置项包括：

- 存储模式切换 `ECLAW_STORAGE_PROVIDER=file|sql`，以及 SQL 连接参数（DSN/URL/用户名/密码/方言）
- 网关运行时参数：运行超时 90s、Lease TTL 180s、心跳间隔 30s、每租户最大并发 4、限流 20次/10s、幂等 TTL 300s
- 终端沙箱：模式 `auto/docker/linux_bwrap/local/windows_*`、超时 120s、最大输出 64KB
- Docker 沙箱：镜像 `eclaw-sandbox:latest`、空闲 TTL 15 分钟、CPU 限制 1.0、tmpfs 256MB
- 记忆系统：检索模式 `bm25`、phase1/phase2 防抖、老化策略（近期主题 14 天、Stage1 过期 90 天）
- A2A 治理：调用最大深度 8、远程调用限流/并发/熔断/重试、推送重试、流检查点间隔

**运行时配置文件**（`eclaw.json`）

`eclaw.json` 是平台运行时配置，包含：

- `plugin_paths`: `["plugins"]` — 插件发现路径
- `system`: 服务端口、存储根目录、日志根目录
- `sso`: 指向测试环境 SSO（`testoa.epoint.com.cn`），包含 client_id/secret、token 心跳 60s、刷新窗口 300s
- `frontend`: `show_reasoncard=true` 等前端特性开关
- `default_super_admin`: 引导登录 ID
- `plugins`: 4 个插件声明（`alpha_tools`、`beta_reports`、`card_demo`、`customer_bid_context`），均启用且面向所有租户

管理员列表存储在 `ECLAW_STORAGE_ROOT/config/admin.json` 中，`eclaw.json` 不携带 `admins` 或 `super_admins`。启动时，遗留的 `admins`/`super_admins` 会被迁移到 `admin.json`。

### 3.2 API 路由层

`backend/app/api/routes/` 下有 16 个路由文件，通过 `api/router.py` 的 `api_router` 聚合，在 `main.py` 中以 `/api/v1` 前缀挂载：

| 路由文件 | 大小 | 职责 |
|---------|------|------|
| `agent.py` | 20.8KB | Agent 运行/会话/附件（最大路由），含 SSE 流式端点 |
| `registrations.py` | 37KB | 工具/技能/MCP 注册管理（最大文件） |
| `system.py` | 32KB | 系统配置管理 |
| `auth.py` | 19.6KB | 认证/SSO/会话管理 |
| `memory.py` | 13.9KB | 记忆系统管理 |
| `hosted_apps.py` | 11.5KB | 托管应用 CRUD |
| `a2a.py` | 11KB | A2A 协议路由 |
| `client_tools.py` | 7.8KB | 客户端工具管理 |
| `channel.py` | 7KB | 钉钉渠道绑定 |
| `tasks.py` | 4.4KB | 任务调度 |
| `workspace.py` | 3.2KB | 工作区管理 |
| `workzones.py` | 3KB | 工作区隔离 |
| `admin_usage.py` | 3.7KB | 管理员用量统计 |
| `plugins.py` | 1.8KB | 插件状态查询 |
| `a2a_well_known.py` | 764B | `.well-known/agent-card.json` |
| `health.py` | 250B | 健康检查 |

关键端点包括：
- `POST /api/v1/agent/runs/stream` — SSE 流式聊天
- `POST /api/v1/agent/runs/ws` — WebSocket 聊天
- `POST /api/v1/agent/runs/{thread_id}/resume` — 恢复中断的会话
- `POST /api/v1/agent/runs/{thread_id}/steer` — 运行中转向
- `POST /api/v1/agent/runs/{thread_id}/cancel` — 取消运行
- `GET /api/v1/agent/sessions` — 会话列表
- `POST /api/v1/auth/sso/authorize` — SSO 授权
- `POST /api/v1/auth/sso/callback` — SSO 回调
- `GET /api/v1/plugins/manifest` — 前端插件清单
- `GET /api/v1/plugins/status` — 插件状态

### 3.3 Gateway 控制面

Gateway 是整个系统最关键的横切层，位于 `backend/app/gateway/`（26 个文件）。

**AppGateway 门面**（`gateway/facade.py`）

`AppGateway` 类在 `__init__` 中组装所有子网关和控制器：

```
AppGateway
├── agent: AgentGateway          # Agent 运行/会话/流式（最大子网关，~68KB）
├── a2a: A2AGateway              # A2A 协议网关
├── channels: ChannelGateway     # 钉钉渠道管理
├── memory: MemoryGateway        # 记忆系统管理（~19KB）
├── client_tools: ClientToolGateway  # 客户端工具管理
├── system: SystemGateway        # 系统配置管理（~33KB，第二大）
├── tasks: TaskGateway           # 任务调度管理
├── usage: UsageGateway          # 用量统计
├── registrations: RegistrationGateway  # 工具/技能/MCP 注册（~22KB）
├── skill_workbench: SkillWorkbenchGateway  # 技能草稿工作台（~20KB）
├── hosted_apps: HostedAppGateway  # 托管应用管理
├── workzones: WorkzoneGateway   # 工作区管理
├── workspace: WorkspaceGateway  # 工作空间管理
├── plugins: PluginGateway       # 插件命令网关
├── admission: GatewayAdmissionController  # 准入控制器
├── streamer: GatewayStreamOrchestrator    # 流式编排器
├── user_display: GatewayUserDisplayService  # 用户展示过滤
└── a2a_governance               # A2A 治理
```

**GatewayServiceBase 基类**（`gateway/base.py`）

所有子网关继承此类。核心方法是 `_invoke()`：

```python
def _invoke(self, *, auth, entrypoint: GatewayEntrypoint, action,
            admission_scope: AdmissionScope, required_permission="agent:run",
            audit_action=None, audit_fields=None, source="http",
            thread_id="", metadata=None) -> T:
```

它统一执行：鉴权（`authorize(auth, permission)`）→ 准入控制（`admit_run` 或 `admit_control`）→ 执行 action → 审计 → 返回。`GatewayEntrypoint` 是一个 Literal 类型，枚举了 20 个入口点（`agent.run`/`agent.stream`/`agent.resume`/`channel.inbound`/`memory.control` 等），用于审计和追踪。

**准入策略组件**（`gateway/policies.py`）

- `GatewayIdempotencyStore`：幂等性存储，通过 `begin/complete/forget` 管理幂等 lease，TTL 默认 300 秒。防止重复请求导致重复执行。
- `GatewayRateLimiter`：滑动窗口限流器，默认 20 次/10 秒。
- `GatewayConcurrencyLimiter`：并发限制器，默认每租户 4 个并发运行。
- `GatewayCircuitBreaker`：熔断器，`assert_available/record_success/record_failure`，打开时返回 503。
- `GatewayTimeoutGuard`：超时保护，默认 90 秒。
- `GatewayAdmissionController`：核心控制器，组合以上所有策略。`admit_run()` 返回 `GatewayAdmissionLease`，包含超时 guard 和并发 lease。

**错误体系**（`gateway/errors.py`）

- `GatewayError`（基类，400）→ `GatewayAdmissionError`（`admission_rejected`）
- `GatewayRateLimitError`（429，`rate_limited`）
- `GatewayConflictError`（409，`conflict`）
- `GatewayCircuitOpenError`（503，`circuit_open`）

**用户展示过滤**（`gateway/user_display_service.py` + `gateway/display_strategies.py`）

Gateway 不仅控制"谁能做什么"，还控制"用户能看到什么"。`GatewayUserDisplayService` 配合 `services/streaming/presenter.py` 和 `gateway/display_strategies.py`，决定每个事件对用户的可见性。展示模式包括 `hidden`（完全隐藏）、`status_only`（只显示状态）、`input_request`（输入请求）、`card`（卡片）、`full`（完整展示）。`tool_display.py` 提供工具名到展示名的映射。

### 3.4 AgentService 门面与四大领域

`AgentService`（`backend/app/services/agent_service.py`）是业务逻辑的聚合点。

**依赖注入容器**（`AgentServiceDependencies` dataclass）

聚合了约 40 个仓储/服务协议字段，包括：`StorageRuntime`、`blob_store`、`tool_repository`、`mcp_repository`、`memory_state_repository`、`memory_artifact_repository`、`agent_definition_repository`、`client_tool_catalog_repository`、`task_repository`、`output_repository`、`context_repository`、`run_registry`、`run_event_repository`、`workspace_service`、`auth_session_service`、`browser_session_service`、`token_usage_repository`、`a2a_repository`、`agent_os_repository`、`a2a_governance`、`runtime_state_backend` 等。

**四大领域（Domain）**

`AgentService` 通过组合四个领域来委托执行：

- **AgentResourceDomain**：管理账号、工具注册表、技能、Bootstrap 配置。负责"Agent 有什么资源"。
- **AgentContextDomain**：管理会话上下文、内存、持久化。负责"Agent 知道什么"。
- **AgentRuntimeDomain**：管理 Provider（模型客户端）、图工厂（AgentGraphFactory）、运行协调（AgentRunCoordinator）、流式服务（AgentStreamService）。负责"Agent 怎么执行"。
- **AgentChannelDomain**：管理外部通道（钉钉等）、入站事件派发。负责"Agent 从哪里接收请求"。

**核心方法**

AgentService 的方法是对外暴露的业务接口，包括：运行（`run`/`resume`）、流式（`start_stream_run`/`start_stream_resume`/`stream_events`）、控制（`steer`/`queue_follow_up`/`cancel`）、会话管理（`list_sessions`/`delete_session`/`rename_session`）、附件（`upload_attachment`/`get_attachment_artifact`）、Agent OS（`get_agent_os_session_snapshot`/`apply_agent_os_intervention`）、客户端工具（`list_client_tool_users`/`list_observed_client_tools`）、生命周期（`start_channel_runtime`/`start_task_scheduler`/`shutdown`）等。

### 3.5 LangGraph 运行时

LangGraph 是 Nexbot 的 Agent 编排引擎，位于 `backend/app/agents/`。

**状态定义**（`agents/state.py`）

`AgentState` 是一个 TypedDict，定义了图状态的全部字段：

```python
class AgentState(TypedDict):
    # 消息与上下文
    messages: Annotated[list[BaseMessage], add_messages]  # 对话历史（reducer: 追加）
    context: AgentContext                                  # 工作区路径、当前文件
    runtime_events: Annotated[list[dict], operator.add]   # 事件流（reducer: 追加）
    token_usage: Annotated[list[dict], operator.add]      # Token 用量

    # 上下文注入
    context_files: list[dict]              # 上下文文件清单
    attachment_context: dict               # 附件上下文
    document_assets: dict                  # 文档资产
    runtime_context: dict                  # 运行时上下文（请求元数据、能力清单等）
    context_injection_policy: dict         # 上下文注入策略
    context_window: dict                   # 上下文窗口使用情况

    # 运行控制
    loop_count: int                        # 循环计数
    termination_reason: str                # 终止原因
    failure_kind: str                      # 失败类型
    model_call_count: int                  # 模型调用计数
    cancel_requested: bool                 # 取消请求
    cancel_reason: str                     # 取消原因
    final_text: str                        # 最终文本

    # 标识
    thread_id: str                         # 会话线程 ID
    run_id: str                            # 运行 ID
    current_turn_id: str                   # 当前轮次 ID
    entrypoint: str                        # 入口点
    execution_mode: str                    # 执行模式
    tenant_id: str                         # 租户 ID
    user_id: str                           # 用户 ID
    workspace_id: str                      # 工作区 ID

    # 技能与 MCP
    loaded_skills: list[dict]              # 已加载技能
    loaded_skill_usage: dict               # 技能使用记录
    loaded_mcp_tools: list[dict]           # 已加载 MCP 工具
    loaded_mcp_tool_usage: dict            # MCP 工具使用记录

    # 客户端工具与表单
    client_tools: list[dict]               # 客户端工具描述
    client_device_id: str                  # 客户端设备 ID
    pending_forms: dict                    # 待处理的表单卡片
    pending_client_tool_calls: dict        # 待处理的客户端工具调用

    # 决策
    last_assistant_decision: str           # 最后一次助手决策
    last_post_tool_decision: str           # 工具后路由决策

    # 队列
    queued_user_events: list[dict]         # 排队的用户事件
    queued_steering_messages: list[dict]   # 排队的转向消息
```

`runtime_events` 和 `token_usage` 使用 `operator.add` 作为 reducer，意味着多个节点的输出会追加合并，而不是覆盖。`messages` 使用 `add_messages` reducer，智能合并消息（同 ID 替换、新 ID 追加）。

**图拓扑**（`agents/graph_runtime/factory.py`）

`AgentGraphFactory.build()` 构建的 LangGraph StateGraph 拓扑如下：

```
START → resume_entry_node → oracle → router → {action | terminal | END}
                                              ↓
                                    route_after_tool → {oracle | END}
```

三个核心节点：

- **oracle 节点**：模型决策入口。调用 `ToolCallingModelAdapter`（模型适配器），流式输出 `reasoning_delta`（推理过程）、`content_delta`（内容增量）、`tool_call_deltas`（工具调用增量）。模型决定是调用工具还是直接回复。

- **action 节点**：执行普通工具。从 `state["messages"][-1]` 取出 AIMessage 的 `tool_calls`，逐个调用 `ToolExecutor.execute()`，返回 `{messages: [ToolMessage...], runtime_events: [...]}`。

- **terminal 节点**：执行沙箱终端命令。与 action 节点类似，但工具通过沙箱后端执行，有独立的审计和中断机制。

两个路由函数：

- **router**：在 oracle 之后执行。如果 AIMessage 有 `tool_calls`，根据工具类型选择 `action` 或 `terminal`；如果没有，路由到 `END`。

- **post_tool_router**（`route_after_tool`）：在 action/terminal 之后执行。根据 `last_post_tool_decision` 决定回到 `oracle`（继续模型决策）还是 `END`（结束运行）。决策基于"工具结果续接"（tool result continuation）语义：`continue_model`（回模型）、`await_user_same_turn`（等用户输入，运行停止但轮次不结束）、`append_output`（追加输出后结束）。

**resume_entry_node**：恢复入口节点。当会话被中断（如等待表单提交）后恢复时，按优先级判断：cancel/steering/queued user event → 回 oracle；pending_forms 非空 → END（等用户提交表单）；最后是 ToolMessage → 回 oracle；否则复用 router。

**Agent Loop 语义**（参考 `docs/0413-agentcore.md`）

当前 Agent Loop 采用"最小充分模型"：

- 用 `tool result continuation` + `当前 assistant message 是否已有正文` 决定工具后行为
- continuation 三种值：`continue_model`（回模型继续）、`await_user_same_turn`（等用户输入，run 停止但 turn 不结束）、`append_output`（追加输出后结束 turn）
- 不引入 `turn_has_answer` / `content_role` 等更复杂的语义——保持简单，避免过度设计

**interrupt_before_tools**：当设置为 `True` 时，图在执行工具前中断，等待用户确认参数。这是参数采集卡片的实现机制——模型调用 `card_render_tool` 渲染表单卡片，图中断，前端展示表单，用户提交后恢复执行。

### 3.6 模型输入的四层分层设计

这是 Nexbot 架构中最精妙的设计之一。每次调用 oracle（模型）前，系统从四个独立层组装模型输入。理解这四层是理解 Agent 行为的关键（详见 `docs/architecture/09-model-input-layering.md`）。

**第一层：System Prompt（系统提示）**

角色：定义 Agent 的人格和行为约束。

来源：`SYSTEM_PROMPT` 常量（或 per-agent 覆盖）+ `helpers._runtime_system_prompt` 生成的节点级指令。节点级指令根据当前可见的工具集合和 `metadata.source` 动态生成——不同入口点（如 `scheduled_task`）会隐藏特定工具，系统提示也随之变化。

**第二层：Runtime Payload（运行时负载）**

角色：向模型展示"当前运行环境的面板"，包括能力清单、记忆、工作区、附件、请求元数据。

来源：`helpers._structured_runtime_payload` 生成一个 JSON SystemMessage。包含 `runtime_context`（请求元数据、会话状态）、`memory_context`（用户偏好、长期事实）、`workspace_context`（工作区文件列表）、`attachment_context`（附件描述）、`capability_catalog`（可用工具/技能/MCP 目录）、`loaded_skills`（已加载技能内容）。

关键点：`RuntimeContextService` 生成两个变体——内部变体（包含 tenant_id/user_id 等敏感信息）和模型变体（**scrubbed**，去除了租户/用户 ID、沙箱路径映射）。`pending_forms` 不注入模型输入，表单提交通过 `runtime_context.request.metadata.card_submit` 到达模型。每个大文本字段通过 `runtime/context/token_budget.py` 裁剪。

**第三层：Conversation Messages（会话消息序列）**

角色：真正的对话历史 + 工具调用回路。

来源：`state.messages` 经过 `RuntimeContextPipeline`（5 个 Transformer 串联）过滤：

1. `DropEmptyMessagesTransformer`：删除空消息
2. `CurrentTurnMessageTransformer`：按 `turn_id` 过滤老轮次的 ToolMessage
3. `RecentToolMessageWindowTransformer`：保留最近 12 条 ToolMessage
4. `RecentMessageWindowTransformer`：保留最近 48 条消息总数
5. `IdentityMessageTransformer`：测试占位

附件通过 `runtime/context/serializer.py:AttachmentMessageSerializer` 序列化——文本附件变成描述性消息，图片附件变成 data URL。

重复工具调用防护：`helpers._resolve_oracle_response_stream` 在模型重试相同工具调用时注入合成 `ToolMessage`，模型看到的消息已经是"自我修正后"的。

**第四层：Tools（工具列表）**

角色：当前轮次模型可调用的工具 schema。

来源：`graph bundle` 的 `oracle_tools = action_tools + terminal_tools`。通过 `OpenAICompatibleOracle._serialize_tool` 序列化，带 `$ref` 内联和 `anyOf:[T,null]` 简化。每次构图重新装配。

**工作区路径边界**

这是一个重要的安全设计：`workspace_path` 是后端可见的用户工作区路径，服务器端收集器只使用这个路径。`runtime_context.system.workspace_path` 是模型/工具可见的路径（如 Docker 沙箱内的 `/workspace` 或本地模式的 `.`）。模型可见路径不能回传给 `ContextFileCollector`、持久化或存储逻辑。记忆路径读取通过 `MemoryRuntimePathReader`，工作区文件读取通过文件系统工具。

### 3.7 工具系统

**DynamicToolLoader**（`agents/tools/loader.py`）

这是工具注册的唯一入口。`build_runtime_toolset()` 方法根据租户配置装配所有可用工具，返回 `RuntimeToolset`。

工具来源和对应的 Builder：

| Builder | 说明 | 工具示例 |
|---------|------|---------|
| `ApiToolBuilder` | API 检索、加载、选择和临时 HTTP 工具 | `api_choose_tool`, `http_call_tool` |
| `SkillToolBuilder` | Skill 注册为 discover + load + 上下文工具 | `skill_discover`, `skill_load` |
| `ScriptToolBuilder` | 执行租户 Python 脚本 | 自定义脚本工具 |
| `CardToolBuilder` | 平台显示卡片渲染 | `card_render_tool` |
| `CardChooseToolBuilder` | 参数采集表单 | `card_render_tool`（form 类型） |
| `ClientToolBuilder` | 浏览器端客户端工具 | 自定义客户端工具 |
| `TaskSchedulerToolBuilder` | 定时任务管理 | `scheduled_task_tool` |
| `MCPDiscoveryService` | MCP server 工具发现 | MCP stdio/sse 工具 |
| `create_builtin_tools` | 内置工具 | 文件读写、终端执行、记忆读取、terminate、image_recognition |

**工具过滤机制**

`_filtered_runtime_tools` 根据 `execution_source` 过滤工具。例如，`metadata.source == "scheduled_task"` 时会移除 `scheduled_task_tool` 和 `scheduled-task-planner` 技能——定时任务不应该自己创建定时任务。

`allowed_tools` / `allowed_skills` / `allowed_apis` / `allowed_scripts` / `allowed_mcp_servers` 参数控制每个 Agent 能看到哪些工具。

**ToolExecutor**（`runtime/tools/executor.py`）

`ToolExecutor` 是工具执行的核心。`execute()` 方法从 `state["messages"][-1]` 取出 AIMessage 的 `tool_calls`，逐个调用工具，返回 `{messages: [ToolMessage...], runtime_events: [...]}`。

关键设计：
- 工具结果必须使用 `tooling/tool_result_envelope.py` 的信封格式，这样 `executor._result_status` 能分类为 `success` / `error` / `awaiting_input`
- `cancel_lookup` 协议允许在工具执行前检查取消请求
- `build_start_events` 生成工具开始事件，用于流式推送

**API 工具 vs HTTP 工具**

`api_choose_tool` 执行已注册的 API 定义（带 `api`/`input_schema`/`argument_bindings` 字段），`http_call_tool` 用于临时直接 HTTP 请求（标准 `method`/`url`/`headers`/`query`/`body` 字段）。API 定义信息不暴露给 `http_call_tool`。

**客户端工具**

客户端工具通过 `client_device_id` + `client_tools` 描述符声明，在用户的浏览器扩展/本地客户端执行，不在服务器端执行。服务器发出 pending 调用，存储到 thread 下，等客户端提交 `/agent/runs/{thread_id}/client-tools/{tool_call_id}/result` 后恢复。

**卡片渲染工具**

`card_render_tool` 是平台显示卡片的唯一入口。支持 camelCase `cardType`：
- `cardType=webpage`：网页预览卡片，使用 `title`/`description` + `data.url`
- `cardType=table`：表格卡片，使用 `title` + `data.columns`/`data.rows`
- `cardType=file`：文件卡片，使用 `title` + `data.logicalPath`/`data.path`/`data.url`/`data.accessUrl`/`data.fileRef`
- `cardType=form`：参数采集表单，写入 `pending_forms`，图中断等待用户提交

### 3.8 终端沙箱机制

`runtime/sandbox/factory.py:create_terminal_command_runner` 选择沙箱后端。工厂默认 fail-closed——降级到 `local` 需要 `terminal_sandbox_fail_closed=False`。

支持的沙箱模式：

| 模式 | 实现方式 | 适用场景 |
|------|---------|---------|
| `local` | 本机 shell | 仅限开发/测试 |
| `docker` | 独立容器 + idle TTL 回收 | 生产环境推荐 |
| `linux_bwrap` | bubblewrap 命名空间隔离 | Linux 无 Docker 环境 |
| `windows_elevated` | NTFS ACL + Job Object | Windows |
| `windows_appcontainer` | AppContainer + capability | Windows |
| `windows_restricted` | 受限进程 | Windows（需要 `fail_closed=false`） |
| `auto` / `auto_linux` | 自动选择最优可用后端 | 默认值 |

Docker 沙箱的配置项包括：镜像名（`eclaw-sandbox:latest`）、镜像来源（registry/embedded_tar/mounted_tar）、容器名前缀、实例 ID、空闲 TTL（默认 15 分钟）、CPU 限制（1.0）、tmpfs 大小（256MB）、Python 路径。

### 3.9 存储层与持久化

**文件仓库模式**（当前默认）

所有结构化数据是 JSON/JSONL 文件，无数据库依赖。`FileRepoLayout`（`backend/app/storage/layout.py`）是所有路径的唯一来源，按 `tenant_<id>/users/user_<id>/...` 层级隔离。

路径校验规则：
- `LOGIN_ID_PATTERN = r"^[A-Za-z0-9._@+-]+$"` — 登录 ID 格式
- `RESOURCE_ID_PATTERN = r"^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$"` — 资源 ID 格式
- `HOSTED_APP_ID_PATTERN = r"^[a-z0-9][a-z0-9_-]{0,63}$"` — 托管应用 ID 格式

主要 Repository 包括：account（账号）、auth_session（认证会话）、agent_definition（Agent 定义）、registry（API/Skill/Script/MCP 注册）、context（会话消息）、task（任务）、run_registry（运行记录）、runtime_logs（运行时日志）、memory_state（记忆状态）等。

`FileRepoLayout` 提供了大量的路径方法，覆盖全局目录（`data_root`、`logs_root`、`tenants_root`、`global_skills_dir` 等）、租户级方法（`tenant_dir`、`tenant_mcps_dir` 等）、用户级方法（`user_dir`、`user_workspace_root_dir`、`user_sessions_dir`、`user_agents_dir` 等）、技能工作台方法、App Integration 方法等。

**SQL 数据库模式**（迁移中）

正在从文件存储向关系数据库迁移，支持 MySQL 8.0/5.7、达梦 DM8、金仓 KingbaseES。

三层归属设计：

| 层 | 归属 | 物理落点 | 处置 |
|----|------|---------|------|
| A · etrobot 既有复用 | etrobot/DBA | `lowcode_app_info`（Agent 配置）、`plugininfo`（模型 Provider）、`exun_session`（会话）、`exun_message`（消息检索投影） | 反射+conformance校验，不拥有 DDL |
| A · 平台通用扩展 | 公司 Agent 平台/DBA | `agent_skill_registration`、`agent_mcp_registration`、`agent_workzone` | conform 模式反射校验 |
| B · Nexbot 专属 | Nexbot | `nexbot_*` 前缀表 | `create_all(checkfirst=True)` 幂等自举 |
| C · 文件/本地 | 文件系统 | blob、workspace、runtime logs、memory | 复用 file 实现 |

关键设计决策：
- 共享库 + 无 Alembic 作为跨系统权威
- A 层既有表由 etrobot/DBA 预建，Nexbot 只符合不拥有
- 判别值统一：`ApplicationType='nexbot'`
- 租户物理列统一 `tenantguid`（VARCHAR(50)）
- `thread_id` 映射为表字段 `sessionid`，值原样保存
- JSON 列当文本处理，不用 `JSON_EXTRACT` 等方言函数
- `updated_at` 条件更新做并发控制
- 混合责任仓储：SQL 仓储同时持有 Engine（写记录）和 StorageRuntime（开目录、存二进制）

SQL 表设计详见 `docs/spec/db/` 目录：
- `01-common-schema-conventions.md`：类型别名（id191/uuid_text/short_text/long_text/json_text/bool_flag/dt/int64）、公共列、命名规范
- `02-account-auth`：`nexbot_tenant`、`nexbot_user`、`nexbot_auth_session`、`nexbot_browser_session`、`nexbot_websocket_ticket_replay`
- `03-agent-configuration`：复用 `lowcode_app_info`，配置写入 `extragconfig.nexbot.agent`
- `04-session-runtime`：复用 `exun_session` + `exun_message` + 新建 `nexbot_message_block`、`nexbot_run_event`、`nexbot_run_registry`
- `05-task-output`：`nexbot_task`、`nexbot_task_run`、`nexbot_output_file`
- `06-tool-integration`：`agent_skill_registration`、`agent_mcp_registration`、客户端工具表

### 3.10 流式事件链路

**事件协议**

后端通过 LangGraph 的两种流模式产生事件：

- **state delta**：`graph.stream(stream_mode="updates")` 产生节点级状态变更
- **custom payload**：`stream_writer()` 直接写入的增量数据（reasoning_delta / content_delta / model_call_status 等）

**SSE 通信**

`POST /api/v1/agent/runs/stream` 是 SSE 流端点，每帧为 `data: RuntimeStreamEnvelope`。顶层事件类型包括：

| 事件类型 | 说明 |
|---------|------|
| `run_context` | 运行上下文（开始时发送） |
| `model_call_start` / `model_call_status` / `model_call_end` | 模型调用生命周期 |
| `content_delta` | 内容增量（流式文本） |
| `reasoning_delta` | 推理过程增量 |
| `tool_call_start` / `tool_call_end` | 工具调用生命周期 |
| `card_rendered` | 卡片渲染事件 |
| `progress` | 进度事件 |
| `trace` | 追踪事件 |
| `agent_event` | Agent 事件 |
| `ui_event` | UI 事件 |
| `run_result` | 运行结果（最终） |
| `error` | 错误事件 |

WebSocket 端点 `POST /api/v1/agent/runs/ws` 需要先换取 ticket（短期签名，EdDSA，TTL 30 秒，一次性），然后连接。

**UIEventAssembler**

`services/streaming/ui_events.py:AgentStreamUIEventAssembler` 把细粒度事件聚合成前端可直接渲染的块（block）：reason block（推理块）、content block（内容块）、tool block（工具块）、card block（卡片块）。最终 `result` 事件带完整 blocks 快照，前端做幂等渲染。

**心跳机制**

长连接 SSE 流使用内部心跳信封，编码为 SSE 注释（`: heartbeat\n\n`），不污染前端状态、不持久化到消息、不进入模型上下文。心跳的作用是续约运行 lease，防止超时。

**运行时日志**

`eclaw_logs/runtime/<tenant>/<user>/<thread>/<run>.jsonl` 记录完整运行轨迹：`request_received → graph_invoke_started → graph_chunk / graph_custom_chunk → oracle_invoke → node_input/output → tool_call_* → response_completed | run_failed`。这是回放和调试的权威来源。

### 3.11 记忆系统

Nexbot 的记忆系统是一个完整的两阶段流水线，详见 `docs/0416/0426/0428 memory` 系列 + `docs/architecture/08`。

**四类记忆概念**

| 名称 | 生命周期 | 用途 |
|------|---------|------|
| 当前对话历史 `state.messages` | 当前 thread | 保持会话连续性 |
| 长期/会话记忆 `memory_context` | 用户级 + 会话级 | 用户偏好、长期事实、历史主题 |
| 业务键值 `working_memory` | 当前 thread | 结构化业务字段复用 |
| 工具结果 `tool_result_memory` | 单轮 | 当前轮即时推理 |

**记忆流水线**

写入线（异步）：

1. 聊天结束后，异步排 `phase1_extract` 任务
2. Phase1：LLM 从对话中抽取候选记忆
3. 本地代码做证据校验、脱敏、去重
4. 写入带准入快照的 Stage1 rollout
5. 排 `phase2_materialize` 任务
6. Phase2：LLM 合并 Stage1 rollout 成用户记忆文档（`memory_summary.md` / `MEMORY.md` 等）

读取线（同步）：

1. 下一轮开始前，`MemoryService.build_runtime_memory_context()` 被调用
2. `MemoryRuntimeLoader` 读取记忆文档
3. `ContextFileCollector` 统一 context file 清单
4. 拆成 `memory_context` + `workspace_context` 注入模型输入第二层

**两层 scope**

- **session_memory**：单个 thread 的阶段性提取结果（rollout_summaries），只在该 thread 内可见
- **user_memory**：跨多个 session 合并后的用户级长期记忆（`memory_summary.md` / `MEMORY.md` / `memory_index.json`），新 thread 也能使用

**记忆子系统组件**

包括：`MemoryRedactionPolicy`（脱敏策略）、`MemoryLifecycleEngine`（老化引擎）、`MemoryModeClassifier`（模式分类器）、`MemoryPhaseOneExtractor`（Phase1 抽取器）、`MemoryPhaseTwoConsolidator`（Phase2 合并器）、`MemoryQualificationEngine`（资格判定）、`MemoryRuntimeLoader`（运行时召回）、`MemoryJobScheduler` + `MemoryJobWorker`（后台任务）、`MemoryCompactor`（合并器）等。

**加载技能保留**

`context_injection_policy.loaded_skill_retention_mode` 和 `loaded_skill_retention_limit` 控制 Skill 的保留策略，存储在 tenant/user/agent 级别，仅用于新会话的技能恢复，不是长期记忆。

### 3.12 定时任务与外部通道

**定时任务（TaskScheduler）**

- 进程内单 leader 模式：使用文件锁 `leader.lock` 确保只有一个实例执行调度
- 后端：APScheduler 3.x，支持 cron / once / interval 三种触发器
- `TaskExecutorDispatcher`：原子认领任务 → 转换为 `AgentRunRequest` → 调用 `AgentRunCoordinator._run_channel_turn_direct`
- `scheduled_task_tool` 允许模型在对话中帮用户创建/修改定时任务
- 当 `metadata.source == "scheduled_task"` 时，`scheduled_task_tool` 和 `scheduled-task-planner` 技能从模型可见工具中移除

**外部通道（Channels）**

钉钉 Stream 入站：
- `DingTalkStreamDispatcher` 监听企业 IM 事件
- 构造 `AgentRunRequest`，走完整 admission/idempotency/timeout 流程
- `DingTalkAgentRunner` 将 Agent 回复投递回钉钉

`ChannelRuntimeManager`：启动时为每个 binding 启动 runtime，支持增量同步。

### 3.13 认证与 SSO 全链路

详见 `docs/0402-auth-token-sso-gateway-flow.md`。

**四层认证体系**

1. SSO 签发上游 `access_token` / `refresh_token`（OAuth 2.0 授权码模式）
2. 后端把 SSO 身份落到本地租户/用户体系，创建浏览器 session cookie
3. 网关模式可通过受信头注入已验证身份（`X-Eclaw-Gateway-Secret` 等）
4. 前端只维护当前用户态和 cookie 会话，不存 access token

**鉴权优先级**（从高到低）

1. 受信网关注入身份头（`X-Eclaw-Gateway-Secret` + `X-Eclaw-Gateway-Tenant-Id` + `X-Eclaw-Gateway-User-Id`）
2. `Authorization: Bearer ...` JWT
3. 浏览器 session cookie
4. 匿名 / demo 上下文

**SSO 登录链路**

`authorize` → 302 跳转上游 SSO → 回调 → `exchange`（换 token + 查用户资料 + 创建/更新 tenant/user + 持久化 token + 创建 session cookie）→ 返回 `return_to`。

**浏览器插件 Extension Auth**

不复用前端 cookie，使用一次性 ticket 换 Bearer token：
- `/auth/extension/authorize` → `/auth/extension/callback` → `/auth/extension/token`

**WebSocket Ticket**

短期签名 ticket（EdDSA 签名，TTL 30 秒，一次性），避免在 URL 中暴露真正的 token。

---

## 四、前端核心逻辑

前端位于 `frontend/`，是一个 Vue 3 + TypeScript + Vite 的 SPA 应用。`index.html` 标题为"小新智能AI工作台"，描述为"企业级 AI 助手平台，集技能、工作空间和协作于一体"。

### 4.1 应用入口与依赖

**入口文件**：`frontend/src/vue-main.ts`（注意不是 `main.ts`）

初始化流程：

1. `registerA2uiSurfaceCard()` — 在创建 App 之前注册 A2UI 表面卡片
2. `createApp(App)` — 创建 Vue 应用
3. `app.use(createPinia())` — 安装 Pinia 状态管理
4. `app.use(router)` — 安装路由
5. `app.use(ElementPlus, { size: "default" })` — 安装 Element Plus UI 组件库
6. `installSformRendererRuntime(app)` — 安装低代码表单渲染运行时（来自 `@epoint-lowcode/sform-renderer`）
7. `app.mount("#app")` — 挂载
8. `loadBrandingConfig()` — 异步加载品牌配置（不阻塞挂载）

样式系统包括：`tokens.css`（设计令牌）、`base.css`、`markdown.css`、`eclaw-theme.css`、`nx-dialog.css`、`admin-unified.css`、`chat-user.css`——有完整的设计 token 体系和主题分层。

**核心依赖**：

| 依赖 | 版本 | 用途 |
|------|------|------|
| `vue` | ^3.5.32 | 框架核心 |
| `pinia` | ^3.0.4 | 状态管理 |
| `vue-router` | ^5.0.4 | 路由 |
| `axios` | ^1.18.1 | HTTP 客户端 |
| `element-plus` | ^2.13.6 | UI 组件库 |
| `markdown-it` | ^14.1.1 | Markdown 渲染 |
| `echarts` | ^6.0.0 | 图表 |
| `monaco-editor` | ^0.55.1 | 代码编辑器（Skill Studio） |
| `pdfjs-dist` | ^5.7.284 | PDF 解析 |
| `zod` | ^4.4.3 | Schema 校验 |
| `@nexbot/plugin-host` | `file:packages/plugin-host` | 插件宿主（本地 workspace） |
| `@a2ui/web_core` | ^0.9.0 | A2UI 表面卡片 |
| `@epframe/eui-core` | ^10.0.6 | Epoint UI 核心 |
| `@epoint-fe/eui-components` | ^10.0.21 | Epoint UI 组件 |

**Monorepo 结构**：`frontend/packages/` 下有 5 个子包：
- `boot`：启动 CLI 工具
- `plugin-host`：插件宿主运行时，被主应用以 `@nexbot/plugin-host` 引用
- `plugin-vite`：Vite 插件，包含 Vue shim（插件系统需要 Vue 运行时隔离）
- `epoint-lowcode-schema`：低代码 Schema 包
- `epoint-lowcode-sform-renderer`：低代码表单渲染器，提供 `installSformRendererRuntime`

### 4.2 状态管理体系

使用 Pinia Composition API 风格，主要 Store：

**chat.ts** — 聊天状态管理

这是最复杂的 Store。关键设计：

- 从后端 `/agent/sessions/summary` 拉取会话列表，同步到 `localStorage`（按 login id 隔离）
- `ServerSessionMetadata` 类型包含丰富的会话元数据：threadId、runId、title、agentId/Name、agentPresentation、traceMode、contextWindow、hostedApp、displayMode、workzoneId/Name、menuNodeId/Title、welcomeStyle 等
- `CHAT_STORAGE_VERSION = 2` — 本地存储版本号，支持版本迁移
- 大量防御性归一化函数：`normalizeRequestMetadata`、`normalizeChatTraceMode`、`normalizeChatDisplayMode` 等——处理来自服务端的不确定格式数据
- 会话 ID 重映射机制（`ChatIdRemap`），支持 ID 迁移

**user.ts** — 用户状态管理

核心关注点是 SSO 认证：

- `DEFAULT_HEARTBEAT_MS = 60_000` — 心跳间隔 60 秒
- `DEFAULT_SSO_CONFIG_RETRIES = 5` — SSO 配置重试 5 次，间隔 400ms
- `loadSsoConfig` 使用 promise 缓存防止并发重复请求
- `normalizeUser` / `normalizeLiteUser` 将后端用户对象映射为前端 `CurrentUser` 类型
- `setAuthInvalidHandler` 注册全局 401 处理器，自动跳转到 `/login`

**其他 Store**：`models.ts`（模型管理）、`admin-sessions.ts`、`adminClientTools.ts`、`adminMemory.ts`、`hostedApp.ts`、`frontend-config.ts`、`preview-panel.ts`

### 4.3 流式通信体系

流式通信是前端最核心的能力，位于 `frontend/src/composables/streaming/` 子目录。

**入口**：`useStreamingV2.ts` 是一个 barrel file（桶文件），re-export `sendStreamingMessageV2` 和 `sendStreamingPayloadV2`。

**核心文件**：

- `sendStreamingMessageV2.ts`（9.7KB）：核心发送逻辑，基于 `fetch` 实现 SSE 解析（不是 EventSource，因为需要 POST 请求 + credentials）
- `streamTurnAssembler.ts`（49.5KB）：流式回合组装器，是前端最大的单个文件。负责把后端的细粒度事件组装成前端可渲染的回合视图模型
- `runStreamClient.ts`（9.6KB）：运行流客户端，管理 fetch 请求和 AbortController
- `sseClient.ts`（3.7KB）：SSE 客户端，解析 SSE 帧格式
- `sseFrames.ts` / `sseFrameDelivery.ts`：SSE 帧处理和投递
- `runtimeEnvelopeDecoder.ts`：运行时信封解码，把 `RuntimeStreamEnvelope` 解码为具体事件
- `runtimeEventDeduper.ts`：事件去重，处理重复事件（如重连后的回放）
- `attachmentUploader.ts`：附件上传

**通信流程**：

```
前端发送消息
  → sendStreamingMessageV2()
    → fetch(POST /api/v1/agent/runs/stream, { credentials: "include" })
      → SSE 流开始
        → sseClient: 逐行解析 "data: ..." 帧
        → sseFrameDelivery: 投递帧到回调
        → runtimeEnvelopeDecoder: 解码 RuntimeStreamEnvelope
        → streamTurnAssembler: 组装为回合视图模型
          → 回调: onContentDelta / onReasoningDelta / onToolCall / onCardRendered / onResult
        → runtimeEventDeduper: 去重
      → SSE 流关闭
    → 最终结果渲染
```

### 4.4 聊天运行时控制器

`useUserChatController.ts` 是用户端聊天体验的核心编排器，组合了多个子模块（全部位于 `./user-chat/` 子目录）：

**子模块**：

- `chatEntryAdapter`：聊天条目适配器，`hasRenderableAssistantEntry` / `normalizeAssistantEntryForChat`
- `chatAssistantEntryMerge`：助手条目合并，`upsertAssistantEntry`
- `chatHistorySync`（17KB）：聊天历史同步，`createChatHistorySync`——从后端加载历史会话并同步到本地
- `chatCardLifecycle`：卡片生命周期管理，`createChatCardLifecycle`——管理表单卡片从激活态到历史态的切换
- `chatRevealScheduler`：揭示调度器，`createChatRevealScheduler`——控制流式文本的渐进式显示（打字机效果）
- `chatStreamingOrchestrator`（45KB）：流式编排器，`createChatStreamingOrchestrator`——协调流式事件到 UI 状态的映射
- `chatRuntimeStore`：运行时注册表，`createChatRuntimeRegistry`——多会话运行时管理器

**多会话运行时管理**

每个聊天 ID 有独立的运行时状态（`ChatRuntimeState`），包含：
- `streamingState`：流式状态（当前回合的增量内容）
- `abortController`：中止控制器
- `requestKey`：请求标识（防重复请求）
- 各种定时器（揭示定时器等）

`createChatRuntimeRegistry` 提供的方法包括 `getRuntime`、`getOrCreateRuntime`、`moveRuntime`、`clearRuntimeTimers`、`syncRuntimeInputState`、`resetRuntime`、`isActiveRequest`、`flushStreamingText`、`flushStreamingPreview` 等。

### 4.5 卡片渲染系统

`frontend/src/utils/card-rendered.ts` 处理多种卡片类型的渲染数据归一化。

**支持的卡片类型**：

| 类型 | Schema | 数据结构 |
|------|--------|---------|
| 网页 | `WebpageCardSchema` | `title` + `description` + `data.url` |
| 表格 | `TableCardSchema` | `title` + `data.columns` + `data.rows` |
| 文件 | `FileCardSchema` | `title` + `data.logicalPath` / `data.path` / `data.url` / `data.accessUrl` / `data.fileRef` |
| 表单 | `FormCardSchema` | 参数采集表单，提交后恢复执行 |
| UI 卡片 | `UICardSchema` | 通用卡片，由插件自定义渲染 |

**数据来源**：
- `card_rendered`：直接来自 `card_render_tool` 的渲染结果
- `card_projection`：来自 `data.payload.card_projection` 的投影数据，支持 `cards` 数组和单个 `card` 对象两种结构

**工具函数**：
- `asRecord`：安全转换为 Record 对象
- `cleanText`：文本清理
- `parseJsonRecord`：解析 JSON 记录（支持对象直接返回、字符串 JSON 解析、非 `{` 开头返回 null）

**前端渲染组件**（`components/chat/`）：

| 组件 | 对应类型 |
|------|---------|
| `UiWebpageCard.vue` | 网页卡片 |
| `UiTableCard.vue` | 表格卡片 |
| `UiFileCard.vue` | 文件卡片 |
| `UiFormCard.vue` | 表单卡片 |
| `PluginCardHost.vue` | 插件自定义卡片 |
| `UiCardFallback.vue` | 未知/无效卡片的兜底渲染 |

`stores/preview-panel.ts` + `PreviewPanel.vue` 处理网页卡片的预览面板。`fileRef` 结构允许插件预览器（如 OnlyOffice）向后端请求只读会话。

### 4.6 前端插件系统

`frontend/src/plugin-runtime/` 实现前端插件加载与注册。

**加载流程**：

1. `loadFrontendPlugins()`：入口函数，从 manifest 开始
2. `loadPluginManifest()`：从 `${API_BASE}/plugins/manifest` 获取插件清单（失败时返回空数组，容错）
3. `indexPluginManifest()`：建立插件索引
4. `ensurePluginLoaded()`：逐个加载插件
   - 动态 `import()` 插件 same-origin bundle
   - 加载插件样式 URL
   - 注册插件的 preview kind 和 card kind

**全局状态管理**：
- `loaded`：全局加载标记（防重入）
- `manifestPromise`：manifest Promise 缓存
- `loadedStyleUrls`：已加载样式 URL Map
- `pluginLoadPromises`：每个插件的加载 Promise
- `pluginLoadStates`：插件状态（`"declared" | "loading" | "loaded" | "failed"`）
- `cardTypeIndex`：卡片类型索引

**注册表**：
- `registry.ts`：`registerPreviewKind` — 注册预览类型
- `card-registry.ts`：`registerCardKind` / `getCardKindRegistration` — 注册卡片类型

插件前端 bundle 是独立的 Vite 子工程（如 `plugins/onlyoffice_preview/frontend/`），通过 `@nexbot/plugin-vite` 构建为同源 JS bundle，由主应用动态加载。

### 4.7 视图与组件组织

**视图**（`views/`）— 18 个根级视图 + 2 个子目录：

| 视图 | 大小 | 用途 |
|------|------|------|
| `AdminAppIntegrationsView.vue` | 110KB | 应用集成管理（最大） |
| `AdminServerToolsView.vue` | 85KB | 服务端工具管理 |
| `WorkzoneView.vue` | 62KB | 工作区视图 |
| `SkillsView.vue` | 54KB | 技能管理（Skill Studio） |
| `AdminA2AView.vue` | 45KB | A2A 管理 |
| `AdminSettingsView.vue` | 24KB | 管理设置 |
| `TasksView.vue` | 22KB | 任务管理 |
| `ExpertsView.vue` | 11KB | 专家管理 |
| `LoginView.vue` | 6.7KB | 登录 |
| `PlazaView.vue` | 4.7KB | 广场 |
| `AdminMemoryView.vue` | 4.5KB | 记忆管理 |
| `AdminClientToolsView.vue` | 3.2KB | 客户端工具 |
| `AdminModelsView.vue` | 2.2KB | 模型管理 |
| `ChatView.vue` | 136B | 聊天入口（路由容器） |

子目录：`views/dev/`（5 个开发调试视图）、`views/skills/`（Skill Studio 编辑器：`DraftFileExplorer.vue` + `MonacoDraftEditor.vue` + `useSkillsViewController.ts`）

**组件**（`components/`）— 10 个功能子目录：

| 子目录 | 文件数 | 关键组件 |
|--------|--------|---------|
| `chat/` | 48 | ChatLayout, ChatWindow, ChatList, MessageBubble, MessageInput, ToolCallCard, ThinkingCard, UiFormCard, UiTableCard, UiFileCard, UiWebpageCard, MarkdownContent, PreviewPanel, PluginCardHost 等 |
| `common/` | 33 | AppSidebar, AppTabs, AppToast, NxButton, NxDialogShell, NxInput, FileCard, JsonTreeViewer 等 |
| `admin/` | 13 | AdminChat, AgentManager, ApiGateway, AdminAgentCard 等 |
| `workzones/` | 7 | WorkzoneCard, WorkzoneConversationPanel, WorkzoneMenuTree 等 |
| `memory/` | 3 | MemoryDashboard, MemoryBookShelf, MemoryItemAuditList |
| `tasks/` | 3 | AddTaskDialog, TaskRunHistory, TaskRunResult |
| `experts/` | 2 | ExpertCard, RecursiveExpertSection |
| `skills/` | 1 | SkillAuthoringChatPanel |
| `agents/` | 1 | AgentPersonaCard |
| `client-tools/` | 1 | ClientToolDashboard |

`chat/` 是最大的组件目录（48 个文件），包含完整的聊天 UI 体系。

**API 客户端**（`api/client.ts`）

- `apiFetch` 始终使用 `credentials: "include"` — 浏览器 session cookie 认证是默认方式
- `PUBLIC_BASE_PATH` 从 `import.meta.env.BASE_URL` 获取，支持子路径部署
- `ApiError` 自定义错误类，携带 `status`（HTTP 状态码）、`code`（业务码）、`payload`
- `setAuthInvalidHandler` 由 `userStore` 注册，401 时全局跳转到 `/login`

---

## 五、扩展机制

### 5.1 后端插件体系

**插件发现与注册**（`backend/app/plugin_runtime/manager.py`）

- 插件位于 `Settings.plugin_paths` 指定的目录下（默认 `plugins/`）
- 通过 `plugin.yml` 清单文件发现
- 在 `ApplicationContainer.build()` 时扫描
- 发现即注册，默认启用；`eclaw.json -> plugins.<id>.enabled=false`、`ECLAW_PLUGIN_DISABLE`、或非匹配的 `ECLAW_PLUGIN_ONLY` 可显式禁用
- 单个插件注册失败不影响主应用启动，降级为 diagnostics `error`
- 管理员可通过 `/api/v1/plugins/status` 检查状态

**插件 SDK**

插件作者代码应依赖 `nexbot_plugin_sdk`（`backend/app/plugin_sdk` 是兼容 re-export）。`scripts/check_plugin_imports.py` 强制插件不能直接导入 `backend.app.storage`、`gateway`、`services` 等内部模块。

**PluginContext 能力面**

`PluginContext` 是插件允许使用的 API 表面：
- `include_router`：注册 API 路由
- `register_gateway_command`：注册 Gateway 命令
- `register_preview_kind`：注册预览类型
- `register_settings_section`：注册设置面板
- `open_repository`：打开存储仓库
- `sign` / `verify`：签名/验签
- `audit`：审计日志
- `file_access.resolve(...)`：请求时文件访问

宿主侧实现在 `backend/app/plugin_host/`。

**插件路由与资产**

- 路由挂载在 `/api/v1/plugins/<plugin_id>/...`
- 前端资产从 `/api/v1/plugins/<plugin_id>/assets/...` 同源加载
- Gateway 命令通过 `PluginGateway` 执行，走与 `AppGateway` 相同的 `_invoke` 准入/权限/超时/遥测/审计路径

**内置插件示例**

`plugins/onlyoffice_preview/`：OnlyOffice 文档预览插件
- 只接受内部 `fileRef`（`workspace`/`agent_output`/`attachment`）
- 生成短期签名文件/回调 URL
- ONLYOFFICE Docs 处于 view 模式（只读）
- 端点：`POST /preview-sessions`、`GET /preview-files/{token}/{filename}`、`POST /callback/{token}`

`plugins/customer_bid_context/`：招标上下文插件
- 包含 package_parser、package_search、package_indexer、package_citations、package_masking、downloader、url_security 等模块

### 5.2 A2A 协议

A2A（Agent-to-Agent）协议是 Nexbot 与外部 Agent 互联的标准协议。后端 `backend/app/a2a/` 是最大的子模块（约 25 个文件）。

**协议规范**

Nexbot 支持 A2A v1.0 JSON-RPC 2.0 over HTTP：

| 方法 | 说明 |
|------|------|
| `SendMessage` | 同步发送消息到远程 Agent |
| `SendStreamingMessage` | 流式发送消息（SSE） |
| `GetTask` / `ListTasks` | 查询/列出任务 |
| `CancelTask` | 取消任务 |
| `SubscribeToTask` | 订阅任务状态变更 |
| push notification config | 推送通知配置 |

**Agent Card 发现**

- `/.well-known/agent-card.json`：全局公开的 Agent Card
- `/api/v1/a2a/agents/{id}/agent-card`：认证后的 Agent Card

**本平台 Agent 发布**

把租户专家发布为标准 A2A Agent，支持同步/流式调用、任务管理、推送通知。

**外部 Agent 注册**

注册远程 A2A Agent，支持：
- 同步/流式调用
- 出站任务管理
- 远程私有网络访问控制（默认禁用）
- 限流/并发/熔断/重试
- 推送重试
- 流检查点间隔

`a2a_call_agent` 工具隐藏，除非专家的 A2A 协作绑定显式授权远程 Agent。不默认把远程 Agent 目录放入模型上下文。

**A2A 持久化**

当前从租户文件存储 `a2a/` 映射到 SQL 设计（`nexbot_a2a_publication`、`nexbot_a2a_remote_agent`、`nexbot_a2a_task_link`、`nexbot_a2a_push_notification_config`）。密钥（远程 auth token、push credentials）不放在 safe DTO 和 metadata JSON 中。

### 5.3 应用接入体系

Nexbot 提供四种应用接入模式，详见 `docs/guide/app-integration/`：

| 模式 | 适用场景 | 认证方式 | 文档 |
|------|---------|---------|------|
| **fast-app sync** | 业务系统后端轻量 JSON 同步调用 | `app_id/app_secret` + 外部身份 → Fast App token | `guide/app-integration/fast-app/sync.md` |
| **fast-app async** | 长耗时业务调用 | 同上 + `execution_mode=async` + 轮询 `jobs/{job_id}` | `guide/app-integration/fast-app/async.md` |
| **client-app (standard)** | 浏览器内嵌完整对话体验 | Runtime Session token + Client Interaction API | `guide/app-integration/standard-app/guide.md` |
| **internal-app** | 可信服务端到服务端调用 A2A Agent | `app_id/app_secret` + `X-ECLAW-TENANT-ID/USER-ID` | `guide/app-integration/internal-app/guide.md` |

**Client Interaction API**

标准接入应用提供完整的对话能力：

| 端点 | 说明 |
|------|------|
| `info` | 获取应用信息 |
| `connect` | 连接（replay + subscribe） |
| `runs` | SSE 流式运行 |
| `client-events` | 客户端工具/HITL/A2UI 回流 |
| `threads` | 会话 CRUD + subscribe |
| `attachments` | 附件上传 |
| `suggestions` | 建议 |
| `rpc` | 单路由代理 |

支持：客户端工具声明、HITL 交互、A2UI activity message、断线重连（cursor-based replay + subscribe）。

### 5.4 Agent OS 多专家协作

Agent OS 是 Nexbot 的多专家协作运行时，详见 `docs/0617-agent-os.md`。它把主专家、子专家、本地专家和远程 A2A Agent 放在同一个协作内核中。

**核心对象模型**

| 对象 | 类比 | 直觉 |
|------|------|------|
| `Mission` | 进程组 | 一次目标协作的根 |
| `Job` | 进程 | 可调度、可恢复、可评估的工作单元 |
| `AgentInstance` | 进程实例 | Mission 内的专家实例 |
| `ContextPack` | 启动参数 | 专家本次执行需要的最小上下文 |
| `AgentMessage` + `Mailbox` | IPC | 定向通信，游标控制增量可见性 |
| `BlackboardEntry` | 共享内存 | 团队共享事实、决策、风险 |
| `Artifact` | 文件系统 | 产物引用和摘要 |
| `InteractionTicket` | 中断向量 | 用户输入/审批/授权的暂停凭证 |
| `Continuation` | 恢复栈帧 | 从暂停点继续执行的句柄 |
| `RuntimeEvent` | 事件日志 | 审计、回放、前端续显 |

**三条核心不变量**

1. Mission 是协作边界——所有 Job 和 AgentInstance 都在 Mission 内
2. Job 是执行边界——每个 Job 有独立的状态和生命周期
3. ContextPack 是上下文边界——每个专家实例的上下文不交叉

**请求路由**

| 场景 | 运行路径 |
|------|---------|
| 普通聊天/工具/表单 | 单 agent fast path |
| 主专家派发已配置子专家 | Agent OS orchestration path |
| 子专家请求表单/审批 | Agent OS interrupt path |
| 用户提交 Agent OS 表单 | Agent OS resume path |
| active Mission 后续普通提问 | 单 agent fast path + projection |

---

## 六、部署与运维

**Docker 构建**

`Dockerfile` 是 3 阶段多阶段构建：

| 阶段 | 基础镜像 | 职责 |
|------|---------|------|
| `frontend-builder` | `node:20-bookworm` | 构建 Vue 前端 + 插件前端 |
| `python-builder` | `python:3.12-slim-bookworm` | 构建 Python venv，安装依赖 |
| `runtime-base` | `python:3.12-slim-bookworm` | 运行时镜像，含 nginx、OpenJDK 17、Docker-in-Docker、fonts-noto-cjk 等 |

运行时镜像特点：
- 容器内 nginx 反代到 backend（端口 18000）
- 支持 Docker-in-Docker 沙箱（从内网下载静态 docker 20）
- OnlyOffice/Tika 文档处理（OpenJDK 17 + Tika 3.3.0 jar）
- 达梦数据库支持（`dmpython` + `dmsqlalchemy`，仅 Linux）
- `dumb-init` 作为 PID 1，`dockerize` 用于模板渲染
- EXPOSE 5171（nginx 端口），VOLUME `eclaw_data`/`eclaw_logs`

**docker/entrypoint.sh**

首次启动时生成默认 `.env`（随机 `ECLAW_JWT_SECRET` / `ECLAW_WEBSOCKET_TICKET_SEED`），启动 nginx（`ECLAW_NGINX_PORT`，默认 5171），启动 uvicorn（`ECLAW_BACKEND_PORT`，默认 18000）。

**沙箱镜像**

`docker/sandbox.Dockerfile` 是独立的沙箱镜像，由 `docker` 终端沙箱模式按会话启动。保持最小化。

**发布流程**

详见 `docs/guide/product-release-flow.html`：

```bash
# 版本准备
python scripts/prepare_release_versions.py --release-version 0.1.x --check
python scripts/prepare_release_versions.py --release-version 0.1.x --write --commit

# 构建发布包
python scripts/build_nexbot_release.py  # 创建 nexbot-release-<version>.tar.gz
# --include-sandbox-release: 同时构建沙箱包
# --sandbox-only: 仅沙箱包
# --backend-wheels-dir: 需要双平台 Linux wheels（含 dm extra）
```

**插件前端构建**

```bash
sh scripts/build_plugin_frontends.sh "$(pwd)"
python scripts/check_plugin_imports.py plugins
```

**插件开发包发布**

```bash
NEXUS_PASSWORD=... scripts/publish_nexus.sh all
```

发布 `nexbot-plugin-sdk`、`nexbot-plugin-testkit`、`nexbot-dev-server`、`@nexbot/plugin-host`、`@nexbot/plugin-vite`、`@nexbot/boot` 到内部 Nexus 仓库。

---

## 七、测试体系

**测试框架**：pytest，testpaths = `["tests"]`，98 项测试文件。

**测试基础设施**（`tests/conftest.py`）：

- 强制 `ECLAW_TERMINAL_SANDBOX_FAIL_CLOSED=false`，让终端工具在 CI 中降级
- 构建隔离的 `Settings`，每个测试的 `storage_root`/`runtime_logs_root` 在 `.test-workspaces/` 下
- 用 `tests/fakes.ScriptedModelClient` 替换模型客户端（无网络依赖）
- 预置 `tenant-a / user-tester` 账号（全部权限 + 默认 Agent）
- 提供 `service`、`client`、`auth_context`、`make_token` 等 fixture
- `register_test_service` / `drain_test_services` 确保清理

**测试覆盖范围**：

| 领域 | 测试文件 |
|------|---------|
| 客户端交互协议 | `test_client_interaction_phase0~5_*.py`、`test_client_interaction_release_guards.py` 等 |
| A2A 协议 | `test_a2a_protocol_v1.py`、`test_a2a_integration.py`、`test_a2a_governance.py` |
| 沙箱/终端 | `test_linux_bwrap_scripts.py`、`test_linux_sandbox_runtime.py`、`test_windows_elevated_sandbox.py` |
| Agent/运行时 | `test_agent_os.py`、`test_agent_graph.py`、`test_runtime_state_store.py`、`test_streaming_runtime_events.py` |
| 存储/迁移 | `test_storage_contracts.py`、`test_sql_provider_bootstrap.py`、`test_default_tenant_sql_migration.py` |
| 工具/MCP/插件 | `test_mcp_loader.py`、`test_plugin_runtime.py`、`test_tool_schemas.py`、`test_card_render_display_cards.py` |
| 记忆系统 | `test_memory_eval.py`、`test_memory_llm_options.py`、`test_memory_context_payload.py` |
| 其他 | `test_rest_api.py`、`test_gateway_policies.py`、`test_dingtalk_stream_dispatcher.py` 等 |

前端有 `*.test.ts` 文件（`composables/` 和 `stores/` 下），但当前没有配置测试运行器或 linter，这些是占位文件，不被 CI 执行。

---

## 八、关键设计决策与演进路线

**架构决策记录**（`docs/adr/`）：

- `0001-phase-one-server-installed-code-plugins.md`：Phase 1 采用服务端安装的代码插件（而非动态加载/远程插件）
- `0002-file-to-sql-migration-throwaway-tool.md`：文件到 SQL 迁移使用一次性工具

**关键演进路线**：

1. **文件存储 → SQL 数据库**：三层归属设计（etrobot 既有表复用 / 平台通用扩展 / Nexbot 专属），支持国产数据库（达梦/金仓），保持 file provider 并行运行作为过渡。当前 SQL provider 创建/校验 schema 后，仍 fallback 到 file-backed repositories，直到每个 SQL repository 实现完成。

2. **单 Agent → 多专家协作**：Agent OS 引入 Mission/Job/ContextPack/Mailbox/Blackboard 等协作对象，支持主专家派发子专家、本地与远程 Agent 协作。

3. **同步对话 → 异步任务**：Fast App async 模式支持长耗时任务，通过 `jobs/{job_id}` 轮询结果。

4. **单一入口 → 多接入模式**：Fast App（同步/异步）、Client App（标准接入）、Hosted App（平台托管）、Internal App（服务端到服务端）、A2A（Agent 间互联）——五种接入模式覆盖不同集成场景。

5. **本地工具 → 客户端工具**：Client Interaction API 支持浏览器端工具声明和回流，工具可以在用户设备上执行（如操作 DOM、读取页面内容）。

6. **手动运维 → 自动化迁移**：提供 SQL 迁移 Web 工具（`ECLAW_MIGRATION_TOOL_ENABLED`）、默认租户 SQL 迁移脚本、文件到数据库迁移计划。

**对于 Agent 开发新手的建议**：

如果你刚开始研究这个项目，建议按以下顺序学习：

1. 先读 `CLAUDE.md`（即 `AGENTS.md`）——这是 AI 协作指南，包含项目的核心约定和命令
2. 读 `docs/architecture/README.md` 及其下属文档——建立架构全局认知
3. 跑通测试：`pytest tests/test_agent_graph.py` ——理解 Agent 图的基本工作方式
4. 读 `backend/app/agents/state.py` 和 `factory.py`——理解状态定义和图拓扑
5. 读 `backend/app/agents/tools/loader.py` 和 `runtime/tools/executor.py`——理解工具系统
6. 读 `docs/0413-agentcore.md`——理解 Agent Loop 语义
7. 读 `docs/architecture/09-model-input-layering.md`——理解模型输入分层
8. 读 `frontend/src/composables/streaming/sendStreamingMessageV2.ts`——理解前端流式通信
9. 尝试创建一个简单的 Skill 或注册一个 API 工具，实际运行一次完整的对话流

---

> **文档版本**：基于 2026-06-29 项目代码库生成
>
> **项目版本**：nexbot 0.1.1
>
> **文档生成工具**：QoderWork + 多 Explore 代理并行探索
