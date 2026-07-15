---
title: Agent 框架专项学习指南
date: 2026-07-06
category: ai
tags:
  - AI应用工程师
  - Agent
  - LangChain
  - LangGraph
  - 学习路线
---

# Agent 框架专项学习指南

> **定位**：面试加分项专项突破。针对岗位要求中的"Dify/n8n 工作流工具或 Agent 框架"加分项，以及 LangChain/LlamaIndex 核心要求，系统梳理主流 Agent 框架的原理、选型和实战。
>
> **与三月学习指南的关系**：本文档是第 6-8 周内容的扩展和深化，侧重框架对比、原理理解和面试准备，而非从零教学。建议在学习指南第 6 周开始 LangChain 后配合阅读。

---

## 目录

- [一、为什么要学 Agent 框架](#一为什么要学-agent-框架)
- [二、框架全景与学习优先级](#二框架全景与学习优先级)
- [三、LangChain —— 必须掌握](#三langchain--必须掌握)
- [四、LangGraph —— 进阶加分](#四langgraph--进阶加分)
- [五、LlamaIndex —— RAG 专精](#五llamaindex--rag-专精)
- [六、Dify —— 可视化 AI 应用开发](#六dify--可视化-ai-应用开发)
- [七、n8n —— 工作流自动化](#七n8n--工作流自动化)
- [八、AutoGPT —— 自主 Agent 先驱](#八autogpt--自主-agent-先驱)
- [九、CrewAI —— 多 Agent 协作](#九crewai--多-agent-协作)
- [十、AutoGen —— 微软多 Agent 对话](#十autogen--微软多-agent-对话)
- [十一、框架选型决策树](#十一框架选型决策树)
- [十二、面试高频问题与参考答案](#十二面试高频问题与参考答案)

---

## 一、为什么要学 Agent 框架

在理解 Agent 框架之前，先要理解什么是 Agent，以及它和普通 LLM 调用的区别。

普通的 LLM 调用是"一问一答"：你给模型一个 Prompt，模型返回一段文本。这种方式适合简单问答，但有明显局限——模型不能查数据库、不能执行代码、不能上网搜索、不能调用外部 API。

Agent 的核心思想是赋予 LLM"自主决策和行动"的能力。一个 Agent 的运行循环是：感知（接收用户输入）→ 规划（模型决定下一步做什么）→ 行动（调用工具执行）→ 观察（获取工具返回结果）→ 再规划（根据结果决定下一步）。这个循环就是著名的 ReAct（Reasoning + Acting）模式。

Agent 框架就是帮你实现这个循环的基础设施。不用框架，你需要自己写 Prompt 模板、管理对话历史、解析模型输出中的工具调用指令、执行工具、把结果拼回 Prompt——这些是高度重复的工程工作。框架把这些抽象为标准接口，让你专注于业务逻辑。

在岗位要求中，Agent 框架出现在两个地方：一是核心要求的"LangChain/LlamaIndex/RAG 开发"，二是加分项的"Dify/n8n 工作流工具或 Agent 框架"。面试官问"你用过什么 Agent 框架"时，能说出 LangChain 的实战经验是基本要求，能对比 Dify、AutoGPT、CrewAI 等框架的优劣则是明显加分。

---

## 二、框架全景与学习优先级

当前主流 Agent 框架可以分成三类：

**代码开发型框架**——通过编写 Python 代码构建 Agent，灵活度高，适合工程师。

| 框架 | 定位 | 学习优先级 | 岗位相关度 |
|------|------|-----------|-----------|
| LangChain | 通用 LLM 应用开发框架 | P0 必学 | 直接要求 |
| LangGraph | 有状态多步骤 Agent 图编排 | P1 加分 | Nexbot 项目使用 |
| LlamaIndex | RAG 专精框架 | P1 加分 | 直接要求 |
| CrewAI | 多 Agent 角色协作 | P2 了解 | 面试对比加分 |
| AutoGen | 微软多 Agent 对话 | P2 了解 | 面试对比加分 |

**可视化开发型平台**——通过拖拽节点构建 AI 应用，适合非技术人员或快速原型。

| 框架 | 定位 | 学习优先级 | 岗位相关度 |
|------|------|-----------|-----------|
| Dify | 可视化 AI 应用开发平台 | P1 加分 | 直接加分项 |
| n8n | 通用工作流自动化（支持 AI 节点） | P2 了解 | 直接加分项 |

**自主 Agent 型**——给定一个高层目标，Agent 自主分解任务、循环执行直到完成。

| 框架 | 定位 | 学习优先级 | 岗位相关度 |
|------|------|-----------|-----------|
| AutoGPT | 最早的开源自主 Agent | P2 了解概念 | 面试概念加分 |
| MetaGPT | 多角色软件团队模拟 | P3 选读 | 扩展视野 |

**建议学习路线**：LangChain（第 6 周）→ LlamaIndex（第 7 周配合 RAG）→ Dify（第 8 周）→ LangGraph（概念了解，配合 Nexbot 项目）→ 其余框架（面试前快速浏览概念）。

---

## 三、LangChain —— 必须掌握

### 3.1 LangChain 是什么

LangChain 是目前最流行的 LLM 应用开发框架，由 Harrison Chase 在 2022 年 10 月创建。它的设计理念是"把 LLM 应用拆解为可组合的模块"，让你像搭积木一样构建 AI 应用。

LangChain 生态包含三部分：LangChain（核心库）、LangGraph（有状态图编排，后面单独讲）、LangSmith（可观测和调试平台）。岗位要求中的"LangChain 开发经验"主要指核心库。

### 3.2 核心概念

**Model I/O（模型输入输出）**

这是与 LLM 交互的基础层。包含三个组件：

`ChatModel` 是对话模型的封装，接收一系列消息（SystemMessage / HumanMessage / AIMessage）并返回 AI 回复。常用的是 `ChatOpenAI`（兼容 OpenAI 接口，包括 Qwen/DeepSeek 等）。`PromptTemplate` 是提示词模板，支持变量插值；`ChatPromptTemplate` 是对话模板，由 `from_messages()` 构建，可以混合 System/Human/AI 消息。`OutputParser` 负责把模型的文本输出解析为结构化数据，如 `StrOutputParser`（直接返回字符串）、`JsonOutputParser`（解析 JSON）、`PydanticOutputParser`（解析为 Pydantic 模型）。

**LCEL（LangChain Expression Language）**

LangChain 的链式调用语法，用管道符 `|` 连接组件。例如：

```python
chain = prompt | model | output_parser
result = chain.invoke({"question": "什么是预测性维护？"})
```

LCEL 的设计灵感来自 Unix 管道——每个组件接收上一个组件的输出，处理后传给下一个。核心接口是 `Runnable`，所有 LCEL 组件都实现了这个接口。`RunnablePassthrough` 直接传递输入，`RunnableParallel` 并行执行多个组件，`RunnableLambda` 把任意函数包装为 Runnable。

LCEL 的优势在于：支持流式输出（stream）、异步执行（ainvoke）、批处理（batch）、自动重试和回退。

**Memory（对话记忆）**

让 Agent 记住之前的对话。主要类型：

`ConversationBufferMemory` 直接保存全部对话历史，简单但 Token 消耗线性增长。`ConversationSummaryMemory` 用 LLM 把旧对话总结为摘要，节省 Token 但有信息损失。`ConversationBufferWindowMemory` 只保留最近 N 轮对话，兼顾效果和成本。`ConversationSummaryBufferMemory` 混合策略——近期对话保留原文，旧对话总结为摘要。

**Tools & Agent（工具与智能体）**

`Tool` 是 Agent 可以调用的外部能力。定义方式有三种：`@tool` 装饰器（最简单）、`StructuredTool.from_function`（更灵活）、`BaseTool` 子类（最定制化）。每个 Tool 有 name、description、args_schema 三个关键属性——模型根据这些信息决定何时调用哪个工具。

`AgentExecutor` 是 Agent 的运行时，负责执行 ReAct 循环：模型决策 → 调用工具 → 观察结果 → 再决策。它管理最大迭代次数、错误处理、提前终止等。

LangChain 支持多种 Agent 类型：`ReAct`（经典推理-行动模式）、`OpenAI Tools`（利用 OpenAI Function Calling）、`OpenAI Functions`（旧版函数调用）、`Structured Chat`（支持多参数工具）。

**Retrieval（检索）**

RAG 的核心组件。`DocumentLoader` 加载文档（PDF/Word/HTML/Markdown），`TextSplitter` 切分文档，`Embedding` 将文本向量化，`VectorStore` 存储和检索向量，`Retriever` 是检索接口的抽象。

### 3.3 实战要点

**工具定义的最佳实践**：工具的 name 要简洁（模型按名字匹配），description 要清晰说明"什么时候用这个工具"（模型按描述决策），args_schema 用 Pydantic 定义并加 field description（模型按 schema 构造参数）。

```python
from langchain.tools import tool
from pydantic import BaseModel, Field

class SensorQueryInput(BaseModel):
    sensor_id: str = Field(description="传感器编号，如 TEMP_001")
    start_time: str = Field(description="查询起始时间，ISO 8601 格式")

@tool("query_sensor_data", args_schema=SensorQueryInput)
def query_sensor_data(sensor_id: str, start_time: str) -> str:
    """查询指定传感器在特定时间段内的读数数据。当用户询问传感器历史数据或实时数值时使用此工具。"""
    # 实际实现
    return f"传感器 {sensor_id} 从 {start_time} 起的数据: ..."
```

**Agent 调试技巧**：开启 `return_intermediate_steps=True` 查看 Agent 的每步推理和工具调用；用 `langchain.debug = True` 打开详细日志；用 LangSmith 平台可视化 Agent 执行轨迹。

**生产环境注意事项**：`AgentExecutor` 的 `max_iterations` 必须设置（默认 15 可能不够或太多）；工具执行错误要 try-except 并返回友好错误信息（让 Agent 能从错误中恢复）；对话 Memory 在长对话中要注意 Token 限制。

### 3.4 与 Nexbot 项目的对照

你研究的 Nexbot 项目虽然用的是 LangGraph 而非 LangChain 核心 Agent，但工具管理和模型调用的思路完全相通。Nexbot 的 `DynamicToolLoader`（见架构文档 3.7 节）就相当于 LangChain 的 Tool 注册中心，`ToolExecutor` 相当于 `AgentExecutor` 的工具执行部分，`AgentState.loaded_skills` 类似 LangChain 的 Memory。

面试时可以说："我研究过一个生产级 Agent 平台的工具系统设计，理解工具注册、动态加载、按权限过滤、按入口点过滤等工程实践，这些和 LangChain 的 Tool/Agent 概念是相通的。"

---

## 四、LangGraph —— 进阶加分

### 4.1 LangGraph 是什么

LangGraph 是 LangChain 团队推出的有状态图编排框架，专门解决复杂 Agent 工作流的问题。LangChain 的 AgentExecutor 是"黑盒循环"——你不好控制每一步的行为；LangGraph 把 Agent 拆解为显式的有向图，每个节点是一个函数，边是条件路由，你可以精确控制执行流程。

### 4.2 核心概念

`StateGraph` 是 LangGraph 的核心图类。你定义一个 `State`（TypedDict），包含所有需要在节点间传递的状态字段。每个节点函数接收 State，返回 State 的更新部分（diff）。`add_messages` 和 `operator.add` 是内置的 reducer，分别用于消息追加和列表追加。

节点是普通的 Python 函数，签名为 `def node_name(state: State) -> dict:`。边有两种：固定边（`add_edge`，从 A 到 B）和条件边（`add_conditional_edges`，根据 State 动态选择下一个节点）。

`interrupt_before` 机制允许在指定节点前暂停执行，等待外部输入后恢复——这是人机交互（HITL）的实现方式。

### 4.3 Nexbot 项目的 LangGraph 实践

Nexbot 是 LangGraph 生产级实践的绝佳案例。回顾你的架构文档 3.5 节：

Nexbot 的图拓扑是 `START → resume_entry → oracle → router → {action | terminal | END} → post_tool_router → {oracle | END}`。

三个核心节点各有职责：`oracle` 是模型决策节点，流式输出推理和内容；`action` 是普通工具执行节点；`terminal` 是沙箱终端命令执行节点。

两个路由函数控制流程：`router` 根据 AIMessage 的 tool_calls 选择执行路径；`post_tool_router` 根据"工具结果续接"语义决定回模型还是结束。

`interrupt_before_tools=True` 实现参数采集卡片——模型调 `card_render_tool` 渲染表单，图暂停，前端展示表单，用户提交后恢复。

`AgentState` 的 `runtime_events` 用 `operator.add` reducer 聚合事件流，`messages` 用 `add_messages` 智能合并消息，`pending_forms` 管理待处理表单。

面试时可以深入讲："我研究过 LangGraph 在生产项目中的使用。它用 StateGraph 把 Agent 的执行流程显式化，比 AgentExecutor 的黑盒循环更可控。特别是条件路由和 interrupt 机制，让复杂的 HITL 交互变得可实现。"

---

## 五、LlamaIndex —— RAG 专精

### 5.1 LlamaIndex 是什么

LlamaIndex（原名 GPT Index）是 Jerry Liu 创建的专注于数据连接和 RAG 的框架。如果说 LangChain 是"通用 LLM 工具箱"，LlamaIndex 就是"RAG 专精工具"。

### 5.2 与 LangChain 的区别

LangChain 更通用，覆盖 Agent、Chain、Memory、Tools 等全场景，但 RAG 部分相对简单。LlamaIndex 在 RAG 方面更深入，提供了更多高级检索策略（句子级检索、自动合并检索、递归检索）、更多数据连接器（LlamaHub 有数百个 loader）、更完善的 Index 类型（VectorStoreIndex、SummaryIndex、KnowledgeGraphIndex）。

实际项目中，两者经常配合使用：用 LangChain 做 Agent 编排，用 LlamaIndex 做 RAG 检索。LangChain 也支持集成 LlamaIndex 的 Retriever。

### 5.3 核心概念

`Document` 和 `Node` 是数据的基本单元。Document 是完整文档，Node 是切分后的片段。`Index` 是数据的索引结构，不同 Index 支持不同检索策略。`QueryEngine` 是查询引擎，封装了"检索 + 生成"流程。`ResponseSynthesizer` 控制如何把检索结果和用户问题组合成最终 Prompt。

### 5.4 学习建议

LlamaIndex 的学习应该配合第 7 周 RAG 学习一起进行。重点是理解它的 `VectorStoreIndex` 和 `QueryEngine`，以及与 LangChain Retriever 的集成方式。不需要花太多时间单独学 LlamaIndex，了解它的定位和核心 API 即可。

---

## 六、Dify —— 可视化 AI 应用开发

### 6.1 Dify 是什么

Dify 是一个开源的 LLM 应用开发平台，由开源社区创建。它的核心价值是"让非技术人员也能构建 AI 应用"——通过可视化拖拽的方式编排 Prompt、工具、知识库，无需写代码就能创建聊天机器人、工作流、Agent。

### 6.2 核心概念

Dify 有三种应用类型：聊天助手（对话型，类似 ChatGPT）、文本生成（单次生成，如翻译/摘要）、Agent（自主工具调用）。还有工作流模式——通过拖拽节点编排多步骤 AI 流程，每个节点可以是 LLM 调用、知识库检索、条件分支、HTTP 请求、代码执行等。

知识库管理是 Dify 的强项——支持上传文档自动切分、向量化、多种检索策略，可视化管理知识库。

### 6.3 与代码开发的对比

Dify 的优势是快速原型、非技术人员可参与、可视化调试、内置运营管理。劣势是灵活性受限、难以做复杂的条件逻辑、版本管理不如代码、定制化需要写插件。

实际工作中的选择策略：快速验证概念用 Dify，生产级复杂逻辑用 LangChain 代码开发。面试时说"我会根据场景选择——快速原型和业务人员自助用 Dify，复杂逻辑和生产部署用 LangChain"会很有说服力。

### 6.4 学习建议

花 2-3 小时实操即可。注册 Dify Cloud 或本地 Docker 部署，创建一个工作流应用（输入传感器数据 → LLM 分析 → 输出诊断报告），体验可视化编排的流程。重点理解 Dify 的定位和适用场景，不需要深入。

### 6.5 岗位相关

岗位加分项明确提到"Dify/n8n 工作流工具"。在工业场景中，Dify 适合让工艺工程师（非技术人员）自己构建简单的 AI 辅助工具，比如设备故障查询助手。你可以说"我了解 Dify 的定位，在工业场景中可以用它让工艺工程师自助构建知识查询应用，降低 AI 使用门槛"。

---

## 七、n8n —— 工作流自动化

### 7.1 n8n 是什么

n8n 是一个开源的工作流自动化工具，类似 Zapier/Make 的自托管替代品。它不是专门的 AI 框架，但通过 AI 节点（LangChain 集成）支持构建 AI 驱动的自动化工作流。

### 7.2 与 Dify 的区别

Dify 专注 AI 应用开发，所有节点都围绕 LLM。n8n 是通用自动化平台，AI 只是其中一个能力——它更擅长连接各种系统（数据库、邮件、Slack、API 等），把 AI 嵌入到端到端自动化流程中。

举例：n8n 的典型场景是"定时从 MES 系统取设备数据 → 调用 LLM 分析异常 → 发送钉钉通知 → 把结果写入数据库"。这种跨系统编排是 Dify 不擅长的。

### 7.3 学习建议

花 1-2 小时了解即可。安装 n8n 或试用 Cloud 版，创建一个简单工作流（定时触发 → HTTP 请求 → LLM 节点 → 输出）。重点理解 n8n 在工业自动化场景中的价值——连接工业系统和 AI 能力。

### 7.4 岗位相关

面试时说"我了解 n8n 在工业场景中的作用——它擅长跨系统编排，可以把 AI 分析嵌入到从 DCS/MES 取数据到发送通知的完整自动化流程中。Dify 更专注 AI 应用本身，n8n 更专注系统间自动化"。

---

## 八、AutoGPT —— 自主 Agent 先驱

### 8.1 AutoGPT 是什么

AutoGPT 是 2023 年 3 月由 Toran Bruce Richards 发布的开源项目，是最早引爆"自主 Agent"概念的项目。给它一个高层目标（如"研究新能源汽车市场并写一份报告"），它会自主分解任务、上网搜索、保存文件、循环执行直到完成。

### 8.2 核心机制

AutoGPT 的运行循环是：读取目标 → 用 LLM 生成下一步"想法"（thought）→ 生成"推理"（reasoning）→ 生成"计划"（plan）→ 选择"行动"（action，如搜索/写文件/执行代码）→ 执行并获取"观察"（observation）→ 回到第一步。这正是 ReAct 模式的完整实现。

AutoGPT 的关键设计包括：长期记忆（用向量数据库存储历史交互）、文件系统（Agent 可以读写文件）、互联网访问（搜索和网页抓取）、预算控制（限制 Token 消耗）。

### 8.3 局限与演进

AutoGPT 的主要问题是：容易"跑偏"（目标分解不合理导致无限循环）、Token 消耗大、任务完成质量不稳定。它更适合演示概念而非生产使用。

AutoGPT 后续演进了 AutoGPT Forge（更模块化的框架）和 AutoGPT Platform（可视化平台）。但对面试来说，了解原始 AutoGPT 的 ReAct 循环概念即可。

### 8.4 面试定位

面试不太可能深入问 AutoGPT 的实现细节，但可能问"你了解哪些 Agent 框架"。提到 AutoGPT 并能说出它的 ReAct 循环和局限性，展示你对 Agent 领域有广泛了解。

---

## 九、CrewAI —— 多 Agent 角色协作

### 9.1 CrewAI 是什么

CrewAI 是 Joao Moura 创建的多 Agent 协作框架。它的核心思想是"模拟人类团队"——你定义多个有不同角色（Role）、目标（Goal）、背景故事（Backstory）的 Agent，它们像团队成员一样分工协作完成任务。

### 9.2 核心概念

`Agent` 有角色、目标、背景故事、工具集。`Task` 是具体任务，有描述和负责的 Agent。`Crew` 是团队，包含多个 Agent 和 Task，定义协作模式（sequential 顺序执行或 hierarchical 层级管理）。

典型示例：构建一个"市场研究团队"——研究员 Agent 负责收集数据、分析师 Agent 负责分析趋势、作家 Agent 负责写报告。每个 Agent 有不同的工具和 Prompt。

### 9.3 与其他框架的对比

LangChain 的 Agent 是"单兵作战"——一个 Agent 调用多个工具。CrewAI 是"团队协作"——多个 Agent 各有分工。LangGraph 也能做多 Agent（通过图节点），但更底层、更灵活。Nexbot 的 Agent OS（见架构文档 5.4 节）则是更完整的多专家协作运行时，有 Mission/Job/Mailbox/Blackboard 等丰富对象。

### 9.4 学习建议

花 1 小时阅读 CrewAI 文档和示例即可，不需要实操。重点理解"角色化 Agent"的设计思路，面试时能对比"单 Agent 多工具 vs 多 Agent 分工协作"两种模式。

---

## 十、AutoGen —— 微软多 Agent 对话

### 10.1 AutoGen 是什么

微软研究院开发的多 Agent 对话框架。核心特点是 Agent 之间通过"对话"协作——一个 Agent 发消息，另一个 Agent 接收并回复，循环直到任务完成。

### 10.2 核心概念

`AssistantAgent` 是 AI Agent，`UserProxyAgent` 是人类代理（可以自动执行代码、调函数）。多个 Agent 可以组成 GroupChat，由 GroupChatManager 管理对话轮次和发言顺序。

典型场景：UserProxy 执行代码 → Assistant 发现代码有错 → 提出修改 → UserProxy 重新执行 → 循环直到代码正确。这种"写代码-执行-调试"的自动循环是 AutoGen 的经典用法。

### 10.3 学习建议

花 1 小时了解概念即可。重点理解"Agent 间对话协作"和"代码执行能力"两个特点。面试时能说出 AutoGen 和 CrewAI 的区别——AutoGen 侧重对话式协作，CrewAI 侧重角色化分工。

---

## 十一、框架选型决策树

面试可能问"如果让你选一个 Agent 框架，你怎么选"。以下是决策思路：

**第一步：场景是什么？**

如果是简单问答/单轮生成，不需要 Agent 框架，直接调 LLM API + Prompt 即可。

如果是 RAG 知识库问答，用 LangChain 的 Retriever + LCEL Chain，或 LlamaIndex 的 QueryEngine。

如果需要工具调用和自主决策，用 LangChain 的 AgentExecutor 或 LangGraph。

如果是多 Agent 协作，考虑 CrewAI（角色分工）或 AutoGen（对话协作）或 LangGraph（自定义图）。

**第二步：使用者是谁？**

如果是工程师做生产开发，选 LangChain/LangGraph（代码灵活、可版本管理、可测试）。

如果是业务人员自助构建，选 Dify（可视化、低门槛）。

如果是跨系统自动化，选 n8n（连接能力强）。

**第三步：复杂度如何？**

简单链式流程用 LangChain LCEL。有条件分支和循环用 LangGraph。多角色协作用 CrewAI。

**面试回答模板**："我的选型思路是先看场景——RAG 用 LangChain 或 LlamaIndex，简单 Agent 用 LangChain AgentExecutor，复杂流程用 LangGraph，多 Agent 协作用 CrewAI。如果是给业务人员用，选 Dify 可视化平台。如果是跨系统自动化，选 n8n。我研究过 Nexbot 项目用 LangGraph 构建了生产级 Agent 平台，它的三节点图（oracle/action/terminal）和条件路由设计给我很大启发。"

---

## 十二、面试高频问题与参考答案

**Q1: 什么是 Agent？Agent 和普通 LLM 调用有什么区别？**

Agent 是能够自主决策和行动的 LLM 应用。普通 LLM 调用是"一问一答"，模型只能基于训练知识回复。Agent 的核心是 ReAct 循环——模型推理出下一步该做什么，调用工具执行，观察结果，再推理下一步。这让 Agent 能查数据库、执行代码、搜索网络、调用 API，能力远超纯 LLM 对话。

**Q2: LangChain 的 LCEL 是什么？为什么用管道符？**

LCEL（LangChain Expression Language）是 LangChain 的链式调用语法，用管道符 `|` 连接组件。设计灵感来自 Unix 管道——每个组件接收上一步输出、处理后传给下一步。好处是代码可读性强、支持流式输出/异步/批处理/重试等运行时能力，且所有组件实现统一的 Runnable 接口可以自由组合。

**Q3: Agent 的 ReAct 模式是什么？**

ReAct 是 Reasoning + Acting 的缩写。Agent 在每一步先"推理"（Thought，分析当前状态和该做什么），再"行动"（Action，调用工具），然后"观察"（Observation，获取工具返回），循环直到完成任务。这种模式让模型能根据工具返回的中间结果动态调整策略，而不是一次性规划所有步骤。

**Q4: LangChain 和 LlamaIndex 有什么区别？怎么选？**

LangChain 是通用 LLM 应用框架，覆盖 Agent/Chain/Memory/Tools 全场景。LlamaIndex 专注 RAG，在文档处理、检索策略、Index 类型方面更丰富。选择上：做 Agent 用 LangChain，做复杂 RAG 可以用 LlamaIndex 或两者配合——LangChain 做 Agent 编排，LlamaIndex 做 RAG 检索。LangChain 也支持集成 LlamaIndex 的 Retriever。

**Q5: LangChain AgentExecutor 和 LangGraph 有什么区别？**

AgentExecutor 是"黑盒循环"——你设置好 Agent 和 Tools，它自动运行 ReAct 循环，但你不好控制每一步。LangGraph 是"白盒图"——你显式定义节点和边，可以精确控制执行流程、插入条件分支、在特定节点暂停等人机交互。简单场景用 AgentExecutor 足够，复杂流程（如需要 HITL、多路由、并行执行）用 LangGraph。

**Q6: Dify 和 LangChain 怎么选？**

看使用者和场景。给工程师做生产级应用，选 LangChain——代码灵活、可测试、可版本管理、可以做复杂逻辑。给业务人员做快速原型或自助工具，选 Dify——可视化拖拽、低门槛、内置运营管理。实际项目中可以配合使用——用 Dify 快速验证概念，验证后用 LangChain 重构为生产代码。

**Q7: n8n 和 Dify 有什么区别？**

Dify 专注 AI 应用开发，所有能力围绕 LLM。n8n 是通用工作流自动化平台，AI 只是其中一个能力。n8n 更擅长跨系统编排——比如从 MES 取数据、调用 LLM 分析、发钉钉通知、写回数据库这种端到端自动化。Dify 更擅长 AI 对话和知识库场景。

**Q8: AutoGPT 有什么局限？为什么生产环境很少用？**

AutoGPT 的主要局限是：目标分解容易跑偏（模型可能进入无限循环）、Token 消耗大（每步都要完整推理）、任务完成质量不稳定（缺乏有效验证机制）。它更适合演示自主 Agent 的概念，生产环境通常用 LangChain/LangGraph 这种可控性更好的框架。

**Q9: 多 Agent 协作有哪些框架？各有什么特点？**

CrewAI 侧重角色化分工——每个 Agent 有角色/目标/背景故事，像团队一样协作。AutoGen 侧重对话式协作——Agent 之间通过对话协商，特别适合"写代码-执行-调试"循环。LangGraph 通过图节点实现多 Agent——最灵活但最底层。选型看场景：角色明确分工用 CrewAI，需要代码执行和对话用 AutoGen，需要精细控制流程用 LangGraph。

**Q10: 你在实际项目中用过 Agent 框架吗？（结合 Nexbot 项目）**

"我研究过一个生产级 Agent 平台——Nexbot/EClaw。它用 LangGraph 构建了三节点状态图：oracle（模型决策）→ action（工具执行）→ terminal（沙箱终端），通过条件路由控制循环。它的工具系统用 DynamicToolLoader 统一管理八种工具来源（API/Skill/Script/MCP/内置/客户端工具等），按权限和入口点动态过滤。模型输入采用四层分层设计（System Prompt + Runtime Payload + Messages + Tools），每层独立裁剪。这些实践让我对 Agent 框架的工程化使用有深入理解。"

**Q11: 什么是 Function Calling？和 Agent 的 Tool Use 有什么关系？**

Function Calling 是 OpenAI 等模型的原生能力——你在请求中声明可用函数的 schema，模型决定是否调用以及传什么参数，返回结构化的调用指令。LangChain 的 Tool Use 底层就利用了 Function Calling——Tool 定义转换为 Function schema 传给模型，模型返回的调用指令被 AgentExecutor 解析并执行。不是所有模型都支持 Function Calling，不支持的需要用输出解析（OutputParser）从文本中提取调用意图。

**Q12: Agent 的 Memory 有哪些类型？怎么选？**

ConversationBufferMemory 保存全部历史，简单但 Token 线性增长。ConversationSummaryMemory 用 LLM 总结旧对话，省 Token 但有信息损失。ConversationBufferWindowMemory 只保留最近 N 轮，兼顾效果和成本。ConversationSummaryBufferMemory 混合——近期保留原文，旧对话总结。选择策略：短对话用 Buffer，长对话用 Window 或 Summary，对成本敏感用 Summary，对质量敏感用 Buffer。

---

> **学习建议总结**：LangChain 是必须动手写的（第 6 周），LlamaIndex 配合 RAG 学习（第 7 周），Dify 花 2-3 小时实操（第 8 周），LangGraph 通过 Nexbot 项目文档理解概念（已研究过），其余框架面试前花 1-2 小时浏览文档即可。面试时能说出 3-4 个框架的定位和区别，加上 Nexbot 项目的实践参照，足以展示你对 Agent 生态的全面理解。
