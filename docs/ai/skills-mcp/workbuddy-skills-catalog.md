---
title: WorkBuddy（CodeBuddy）公开市场 Skills 完整清单解析
date: 2026-07-29
category: ai
tags:
  - ai
  - skill
  - workbuddy
  - codebuddy
  - mcp
  - 腾讯
  - agent
description: 解析腾讯 WorkBuddy/CodeBuddy 公开市场归档仓库 workbuddyskills 的完整资源清单，覆盖技能包、连接器、专家包、插件市场四大类共 833 项资源，含分类体系、前置条件、安装方式与数据来源。
---

# WorkBuddy（CodeBuddy）公开市场 Skills 完整清单解析

> **来源**：
> - 仓库 [infometa/workbuddyskills](https://github.com/infometa/workbuddyskills)（CATALOG.md 最近同步 2026-07-29）
> - 社区讨论 [linux.do topic/2627556](https://linux.do/t/topic/2627556)

## 一、项目概述

### 1.1 项目定位

`workbuddyskills` 是腾讯 **WorkBuddy / CodeBuddy** AI 编程助手公开市场的归档仓库，将官方市场的技能包、连接器、专家插件、插件市场内容统一抓取并整理为可离线学习、检索与对照写法的本地知识库。

> 社区反馈（linux.do）：workbuddy 内置大量 skills，甚至包含 12306、deep_research 等日常向工具，主打「日常使用」场景，可直接下载复用。

### 1.2 核心概念

| 术语 | 含义 |
|------|------|
| **WorkBuddy / CodeBuddy** | 腾讯出品的 AI 编程助手，支持技能、连接器、专家插件扩展 |
| **技能包（skills）** | 封装特定领域能力的 `SKILL.md` 指令集，让 AI 在某类任务上更专业 |
| **连接器（connectors）** | MCP 协议的外部服务接入配置（`mcp.json`），连接器市场仅提供配置模板，启用需在 App 内完成 OAuth/扫码 |
| **专家包（experts）** | 由 agents / skills / avatars 组成的专家插件，按职业角色提供深度能力 |
| **插件市场（plugins）** | 官方插件与团队插件合集，提供更重的工作流能力 |

### 1.3 版权与维护

- 内容来自 WorkBuddy / CodeBuddy 公开 CDN 与市场包，版权归原作者与腾讯相关产品所有；仓库仅作学习归档，请勿用于未授权商业再分发。
- 自动化脚本每日检查公开市场并同步更新，归档可能与官方最新版本存在差异，以官方市场为准。

## 二、仓库结构

```text
workbuddyskills/
├── skills/          # 推荐技能市场技能包（含 SKILL.md 的顶层包）
├── connectors/      # 连接器配置（mcp.json）+ 自带 skills
├── experts/         # 专家插件（agents / skills / avatars）+ expert_center.json
├── plugins/
│   ├── codebuddy-plugins-official/   # 官方插件市场
│   └── cb_teams_marketplace/         # 团队插件市场
└── CATALOG.md       # 完整清单（全部名称、用途、前置条件，可点击跳转）
```

## 三、资源总量一览

| 分类 | 数量 | 说明 |
|------|------|------|
| 技能包 `skills/` | **295** | 含 `SKILL.md` 的顶层包，按用途分 10 个子类 |
| 连接器 `connectors/` | **76** | MCP 外部服务接入配置模板 |
| 专家插件 `experts/` | **399** | 按职业角色分 14 个子类 |
| 官方插件 `plugins/official` | **57** | CodeBuddy 官方维护 |
| 团队插件 `plugins/teams` | **30** | 社区/团队贡献 |
| **合计** | **857** | 四大类资源总和 |

> 注：CATALOG.md 顶部统计与 README 略有出入（连接器 73 vs 76、专家 378 vs 399），系不同统计口径，本文以 README 较新数据为准。

## 四、技能包 skills/（295）

技能包是仓库主体，按用途分为 10 个子类。每个条目包含「用来做什么」与「前置条件」。

### 4.1 子类分布

| 子类 | 数量 | 占比 | 代表条目 |
|------|------|------|----------|
| AI / Agent 工具 | 159 | 53.9% | deep-research、diagnose、agent-browser-core、agent-mail |
| 腾讯 / 微信 / 企微 | 47 | 15.9% | kdocs、tencent-docs、wecom、tmeet、tencent-survey |
| 文档 / 办公 / 协作 | 44 | 14.9% | feishu、dingtalk、notion、jira、apple-notes |
| 搜索 / 研究 / 知识 | 15 | 5.1% | arxiv-reader、github-ai-trends、humanizer |
| 设计 / UI / 地图 | 12 | 4.1% | impeccable、excalidraw-diagram、deck-generator |
| 数据 / 金融 / 股票 | 6 | 2.0% | earnings-tracker、westock-mcp |
| 内容 / 营销 / 媒体 | 5 | 1.7% | content-factory、content-repurposer、fbs-bookwriter |
| 云 / 存储 / 部署 | 4 | 1.4% | cloudflare、cloudbase、edgeone、baidu-drive |
| 开发 / 工程 | 2 | 0.7% | frontend-dev、gif-sticker-maker |
| 其他 | 1 | 0.3% | — |

### 4.2 高价值技能精选

按能力维度挑选代表性技能：

| 能力方向 | 技能 | 作用 | 前置条件 |
|----------|------|------|----------|
| 深度研究 | `deep-research` | 结构化深度研究工作流，支持 human-in-the-loop，`/research` 触发 | 无 |
| 调试诊断 | `diagnose` | 硬 bug 与性能回归的纪律性诊断循环：复现 → 最小化 → 定位 → 修复 | 无 |
| 内核分析 | `crash-expert-skill` | Linux kernel vmcore/coredump 分析专家 | 可能需启用 MCP/连接器 |
| 论文阅读 | `arxiv-reader` | 指定 arxiv_id/url，基于 LLM Agent 对论文分类与深度阅读，打印笔记 | 需 LLM API Key、`LLM_API_KEY` |
| 论文追踪 | `arxiv-watcher` | 搜索并摘要 ArXiv 最新研究 | 无 |
| 研究优化 | `autoresearch` | Karpathy 式 autoresearch 优化，生成 50+ 变体并筛选 | 需 `ANTHROPIC_API_KEY` |
| 浏览器 | `agent-browser-core` | OpenClaw skill，Rust 实现 + Node.js fallback 的 agent-browser CLI | 需登录/OAuth |
| 邮件 | `agent-mail` | AI agent 邮箱：查收、发送、经 @agentmail 域通信 | `AGENTMAIL_API_KEY` |
| 苹果生态 | `apple-notes` / `apple-reminders` | macOS 上管理备忘录/提醒事项（memo/remindctl CLI） | 无 |
| 网盘 | `baidu-drive` / `tencent-weiyun` | 百度网盘/腾讯微云文件管理（上传/下载/转存/分享/搜索） | 需登录/OAuth |
| 出行 | `didi-ride-skill` | 滴滴打车、查价、路线规划、订单查询 | `DIDI_MCP_KEY` |
| 出行 | `airchina-travel-assistant` | 领取国航优惠券 | `SECRET_KEY` |
| 出行 | `flyai` | 自然语言搜索机票/酒店/景点/演出/旅行优惠 | `FLYAI_API_KEY` |
| 文档 | `kdocs` | 金山文档官方 Skill，云端新建/读取/编辑/搜索/分享 | `KINGSOFT_DOCS_TOKEN` |
| 表单 | `jinshuju` | 金数据表单创建/编辑/数据查询/批量更新 | 需登录 + `YOUR_API_KEY` |
| 设计 | `deck-generator` | AI 生成图片的专业演示文稿 | `GEMINI_API_KEY` |
| 去 AI 味 | `humanizer` | 移除文本中的 AI 生成痕迹 | 无（可选 API 增强） |
| 长文档 | `fbs-bookwriter` | 福帮手出品，书籍/手册/白皮书长文档工具链，S/P/C/B 分层审校 | 可能需 MCP/连接器 |
| 内容生产 | `content-factory` | 多 agent 内容生产系统，一份素材生成多格式 | 需 LLM API Key |
| 交付物 | `html-deploy` | 发布自包含 HTML 到 htmlcode.fun 返回在线 URL | 无 |
| 团队协同 | `agent-team-orchestration` | 编排多 agent 团队：角色定义、任务生命周期、交接协议 | 无 |
| 反蒸馏 | `anti-distill` | 防员工 Skill 被蒸馏，清理 skill 文件使其看起来完整 | 无 |

## 五、连接器 connectors/（76）

连接器是 MCP 协议的外部服务接入配置模板。**仓库仅含配置模板，启用仍需在 WorkBuddy App 内完成 OAuth / 扫码**。

### 5.1 连接器与技能的关系

```text
连接器（connectors/）          技能（skills/）
   │                              │
   ├─ mcp.json（MCP 配置）         └─ SKILL.md（能力指令）
   ├─ 对接外部服务凭证
   └─ App 内 OAuth/扫码启用
        │
        ▼
   部分 skill 依赖对应 connector 才能完整工作
   （前置条件中的「可能需要启用对应 MCP / 连接器」即指此）
```

### 5.2 代表性连接器

| 平台方向 | 连接器 | 作用 | 前置条件 |
|----------|--------|------|----------|
| 代码托管 | `github` / `gongfeng-woa` | GitHub/工蜂仓库管理、文件操作 | 可能需 MCP/连接器 |
| 协作平台 | `feishu` / `dingtalk` / `wecom` | 飞书/钉钉/企微 文档/日历/通讯录/审批 | 需 App 内 OAuth |
| 研发管理 | `tapd` / `jira` | TAPD/Jira 需求/缺陷/任务/迭代管理 | `JIRA_API_TOKEN` 等 |
| 知识库 | `lexiang` / `notion` / `iwiki-woa` | 乐享/Notion/iWiki 知识库搜索与写入 | 需登录/OAuth |
| 邮件 | `gmail` / `netease-email` / `qq-mail` | IMAP/SMTP 邮件收发搜索 | 需登录 + 凭证 |
| 网盘 | `baidu-netdisk` / `tencent-weiyun` | 百度网盘/微云 文件管理与检索 | 需登录/OAuth |
| 数据 | `westock-mcp` / `gangtise-mcp` / `yingmi-mcp` | 股票行情/机构观点/基金数据 | 各自 API Key |
| 法务 | `fyopen-lawsearch` / `pkulaw` / `wk-workbuddy` | 法规检索/北大法宝/沃尔特斯法律 | 需凭证 |
| 企业信息 | `tyc-mcp` / `qcc-company` / `qixinhuiyan-mcp` | 天眼查/企查查/启信慧眼 企业数据查询 | 各自 API Key |
| 设计 | `canva` / `mastergo-vibe-mcp` | Canva/MasterGo 设计能力调用 | 需凭证 |
| 云 | `cloudbase` / `edgeone-pages` / `zhiyan-cicd` | 云开发/EdgeOne 部署/TKE CI/CD | 需凭证 |
| 会议 | `tmeet` | 腾讯会议 CLI：OAuth/会议/录制管理 | 需登录/OAuth |

## 六、专家包 experts/（399）

专家插件按职业角色组织，由 agents / skills / avatars 组成，每个专家针对特定职业场景提供深度能力。

### 6.1 专家子类分布

| 子类 | 数量 | 子类 | 数量 |
|------|------|------|------|
| 内容创作 | 45 | 游戏空间 | 25 |
| 技术工程 | 41 | 法务安全 | 24 |
| 数据智能 | 41 | 项目质量 | 23 |
| 金融投资 | 36 | 全球发展 | 21 |
| 营销增长 | 35 | 产品设计 | 19 |
| 行业顾问 | 31 | 销售商务 | 16 |
| 腾讯专区 | 29 | 运营人力 | 13 |

### 6.2 专家包示例

```bash
# 查看某个专家（全域内容分发团队）
ls experts/content-distribution-team/agents
cat experts/content-distribution-team/.codebuddy-plugin/plugin.json
```

> 专家包的完整清单（名称、用途、前置条件）见仓库 [CATALOG.md](https://github.com/infometa/workbuddyskills/blob/main/CATALOG.md) 第 3 章。

## 七、插件市场 plugins/（87）

插件提供比技能更重的工作流能力，分官方与团队两个市场。

### 7.1 官方插件（57）代表

| 方向 | 插件 | 作用 |
|------|------|------|
| 安全拦截 | `atuin` | 自动拦截 AI 高危操作，阻止使用有漏洞的组件（腾讯玄武实验室） |
| 供应链安全 | `chainguard` | 自动拦截 AI 依赖安装，进行供应链安全审计 |
| 安全审计 | `security-scan` | 语义索引 + 多 Agent 并行扫描 + 对抗验证的漏洞发现，支持无人值守 + 安全门禁 |
| Skill 审查 | `skills-security-check` | 腾讯云鼎实验室出品，对 SKILL.md 及配套脚本做安全审查 |
| 安全规则 | `security-rules` / `security-guidance` | 安全三部 rules / 编辑文件时安全告警（命令注入/XSS） |
| 语言服务 | `clangd/csharp/gopls/jdtls/lua/php/pyright/rust-analyzer/swift/typescript-lsp` | 各语言 LSP，提供代码智能/诊断/重构 |
| 文档处理 | `docx` / `pptx` / `xlsx` / `pdf` | Word/PPT/Excel/PDF 创建编辑分析 |
| 前端 | `frontend-design` | 创建独特生产级前端界面，避免千篇一律 AI 审美 |
| 测试 | `testbuddy` / `webapp-testing` | 文本测试用例生成 / 引导式 Web 应用测试 |
| 工作流 | `feature-dev` / `requirements-driven-workflow` | 功能开发结构化工作流 / 需求驱动 + 90% 质量门控 |
| 多代理 | `oh-my-codebuddy` | agents/commands/skills/hooks/tools/MCP 全家桶，多代理编排 |
| 技能发现 | `find-skills` / `hot-skills` / `plugin-finder` | 从 Vercel Skills/ClawHub 发现安装技能 / 7 个热门技能合集 / 插件发现比较 |

### 7.2 团队插件（30）代表

| 方向 | 插件 | 作用 |
|------|------|------|
| 投资分析 | `a-share-analysis` | A 股 21 个专业分析 skill + 6 个编排 agent |
| 投资分析 | `ai-hedge-fund` | 19 位投资大师并行分析（巴菲特/芒格/林奇等）+ 风险管理 |
| 交易 | `trading-agent` | 多角色辩论方法论，输出 BUY/SELL/HOLD 建议 |
| 研究 | `deep-research` | 综合 Web 研究、信息合成、深度研究 |
| 设计转码 | `design-to-code` | Figma 设计/UI 截图转生产就绪代码组件 |
| 高考 | `gaokao-advisor` | 高考真题/高校专业检索/志愿填报参考 |
| PPT | `ppt-implement` | 一键将想法转化为精美演示文稿 |
| 视频 | `remotion-video-generator` | 用 Remotion 生成生产级视频 |
| 技能创建 | `skill-creator` | 创建高效 Claude 技能的指南 |
| Web 应用 | `modern-webapp` / `webapp-testing` | React/TS/Vite/Tailwind 现代 Web 应用开发与测试 |

## 八、前置条件体系

每个资源条目都标注前置条件，是判断「能否开箱即用」的关键。

### 8.1 前置条件类型

| 类型 | 含义 | 典型场景 |
|------|------|----------|
| **无** | 不需额外密钥或登录即可阅读/使用说明 | deep-research、diagnose、apple-notes |
| 大模型 API Key | 需 OpenAI/Anthropic 等 LLM 凭证 | autoresearch、content-factory、flyai |
| 登录 / OAuth / 扫码 | 需在 App 内完成授权 | feishu、dingtalk、baidu-drive |
| 微信/企微凭证 | 需微信或企业微信扫码登录 | canva、cloudbase、westock-mcp |
| 飞书应用凭证 | 需飞书应用授权 | cloudq、colleague-skill |
| GitHub Token | 需 `gh auth login` 或 `GITHUB_TOKEN` | github-ai-trends、capability-evolver |
| 环境变量 | 需配置特定环境变量 | 见下表 |
| token-schema 凭证 | 按 token 模式配置凭证 | bugly-token、gangtise-mcp |

### 8.2 常见环境变量速查

```bash
# 邮件
AGENTMAIL_API_KEY          # agent-mail
EMAIL_PASSWORD             # gmail

# 大模型
ANTHROPIC_API_KEY          # autoresearch
GEMINI_API_KEY             # deck-generator
LLM_API_KEY                # arxiv-reader

# 出行
DIDI_MCP_KEY               # didi-ride-skill
FLYAI_API_KEY              # flyai
CHENGXIN_API_KEY           # tc-chengxin（同程程心）

# 文档协作
KINGSOFT_DOCS_TOKEN        # kdocs
YOUR_API_KEY / YOUR_API_SECRET  # jinshuju

# 云与代码
GITHUB_TOKEN               # github-ai-trends、capability-evolver
TENCENTCLOUD_SECRET_KEY    # cloudq
TENCENT_MAP_KEY            # tencent-map

# 金融
GTS_ACCESS_KEY / GTS_secret_KEY  # gangtise-mcp
YINGMI_API_KEY             # yingmi-mcp
TDX_API_KEY                # tdx-connector

# 其他
FADADA_APP_SECRET          # fadada-document-sign
WEIYUN_MCP_TOKEN           # tencent-weiyun
SCRM_APP_KEY               # weisheng-scrm
```

## 九、安装与使用

### 9.1 装回 WorkBuddy

将归档资源拷贝到 WorkBuddy 本地目录即可启用：

| 内容 | 拷贝到 |
|------|--------|
| 技能 | `~/.workbuddy/skills/<name>/` |
| 专家 | `~/.workbuddy/plugins/marketplaces/experts/plugins/<name>/` |
| 连接器市场 | `~/.workbuddy/connectors-marketplace/connectors/<id>/` |

> 连接器启用仍需在 App 内完成 OAuth / 扫码，仓库只有配置模板。

### 9.2 快速浏览（离线学习）

```bash
# 浏览技能列表
ls skills | head

# 查看某个技能内容
cat skills/lark-unified/SKILL.md

# 浏览专家
ls experts/content-distribution-team/agents
cat experts/content-distribution-team/.codebuddy-plugin/plugin.json

# 浏览连接器
ls connectors | head
cat connectors/westock-mcp/mcp.json
```

### 9.3 数据来源（公开 CDN）

```text
Skills:        https://download.codebuddy.cn/skill-marketplace/skill-marketplace.zip
Connectors:    https://acc-1258344699.cos.ap-guangzhou.myqcloud.com/connectors-config-v2/connectors-config.zip
Experts catalog: .../workbuddy/expert-marketplace/expert_center.json
Experts bundles: .../workbuddy/expert-marketplace/bundles/<name>.tar.gz
Plugins:       https://download.codebuddy.cn/plugin-marketplace/*.zip
```

## 十、选型与实施建议

### 10.1 选型决策路径

1. **先定场景**：日常工具向（出行/邮件/网盘/文档）→ 技能包；外部系统集成 → 连接器；职业深度能力 → 专家包；完整工作流 → 插件市场。
2. **再查前置条件**：标注「无」的可直接试用；需 API Key/OAuth 的提前准备凭证。
3. **技能 vs 连接器**：技能是 AI 的「能力指令」，连接器是「外部接入通道」；部分技能依赖连接器才能完整工作，组合使用。
4. **官方 vs 团队**：稳定优先选官方插件；垂直领域深度（如 A 股分析、对冲基金）选团队插件。

### 10.2 使用注意事项

- **安全优先**：第三方 skill/插件可能各自有 LICENSE，使用前建议用安全扫描器（如 skills-security-check）审查。
- **凭证隔离**：环境变量按需配置，避免一次性写入所有凭证；敏感凭证不入库。
- **版本对齐**：归档可能与官方最新版本存在差异，生产环境以官方市场为准。
- **连接器启用**：仓库仅含配置模板，必须回到 WorkBuddy App 内完成 OAuth/扫码才算真正启用。

## 十一、重要结论

1. **资源规模庞大**：WorkBuddy 公开市场归档了 857 项资源，是当前已知规模最大的中文 AI Agent 能力市场之一，技能包中 AI/Agent 工具占 53.9%，反映通用 Agent 能力是市场主力。
2. **主打日常使用**：从 12306、滴滴、国航、携程到金山文档、百度网盘、QQ 邮箱，覆盖大量本土化日常与办公场景，这是相较海外 Skill 生态的显著差异。
3. **四层扩展体系清晰**：技能（能力指令）→ 连接器（外部接入）→ 专家（职业角色）→ 插件（工作流）层层递进，可按场景复杂度逐级选型。
4. **前置条件是落地关键**：约半数资源需 API Key 或 OAuth 授权，无前置条件的开箱即用资源（如 deep-research、diagnose、humanizer）是快速试用的首选。
5. **腾讯生态深度集成**：腾讯/微信/企微类技能 47 项 + 腾讯专区专家 29 项，飞书/钉钉/企微协作连接器齐全，对国内企业协同场景适配度高。
6. **安全能力成体系**：官方插件市场有 atuin（玄武实验室）、chainguard、security-scan、skills-security-check（云鼎实验室）等多款安全插件，形成供应链拦截 + 代码审计 + Skill 审查的纵深防御。
7. **学习价值**：仓库定位「对照写法」，是研究高质量 SKILL.md 写法、MCP 连接器配置、专家插件组织的优质本地素材库。

---

> **备注**：本文档基于 workbuddyskills 仓库 CATALOG.md（1019 行）与 README.md 整理，数量统计以 README 较新数据为准。完整条目（含每个技能的中文用途与前置条件）请查阅仓库 [CATALOG.md](https://github.com/infometa/workbuddyskills/blob/main/CATALOG.md)。
