---
title: Agent 框架补充篇：Coze / Semantic Kernel / MCP / Multi-Agent
date: 2026-07-16
category: ai
tags:
  - AI应用工程师
  - Agent
  - Multi-Agent
  - MCP
  - Coze
  - 学习路线
description: 对照 AI 市场全景 BI 报告的岗位工程能力雷达，补齐 Agent 框架专项指南未覆盖的 Coze、Semantic Kernel、MCP 协议、Multi-Agent 编排与 Tool Calling，并给出能力优先级与学习分配。
---

# Agent 框架补充篇：Coze / Semantic Kernel / MCP / Multi-Agent

> **定位**：本文是 [Agent 框架专项学习指南](/ai/learning-roadmap/agent-frameworks-guide) 的补充篇。原文已覆盖 LangChain / LangGraph / LlamaIndex / Dify / n8n / AutoGPT / CrewAI / AutoGen，本文只补缺口，不重复讲已覆盖的框架。
>
> **补充依据**：对照最新《AI 市场全景 BI 报告》的岗位数据，报告里高频出现但原文没展开的能力/工具主要有：Coze（扣子）、Semantic Kernel、MCP 协议、Multi-Agent（约 40% 岗位需要）、Tool Calling，以及一张"工程能力雷达图"。本文围绕这些缺口做细化。

---

## 目录

- [一、从 BI 报告读出的岗位信号](#一从-bi-报告读出的岗位信号)
- [二、工程能力雷达六维拆解](#二工程能力雷达六维拆解)
- [三、Coze（扣子）——字节可视化 Agent 平台](#三coze扣子字节可视化-agent-平台)
- [四、Semantic Kernel——微软企业级编排](#四semantic-kernel微软企业级编排)
- [五、MCP——模型上下文协议](#五mcp模型上下文协议)
- [六、Multi-Agent 编排深化](#六multi-agent-编排深化)
- [七、Tool Calling 深化](#七tool-calling-深化)
- [八、框架生态全景更新表](#八框架生态全景更新表)
- [九、面试补充题](#九面试补充题)
- [十、学习优先级与时间分配](#十学习优先级与时间分配)

---

## 一、从 BI 报告读出的岗位信号

BI 报告是对大量招聘数据做的市场画像，把它当成"市场在为哪些能力付费"的信号来读，比空想学什么更靠谱。几个关键信号：

| 信号 | 含义 | 对学习的指导 |
|---|---|---|
| Multi-Agent 约 40% 岗位需要 | 单 Agent 已不够，多智能体协作成主流需求 | 必须理解多 Agent 编排模式，能讲清取舍 |
| MCP 被频繁提及 | 工具/上下文接入正在走向标准协议 | 要理解 MCP 是什么、解决什么问题 |
| Tool Calling 成硬需求 | 工具调用是 Agent 的地基能力 | 吃透 Function Calling 原理和工程实践 |
| Coze / Dify 词云突出 | 可视化平台在企业侧渗透率高 | 至少了解 Coze，能和 Dify 对比 |
| 框架生态含 Semantic Kernel | 微软技术栈企业有需求 | 了解定位，不必深学 |
| LangChain 仍是最主流框架 | 代码开发型框架的基本盘 | 原文重点，继续以它为主线 |

报告里那张"工程能力雷达图"给了六个维度：**Multi-Agent、Tool Calling、RAG Engineering、Deployment、Prompt Engineering、Fine-tuning**。这六个维度基本就是一个 AI 应用工程师被考核的工程能力框架，下一节逐项拆。

---

## 二、工程能力雷达六维拆解

把雷达图的六个维度对应到"要学到什么水平 + 优先级 + 最小验收物"：

| 能力维度 | 要求水平 | 优先级 | 最小验收物 | 对应文档 |
|---|---|---|---|---|
| Tool Calling（工具调用） | 能定义工具、让模型可靠调用、处理错误恢复 | P0 | 一个能自动选工具的 Agent Demo | 本文第七节 + [agent 指南](/ai/learning-roadmap/agent-frameworks-guide) 3.2 |
| RAG Engineering（检索增强） | 能搭端到端可溯源知识库并优化 | P0 | 工业规程 RAG 作品 | [RAG 专项指南](/ai/learning-roadmap/rag-knowledge-base-guide) |
| Prompt Engineering（提示工程） | 能写稳定、可控、防幻觉的提示词 | P0 | 一套结构化 Prompt 模板 | [三月指南](/ai/learning-roadmap/ai-engineer-3month-guide) 第 5 周 |
| Deployment（部署） | 能把模型/应用封装成 API 并容器化 | P0 | FastAPI + Docker 服务 | [三月指南](/ai/learning-roadmap/ai-engineer-3month-guide) 第 3~4 周 |
| Multi-Agent（多智能体） | 理解编排模式，能选型和讲清取舍 | P1 | 一个多 Agent 协作 Demo | 本文第六节 |
| Fine-tuning（微调） | 理解何时用、LoRA 概念，不必精通 | P2 | 能讲清微调 vs RAG 的取舍 | 本文本节下方 |

关于 **Fine-tuning**：雷达图里它是六维之一，但对 AI 应用工程师（尤其工业落地方向）它是最低优先级。原因是大多数企业需求用 RAG + Prompt 就能解决，微调需要算力和标注数据、更新慢。你需要掌握的是"判断力"而非"实操"：知道微调适合改变模型的表达风格/领域语言习惯，而知识更新和事实问答用 RAG。了解 LoRA/QLoRA 是低成本微调方案即可，前 3 个月不建议深挖（和 [01-岗位拆解](/ai/learning-roadmap/01-岗位技能与要求拆解) "不建议一开始深学的内容"一致）。

**这六维怎么用**：把它当成自检清单。P0 四项（Tool Calling / RAG / Prompt / Deployment）必须都有可展示的作品，P1 的 Multi-Agent 要能讲清楚，P2 的 Fine-tuning 会判断取舍即可。

---

## 三、Coze（扣子）——字节可视化 Agent 平台

### 3.1 Coze 是什么

Coze（中文名"扣子"）是字节跳动推出的可视化 AI 智能体（Bot）开发平台。定位和 Dify 相近——通过拖拽和配置，无需写代码就能构建聊天机器人、工作流、智能体，并一键发布到飞书、微信、网页等渠道。它内置了插件市场、知识库、工作流、多轮对话记忆等能力。

### 3.2 与 Dify 的对比

| 维度 | Coze（扣子） | Dify |
|---|---|---|
| 出品方 | 字节跳动 | 开源社区 |
| 部署 | 主要是云端 SaaS（有国内/海外版） | 开源，可私有化 Docker 部署 |
| 强项 | 插件生态、发布渠道多、开箱即用 | 开源可控、可私有化、工作流灵活 |
| 私有化 | 弱（SaaS 为主） | 强（自托管） |
| 适合 | 快速做面向 C 端/办公渠道的 Bot | 企业私有化、自主可控的 AI 应用 |

一句话选型：要快速做个能发到飞书/微信的智能体、且不介意用云服务，选 Coze；要私有化部署、数据不出内网（工业场景常见），选 Dify。

### 3.3 岗位相关与学习建议

工业场景更看重私有化和数据安全，所以生产上 Dify 比 Coze 更常用。但 Coze 在词云里很突出，说明市场认知度高，你至少要了解它的定位，面试被问到能对比 Coze / Dify / LangChain 三者的取舍。学习投入：注册体验一次，做一个简单 Bot，1 小时即可，重点是理解定位而非深用。

---

## 四、Semantic Kernel——微软企业级编排

### 4.1 Semantic Kernel 是什么

Semantic Kernel（简称 SK）是微软开源的 LLM 应用编排框架，支持 C#、Python、Java。它的核心概念是把提示词函数（Semantic Function）和原生代码函数（Native Function）统一封装成"插件（Plugin/Skill）"，再由 Planner 自动编排调用顺序完成复杂任务。设计上很贴合微软/.NET 企业技术栈。

### 4.2 与 LangChain 的定位差异

| 维度 | Semantic Kernel | LangChain |
|---|---|---|
| 主推语言 | C# / .NET（也支持 Python/Java） | Python（也有 JS） |
| 企业定位 | 深度绑定 Azure / 微软生态 | 生态中立、社区最大 |
| 核心抽象 | Plugin + Planner | Chain / Agent / LCEL |
| 适合场景 | .NET 企业、已在用 Azure | 通用 LLM 应用、Python 团队 |

### 4.3 学习建议

对以 Python 为主的 AI 应用工程师，SK 是"了解即可"的框架，除非目标企业是 .NET/Azure 技术栈。花 30 分钟读懂它的 Plugin + Planner 思路，面试能说出"SK 是微软的 LLM 编排框架，插件化 + Planner 自动编排，适合 .NET/Azure 企业，Python 团队一般还是用 LangChain"即可。

---

## 五、MCP——模型上下文协议

### 5.1 MCP 是什么

MCP（Model Context Protocol，模型上下文协议）是 Anthropic 于 2024 年提出的开放协议，用来标准化"大模型/Agent 如何接入外部工具和数据源"。可以把它类比为"AI 工具接入界的 USB-C 接口"——以前每个工具、每个数据源都要为每个 Agent 框架单独写一套对接，MCP 定义了统一的协议，工具方只要实现一次 MCP Server，任何支持 MCP 的客户端（Claude Desktop、各类 IDE、Agent 框架）都能直接接入。

### 5.2 解决什么问题

没有 MCP 时：工具接入是 M×N 的问题——M 个 Agent 框架 × N 个工具，各写各的。有了 MCP：变成 M+N——工具实现一次 MCP Server，框架实现一次 MCP Client，双方即可互通。

它定义了三类核心能力：

| MCP 能力 | 作用 |
|---|---|
| Tools（工具） | 供模型调用的可执行函数 |
| Resources（资源） | 供模型读取的数据（文件、数据库记录等） |
| Prompts（提示模板） | 可复用的提示词模板 |

通信上支持 stdio（本地进程）和 SSE/HTTP（远程）两种传输方式。

### 5.3 与 Tool Calling 的关系

Tool Calling 是模型层面的能力（模型决定调哪个函数、传什么参数）；MCP 是工具接入层面的协议（工具怎么被标准化地注册和暴露给模型）。两者是互补的：MCP 负责把外部工具标准化地"接进来"，Tool Calling 负责让模型"用起来"。

### 5.4 生产实践参照

[生产级 Agent 平台架构全景](/ai/applications/nexbot-architecture-guide) 就把 MCP 作为工具来源之一：它的 `DynamicToolLoader` 统一注入 API / Skill / Script / MCP / 内置工具等多种来源（3.7 节），并有 `MCPDiscoveryService` 负责 MCP server 的工具发现（stdio/sse），`AgentState` 里还专门维护 `loaded_mcp_tools` 和 `loaded_mcp_tool_usage`。这说明 MCP 已经进入生产级 Agent 平台的工具体系。面试能结合这个例子讲，很加分。

### 5.5 学习建议

花 1~2 小时：读一遍 MCP 官方文档，理解 Client/Server 模型和 Tools/Resources/Prompts 三类能力；有条件的话在 Claude Desktop 或某个 IDE 里接一个现成的 MCP Server（如文件系统 Server）体验一次。重点是能讲清"MCP 解决工具接入标准化问题，是 M×N 到 M+N 的转变"。

---

## 六、Multi-Agent 编排深化

BI 报告显示约 40% 岗位需要 Multi-Agent，这是原文没有系统展开的重点，这里补齐。

### 6.1 为什么要多 Agent

单 Agent（一个模型 + 一堆工具）在任务复杂时会力不从心：上下文太长、职责不清、容易跑偏。多 Agent 的思路是"分而治之"——把复杂任务拆给多个各有专长的 Agent，通过某种编排方式协作。好处是职责清晰、每个 Agent 上下文更聚焦、可分别优化；代价是编排复杂度和 Token 成本上升。

### 6.2 三种主流编排模式

| 模式 | 机制 | 代表框架 | 适合场景 |
|---|---|---|---|
| Supervisor（主管调度） | 一个主管 Agent 决定把子任务派给哪个专家 Agent | LangGraph、AutoGen GroupChat | 有明确调度中枢的任务 |
| Handoff（交接） | Agent 之间按需把对话"移交"给更合适的 Agent | Swarm 类设计 | 客服分流、领域切换 |
| Role-based（角色分工） | 预设角色/目标/背景，按流程顺序或层级协作 | CrewAI | 流程明确的团队型任务 |

### 6.3 各框架的多 Agent 做法对照

- **CrewAI**：角色化分工（Role/Goal/Backstory），像模拟一个团队，顺序或层级协作。适合流程清晰的任务。（原文第九节已详述）
- **AutoGen**：对话式协作，多个 Agent 组成 GroupChat 由 Manager 调度发言，擅长"写代码-执行-调试"循环。（原文第十节已详述）
- **LangGraph**：用图节点自定义多 Agent，最灵活也最底层，可实现 Supervisor 等任意拓扑。（原文第四节）
- **Nexbot Agent OS**：更完整的多专家协作运行时，有 Mission / Job / Mailbox / Blackboard 等对象（见 [架构全景](/ai/applications/nexbot-architecture-guide) 5.4 节），是生产级多 Agent 的参考实现。

### 6.4 选型思路

- 角色分工明确、流程固定 → CrewAI。
- 需要代码执行、Agent 间反复对话 → AutoGen。
- 要精细控制流程、自定义拓扑、要 HITL → LangGraph。
- 只是简单任务 → 别上多 Agent，单 Agent + 工具更省心。

一个重要判断：**不要为了用多 Agent 而用多 Agent**。多 Agent 增加成本和不确定性，只有当单 Agent 确实扛不住（职责冲突、上下文爆炸）时才拆。面试讲得出这个"克制"的判断，比堆框架名词更显成熟。

---

## 七、Tool Calling 深化

Tool Calling 是雷达图 P0 能力，也是 Agent 的地基，值得单独讲透。

### 7.1 Function Calling 原理

Function Calling 是 OpenAI 等模型的原生能力：你在请求里用 JSON Schema 声明可用函数（名称、描述、参数），模型在需要时不直接答话，而是返回一个"调用指令"（要调哪个函数、参数是什么）。你的程序执行这个函数，把结果回填给模型，模型再据此继续。这就是 Agent Tool Use 的底层机制——LangChain 的 Tool、MCP 的 Tools 最终都落到这套 Function Calling 上。

### 7.2 让模型可靠调用工具的工程要点

| 要点 | 做法 |
|---|---|
| 工具命名 | 名字要语义清晰（模型按名字匹配意图） |
| 描述（description） | 明确写"什么时候用这个工具"，这是模型决策的主要依据 |
| 参数 schema | 用 Pydantic 定义并给每个字段写 description |
| 工具数量 | 别一次塞几十个工具，太多会降低选择准确率，按场景过滤 |
| 错误恢复 | 工具内部 try-except，返回可读错误信息，让模型能重试或换路 |
| 并行调用 | 新模型支持一次返回多个工具调用，注意结果按 id 对齐回填 |

### 7.3 和 MCP 的衔接

前面说过：MCP 负责把工具标准化地接进来，Tool Calling 负责让模型用起来。工程上一个成熟做法（如 Nexbot 的 `DynamicToolLoader`）是：统一收集 API/Skill/Script/MCP/内置等多来源工具 → 转成统一的工具 schema → 按权限和入口点过滤 → 注入给模型做 Function Calling。理解这条链路，就理解了生产级 Agent 的工具系统。

---

## 八、框架生态全景更新表

在原文第二节"框架全景"基础上，补入本文新增的条目：

| 框架 / 协议 | 类型 | 学习优先级 | 本文/原文位置 |
|---|---|---|---|
| LangChain | 代码开发框架 | P0 必学 | 原文三 |
| LangGraph | 有状态图编排 | P1 加分 | 原文四 |
| LlamaIndex | RAG 专精 | P1 加分 | 原文五 + [RAG 专项](/ai/learning-roadmap/rag-knowledge-base-guide) |
| Dify | 可视化开源平台 | P1 加分 | 原文六 |
| n8n | 工作流自动化 | P2 了解 | 原文七 |
| CrewAI / AutoGen | 多 Agent 协作 | P1~P2 | 原文九、十 + 本文六 |
| AutoGPT / MetaGPT | 自主 Agent | P2~P3 | 原文八 |
| **Coze（扣子）** | 可视化 Agent 平台 | P2 了解 | **本文三** |
| **Semantic Kernel** | 微软企业级编排 | P3 了解 | **本文四** |
| **MCP 协议** | 工具接入标准协议 | P1 加分 | **本文五** |

---

## 九、面试补充题

**Q1：什么是 Multi-Agent？什么时候该用多 Agent 而不是单 Agent？**

多 Agent 是用多个各有专长的 Agent 协作完成复杂任务。当单 Agent 出现职责冲突、上下文过长、容易跑偏时才拆成多 Agent。编排模式主要有 Supervisor（主管调度）、Handoff（交接）、Role-based（角色分工）。但要克制——多 Agent 增加成本和不确定性，简单任务用单 Agent + 工具更好。

**Q2：MCP 是什么？解决了什么问题？**

MCP 是 Anthropic 提出的模型上下文协议，标准化大模型/Agent 接入外部工具和数据的方式。它把工具接入从 M×N（每个框架对接每个工具）变成 M+N（工具实现一次 Server，框架实现一次 Client）。定义 Tools/Resources/Prompts 三类能力，支持 stdio 和 SSE 传输。

**Q3：MCP 和 Function Calling 有什么关系？**

Function Calling 是模型层能力（模型决定调什么函数），MCP 是工具接入层协议（工具怎么被标准化暴露）。互补关系：MCP 把工具接进来，Function Calling 让模型用起来。

**Q4：Coze、Dify、LangChain 怎么选？**

看使用者和场景。工程师做生产、要私有化和定制 → LangChain（代码可控）；企业要私有化的可视化平台 → Dify（开源自托管）；快速做能发到飞书/微信的 Bot、可用云服务 → Coze。工业场景重私有化，生产多用 Dify + LangChain。

**Q5：Semantic Kernel 和 LangChain 的区别？**

SK 是微软的 LLM 编排框架，主推 C#/.NET、深绑 Azure，核心是 Plugin + Planner；LangChain 生态中立、以 Python 为主、社区最大。.NET/Azure 企业用 SK，Python 团队一般用 LangChain。

**Q6：AI 应用工程师的工程能力包括哪些？（结合雷达图）**

六个维度：Tool Calling、RAG Engineering、Prompt Engineering、Deployment 是 P0（都要有作品），Multi-Agent 是 P1（要能讲清编排取舍），Fine-tuning 是 P2（会判断微调 vs RAG 的取舍即可，不必精通）。

---

## 十、学习优先级与时间分配

在原文学习路线（LangChain → LlamaIndex → Dify → LangGraph → 其余浏览）基础上，把本文新增内容插进去：

| 内容 | 优先级 | 建议投入 | 时机 |
|---|---|---|---|
| Tool Calling 吃透（含 Function Calling） | P0 | 3~4 小时 | 学 LangChain Agent 时 |
| MCP 理解 + 接一个 Server 体验 | P1 | 1~2 小时 | 学完工具系统后 |
| Multi-Agent 编排模式理解 | P1 | 2~3 小时 | 学完 CrewAI/AutoGen 后 |
| Coze 体验 + 对比 Dify | P2 | 1 小时 | 面试前 |
| Semantic Kernel 了解定位 | P3 | 30 分钟 | 面试前浏览 |
| Fine-tuning 取舍判断（LoRA 概念） | P2 | 1 小时 | 有余力再看 |

> **总结**：BI 报告的信号很明确——市场在为 Multi-Agent、MCP、Tool Calling 这些工程能力付费。对照那张六维雷达图自检：P0 四项（Tool Calling / RAG / Prompt / Deployment）必须有作品，Multi-Agent 要能讲清编排取舍，Fine-tuning 会判断即可。框架上以 LangChain 为主线，补 Coze / Semantic Kernel / MCP 的认知，再结合 Nexbot 的生产级实践，就能覆盖岗位对 Agent 工程能力的完整要求。
