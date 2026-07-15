---
title: AI 应用工程师三个月面试通关学习指南
date: 2026-07-06
category: ai
tags:
  - AI应用工程师
  - 工业AI
  - 学习路线
  - 面试
---

# AI 应用工程师（工业数据方向）—— 三个月面试通关学习指南

> **目标**：在 3 个月内系统掌握岗位要求的核心技能，能够通过面试并胜任工业 AI 应用开发工作。
>
> **适用人群**：有软件开发基础（熟悉 epoint 框架、Vue 前端、Python 脚本），但需要系统补充 AI/ML、大模型应用、工业数据工程等领域的知识。
>
> **学习策略**：理论与实践并重，每个知识点都配以动手实验；以 Nexbot 项目（你已研究的 FastAPI + LangGraph + RAG 平台）作为实战参照，加速理解。
>
> **每日时间建议**：工作日 2-3 小时 + 周末 6-8 小时，合计每周约 20-25 小时。

---

## 目录

- [岗位要求拆解与优先级](#岗位要求拆解与优先级)
- [第一个月：Python 数据科学 + REST API + Docker](#第一个月python-数据科学--rest-api--docker)
- [第二个月：大模型应用 + RAG + LangChain](#第二个月大模型应用--rag--langchain)
- [第三个月：工业数据工程 + 时序预测 + 项目实战 + 面试](#第三个月工业数据工程--时序预测--项目实战--面试)
- [面试高频考点清单](#面试高频考点清单)
- [推荐学习资源汇总](#推荐学习资源汇总)

---

## 岗位要求拆解与优先级

根据招聘要求，将技能分为三个优先级：

**P0 — 必须掌握（面试必考，日常工作核心）**

| 技能 | 要求程度 | 对应职责 |
|------|---------|---------|
| Python + Pandas/NumPy/Scikit-learn | 熟练，工程化编码 | 工业数据清洗、特征工程、数据集构建 |
| PyTorch 或 TensorFlow | 熟悉 | 模型训练与部署 |
| Prompt Engineering | 实战经验 | 大模型应用开发 |
| LangChain / LlamaIndex / RAG | 开发经验 | 私有知识库构建 |
| RESTful API（FastAPI/Flask/Django） | 熟悉 | 模型服务封装 |
| Docker 基本操作 | 基础 | 服务部署 |
| 大模型 API 集成（DeepSeek/Qwen） | 实战 | AI 应用开发 |

**P1 — 强加分项（有则明显提升竞争力）**

| 技能 | 要求程度 | 对应职责 |
|------|---------|---------|
| 工业时序预测（LSTM/Transformer） | 熟悉 | 预测性维护、智能调度 |
| Dify/n8n 工作流或 Agent 框架 | 经验 | AI 应用编排 |
| MES/SCADA/DCS 数据交互逻辑 | 了解 | 工业数据工程 |
| 流程工业经验（化工/钢铁/电力/制药/能源） | 了解 | 行业理解 |

**P2 — 通用能力（面试考察软实力）**

| 能力 | 面试考察方式 |
|------|------------|
| 跨部门沟通协作 | 行为面试题：如何与非技术人员对齐需求 |
| 技术文档写作 | 可能要求现场写技术方案 |
| 自驱力与行业热情 | "为什么选择工业 AI 方向" |

---

## 第一个月：Python 数据科学 + REST API + Docker

**本月目标**：打下坚实的数据处理和工程化基础，能够独立完成"数据清洗 → 特征工程 → 模型训练 → API 封装 → Docker 部署"的完整链路。

### 第 1 周：Python 工程化 + Pandas/NumPy 数据处理

**学习目标**：掌握 Python 工程化编码习惯，熟练使用 Pandas/NumPy 进行数据清洗和特征工程。

**知识点清单**：

Python 工程化方面，需要掌握 virtualenv/venv 虚拟环境管理，requirements.txt 和 pyproject.toml 依赖管理，type hints 类型标注，dataclass 和 Pydantic 数据模型，logging 日志规范，pytest 单元测试基础，异常处理最佳实践，以及代码格式化工具 black/isort/ruff 的使用。

Pandas 方面，需要掌握 DataFrame 创建与索引，数据清洗（缺失值处理 fillna/dropna、异常值检测、重复数据去除），数据变换（apply/map/transform、分组聚合 groupby/agg/pivot_table），时间序列处理（resample 重采样、rolling 滑动窗口、shift 偏移），数据合并（merge/concat/join），以及数据读写（CSV/Excel/SQL/Parquet）。

NumPy 方面，需要掌握 ndarray 创建与操作，广播机制，矩阵运算，随机数生成，以及与 Pandas 的互操作。

**每日学习安排**：

周一至周二，花 2 小时复习 Python 工程化基础。重点练习虚拟环境创建、依赖管理、类型标注、Pydantic 数据模型。练习题：用 Pydantic 定义一个工业传感器数据模型，包含传感器 ID、时间戳、温度/压力/流量等字段，带校验逻辑。

周三至周四，花 3 小时学习 Pandas 数据清洗。找一份公开的工业传感器数据集（如 UCI 电力负荷数据集、Kaggle 轴承故障数据集），练习缺失值处理、异常值检测（IQR 方法/Z-score 方法）、数据类型转换、时间索引设置。

周五，花 2 小时学习 Pandas 特征工程。练习从时间序列中提取统计特征：均值、方差、最大/最小值、峰度、偏度；滑动窗口特征；差分特征；编码特征（OneHot/Label）。

周六，花 4 小时做综合练习。模拟工业场景：给定一批传感器时序数据，完成"读取 → 清洗 → 特征提取 → 保存"全流程，代码用函数封装、写类型标注、加单元测试。

周日，花 2 小时阅读 NumPy 文档，重点理解广播机制和矩阵运算，因为后续 ML 模型训练会大量使用。

**Nexbot 项目参照**：阅读 `backend/app/core/settings_models.py`，看真实项目如何用 Pydantic Settings 管理配置；阅读 `backend/app/storage/layout.py`，看如何用 dataclass 组织复杂路径逻辑。这两个文件是 Python 工程化的优秀范例。

**本周产出**：一个 GitHub 仓库 `industrial-data-cleaning`，包含数据清洗和特征工程的完整代码 + 测试 + README。

### 第 2 周：Scikit-learn 传统机器学习实战

**学习目标**：掌握传统 ML 全流程（数据准备 → 模型训练 → 评估 → 持久化），能独立完成分类和回归任务。

**知识点清单**：

监督学习方面，需要掌握分类算法（逻辑回归、随机森林、SVM、XGBoost）和回归算法（线性回归、Ridge/Lasso、随机森林回归、梯度提升回归）。

模型评估方面，需要掌握分类指标（accuracy、precision、recall、F1、混淆矩阵、ROC/AUC）和回归指标（MSE、RMSE、MAE、R2），以及交叉验证（KFold、StratifiedKFold）和训练/验证/测试集划分。

特征工程进阶方面，需要掌握标准化/归一化（StandardScaler/MinMaxScaler）、特征选择（SelectKBest、基于模型的重要性）、降维（PCA）、管道化（Pipeline + ColumnTransformer）。

模型持久化方面，掌握 joblib/pickle 保存和加载模型。

**每日学习安排**：

周一至周二，花 3 小时学习分类模型。用 sklearn 的 iris/wine 数据集练习，然后换成工业场景数据（如轴承故障分类：正常/内圈故障/外圈故障）。重点理解过拟合/欠拟合的判断，学习曲线的绘制。

周三，花 2 小时学习回归模型。用 sklearn 的 California Housing 数据集练习，然后换成工业场景（如设备剩余使用寿命预测）。重点理解 R2 和 RMSE 的业务含义。

周四，花 2 小时学习 Pipeline 和交叉验证。把前面的数据处理 + 模型训练组装成 sklearn Pipeline，用 GridSearchCV 做超参数搜索。理解为什么要用 Pipeline（防止数据泄露）。

周五，花 2 小时学习模型评估可视化。绘制混淆矩阵热力图、ROC 曲线、特征重要性图、学习曲线。用 matplotlib/seaborn 画图。

周六，花 4 小时做综合项目：设备故障预测。用 NASA 轴承数据集（公开可下载），完成"数据加载 → 清洗 → 特征提取 → 模型训练 → 评估 → 模型保存"全流程。模型选随机森林和 XGBoost 对比。

周日，花 2 小时复习理论。理解偏差-方差权衡、正则化的作用、集成学习的原理（Bagging vs Boosting）。

**面试可能问到的题**：如何处理类别不平衡？如何选择评估指标？什么是数据泄露，如何避免？随机森林和 XGBoost 的区别？特征重要性如何计算？

**本周产出**：GitHub 仓库 `bearing-fault-prediction`，包含完整 ML Pipeline + 模型对比报告 + 可视化图表。

### 第 3 周：FastAPI RESTful API 开发

**学习目标**：能用 FastAPI 开发规范的 RESTful API，将 ML 模型封装为可调用的 API 服务。

**知识点清单**：

FastAPI 基础方面，需要掌握路由定义（@app.get/post/put/delete）、路径参数和查询参数、请求体模型（Pydantic BaseModel）、响应模型（response_model）、依赖注入（Depends）、异步处理（async/await）。

RESTful 设计方面，掌握资源命名规范、HTTP 方法语义、状态码使用、分页/过滤/排序、错误处理（HTTPException + 异常处理器）。

API 文档方面，掌握 OpenAPI/Swagger 自动文档、API 描述和标签、响应示例。

中间件方面，掌握 CORS 配置、请求日志、认证基础（OAuth2/Bearer Token）。

测试方面，掌握 TestClient 和 pytest 的 API 测试。

**每日学习安排**：

周一，花 3 小时学习 FastAPI 基础。跟着官方教程做一遍 CRUD 示例。理解 async/await、Depends 依赖注入、Pydantic 模型校验。

周二，花 2 小时学习 RESTful API 设计规范。理解资源导向设计，HTTP 方法正确使用，状态码语义。练习设计一个"传感器数据管理"的 API 接口集。

周三，花 3 小时实现 ML 模型 API 封装。把第 2 周训练的轴承故障预测模型用 FastAPI 封装：POST /predict 接收传感器数据，返回故障类型和置信度。理解模型加载时机（应用启动时加载一次，不要每次请求加载）。

周四，花 2 小时学习 API 安全和中间件。加 CORS 配置，加 Bearer Token 认证，加请求日志中间件。理解 API Key 和 JWT 的区别。

周五，花 2 小时学习 API 测试。用 pytest + TestClient 写 API 集成测试，测试正常输入、边界值、异常输入。

周六，花 3 小时学习 FastAPI 进阶：后台任务（BackgroundTasks）、流式响应（StreamingResponse）、WebSocket。这些在工业实时数据推送场景中会用到。

周日，花 2 小时对比 FastAPI vs Flask vs Django。理解各自优缺点，准备面试可能问"为什么选 FastAPI"。

**Nexbot 项目参照**：你已研究过 Nexbot 项目，它的后端就是 FastAPI。重点回顾 `nexbot-architecture-guide.md` 中 3.2 节的完整路由清单和 3.3 节的 Gateway 设计——这是 FastAPI 企业级实践的绝佳参考。面试时可以说"我研究过一个生产级 FastAPI 项目的网关设计"。

**面试可能问到的题**：FastAPI 的异步机制是什么？为什么比 Flask 快？Depends 依赖注入的好处？如何处理大文件上传？如何做 API 版本管理？如何保证 API 的幂等性？

**本周产出**：GitHub 仓库 `bearing-fault-api`，FastAPI 服务 + Swagger 文档 + pytest 测试 + Dockerfile。

### 第 4 周：Docker 基础 + 模型服务部署

**学习目标**：掌握 Docker 基本操作，能将 FastAPI + ML 模型打包为 Docker 镜像并运行。

**知识点清单**：

Docker 基础方面，需要掌握镜像与容器概念、Dockerfile 编写（FROM/WORKDIR/COPY/RUN/EXPOSE/CMD/ENTRYPOINT）、镜像构建（docker build）和容器运行（docker run）、端口映射和数据卷（-v）、环境变量（-e/--env-file）、docker-compose 多服务编排。

部署实践方面，掌握 Python 项目的 Docker 化（venv/pip install、多阶段构建减小镜像体积）、模型文件的打包策略、GPU 支持（nvidia-container-toolkit 基础了解）、健康检查（HEALTHCHECK）、日志管理。

**每日学习安排**：

周一，花 2 小时学习 Docker 核心概念。理解镜像/容器/仓库的区别，练习 docker run hello-world，docker pull/push 基础命令。

周二，花 3 小时学习 Dockerfile。为第 3 周的 FastAPI 服务写 Dockerfile：选 python:3.12-slim 基础镜像，安装依赖，复制代码，暴露端口，启动命令。练习多阶段构建减小镜像体积。

周三，花 2 小时学习 docker-compose。编写 docker-compose.yml，包含 API 服务 + Redis（模拟缓存）。理解 depends_on、volumes、environment 配置。

周四，花 2 小时学习 Docker 网络和数据卷。理解 bridge 网络、容器间通信、数据持久化。练习在容器中挂载模型文件。

周五，花 2 小时学习 Docker 部署优化。镜像大小优化（.dockerignore、多阶段构建、slim 镜像）、安全实践（非 root 用户运行）、健康检查配置。

周六，花 3 小时综合实战：把前三周的成果整合。Docker 镜像包含：Python 环境 + Pandas/sklearn 依赖 + 训练好的模型文件 + FastAPI 服务。用 docker-compose 一键启动。

周日，花 2 小时了解 GPU Docker。如果面试涉及深度学习部署，了解 nvidia-container-toolkit 的基本用法，不需要深入。

**Nexbot 项目参照**：阅读 `nexbot-architecture-guide.md` 第六章"部署与运维"，里面有完整的 3 阶段 Dockerfile 分析（frontend-builder → python-builder → runtime-base），以及 docker/entrypoint.sh 的启动流程、沙箱镜像等。这是企业级 Docker 部署的优秀参考。

**面试可能问到的题**：Docker 镜像如何减小体积？多阶段构建的原理？容器和虚拟机的区别？docker-compose 的作用？如何在 Docker 中使用 GPU？

**本月产出清单**：

1. `industrial-data-cleaning` — 数据清洗和特征工程代码库
2. `bearing-fault-prediction` — 传统 ML 全流程项目
3. `bearing-fault-api` — FastAPI + Docker 部署的模型服务

---

## 第二个月：大模型应用 + RAG + LangChain

**本月目标**：掌握大模型应用开发全栈能力，能独立构建 RAG 私有知识库和大模型 API 服务。

### 第 5 周：大模型基础 + Prompt Engineering

**学习目标**：理解大语言模型的基本原理，掌握 Prompt Engineering 的系统方法。

**知识点清单**：

大模型基础方面，需要理解 Transformer 架构基本原理（Self-Attention、Multi-Head Attention、Positional Encoding）、LLM 训练流程（预训练 → SFT → RLHF）、上下文窗口和 Token 概念、温度（temperature）和 Top-p 采样参数、不同模型的定位（GPT 系列、Claude、Qwen、DeepSeek、Llama）。

Prompt Engineering 方面，需要掌握 Zero-shot / Few-shot Prompting、Chain-of-Thought（CoT）思维链、Role Prompting（角色扮演）、Structured Output（结构化输出，JSON 模式）、Prompt 模板化管理、系统提示（System Prompt）与用户提示（User Prompt）的分层设计。

API 调用方面，掌握 OpenAI 兼容 API 格式（/v1/chat/completions）、流式输出（stream=True）、函数调用（Function Calling / Tool Use）、Token 计费理解。

**每日学习安排**：

周一，花 2 小时学习大模型基础理论。不需要数学推导，重点理解 Transformer 的直觉：注意力机制是"加权平均"，位置编码让模型理解顺序，预训练让模型学会语言规律。推荐看 3Blue1Brown 的 Transformer 可视化视频。

周二，花 2 小时注册和调用大模型 API。注册阿里云 DashScope（Qwen）或 DeepSeek API，用 Python requests/httpx 调用 /v1/chat/completions。练习基本对话、流式输出、函数调用。

周三，花 2 小时学习 Prompt Engineering 基础。练习 Zero-shot、Few-shot、CoT 三种模式。场景练习：让模型分析一段传感器数据描述，判断可能的故障类型。

周四，花 2 小时学习结构化输出。让模型输出 JSON 格式的分析结果。练习 Function Calling：定义一个 get_sensor_data 函数，让模型决定何时调用。这直接对应岗位要求中的"API 集成"。

周五，花 2 小时学习 Prompt 模板化。用字符串模板或 Jinja2 管理 Prompt。理解 System Prompt + User Prompt 的分层设计。场景练习：设计一个工业设备故障诊断助手的 System Prompt。

周六，花 3 小时做综合练习。构建一个"工业知识问答"的原型：用户提问 → 构造 Prompt → 调用 Qwen/DeepSeek API → 返回回答。练习不同的 Prompt 策略对回答质量的影响。

周日，花 1 小时阅读论文"Attention Is All You Need"的摘要和结论部分，面试可能问到 Transformer 的起源。

**Nexbot 项目参照**：你的 `nexbot-architecture-guide.md` 3.6 节"模型输入的四层分层设计"是 Prompt Engineering 的企业级实践——System Prompt + Runtime Payload + Messages + Tools 四层独立组装。面试时可以说"我理解生产级大模型应用的 Prompt 不是简单拼字符串，而是分层设计、独立裁剪"。

**面试可能问到的题**：Transformer 的核心机制是什么？Prompt Engineering 有哪些高级技巧？什么是 Function Calling？temperature 参数的作用？如何减少 Token 消耗？大模型的幻觉问题如何缓解？

### 第 6 周：LangChain/LlamaIndex 应用开发

**学习目标**：掌握 LangChain 框架的核心概念，能开发基于大模型的应用。

**知识点清单**：

LangChain 核心方面，需要掌握 LangChain 基本架构（LangChain → LangGraph → LangSmith）、ChatModel 和 LLM 接口、PromptTemplate 和 ChatPromptTemplate、Output Parser（StrOutputParser、JsonOutputParser、PydanticOutputParser）、Chain 链式调用（LCEL 表达式语言）、Runnable 接口、Memory 对话记忆（ConversationBufferMemory、ConversationSummaryMemory）。

工具调用方面，掌握 Tool 定义（@tool 装饰器、StructuredTool）、Agent 执行器（AgentExecutor）、ReAct 推理模式、工具选择路由。

LlamaIndex 方面，掌握 Document 和 Node 概念、Index 类型（VectorStoreIndex、SummaryIndex）、Query Engine 查询引擎、Response Synthesizer。

**每日学习安排**：

周一，花 2 小时学习 LangChain 基础。pip install langchain langchain-openai，练习 ChatModel + PromptTemplate + OutputParser 的基本链。

周二，花 2 小时学习 LCEL（LangChain Expression Language）。理解 pipe 操作符 |，练习 RunnablePassthrough、RunnableParallel、RunnableLambda。用 LCEL 重写第 5 周的工业问答原型。

周三，花 2 小时学习 LangChain Memory。理解对话记忆的作用，对比 BufferMemory 和 SummaryMemory 的优劣。场景：多轮工业设备诊断对话，模型需要记住之前说的故障信息。

周四，花 3 小时学习 LangChain Tools 和 Agent。定义几个工具：查询传感器数据、查询设备手册、计算统计指标。用 AgentExecutor 创建一个能自动选择工具的 Agent。这直接对应岗位要求中的"Agent 框架"加分项。

周五，花 2 小时学习 LlamaIndex 基础。理解 LlamaIndex 与 LangChain 的定位差异（LlamaIndex 更专注于 RAG，LangChain 更通用）。练习用 LlamaIndex 加载文档并创建 VectorStoreIndex。

周六，花 3 小时做综合项目。用 LangChain 构建一个工业设备诊断 Agent：能调用传感器数据查询工具、设备手册搜索工具、故障分类工具，多轮对话诊断设备问题。

周日，花 2 小时了解 LangGraph 基础概念。理解 StateGraph、节点、路由的概念。不需要深入实现，但要知道 LangGraph 是 LangChain 生态中用于构建有状态多步骤 Agent 的高级工具。

**Nexbot 项目参照**：你的 `nexbot-architecture-guide.md` 3.5 节"LangGraph 运行时"详细描述了三节点图（oracle/action/terminal）和状态流转——这是 LangGraph 的生产级实践。面试时可以说"我研究过 LangGraph 在生产项目中的使用，理解 oracle（模型决策）→ action（工具执行）→ terminal（沙箱）的图拓扑设计"。另外 3.7 节"工具系统"中 DynamicToolLoader 的八种 Builder 也是 Agent 工具管理的优秀参考。

**面试可能问到的题**：LangChain 的 LCEL 是什么？Agent 的 ReAct 模式是什么原理？LangChain Memory 有哪些类型？LangChain 和 LlamaIndex 的区别？如何选择合适的 LLM 框架？

### 第 7 周：RAG 私有知识库构建

**学习目标**：掌握 RAG 全流程，能为企业构建私有知识库问答系统。这是岗位要求中的核心职责之一。

**知识点清单**：

RAG 全流程方面，需要掌握文档加载（PDF/Word/HTML/Markdown）、文档切分（RecursiveCharacterTextSplitter、MarkdownHeaderTextSplitter）、嵌入模型（Embedding Model 选择：OpenAI/bge-m3/通义千问 embedding）、向量数据库（Chroma/FAISS/Milvus/Qdrant）、检索策略（相似度搜索、MMR 多样性检索、混合检索）、上下文组装（检索结果 → Prompt 上下文）、生成回答。

RAG 优化方面，掌握 Query 改写（查询扩展、HyDE 假设文档生成）、重排序（Reranker 模型）、引用溯源（标注回答来源）、评估指标（忠实度、相关性、上下文利用率）。

工业知识库方面，掌握工业文档特点（操作规程、设备手册、故障案例、维护记录）、文档清洗策略（表格处理、图片描述、术语统一）、私有化部署方案。

**每日学习安排**：

周一，花 2 小时学习 RAG 基本原理。理解"检索-增强-生成"三步流程，对比 RAG 与微调的优劣。理解为什么企业需要 RAG（数据隐私、实时性、成本）。

周二，花 3 小时实践 RAG 基础流程。用 LangChain + Chroma 构建 RAG：加载一份 PDF 文档 → 切分 → 向量化 → 存储 → 检索 → 生成回答。先跑通流程，不优化。

周三，花 2 小时学习文档切分策略。理解 chunk_size 和 chunk_overlap 的作用。对比不同切分策略对检索质量的影响。练习 MarkdownHeaderTextSplitter（按标题切分，适合技术文档）。

周四，花 2 小时学习嵌入模型选择。对比 OpenAI text-embedding-3、bge-m3（开源中文嵌入模型）、通义千问 embedding。理解维度、速度、质量的权衡。练习用 bge-m3 做本地嵌入（不依赖 API）。

周五，花 3 小时学习 RAG 优化。实践 Query 改写：用 LLM 把用户的口语化问题改写为更适合检索的查询。实践 Reranker：用 bge-reranker 对检索结果重排序。对比优化前后的回答质量。

周六，花 3 小时构建工业知识库原型。模拟场景：收集几份设备操作手册（PDF）→ 清洗 → 切分 → 向量化 → 构建问答系统。加上引用溯源功能，回答时标注来源段落。

周日，花 2 小时学习 RAG 评估。理解 RAGAS 评估框架，用忠实度（faithfulness）和相关性（relevance）指标量化 RAG 质量。

**Nexbot 项目参照**：你的 `nexbot-architecture-guide.md` 3.11 节"记忆系统"描述了一个完整的两阶段记忆流水线——Phase1 抽取候选记忆、Phase2 合并巩固。虽然记忆系统和 RAG 不完全相同，但文档处理、向量化、检索的思路是相通的。另外 3.7 节中的 DocumentContext 工具（list_documents/search_document/read_document_chunk）也是 RAG 在生产中的实现方式。

**面试可能问到的题**：RAG 的全流程是什么？如何选择嵌入模型？chunk_size 怎么定？如何优化 RAG 的检索质量？RAG 和微调什么时候用哪个？如何评估 RAG 系统的质量？如何处理表格数据的 RAG？

### 第 8 周：DeepSeek/Qwen 部署 + Agent 框架

**学习目标**：掌握开源大模型的本地部署，了解 Agent 框架和 Dify/n8n 工作流工具。

**知识点清单**：

模型部署方面，需要了解 Ollama 本地部署工具、vLLM 推理加速框架（概念了解即可）、模型量化（GGUF/AWQ/GPTQ 格式概念）、Qwen 和 DeepSeek 模型的特点、本地部署 vs API 调用的选择。

Agent 框架方面，需要了解 Dify（可视化 AI 应用开发平台）、n8n（工作流自动化工具）、Agent 的核心概念（规划 → 工具调用 → 观察 → 行动循环）、多 Agent 协作概念。

工作流编排方面，了解 Dify 的工作流模式、n8n 的节点编排、与 LangChain 代码方式开发 AI 应用的对比。

**每日学习安排**：

周一，花 2 小时用 Ollama 本地部署 Qwen 模型。安装 Ollama，拉取 qwen2.5:7b 模型，用命令行和 API 调用。理解本地部署的优势（隐私、无 API 费用）和劣势（硬件要求、推理速度）。

周二，花 2 小时了解 vLLM 和模型量化。不需要实操，但要知道 vLLM 用 PagedAttention 加速推理，量化（4bit/8bit）能减小显存占用。面试可能问"如何部署大模型到生产环境"。

周三，花 3 小时学习 Dify。注册 Dify Cloud 或本地部署，创建一个工作流应用：输入传感器数据 → LLM 分析 → 输出故障诊断报告。理解 Dify 的定位（让非技术人员也能构建 AI 应用）。

周四，花 2 小时了解 n8n。安装或试用 n8n Cloud，创建一个工作流：定时从数据库取数据 → 调用 LLM 分析 → 发送通知。理解 n8n 在自动化场景中的作用。

周五，花 2 小时深入 Agent 概念。回顾 ReAct 模式（Reasoning + Acting），理解 Agent 与 Chain 的区别（Agent 能自主决策调用哪个工具，Chain 是固定流程）。对比 LangChain Agent、Dify Agent、AutoGPT 等不同实现。

周六，花 3 小时做综合项目。用 Ollama + LangChain 构建一个本地运行的工业知识库问答系统：Qwen2.5 本地模型 + bge-m3 本地嵌入 + Chroma 向量库 + 工业文档 RAG。不依赖任何外部 API，完全私有化部署。

周日，花 2 小时整理本月学习。写一篇技术博客"工业 AI 知识库构建实践：从 RAG 到私有化部署"，发布到知乎或 CSDN。面试时可以分享。

**面试可能问到的题**：如何在本地部署大模型？Ollama 和 vLLM 的区别？模型量化是什么？Dify 和 LangChain 的区别？Agent 的 ReAct 模式是什么？什么时候用 Dify，什么时候用代码开发？

**本月产出清单**：

1. `industrial-qa-prototype` — 大模型 API 调用 + Prompt Engineering 原型
2. `industrial-diagnostic-agent` — LangChain Agent 多工具调用项目
3. `industrial-knowledge-base` — RAG 私有知识库问答系统
4. `local-rag-system` — 完全私有化部署的 RAG 系统（Ollama + 本地嵌入）
5. 一篇技术博客

---

## 第三个月：工业数据工程 + 时序预测 + 项目实战 + 面试

**本月目标**：补齐工业数据工程和深度学习短板，完成一个端到端综合项目，准备面试。

### 第 9 周：工业数据工程（DCS/SCADA 时序数据）

**学习目标**：理解工业控制系统数据特点，掌握工业时序数据处理方法。这是岗位的核心职责之一。

**知识点清单**：

工业控制系统方面，需要了解 DCS（分布式控制系统）的基本概念——用于过程工业（化工/电力/制药）的连续控制，数据特点是大批量、高频、连续时序；SCADA（监控与数据采集系统）的基本概念——用于远程监控，数据特点是地理分散、事件驱动；MES（制造执行系统）的基本概念——车间级生产管理，连接 ERP 和控制系统。不需要深入，但要知道它们各自产生什么数据、数据如何交互。

工业时序数据特点方面，需要理解高频采样（秒级/毫秒级）、多变量并发（温度/压力/流量/液位等同时采集）、数据缺失和漂移（传感器故障）、噪声和异常（工况变化）、非平稳性（设备老化导致基线漂移）。

工业数据工程实践方面，掌握时序数据存储格式（Parquet/InfluxDB/TimescaleDB 概念）、时序数据清洗（插值填补、异常值检测、去噪滤波）、时序特征工程（时域特征、频域特征、统计特征）、数据标注方法（故障标签、工况标签）、数据集构建（滑动窗口切割样本）。

**每日学习安排**：

周一，花 2 小时学习工业控制系统基础。了解 DCS/SCADA/MES 各自的功能定位和数据产生方式。重点理解"DCS 产生连续时序数据"这个概念，因为岗位要求处理的就是这类数据。不需要学具体的 DCS 产品（如和利时/浙大中控），但要知道数据长什么样。

周二，花 3 小时处理工业时序数据。用 Pandas 处理一份模拟的 DCS 时序数据（多变量、高频、有缺失和异常）。练习：时间索引设置、缺失值插值（线性/样条）、异常值检测（滚动统计方法）、去噪滤波（移动平均/Savitzky-Golay 滤波）。

周三，花 2 小时学习时序特征工程。从时序数据中提取：时域特征（均值/方差/峰值/裕度/脉冲指标/歪度/峭度——这些是设备诊断的经典特征）、频域特征（FFT 变换后的频谱能量分布）、统计特征（滑动窗口统计量）。

周四，花 2 小时学习滑动窗口样本切割。把连续时序数据切割为等长窗口样本（如每 1024 个点一个样本），配标签（正常/异常）。这是时序预测模型训练的标准数据准备方式。

周五，花 2 小时了解时序数据库。不需要深入，但要知道 InfluxDB/TimescaleDB 的概念，了解工业场景中为什么不用 MySQL 存时序数据。练习用 Parquet 格式存储处理后的时序数据（比 CSV 高效得多）。

周六，花 3 小时做综合练习。下载 NASA 轴承数据集（或 PHM Society 挑战赛数据集），完成"原始振动数据 → 清洗 → 特征提取 → 滑动窗口切割 → 标签标注 → 数据集构建"全流程。输出一个可以直接用于模型训练的数据集。

周日，花 2 小时阅读工业 AI 相关资料。了解预测性维护、质量检测、智能调度这三个应用场景的业务逻辑。面试时能说出"工业 AI 的典型应用场景包括预测性维护（预测设备何时故障）、质量检测（基于传感器数据判断产品质量）、智能调度（优化生产排程）"。

**面试可能问到的题**：DCS 和 SCADA 的区别？工业时序数据有什么特点？如何处理传感器数据缺失？设备诊断的时域特征有哪些？什么是峭度指标，它有什么物理意义？滑动窗口切割样本时如何选择窗口大小？

### 第 10 周：PyTorch + 时序预测模型

**学习目标**：掌握 PyTorch 基本用法，能用 LSTM/Transformer 做时序预测。这是岗位的加分项，但面试中很可能问到。

**知识点清单**：

PyTorch 基础方面，需要掌握 Tensor 操作（创建/索引/运算/广播）、自动求导（autograd）、nn.Module 模型定义、Dataset/DataLoader 数据加载、训练循环（前向传播 → 损失计算 → 反向传播 → 参数更新）、模型保存和加载、GPU 使用（.to(device)）。

时序模型方面，需要掌握 LSTM（理解门控机制：输入门/遗忘门/输出门，不需要数学推导但要知道直觉）、GRU（LSTM 的简化版）、Transformer Encoder 用于时序（Self-Attention 在时序中的应用）、1D-CNN 用于时序分类、模型选择策略（LSTM 适合中长期依赖，CNN 适合局部模式，Transformer 适合长序列）。

训练技巧方面，掌握学习率调度、早停法（Early Stopping）、梯度裁剪、损失函数选择（MSE 用于回归、CrossEntropy 用于分类）、过拟合处理（Dropout、权重衰减、数据增强）。

**每日学习安排**：

周一，花 3 小时学习 PyTorch 基础。安装 PyTorch（CPU 版即可），练习 Tensor 操作、自动求导。理解 PyTorch 与 NumPy 的关系。写一个最简单的线性回归训练循环。

周二，花 3 小时学习 PyTorch 模型定义和数据加载。用 nn.Module 定义一个简单的 MLP（多层感知机），用 Dataset/DataLoader 加载第 9 周准备的时序数据集。完成训练循环：前向传播 → 损失 → 反向传播 → 优化器更新。

周三，花 3 小时学习 LSTM 时序模型。理解 LSTM 的门控机制直觉：遗忘门决定丢弃什么历史信息，输入门决定加入什么新信息，输出门决定输出什么。用 nn.LSTM 构建一个时序分类模型（轴承故障分类），训练并评估。

周四，花 2 小时学习 1D-CNN 时序模型。用 nn.Conv1d 构建一维卷积网络做时序分类。对比 LSTM 和 CNN 的效果和速度。理解 CNN 适合提取局部模式（如振动信号中的冲击特征）。

周五，花 2 小时学习 Transformer 用于时序。了解 Transformer Encoder 的 Self-Attention 机制如何应用于时序数据。用 PyTorch 实现一个简单的 Transformer 时序分类器。理解位置编码在时序中的作用。

周六，花 3 小时做综合项目。用第 9 周的 NASA 轴承数据集，对比三种模型（LSTM/1D-CNN/Transformer）在故障分类任务上的表现。记录准确率、训练时间、推理速度。写一份模型对比报告。

周日，花 2 小时学习训练技巧。给项目加上：学习率调度（ReduceLROnPlateau）、早停法、梯度裁剪、Dropout。理解每个技巧的作用和适用场景。

**面试可能问到的题**：LSTM 的三个门分别是什么作用？LSTM 和 GRU 的区别？CNN 和 LSTM 在时序任务中各自的优劣？Transformer 用于时序有什么挑战？如何防止过拟合？学习率调度有哪些策略？PyTorch 中 Dataset 和 DataLoader 的作用？

### 第 11 周：综合项目实战（端到端工业 AI 应用）

**学习目标**：将三个月所学整合为一个端到端的工业 AI 应用项目，作为面试核心作品。

**项目设计：工业设备智能诊断与知识库系统**

这个项目融合了岗位要求的几乎所有技能点：

系统包含三个模块。数据与模型模块：使用 NASA 轴承数据集（或 PHM 数据集），完成数据清洗、特征工程、滑动窗口切割；用 LSTM 和随机森林分别训练故障分类模型；对比深度学习和传统 ML 的效果。RAG 知识库模块：收集设备操作手册、故障案例文档（可以用公开的设备手册 PDF）；用 LangChain + bge-m3 + Chroma 构建 RAG 问答系统；支持自然语言查询设备故障信息。API 服务模块：用 FastAPI 封装所有功能；POST /predict 接收传感器数据返回故障预测；POST /ask 接收自然语言问题返回知识库回答；GET /health 健康检查。部署模块：用 Docker 打包整个系统；docker-compose 一键启动（API 服务 + 向量数据库）；README 文档完整。

**每日学习安排**：

周一，花 3 小时搭建项目骨架。创建 GitHub 仓库 `industrial-ai-system`，搭建项目结构（src/data、src/models、src/rag、src/api、tests/），写 requirements.txt 和 Dockerfile。

周二，花 3 小时整合数据与模型模块。把第 9-10 周的数据处理和模型训练代码迁移到新项目，重构为模块化结构。训练并保存模型文件。

周三，花 3 小时整合 RAG 知识库模块。把第 7-8 周的 RAG 代码迁移，重构为可独立调用的模块。确保知识库问答和模型预测可以并行工作。

周四，花 3 小时开发 FastAPI 服务。定义 API 接口：/predict（模型预测）、/ask（知识库问答）、/health（健康检查）。写 Pydantic 请求/响应模型。加 CORS 和日志中间件。

周五，花 2 小时编写 Docker 部署。写 Dockerfile 和 docker-compose.yml。测试 docker-compose up 一键启动。验证所有 API 正常工作。

周六，花 3 小时写文档和完善细节。写 README.md（项目介绍、架构图、快速开始、API 文档）；写架构设计文档（画一个简单的系统架构图）；加单元测试；加错误处理和边界值测试。

周日，花 2 小时录制演示视频。用 screen recording 录一个 3-5 分钟的演示：启动系统 → 发送传感器数据预测 → 知识库问答 → 查看结果。放到 README 里或上传 B 站。

**项目亮点设计**（面试加分项）：

传统 ML + 深度学习对比（随机森林 vs LSTM），展示对两种方法的理解。RAG + 模型预测结合，展示端到端解决问题能力。私有化部署（本地嵌入模型 + 本地 LLM），展示对企业数据隐私的理解。完整的工程化实践（Docker、测试、文档），展示工程素养。Nexbot 项目研究经历，展示对生产级 Agent 平台的理解。

### 第 12 周：面试冲刺 + 技术文档写作

**学习目标**：系统复习三个月所学，准备面试高频问题，完成技术博客。

**每日学习安排**：

周一至周二，花 4 小时系统复习。按以下清单逐项过一遍，每个知识点能用 2-3 句话清晰表述：

Python 工程化（虚拟环境、类型标注、Pydantic、pytest）；数据处理（Pandas 数据清洗、特征工程、滑动窗口）；传统 ML（sklearn 分类/回归、交叉验证、Pipeline、模型评估）；深度学习（LSTM 门控机制、1D-CNN、Transformer 注意力、过拟合处理）；大模型（Transformer 原理、Token 概念、温度参数）；Prompt Engineering（CoT、Few-shot、结构化输出、Function Calling）；LangChain（LCEL、Memory、Tools/Agent、ReAct）；RAG（全流程、切分策略、嵌入模型、检索优化、评估）；FastAPI（路由、依赖注入、异步、Pydantic 模型、中间件）；Docker（Dockerfile、多阶段构建、docker-compose）；工业知识（DCS/SCADA/MES、时序数据特点、预测性维护）。

周三，花 2 小时准备项目讲解。写一份 5 分钟的项目讲解大纲：问题背景 → 技术选型 → 架构设计 → 核心难点 → 成果展示。对着镜子或录音练习 3 遍。

周四，花 2 小时准备行为面试题。准备以下问题的回答：为什么从当前方向转向 AI？为什么选择工业 AI 方向？遇到过的最大技术挑战是什么？如何与非技术人员（工艺工程师/操作工）沟通需求？你对工业 AI 未来发展的看法？

周五，花 2 小时模拟面试。找一个朋友或用 AI 工具（如 ChatGPT 扮演面试官）做模拟面试。重点练习：项目讲解、技术问答、现场编码（可能是 Python 数据处理或 API 开发）。

周六，花 3 小时写技术博客。题目建议："从零到一构建工业设备智能诊断系统" 或 "RAG 私有知识库在工业场景的实践"。内容基于第 11 周的综合项目。发布到知乎/CSDN/掘金。

周日，花 2 小时整理简历。在简历项目经历中加入：综合项目（端到端工业 AI 系统）、Nexbot 项目研究（Agent 平台架构分析）、技术博客链接。确保简历中出现的每个技术点都能在面试中展开讲 2-3 分钟。

---

## 面试高频考点清单

以下是根据岗位要求整理的面试高频考点，按概率排序：

**几乎必问（90%+）**

自我介绍 + 项目讲解（5 分钟）。Python 编码习惯（类型标注、异常处理、代码组织）。Pandas 数据处理实操（可能给一段数据让你写清洗代码）。RAG 全流程描述。大模型 API 调用经验。FastAPI 或 Flask 开发经验。Docker 基本操作。

**高概率（60-90%）**

LangChain 的使用经验。Prompt Engineering 技巧。传统 ML 评估指标。过拟合和欠拟合的判断。如何处理数据缺失和异常值。Docker 镜像优化。RESTful API 设计规范。

**中等概率（30-60%）**

LSTM 原理和门控机制。Transformer 的 Attention 机制。特征工程方法（时域/频域特征）。模型部署到生产环境的经验。向量数据库的选择。Dify/n8n 使用经验。工业控制系统（DCS/SCADA）了解程度。

**低概率但准备了就加分（10-30%）**

模型量化。vLLM 推理加速。多 Agent 协作。工业安全标准。MES 数据交互。具体行业工艺流程。

---

## 推荐学习资源汇总

**在线课程**

FastAPI 官方教程（https://fastapi.tiangolo.com/zh/tutorial/）—— 中文版，最好的 FastAPI 学习资源。LangChain 官方文档（https://python.langchain.com/）—— 从 Quick Start 开始，按 Tutorial 顺序做。吴恩达 Machine Learning 专项课程（Coursera）—— 传统 ML 基础，选学关键章节。吴恩达 ChatGPT Prompt Engineering for Developers（DeepLearning.AI）—— 1 小时短课，Prompt Engineering 入门。李沐《动手学深度学习》（https://zh.d2l.ai/）—— PyTorch 版，重点看 LSTM 和 Attention 章节。

**书籍**

《Python 数据分析与数据化运营》—— Pandas 实战参考。《机器学习》周志华（西瓜书）—— 理论参考，选读关键章节。《大模型应用开发极简入门》—— LangChain + RAG 实战。

**实践数据集**

NASA Bearing Dataset —— 轴承振动数据，设备诊断经典数据集。PHM Society Data Challenge（https://www.phmsociety.org/）—— 工业预测性维护挑战赛数据。UCI 电力负荷数据集 —— 时序预测入门数据集。Kaggle 工业相关数据集 —— 搜索 "industrial" "predictive maintenance" "bearing fault"。

**工具与平台**

阿里云 DashScope（https://dashscope.aliyun.com/）—— Qwen 模型 API，有免费额度。DeepSeek 平台（https://platform.deepseek.com/）—— DeepSeek 模型 API，价格便宜。Ollama（https://ollama.com/）—— 本地模型部署工具。Dify（https://dify.ai/）—— 可视化 AI 应用开发平台。Chroma（https://www.trychroma.com/）—— 轻量级向量数据库。HuggingFace（https://huggingface.co/）—— 模型和数据集托管。

**Nexbot 项目参照**

你已经研究的 Nexbot 项目本身就是最佳实践参考。在面试中可以提及：

"我研究过一个生产级 Agent 平台的架构设计，理解 FastAPI 企业级实践（网关、准入控制、中间件）、LangGraph 状态机（oracle/action/terminal 三节点图）、模型输入分层设计（System Prompt + Runtime Payload + Messages + Tools 四层）、RAG 和记忆系统的两阶段流水线、Docker 多阶段构建部署。"

这会展示你对工程化实践有深入理解，而不仅仅是跟着教程做过 demo。具体参照 `nexbot-architecture-guide.md` 中以下章节：3.2 API 路由层、3.3 Gateway 控制面、3.5 LangGraph 运行时、3.6 模型输入四层分层、3.7 工具系统、3.11 记忆系统、第六章部署与运维。

---

> **最后的话**：三个月的时间紧凑但足够。关键是每天保持学习节奏，每周有产出，最后有一个能拿出来讲的项目。面试官最看重的不是你懂多少理论，而是你能不能把东西做出来、讲清楚。加油！
