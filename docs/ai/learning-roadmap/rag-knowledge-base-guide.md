---
title: RAG 知识库搭建专项指南
date: 2026-07-16
category: ai
tags:
  - AI应用工程师
  - RAG
  - Milvus
  - RAGFlow
  - 学习路线
description: 面向工业私有知识库的 RAG 专项落地指南，确认"文本切分 + 嵌入向量化 + 向量库"的标准思路，给出 RAGFlow 一键部署与自建简易 RAG 两条方案、选型对比与代码骨架。
---

# RAG 知识库搭建专项指南

> **定位**：面向岗位 P0 核心职责"私有知识库构建"（见 [01-岗位技能与要求拆解](/ai/learning-roadmap/01-岗位技能与要求拆解) 职责 4）的专项深化。
>
> **与其他文档的关系**：这是[三个月面试通关学习指南](/ai/learning-roadmap/ai-engineer-3month-guide) 第 7 周"RAG 私有知识库构建"的展开与落地版，也是 [Agent 框架专项学习指南](/ai/learning-roadmap/agent-frameworks-guide) 中 LlamaIndex/Retrieval 章节的实操补充。建议在跑过第 7 周基础流程后配合阅读。

---

## 目录

- [一、先回答你的三个问题](#一先回答你的三个问题)
- [二、RAG 是什么，为什么工业知识库要用它](#二rag-是什么为什么工业知识库要用它)
- [三、RAG 核心流程七步拆解](#三rag-核心流程七步拆解)
- [四、两条落地路线对比](#四两条落地路线对比)
- [五、路线 A：RAGFlow 一键部署](#五路线-aragflow-一键部署)
- [六、路线 B：自建简易 RAG](#六路线-b自建简易-rag)
- [七、向量数据库选型对比](#七向量数据库选型对比)
- [八、嵌入模型选型](#八嵌入模型选型)
- [九、进阶优化手段](#九进阶优化手段)
- [十、工业场景落地要点](#十工业场景落地要点)
- [十一、选型决策与学习路线](#十一选型决策与学习路线)

---

## 一、先回答你的三个问题

你提的三个问题，先给结论：

**问题 1：文本切分 + 嵌入模型向量化 + 存入 Milvus 这类向量数据库，这是搭建知识库的思路吗？**

是。这正是 RAG（Retrieval-Augmented Generation，检索增强生成）知识库最经典、最主流的技术链路。你描述的三步是核心，完整链路还要加上"检索召回 → 组装上下文 → 大模型生成带引用的答案"。也就是说你的直觉方向完全正确，只是把中间和后面几步补全就是一套完整方案。

**问题 2：可行吗？**

可行，而且是当前企业私有知识库的事实标准做法。它不需要训练模型、不需要 GPU 集群，用开源嵌入模型 + 开源向量库 + 一个大模型 API 就能跑通。个人在一台普通机器上就能搭出 Demo，工业规程/手册/案例问答就是它的典型落地场景。

**问题 3：具体方案是什么？**

有两条路线，按投入和目的选：

| 路线 | 一句话描述 | 适合谁 |
|---|---|---|
| 路线 A：开源平台一键部署 | 用 RAGFlow（或 Dify）Docker 一键起服务，网页上传文档就能问答 | 想快速看到效果、给业务人员用、不想写代码 |
| 路线 B：自建简易 RAG | 用 LangChain/LlamaIndex + 嵌入模型 + Milvus 自己写代码 | 想理解原理、要做定制化、要写进简历讲清每一步 |

**给你的建议**：先用路线 A 跑通体验一遍，建立"RAG 能干什么"的直觉；再用路线 B 自己搭一遍，把每一步原理吃透。面试时讲路线 B 才有含金量，但路线 A 能帮你快速验证想法。

---

## 二、RAG 是什么，为什么工业知识库要用它

### 2.1 一句话理解 RAG

RAG 就是"先查资料，再回答问题"。大模型本身的知识是训练时固化的，不知道你公司内部的设备手册、操作规程、故障案例。RAG 的做法是：把这些私有文档提前处理好存起来，用户提问时先从文档里检索出最相关的片段，再把"问题 + 检索到的片段"一起交给大模型，让它基于这些真实资料来回答。

用一个比喻：大模型是一个知识渊博但没读过你公司内部资料的专家；RAG 相当于在他回答前，先把相关的几页手册翻开摆在他面前。

### 2.2 为什么不直接微调模型

初学者常问"为什么不把公司文档拿去微调（fine-tune）模型"。对比一下就清楚了：

| 维度 | RAG | 微调 |
|---|---|---|
| 数据更新 | 文档改了重新入库即可，分钟级 | 要重新训练，成本高、周期长 |
| 可溯源 | 能告诉你答案来自哪份文档哪一段 | 无法定位来源，容易胡编 |
| 成本 | 无需 GPU 训练，只需推理 | 需要算力和标注数据 |
| 防幻觉 | 基于检索到的真实片段回答 | 仍可能编造 |
| 适合场景 | 知识问答、文档检索（大多数企业需求） | 改变模型风格、领域语言习惯 |

工业知识库的核心诉求是"答得准、可追溯、能随文档更新"，这三点全都指向 RAG。微调更多用于让模型学会某种表达风格，而不是记住事实。

### 2.3 岗位为什么强调它

岗位职责 4 原文是"基于 RAG 构建工业智能知识库，完成规程、手册、案例等文档的语料清洗、向量化与集成"。它要的不是"会做聊天机器人"，而是能把企业文档变成**可检索、可追溯、可维护**的知识系统。这正是 RAG 要解决的问题。

---

## 三、RAG 核心流程七步拆解

一套完整 RAG 分两个阶段：**离线建库**（把文档处理进向量库）和**在线问答**（用户提问到出答案）。合起来是七步：

| 步骤 | 阶段 | 做什么 | 关键点 |
|---|---|---|---|
| 1. 文档加载 | 离线 | 读取 PDF/Word/Markdown/HTML/表格 | 去页眉页脚、页码、水印等噪声 |
| 2. 文本切分 | 离线 | 把长文档切成小片段（chunk） | chunk 大小和重叠影响检索质量 |
| 3. 嵌入向量化 | 离线 | 用嵌入模型把每个 chunk 变成向量 | 中文场景选对模型很关键 |
| 4. 向量入库 | 离线 | 把向量 + 原文 + 元数据存进向量库 | 存来源、标题、页码便于溯源 |
| 5. 检索召回 | 在线 | 把问题也向量化，从库里找最相似的 top-k | 相似度检索 / 混合检索 |
| 6. 重排与组装 | 在线 | 对召回结果重排，拼成上下文 Prompt | rerank 提升准确率 |
| 7. 生成答案 | 在线 | 大模型基于上下文生成带引用的答案 | 检索不到要明确说不知道 |

你最初描述的"切分 + 向量化 + 存 Milvus"覆盖的是第 2~4 步（离线建库的核心），第 5~7 步是在线问答部分。把七步连起来，就是一套可用的知识库。

一张流程简图：

```
离线建库：  文档 → 切分 → 嵌入 → 存入向量库(Milvus)
                                        │
在线问答：  用户问题 → 嵌入 → 检索 top-k ┘ → 重排 → 拼上下文 → LLM → 带引用答案
```

---

## 四、两条落地路线对比

| 对比维度 | 路线 A：RAGFlow / Dify 一键部署 | 路线 B：LangChain + Milvus 自建 |
|---|---|---|
| 上手速度 | 快，Docker 起服务后网页操作 | 慢，需要写代码调链路 |
| 是否要写代码 | 基本不用 | 需要 Python |
| 灵活度 | 中，受平台能力限制 | 高，每一步都能定制 |
| 文档解析能力 | RAGFlow 内置强解析（表格/版面） | 需要自己选 loader |
| 生产可控性 | 中，平台黑盒 | 高，全链路可控可测 |
| 适合人群 | 业务人员、快速原型 | 工程师、生产开发、写简历 |
| 面试含金量 | 能说"用过平台" | 能讲清每一步原理，加分明显 |

关系类比：这和 [Agent 框架专项指南](/ai/learning-roadmap/agent-frameworks-guide) 里"Dify 可视化 vs LangChain 代码开发"的取舍完全一致——快速验证用平台，生产定制用代码。

---

## 五、路线 A：RAGFlow 一键部署

### 5.1 RAGFlow 是什么

RAGFlow 是一款开源的 RAG 引擎与应用平台。它的特色是**深度文档理解**——对 PDF、扫描件、表格、版面复杂的文档有很强的解析能力（基于文档结构识别，而不是简单粗暴地按字符切）。它内置了知识库管理、切分可视化、检索测试、智能体（Agent）编排，支持一键部署。

和 Dify 的差异：Dify 是通用的 LLM 应用开发平台（聊天助手/工作流/Agent 都能做），知识库只是其中一块；RAGFlow 更聚焦 RAG 本身，文档解析和检索质量是它的强项。做纯知识库问答，RAGFlow 的解析效果通常更好；要做复杂的多步 AI 应用编排，Dify 更全能。

### 5.2 部署要点

RAGFlow 官方提供 Docker Compose 一键部署，核心步骤（以官方文档为准）：

```bash
# 1. 克隆仓库
git clone https://github.com/infiniflow/ragflow.git
cd ragflow/docker

# 2. 启动（首次会拉取镜像，需要一定时间和磁盘）
docker compose -f docker-compose.yml up -d

# 3. 查看服务状态
docker compose logs -f
```

部署前注意：

- 机器建议 4 核 16GB 内存、50GB 以上磁盘（内置的向量检索和文档解析组件较吃资源）。
- Linux 上需确认 `vm.max_map_count` 满足要求（Elasticsearch 类组件的常见前置条件，官方文档有说明）。
- 起来后浏览器访问对应端口，注册账号 → 配置大模型 API Key（DeepSeek/Qwen/OpenAI 等）→ 建知识库 → 上传文档 → 等待解析完成 → 在对话里提问。

### 5.3 适合场景

- 想在半天内看到"上传手册就能问答"的效果。
- 让工艺/运维工程师（非技术人员）自己维护知识库。
- 文档以 PDF、扫描件、复杂表格为主，需要强解析能力。

---

## 六、路线 B：自建简易 RAG

自己写一遍才能真正理解 RAG，也是面试讲得清楚的前提。下面给一套最小可运行方案。

### 6.1 技术选型

| 环节 | 推荐选择 | 说明 |
|---|---|---|
| 开发框架 | LangChain（或 LlamaIndex） | LangChain 通用，LlamaIndex 更专精 RAG |
| 文档加载 | `PyPDFLoader` / `UnstructuredLoader` | 按文档类型选 loader |
| 文本切分 | `RecursiveCharacterTextSplitter` / `MarkdownHeaderTextSplitter` | 技术文档优先按标题切 |
| 嵌入模型 | `bge-large-zh-v1.5` / `bge-m3`（本地）或通义千问 embedding（API） | 中文场景效果好，见第八节 |
| 向量数据库 | Milvus（生产）/ Chroma（本地起步） | 见第七节 |
| 重排模型 | `bge-reranker-v2-m3` | 可选，明显提升准确率 |
| 大模型 | DeepSeek / Qwen（API） | 兼容 OpenAI 接口，接入简单 |

### 6.2 最小代码骨架

以下是"建库 + 问答"的最小骨架（LangChain + Milvus + bge 嵌入），仅示意主干流程：

```python
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_milvus import Milvus
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# ---------- 离线建库 ----------
# 1. 加载文档
docs = PyPDFLoader("设备操作规程.pdf").load()

# 2. 切分
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=80)
chunks = splitter.split_documents(docs)

# 3+4. 嵌入 + 入库（Milvus）
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-large-zh-v1.5")
vectorstore = Milvus.from_documents(
    chunks,
    embedding=embeddings,
    connection_args={"uri": "http://localhost:19530"},
    collection_name="industrial_docs",
)

# ---------- 在线问答 ----------
# 5. 检索
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# 6+7. 组装上下文 + 生成（带引用）
prompt = ChatPromptTemplate.from_template(
    "你是工业知识库助手。只依据下面提供的资料回答，"
    "资料中没有的内容要明确说'资料中未找到'，不要编造。\n\n"
    "资料：\n{context}\n\n问题：{question}"
)
llm = ChatOpenAI(model="deepseek-chat", base_url="https://api.deepseek.com")

def answer(question: str):
    hits = retriever.invoke(question)
    context = "\n\n".join(
        f"[来源:{d.metadata.get('source')} 第{d.metadata.get('page')}页] {d.page_content}"
        for d in hits
    )
    chain = prompt | llm
    return chain.invoke({"context": context, "question": question}).content

print(answer("反应釜超温时的处置步骤是什么？"))
```

要点说明：

- Prompt 里明确约束"只依据资料回答、没有就说没有"，这是防幻觉的关键。
- 检索片段带上 `source`/`page` 元数据，回答才能溯源。
- 本地没有 Milvus 时，把 `Milvus` 换成 `Chroma` 即可零依赖起步，代码结构不变。

### 6.3 本地起 Milvus

Milvus 官方提供轻量部署方式：

```bash
# 方式一：Milvus Lite（Python 内嵌，最适合本地学习）
pip install pymilvus  # 直接用本地文件作为 uri，无需 Docker

# 方式二：Docker Standalone（更接近生产）
# 下载官方 standalone docker-compose 后
docker compose up -d
```

学习阶段用 Milvus Lite 或 Chroma 即可，不必一上来就上分布式集群。

---

## 七、向量数据库选型对比

| 向量库 | 定位 | 部署复杂度 | 适用阶段 |
|---|---|---|---|
| Chroma | 轻量、纯 Python 易上手 | 极低 | 本地学习、小 Demo |
| FAISS | Facebook 出品的向量检索库 | 低（无服务，内存索引） | 单机、原型、离线批量 |
| Milvus | 面向生产的分布式向量数据库 | 中（Lite 简单，集群复杂） | 生产、数据量大、要扩展 |
| Qdrant | Rust 编写，性能好、带过滤 | 中 | 生产、需要元数据过滤 |
| pgvector | PostgreSQL 扩展 | 低（已有 PG 就顺手） | 已用 Postgres、数据量中等 |

选型建议：

- 学习/原型：Chroma 或 Milvus Lite。
- 生产、要长期扩展、数据量大：Milvus（你问题里提到的选择是对的）。
- 已经在用 PostgreSQL：pgvector 最省事。

---

## 八、嵌入模型选型

嵌入模型决定检索质量，中文工业文档尤其要选对。

| 模型 | 类型 | 特点 |
|---|---|---|
| `bge-large-zh-v1.5` | 开源本地 | 中文效果好，社区常用基准 |
| `bge-m3` | 开源本地 | 多语言、支持稠密/稀疏/多向量混合 |
| `m3e-base` | 开源本地 | 中文老牌，轻量 |
| 通义千问 text-embedding | API | 阿里云，接入简单，免运维 |
| OpenAI text-embedding-3 | API | 质量高，但需外网、有成本 |

权衡三点：维度（影响存储和速度）、速度、质量。数据敏感、要私有化的工业场景，优先本地开源模型（bge 系列）；追求省心、能联网，可用 API 嵌入。**注意：建库和查询必须用同一个嵌入模型**，否则向量空间不一致，检索会失效。

---

## 九、进阶优化手段

跑通基础流程后，按下面顺序优化，收益从高到低：

| 优化项 | 解决什么问题 | 做法 |
|---|---|---|
| 切分策略 | 片段太大噪声多、太小丢上下文 | 技术文档用 Markdown 按标题切；调 `chunk_size`/`overlap` |
| 重排（rerank） | 向量召回的 top-k 排序不够准 | 用 `bge-reranker` 对召回结果二次打分排序 |
| 混合检索 | 关键词（设备编号/术语）向量检索易漏 | 向量检索 + BM25 关键词检索融合 |
| Query 改写 | 用户问法口语化、太短 | 用 LLM 把问题改写/扩展，或 HyDE 生成假设文档再检索 |
| 引用溯源 | 答案无法核对 | 元数据带 source/page，回答附出处 |
| 评估 | 不知道好不好、改了有没有变好 | 用 RAGAS 量化忠实度、相关性、上下文利用率 |

一个常见误区：一上来就堆各种高级技巧。正确顺序是**先把基础链路跑通拿到 baseline，再针对性优化**，每次只改一处并用评估对比效果。

---

## 十、工业场景落地要点

工业知识库有它的特殊性，这几点直接决定项目能不能用：

| 要点 | 说明 |
|---|---|
| 语料清洗 | 规程/手册/案例常是 PDF，要去页眉页脚、水印、目录页；表格要单独处理成结构化文本 |
| 术语与编号 | 设备编号（如 TEMP_001）、工艺缩写要能被检索到，建议加关键词/混合检索 |
| 不许胡编 | 涉及安全规程，答错代价大，Prompt 必须约束"资料没有就说不知道" |
| 带来源 | 答案要能指到"某手册第几页第几段"，方便工程师核对 |
| 可更新 | 文档改版后要能重新入库（增量更新 / 按版本管理 collection） |
| 权限 | 不同角色能看的文档不同，检索时要按权限过滤（元数据过滤） |

这几点也正是岗位拆解里对 RAG 项目的硬性要求（"不允许模型胡编规程、答案要带来源、检索不到要说不知道、文档更新后要能重新入库、要能处理术语和设备编号"）。做作品集时把这些点都覆盖到，面试才立得住。

参照：[生产级 Agent 平台架构全景](/ai/applications/nexbot-architecture-guide) 3.7 节的 DocumentContext 工具（list_documents / search_document / read_document_chunk）就是 RAG 检索能力在生产项目里的一种实现方式，可作为工程化参考。

---

## 十一、选型决策与学习路线

### 11.1 决策树

**第一步：目的是什么？**

- 只想快速看效果 / 给业务人员用 → 路线 A，RAGFlow 一键部署。
- 想理解原理 / 定制 / 写进简历 → 路线 B，自建。

**第二步：数据量和场景？**

- 本地学习、小 Demo → Chroma 或 Milvus Lite。
- 生产、数据量大、要扩展 → Milvus 或 Qdrant。
- 已有 PostgreSQL → pgvector。

**第三步：数据能不能出内网？**

- 不能（工业常见）→ 本地开源嵌入模型（bge）+ 本地/私有化部署大模型或私有 API。
- 能 → 可用云端 embedding 和大模型 API，省运维。

### 11.2 建议学习路线

1. 先用 RAGFlow 一键部署，上传一份设备手册，体验完整问答，建立直觉（半天）。
2. 用 LangChain + Chroma 自己写一遍最小 RAG，跑通七步（1~2 天）。
3. 把向量库换成 Milvus，理解生产向量库的差异（半天）。
4. 加优化：切分策略 → rerank → 引用溯源 → RAGAS 评估（2~3 天）。
5. 做一个"工业规程 RAG 知识库"作品，覆盖清洗、切分、向量化、检索、溯源、评估，写好 README 和运行命令，作为简历项目。

### 11.3 面试高频问题

- RAG 的完整流程是什么？（答七步）
- RAG 和微调怎么选？（数据更新频繁、要溯源、防幻觉用 RAG）
- chunk_size 怎么定？（看文档结构，技术文档按标题切，兼顾上下文完整和噪声）
- 如何选嵌入模型？（中文私有化选 bge 系列，注意建库和查询同模型）
- 怎么优化检索质量？（切分优化 → rerank → 混合检索 → query 改写）
- 怎么评估 RAG？（RAGAS：忠实度、相关性、上下文利用率）
- 怎么防止模型胡编？（Prompt 约束 + 检索不到说不知道 + 带引用溯源）

> **总结**：你最初的思路（切分 + 嵌入 + Milvus）没错，它就是 RAG 建库的核心。补上检索、重排、生成、溯源就是完整方案。学习上先用 RAGFlow 看效果，再用 LangChain + Milvus 自建吃透原理，最后沉淀一个带评估和溯源的工业 RAG 作品，就能直接对上岗位职责 4 的要求。
