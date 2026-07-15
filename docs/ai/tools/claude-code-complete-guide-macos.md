---
title: Claude Code 完整操作指南（macOS 版）
date: 2026-06-08
category: ai
tags:
  - ai
  - claude-code
  - cli
  - coding-assistant
  - anthropic
  - tools
  - agent
description: 一份面向开发者的 Claude Code 详细使用手册，涵盖安装配置、日常操作、模型管理、第三方接入、API 中转站搭建、高级功能及常见问题。
---

# Claude Code 完整操作指南（macOS 版）

> 一份面向开发者的详细使用手册，涵盖安装配置、日常操作、模型管理、高级功能及常见问题。

---

## 一、安装与启动

### 1.1 系统要求

- macOS Monterey (12.x) 或更高版本
- 已安装 [Node.js](https://nodejs.org/)（LTS 版本，推荐 18+）
- 稳定的网络连接（首次启动需浏览器授权）

### 1.2 安装 Claude Code

打开终端（Terminal.app 或 iTerm2），执行以下任一命令：

```bash
# 方式一：使用 npm 全局安装（推荐）
npm install -g @anthropic-ai/claude-code

# 方式二：使用 Homebrew
brew install --cask claude-code

# 方式三：官方安装脚本
curl -fsSL https://claude.ai/install.sh | bash
```

验证安装：

```bash
claude --version
# 输出示例：Claude Code v1.2.3
```

### 1.3 在指定项目中启动

```bash
# 进入你的项目目录
cd /Users/你的用户名/Workspace/your-project

# 启动 Claude Code
claude
```

**常用启动参数：**

| 参数 | 说明 | 示例 |
|------|------|------|
| `-c` | 继续上一次会话 | `claude -c` |
| `-p "指令"` | 单次执行后自动退出 | `claude -p "解释 package.json"` |
| `--model <模型名>` | 指定默认模型 | `claude --model claude-sonnet-4-20250514` |
| `--permission-mode plan` | 直接进入计划模式 | `claude --permission-mode plan` |

### 1.4 首次启动授权

- 终端会显示一个链接，按回车自动打开浏览器。
- 登录 Anthropic 账号（若没有需注册）。
- 授权成功后，令牌会保存在本地，下次无需重复登录。

> 如果浏览器未自动打开，可以手动复制链接到浏览器完成授权。

---

## 二、基本使用

### 2.1 核心交互方式

在 Claude Code 会话窗口中，你可以直接输入自然语言指令：

| 输入类型 | 语法 | 示例 |
|----------|------|------|
| 自然语言 | 直接描述需求 | "请给这个 React 组件增加一个 loading 状态" |
| 引用文件 | `@文件路径` | `@src/utils/formatDate.ts` |
| 引用文件夹 | `@文件夹路径` | `@components/Button/` |
| 执行命令 | `!命令` | `! npm run lint` |
| 多文件引用 | 用空格分隔 | `@A.js @B.css 对比它们的样式差异` |

**自动补全**：输入 `@` 或 `!` 后按 `Tab` 键可触发路径或命令补全。

### 2.2 常用斜杠命令（会话内输入 `/` 调出）

| 命令 | 作用 | 使用场景 |
|------|------|----------|
| `/init` | **新项目必用**：扫描项目生成 `CLAUDE.md` 配置文件 | 首次进入项目，让 AI 理解项目结构 |
| `/model` | 切换模型 | 根据任务选择更合适模型 |
| `/cost` | 查看当前会话的 Token 消耗和费用 | 控制预算，监控用量 |
| `/memory` | 编辑 AI 的记忆文件，设定全局规则 | 让 AI 记住你的代码风格、命名规范 |
| `/compact` | 压缩上下文（保留关键信息，丢弃旧对话） | 会话过长导致响应变慢时使用 |
| `/clear` | 清空当前会话全部历史 | 开启全新话题 |
| `/status` | 查看当前会话状态（模型、模式、Token 用量） | 快速确认配置 |
| `/plan` | 进入计划模式（详见第四节） | 需要只读分析时 |
| `/help` | 显示所有可用命令 | 忘记某个命令时 |

### 2.3 三种工作模式

按下 `Shift + Tab` 可以循环切换工作模式：

| 模式 | 图标 | 行为 | 适用场景 |
|------|------|------|----------|
| **Normal（默认）** | - | 每次修改文件前需要确认 | 日常开发，安全第一 |
| **Auto-Accept** | - | 自动修改文件，命令执行仍需确认 | 批量操作、重复性任务 |
| **Plan Mode** | - | 只读模式，不修改任何文件，不执行命令 | 架构分析、方案设计 |

> 提示：在 Plan Mode 下，AI 会先给出详细的计划，你可以按 `Ctrl + G` 用编辑器修改计划，确认后再切换回其他模式执行。

### 2.4 会话内常用操作

- **换行输入**：按 `Shift + Enter`（不发送消息）
- **打断 AI**：按 `Ctrl + C`（当 AI 跑偏或生成过长时使用）
- **撤销最后一次文件改动**：快速按两次 `Esc`（救命键，比 Git 回滚还快）
- **搜索命令历史**：按 `Ctrl + R`
- **退出会话**：按 `Ctrl + D`

---

## 三、模型切换与配置

### 3.1 会话内切换（最直接）

```bash
/model                # 弹出交互式选择列表，方向键选择
/model sonnet         # 切换到 Sonnet 4.6
/model opus           # 切换到 Opus 4.6
/model haiku          # 切换到 Haiku 4.5
```

### 3.2 启动时指定模型

```bash
claude --model claude-sonnet-4-20250514
```

### 3.3 模型推荐策略

| 模型 | 特点 | 性价比 | 最佳用途 |
|------|------|--------|----------|
| **Sonnet** | 均衡、速度快、代码质量高 | 最高 | 日常编码、重构、调试、编写单元测试 |
| **Opus** | 最强大、推理深、成本高 | 中等 | 复杂架构设计、关键代码审查、疑难 Bug 分析 |
| **Haiku** | 极快、便宜、回答简洁 | 较高 | 快速问答、简单脚本、解释代码片段 |

**日常建议**：默认使用 Sonnet，遇到复杂问题临时切换到 Opus，琐碎任务用 Haiku。

### 3.4 持久化模型配置

创建或修改 `~/.claude/settings.json`，可以设置默认模型：

```json
{
  "env": {
    "ANTHROPIC_MODEL": "claude-sonnet-4-20250514"
  }
}
```

保存后，每次启动 Claude Code 都会使用该模型。

---

## 四、计划模式（Plan Mode）

### 4.1 什么是计划模式？

计划模式是 Claude Code 的 **"先规划，后执行"** 安全机制。在此模式下，AI **不会修改任何文件**，也不会执行终端命令，而是生成一份详细的实施计划供你审核。

### 4.2 如何开启计划模式？

| 方法 | 操作 |
|------|------|
| **快捷键** | 按两次 `Shift + Tab`（Normal -> Plan -> Auto-Accept） |
| **命令** | 在会话中输入 `/plan` |
| **启动参数** | `claude --permission-mode plan` |
| **默认模式** | 在 `~/.claude/settings.json` 中设置 `"permissions": { "defaultMode": "plan" }` |

### 4.3 计划模式下的交互流程

1. **进入计划模式**（终端提示符变为 `[Plan Mode]`）。
2. **发布指令**，例如：
   > "在不修改代码的前提下，分析 `UserController.java` 现有的权限校验逻辑，并制定一个增加登录日志功能的实施方案。"
3. **AI 生成计划**（Markdown 格式，包含步骤、涉及文件、潜在风险）。
4. **编辑计划**（可选）：
   - 按 `Ctrl + G` 打开系统默认编辑器（如 VS Code、Vim）直接修改计划。
   - 删除不合理步骤，补充业务细节。
5. **确认计划**：
   - 切回 **Normal** 或 **Auto-Accept** 模式（`Shift + Tab`）。
   - 输入："计划已确认，请开始执行。"
6. **AI 按照计划逐步实施**。

### 4.4 典型使用场景

- **重构前分析**：让 AI 评估改动范围和影响。
- **新功能设计**：先让 AI 输出技术方案，团队 Review 后再落地。
- **学习代码库**：在不污染代码的前提下理解复杂模块。

---

## 五、接入第三方模型（以阿里云百炼 Kimi 为例）

### 5.1 原理简介

Claude Code 默认连接 Anthropic 官方 API。通过修改 `ANTHROPIC_BASE_URL` 和 `ANTHROPIC_AUTH_TOKEN`，可以将其指向任何兼容 Anthropic 接口的第三方服务，例如阿里云百炼提供的 Kimi 模型。

### 5.2 准备工作

1. 登录 [阿里云百炼控制台](https://bailian.console.aliyun.com/)。
2. 确保已开通 **Coding Plan**（推荐）或 **Token Plan**。
3. 在 **API-KEY 管理** 中创建密钥，并选择 **北京地域**。
4. 记下你的 API Key 和对应的 **Base URL** 及 **模型名称**。

### 5.3 配置方式

#### 方式一：环境变量（临时生效）

在终端中执行：

```bash
# Coding Plan 示例
export ANTHROPIC_BASE_URL="https://coding.dashscope.aliyuncs.com/apps/anthropic"
export ANTHROPIC_AUTH_TOKEN="sk-sp-xxxxxxxx"
export ANTHROPIC_MODEL="kimi-k2.5"

# 然后在同一终端启动 Claude Code
claude
```

#### 方式二：配置文件（永久生效）

编辑 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://coding.dashscope.aliyuncs.com/apps/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "sk-sp-xxxxxxxx",
    "ANTHROPIC_MODEL": "kimi-k2.5"
  },
  "useCustomApi": true
}
```

#### 方式三：启动时指定模型

```bash
claude --model kimi-k2.5
```

### 5.4 验证接入

启动 Claude Code 后，发送一条简单消息：

```
你好，请自我介绍一下
```

如果 Kimi 正常回复，说明接入成功。

### 5.5 常见错误与解决

| 错误信息 | 原因 | 解决方案 |
|----------|------|----------|
| `403 permission_error` | API Key 地域不是北京 | 重新在百炼控制台创建北京地域的 Key |
| `404 not_found_error` | Base URL 错误或路径不完整 | 检查是否多加了 `/v1` 等后缀，严格按照文档填写 |
| `Invalid model name` | 模型名称与套餐不匹配 | 登录控制台「模型广场」查看可用模型 |
| `401 Unauthorized` | API Key 无效或过期 | 重新生成 Key 并更新配置 |

---

## 六、搭建 API 中转站（多账号管理）

### 6.1 为什么要搭建中转站？

- 你拥有多个 AI 服务账号（如多个 Trae 账号、多个百炼 Key），想统一管理。
- 需要负载均衡、故障自动切换、用量统计。
- 团队内部多人使用，需分配独立令牌和配额。

### 6.2 方案对比

| 方案 | 核心功能 | 技术门槛 | 推荐场景 |
|------|----------|----------|----------|
| **应用内负载均衡** | 代码内轮询多个 Key | 低 | 本地单个项目，快速集成 |
| **One API** | Web 管理界面、多用户、令牌、额度 | 低 | **推荐**：个人或小团队，可视化操作 |
| **LiteLLM Gateway** | 高级路由、熔断、Redis 限流、Failover | 中 | 生产环境、高并发 |
| **Sub2API** | 将订阅账号（如 Trae）转为标准 API | 中 | 专门处理多个 Trae 账号池 |

### 6.3 快速部署 One API（推荐）

**步骤 1：使用 Docker 运行**

```bash
docker run -d --restart always \
  -p 3000:3000 \
  -v /your/data/folder:/data \
  --name one-api \
  justsong/one-api
```

**步骤 2：访问管理后台**

浏览器打开 `http://localhost:3000`，默认账号 `root`，密码 `123456`（首次登录强制修改密码）。

**步骤 3：添加上游渠道**

- 点击「渠道」->「添加渠道」。
- 类型选择 `Claude` 或 `OpenAI`（根据上游接口类型）。
- 填入你的 API Key（例如多个 Trae 账号的 Key，或阿里云百炼 Key）。
- 支持设置权重、模型映射、速率限制。

**步骤 4：生成访问令牌**

- 点击「令牌」->「添加令牌」。
- 设置令牌名称、过期时间、额度（如 100 万 Token）。
- 生成后复制令牌（形如 `sk-xxxx`）。

**步骤 5：配置 Claude Code**

```bash
export ANTHROPIC_BASE_URL="http://localhost:3000"
export ANTHROPIC_AUTH_TOKEN="sk-xxxx"
claude
```

或者写入 `~/.claude/settings.json`。

**步骤 6：验证**

启动 Claude Code 发送消息，One API 后台会显示请求日志，并自动轮询你配置的多个上游 Key。

### 6.4 高级：使用 LiteLLM Gateway（适用于高并发）

```bash
# 安装
pip install 'litellm[proxy]'

# 创建配置文件 config.yaml
cat > config.yaml << EOF
model_list:
  - model_name: claude-3-sonnet
    litellm_params:
      model: claude-3-sonnet-20241022
      api_key: trae_key_1
      rpm: 100       # 每分钟请求限制
  - model_name: claude-3-sonnet
    litellm_params:
      model: claude-3-sonnet-20241022
      api_key: trae_key_2
      rpm: 100
litellm_settings:
  num_retries: 3     # 失败重试次数
  request_timeout: 60
EOF

# 启动网关
litellm --config config.yaml --port 4000
```

然后将 Claude Code 的 Base URL 指向 `http://localhost:4000`。

### 6.5 专用方案：Sub2API（Trae 账号池）

如果你持有多个 Trae 付费账号，可以使用 Sub2API 将它们转化为统一的 API 接口：

```bash
git clone https://github.com/Wei-Shaw/sub2api
cd sub2api/deploy
docker compose up -d
```

配置账号信息（编辑 `accounts.json`），即可获得兼容 OpenAI 的 API 端点。

---

## 七、文件选择与上下文引用

### 7.1 使用 `@` 引用文件

```bash
# 相对路径
@src/main/java/com/example/UserService.java

# 绝对路径（支持 Tab 补全）
@/Users/yourname/Workspace/project/pom.xml

# 引用多个文件
@A.java @B.java 比较这两个文件的差异
```

### 7.2 拖拽文件到终端

直接从 macOS 的 **访达（Finder）** 中将一个或多个文件拖入 Claude Code 的终端窗口，路径会自动插入。

### 7.3 通配符或文件夹

```bash
# 引用所有 Java 文件（注意 Token 消耗）
@src/main/java/**/*.java

# 引用当前目录下所有 JSON 配置文件
@*.json
```

### 7.4 直接粘贴内容

在编辑器中选中代码并复制（`Cmd + C`），然后切换到 Claude Code 直接粘贴（`Cmd + V`），AI 会自动识别为文本内容。

### 7.5 引用上次命令输出

执行 `!` 命令后，其输出结果会自动保存在上下文中。你也可以使用 `$` 显式引用：

```bash
! ls -la
# 然后说：请解释一下 $ 中列出的文件权限
```

### 7.6 高效上下文管理技巧

- **限制引用文件数量**：一次不要超过 10-15 个文件，以免超出上下文窗口。
- **使用 `/compact`**：当会话很长、响应变慢时，执行 `/compact` 压缩历史。
- **使用 `/clear`**：切换到全新任务时，清空历史以避免干扰。

---

## 八、常见安全确认与故障排查

### 8.1 命令行授权确认

Claude Code 执行任何终端命令前都会请求授权：

```
Do you want to proceed?
> 1. Yes
  2. Yes, allow reading from scripts/ from this project
  3. No
```

- **1. Yes**：仅允许本次执行。
- **2. Yes, allow from this project**：允许该项目下同类操作不再询问（推荐用于可信的项目）。
- **3. No**：拒绝执行。

> 对于无害的查询命令（`ls`、`cat`、`git status`），通常选择 **1**。对于陌生的命令（如 `rm -rf`），务必确认后再允许。

### 8.2 常见错误及解决

| 错误现象 | 可能原因 | 解决方案 |
|----------|----------|----------|
| `Command not found: claude` | Claude Code 未安装或 PATH 未配置 | 重新安装，或执行 `npm install -g @anthropic-ai/claude-code` |
| `Authentication failed` | 授权令牌过期或无效 | 删除 `~/.claude/credentials`，重新运行 `claude` 进行浏览器授权 |
| `Rate limit exceeded` | 触发了 API 频率限制 | 降低请求速度，或使用中转站（如 One API）配置轮询 |
| `Context length exceeded` | 会话内容超过模型最大上下文 | 执行 `/compact` 或 `/clear`，重启会话 |
| `Model not found` | 模型名称写错或无权访问 | 执行 `/model` 查看可用模型列表 |
| `Network timeout` | 网络不稳定或代理设置问题 | 检查代理配置；设置环境变量 `API_TIMEOUT_MS=600000` |

### 8.3 重置 Claude Code

如果遇到持续问题，可以重置配置：

```bash
# 备份配置文件（可选）
cp ~/.claude/settings.json ~/.claude/settings.json.bak

# 删除配置目录
rm -rf ~/.claude

# 重新启动，会重新引导配置
claude
```

---

## 九、快捷键速查表

| 快捷键 | 作用 |
|--------|------|
| `Shift + Enter` | 多行输入换行（不发送） |
| `Ctrl + C` | 打断当前 AI 生成 |
| `Esc` 两次 | 撤销上一次文件改动 |
| `Shift + Tab` | 循环切换模式（Normal -> Plan -> Auto-Accept） |
| `Ctrl + R` | 搜索命令历史 |
| `Ctrl + D` | 退出 Claude Code |
| `Ctrl + G` | （在 Plan Mode 下）打开编辑器修改计划 |
| `Ctrl + L` | 清屏（类似终端 `clear`） |
| `Tab` | 补全文件路径或命令（输入 `@` 或 `!` 后） |
| `Up` / `Down` | 浏览历史输入消息 |

> **macOS 特殊配置**：如需使用 `Alt` 组合键（如 `Alt + M`），请在 iTerm2 中设置：`Settings -> Profiles -> Keys -> Left Option key -> Esc+`。

---

## 十、常见问题 FAQ

### Q1：Claude Code 是否免费？

Claude Code 本身是 Anthropic 提供的命令行工具，但调用 API 会产生费用（按 Token 计费）。新用户通常有免费试用额度。

### Q2：我可以同时使用多个模型吗？

可以。会话内随时用 `/model` 切换，或者通过搭建中转站实现多个模型/Key 的自动轮询。

### Q3：如何让 AI 记住我的代码规范？

使用 `/memory` 命令，在打开的编辑器中写入规则，例如：

```
请遵循以下规范：
- 使用 2 空格缩进
- 变量名使用 camelCase
- 所有公共方法必须包含 Javadoc
```

Claude Code 会将这些规则作为系统提示，应用于后续对话。

### Q4：Claude Code 支持本地模型（如 Ollama）吗？

目前官方不支持直接接入本地模型，但可以通过兼容 OpenAI API 的中转工具（如 LiteLLM）将本地模型包装成 Anthropic 风格接口，然后接入。

### Q5：如何查看我用了多少 Token？

会话内执行 `/cost`，会显示当前会话 Token 消耗和预估费用。

### Q6：我能在 CI/CD 中使用 Claude Code 吗？

可以，使用 `-p` 参数进行非交互式调用：

```bash
claude -p "审查这个 PR 的代码变更" --output-format json
```

但需要注意设置环境变量 `ANTHROPIC_API_KEY` 避免浏览器授权。

### Q7：为什么我拖拽文件后路径变成了绝对路径？

这是正常现象。Claude Code 支持绝对路径，可以正常访问文件内容。如果不想显示完整用户路径，可以用 `@./relative/path`。

### Q8：计划模式下 AI 生成计划后，如何修改？

按 `Ctrl + G` 打开系统编辑器（可设置默认编辑器，如 `export EDITOR=code`）。修改保存后，Claude Code 会自动读取新计划。

---

## 附录：示例工作流

### 场景：开发一个新功能

```bash
# 1. 进入项目
cd /Users/yourname/Workspace/your-project

# 2. 启动 Claude Code
claude

# 3. 新项目初始化（首次）
/init

# 4. 进入计划模式
/plan

# 5. 发布需求
"我需要为需求管理模块新增一个'需求优先级排序'功能。请先分析现有的 Controller 和 Service，制定一个实施方案。"

# 6. AI 生成计划，按 Ctrl+G 微调

# 7. 切换回 Normal 模式，执行
Shift + Tab
"按计划开始实施"

# 8. 实施过程中引用文件
"@RequirementService.java 请实现第 3 步中的排序算法"

# 9. 需要切换模型
/model opus
"请对刚才的算法进行性能优化分析"

# 10. 查看费用
/cost

# 11. 完成，退出
Ctrl + D
```

---

## 相关资源

- 官方文档：[Claude Code 用户指南](https://docs.anthropic.com/claude-code)
- 阿里云百炼：[Coding Plan 接入文档](https://help.aliyun.com/zh/model-studio/developer-reference/use-coding-plan)
- One API GitHub：[justsong/one-api](https://github.com/songquanpeng/one-api)
- LiteLLM 文档：[litellm.vercel.app](https://litellm.vercel.app/)

---

*本指南基于 Claude Code v1.2+ 及 macOS 环境编写，更新于 2026 年 6 月。*
