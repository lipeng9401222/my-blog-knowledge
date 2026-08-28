---
title: AI Agent 扩展能力（Skill / MCP）精选合集
date: 2026-07-14
category: ai
tags:
  - ai
  - skill
  - mcp
  - agent
  - tools
  - collection
description: 系统性收录社区验证好用的 AI Agent 扩展能力（Skill / MCP）工具，按思考推理、开发辅助、浏览器自动化、DevOps、知识记忆、去 AI 味、科研、安全八大类整理，含选型建议与安全须知。
---

# AI Agent 扩展能力（Skill / MCP）精选合集

> **来源**：[linux.do topic/2533306](https://linux.do/t/topic/2533306)（作者：scp，最后更新 2026-07-14）
> **更新记录**：
> - 2026-07-07：新增「学术 / 科研」大类及若干工具推荐
> - 2026-07-06：新增「审美 / 去 AI 味」「安全 / 防注入检测」两大类及若干工具推荐

## 一、文档概述

在 AI 编程协作中，当需要扩展 Agent 能力（如浏览器操作、记忆持久化、设计审计等）时，临时让 AI 现搓既耗时又费 token，而网络上筛选合适工具又难以判断质量。本文档系统性收录社区验证好用的 **Skill** 与 **MCP** 工具，按用途分类，并标注类型、地址、作用与社区评价，便于按需取用。

### 核心概念

| 术语 | 含义 |
|------|------|
| **Skill** | 封装特定领域能力/方法论的指令集（通常为 `SKILL.md`），让 AI 在某类任务上更专业，如代码审计、UI 审美 |
| **MCP** | Model Context Protocol，标准化协议，让 AI 通过 Server 接入外部工具/数据源（数据库、API、浏览器等） |
| **CLI / 框架** | 命令行工具或可组装的 Skill 框架，提供更重的工作流能力 |

### 工具分类总览

| 序号 | 大类 | 子类 | 工具数 | 代表工具 |
|------|------|------|--------|----------|
| 一 | 思考 / 推理增强类 | — | 3 | Grill Me、Sequential Thinking |
| 二 | 开发 / 编程辅助类 | — | 7 | Superpowers、OpenSpec、Context7 |
| 三 | 浏览器 / 自动化类 | — | 4 | Playwright MCP、Agent Browser |
| 四 | 工程平台 / DevOps 类 | — | 7 | 飞书 Lark-CLI、Figma MCP、OfficeCLI |
| 五 | 知识系统 / 记忆类 | — | 3 | GitNexus、Mem0 |
| 六 | 审美 / 去 AI 味类 | UI / 文案 | 4 | Taste-Skill、qu-ai-wei |
| 七 | 学术 / 科研类 | — | 1 | Academic Research Skills |
| 八 | 安全 / 防注入检测 | 安装前 / 运行时 | 4 | SkillGuard、Snyk Agent Scan |

## 二、思考 / 推理增强类

通过压力测试、分步推理等方式，提升 AI 在复杂问题上的推理质量与逻辑严谨性。

| 名称 | 类型 | 作用 | 评价 |
|------|------|------|------|
| **Grill Me** | Skill | 对方案进行“压力测试”，连续追问并挑战假设，暴露设计漏洞与不完整逻辑 | 论坛高频提及，必备推荐 |
| **Grill With Docs** | Skill | Grill Me 的“带文档”变体，追问时同步对照需求文档/规约核验，适合有明确规格的模块开发 | 规约驱动场景下比原版更稳（Pachakutiq 推荐） |
| **Sequential Thinking** | MCP | 将复杂问题拆解为可执行的分步推理过程，允许中途修正或回溯推理链 | 部分现代 Agent 已预置分步思考能力，价值下降 |

> 地址：[mattpocock/skills](https://github.com/mattpocock/skills) ｜ [sequentialthinking MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking)

## 三、开发 / 编程辅助类

覆盖文档上下文、规约驱动开发、代码范围约束、前端审计等开发全链路。

| 名称 | 类型 | 作用 | 评价 |
|------|------|------|------|
| **Context7** | MCP | 为模型提供最新框架/库文档上下文，解决知识过时 | 实测提升一般（opencode 场景） |
| **Supabase MCP** | MCP | 数据库 schema 查询、SQL 分析、权限策略检查 | 可结合 Supabase 免费在线库存个人结构化数据 |
| **Exa Search MCP** | MCP | 高质量语义搜索，可转 Skill：`npx -y @filiksyos/mcptoskill` | 比让 AI 瞎琢磨 cURL 好用；登录建个人凭证可提高并发 |
| **Superpowers** | Skill 框架 | 一整套代理式编程方法论 + 可组装 skills，覆盖头脑风暴/spec/TDD/代码评审 | 社区热度极高（主仓 100k+ stars，中文版 6k+），skills 全家桶，按需取用 |
| **OpenSpec** | Skill / 工作流 | 规约驱动开发（SDD）：大模块先写结构化 spec，再交 Agent 按 spec 实现 | 大模块用 spec 模式最稳，小改动可直接写 |
| **Ponytail** | Skill | 约束 Agent 只触碰明确指定的代码范围，避免误伤无关逻辑 | 治好合并冲突恐惧症（chopin2077 推荐） |
| **Impeccable** | Skill | 前端设计审计与改进闭环：诊断问题 → 建议 → 直接修复，定位 client-ready 质量 | 前端代码审计/审美提升首选 |

> 地址：[obra/superpowers](https://github.com/obra/superpowers) ｜ [中文增强版 jnMetaCode/superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) ｜ [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) ｜ [alonbaron/claude-skills](https://github.com/alonbaron/claude-skills) ｜ [peterhadorn/webdesign-agency-skills](https://github.com/peterhadorn/webdesign-agency-skills)

## 四、浏览器 / 自动化类

为 AI Agent 提供浏览器控制、UI 自动化、移动设备操作能力。

| 名称 | 类型 | 作用 | 评价 |
|------|------|------|------|
| **Playwright MCP** | MCP | 浏览器自动化：页面操作、UI 测试、数据抓取 | AI 浏览器能力的默认推荐 |
| **Kimi WebBridge** | Skill | 专为 AI Agent 设计的浏览器插件：开网页、点击、填表、提取信息 | codex 中可用，可操作登录态网站；codex 内置浏览器对认证站点直接报错 |
| **Agent Browser** | CLI / Skill | Vercel 出品的浏览器自动化 CLI，描述场景即自动编排跑通流程，无需手写脚本 | 3.8w+ stars，原生 agent 友好，前端测试灵活 |
| **Android MCP Server** | MCP | 通过 ADB 控制 Android 设备：截图、UI 布局分析、包管理、任意 ADB 命令，支持多设备 | 770+ stars；注意：APP UI 层级深易致低配模型卡死，能用浏览器就别用手机 |

> 地址：[microsoft/playwright](https://github.com/microsoft/playwright) ｜ [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) ｜ [minhalvp/android-mcp-server](https://github.com/minhalvp/android-mcp-server)

## 五、工程平台 / DevOps 类

打通 GitHub、Notion、飞书、Figma、Office 等平台，让 AI 直接操作工程协作产物。

| 名称 | 类型 | 作用 | 评价 |
|------|------|------|------|
| **GitHub MCP** | MCP | 访问 issue、PR、代码仓库分析 | 使用率最高的 MCP 之一，部分功能可被 GitHub CLI 替代 |
| **Notion MCP** | MCP | 知识库管理、文档组织、项目记录自动化 | 知识管理代表，少量个人数据可托管 |
| **maton（聚合 API）** | MCP | 一个 API 同时接入 Notion、OneDrive 等多平台，免逐个配置凭证 | 接入便捷（mjj7458 推荐） |
| **飞书 Lark-CLI** | Skill 集合 | 飞书官方开源 AI 操作工具：读消息、查日历、写文档、建表格、发邮件；npm 一行安装，支持 Claude Code/Cursor/Trae | 国内协同场景刚需（Corgier 推荐） |
| **Figma MCP（Dev Mode）** | MCP | 从 Figma 设计稿直接生成/对齐前端代码，打通“设计 → 代码” | 设计到代码方案的不错选择 |
| **OfficeCLI** | CLI / Skill | 专为 AI agent 的 Office 套件：单命令读写 Word/Excel/PPT，单二进制免装 Office | 9.5k+ stars，C# 编写；Word/Excel 效果好，PPT 闭环需多模态模型 |

> 地址：[飞书 CLI 官网](https://www.feishu.cn/feishu-cli) ｜ [iOfficeAI/OfficeCLI](https://github.com/iOfficeAI/OfficeCLI)

## 六、知识系统 / 记忆类

为 Agent 提供长期记忆与代码库理解能力。

| 名称 | 类型 | 作用 | 评价 |
|------|------|------|------|
| **Obsidian** | Skill / MCP 接入 | 作为本地知识库系统，实现长期知识存储与检索 | 个人知识管理代表，需一定配置动手能力 |
| **GitNexus** | 工具（本地知识图谱） | 纯浏览器端代码知识图谱引擎：丢入任意 git 仓库/ZIP，生成交互式图谱 + 内置 Graph RAG Agent | 4.3w+ stars，零服务器本地运行，代码库理解/重构好用 |
| **Mem0** | MCP / 记忆层 | AI agent 通用记忆层：跨会话持久化，记住用户偏好、历史决策、项目上下文 | 6w+ stars，记忆类事实级标准方案，想让 agent「长记性」首选 |

> 地址：[abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus) ｜ [mem0ai/mem0](https://github.com/mem0ai/mem0)

## 七、审美 / 去 AI 味类

### 7.1 UI / 视觉去 AI 味

| 名称 | 类型 | 作用 | 评价 |
|------|------|------|------|
| **Taste-Skill** | Skill | 让 AI 拥有“好品味”：生成前先做审美与原创性校验，阻止千篇一律样板 UI | 5.8w+ stars，UI 去 AI 味热度最高（wxpp 推荐） |
| **UI/UX Pro Max** | Skill | 跨平台 UI/UX 设计智能 skill：配色、布局、组件、交互，覆盖 Web/移动/桌面 | 10w+ stars（中文版 1.1k），UI 设计现象级项目，立竿见影 |

> 地址：[Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) ｜ [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) ｜ [中文版 bbylw/ui-ux-pro-max-skill-cn](https://github.com/bbylw/ui-ux-pro-max-skill-cn)

### 7.2 文案 / 写作去 AI 味

| 名称 | 语言 | 作用 | 评价 |
|------|------|------|------|
| **qu-ai-wei（去 AI 味）** | 中文 | 专攻简体中文 AI 写作痕迹：清理“赋能/打造/极致/无缝”等空泛营销词、对仗堆砌、AI 腔句式 | 中文场景首选，170+ stars，实测有效 |
| **Humanizer** | 英文 | 移除英文文本中的 AI 生成痕迹 | 2.7w+ stars，英文去 AI 味最知名 skill |

> 地址：[LifelongLazyLearner/qu-ai-wei](https://github.com/LifelongLazyLearner/qu-ai-wei) ｜ [blader/humanizer](https://github.com/blader/humanizer)

## 八、学术 / 科研类

| 名称 | 类型 | 作用 | 评价 |
|------|------|------|------|
| **Academic Research Skills** | Skill 套件 | 科研全流程：找参考文献、格式化引用、验证数据、检查逻辑一致性、同行评议式追问；定位「AI 是副驾驶不是飞行员」 | 3.6w+ stars（Codex 版 5.6k），评审阶段类似 Grill Me 反复追问暴露论点漏洞，科研党强推 |

> 地址：[Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills) ｜ [Codex 原生版](https://github.com/Imbad0202/academic-research-skills-codex)

## 九、安全 / 防注入检测

### 9.1 Skill 安装前审计

| 名称 | 类型 | 作用 | 评价 |
|------|------|------|------|
| **SkillGuard** | Skill 扫描器 | 安装前扫描 AI agent skill，检测 prompt injection、数据外泄、恶意 payload | 专门针对 skill 文件的静态扫描器，装新 skill 前跑一遍 |
| **Skill-Sentinel** | Skill 扫描器 | 针对 `SKILL.md` 的安全扫描：恶意代码、prompt injection、数据外泄、供应链威胁 | SkillGuard 同类替代，规则集不同，可交叉验证 |

> 地址：[obielin/skillguard](https://github.com/obielin/skillguard) ｜ [EvolutionUnleashed/skill-sentinel](https://github.com/EvolutionUnleashed/skill-sentinel)

### 9.2 MCP / Agent 运行时与综合扫描

| 名称 | 类型 | 作用 | 评价 |
|------|------|------|------|
| **MCP Scanner（Cisco AI Defense）** | MCP 扫描器 | 扫描 MCP server 潜在威胁与安全发现 | 思科官方出品，近 1k stars，企业级可靠性有保障 |
| **Snyk Agent Scan** | Agent+MCP+Skill 扫描器 | 为 AI agent、MCP server、agent skill 提供一体化安全扫描 | 2.7k+ stars，Snyk 出品，一个工具覆盖 skill + mcp + agent |

> 地址：[cisco-ai-defense/mcp-scanner](https://github.com/cisco-ai-defense/mcp-scanner) ｜ [snyk/agent-scan](https://github.com/snyk/agent-scan)

## 十、MCP 端点速查

部分 MCP 提供可直接接入的远程端点：

```text
# 上下文与检索
Context7          https://mcp.context7.com/mcp
Exa Search        https://mcp.exa.ai/mcp

# 数据与平台
Supabase          https://mcp.supabase.com/mcp
Figma (Dev Mode)  https://mcp.com.figma.com/mcp
maton (聚合)       https://maton.ai/

# MCP 目录导航
mcp.directory     https://mcp.directory/
```

将 Skill 转 MCP 的通用方式（Exa 示例）：

```bash
npx -y @filiksyos/mcptoskill https://mcp.exa.ai/mcp --name=exa
```

## 十一、选型与实施建议

### 选型决策路径

1. **先判需求类型**：推理增强 → 一类；代码开发 → 二类；浏览器/自动化 → 三类；平台协作 → 四类；长期记忆 → 五类；审美/写作 → 六类；科研 → 七类。
2. **再判改动规模**：大模块完整开发优先 OpenSpec（spec 驱动）+ Superpowers（方法论框架）；小改动可头脑风暴后直写。
3. **代码范围控制**：凡修改既有代码，配合 Ponytail 约束改动范围，降低合并冲突风险。
4. **UI 质量兜底**：若 AI 生成 UI 偏“样板味”，叠加 Taste-Skill 或 UI/UX Pro Max。
5. **中文写作场景**：去 AI 味首选 qu-ai-wei；英文场景用 Humanizer。

### 安装与使用流程

```text
1. 选定工具 → 访问对应 GitHub 仓库
2. （Skill）将 SKILL.md 放入 Agent 的 skills 目录
   （MCP）在 Agent 配置中填入端点 URL 或按仓库说明本地启动
3. 安装前：用 SkillGuard / Skill-Sentinel 扫描 skill 文件
4. 运行时：用 Snyk Agent Scan 或 MCP Scanner 做综合安全扫描
5. 验证：在小任务上试跑，确认行为符合预期后再投入正式流程
```

### 安全须知

- **安装前必扫**：第三方 Skill/MCP 可能含 prompt injection、数据外泄、恶意 payload，务必先用扫描器过一遍。
- **交叉验证**：SkillGuard 与 Skill-Sentinel 规则集不同，两者交叉使用可提升检出率。
- **企业优先**：MCP/Agent 综合扫描优先选 Snyk Agent Scan（覆盖 skill+mcp+agent 一条龙）或思科 MCP Scanner。
- **移动端谨慎**：Android MCP Server 对低配模型易卡死，能用浏览器方案就不要用手机控制。

## 十二、重要结论

1. **Skill 与 MCP 的分工**：Skill 偏「能力/方法论封装」（让 AI 更专业），MCP 偏「外部资源接入」（让 AI 能用工具）；二者互补，复杂工作流常需组合使用。
2. **社区共识的“全家桶”**：Superpowers（主仓 100k+ stars）是覆盖开发全阶段的 skills 框架，新手可作起点按需取用。
3. **去 AI 味已成刚需**：UI 端（Taste-Skill 5.8w+、UI/UX Pro Max 10w+）与文案端（qu-ai-wei、Humanizer 2.7w+）均有现象级项目，反映社区对“AI 味”的强烈抵触。
4. **记忆与代码理解是高价值方向**：Mem0（6w+）与 GitNexus（4.3w+）解决 Agent「不长记性」「不懂代码库」两大痛点，是长期价值最高的基础设施。
5. **安全扫描必须前置**：随着 Skill/MCP 供应链风险显现，安装前扫描（SkillGuard）+ 运行时综合扫描（Snyk Agent Scan）应成为标准动作，而非可选项。
6. **国内协同场景**：飞书 Lark-CLI（官方开源、npm 一行安装、支持主流 AI 工具）是国内团队协作的刚需接入点。

---

> **备注**：本文档基于论坛帖（含社区多位用户推荐：xuanaixuan、Berton_Wang、chopin2077、Pachakutiq、Corgier、mjj7458、MagicMonkey、Shawn_Aaron、MuYukki、wxpp 等）整理。Star 数为抓取时数据，工具质量与维护状态请以仓库最新为准。
