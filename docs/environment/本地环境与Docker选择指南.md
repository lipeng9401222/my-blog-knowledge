---
title: 本地环境与 Docker 选择指南
date: 2026-04-29
category: environment
tags:
  - Docker
  - 环境安装
  - MySQL
  - Nginx
  - Maven
  - JDK
  - Node.js
description: 本地安装与 Docker 容器化的选择策略，涵盖 MySQL、Nginx、Maven、JDK、Node 等工具的适用场景与推荐方案
---

# 本地环境与 Docker 选择指南

> 适用场景：本机已经安装了 MySQL、Nginx、Maven、JDK、Tomcat、Node 等环境，同时也安装了 Docker，不确定后续应该使用本地环境还是 Docker。

---

## 1. 先给结论

如果你本地已经安装了 MySQL、Nginx、Maven 等工具，并不代表 Docker 就没用了。

更推荐的方式是：

| 场景 | 推荐选择 |
| --- | --- |
| 日常写代码、调试后端 | 本地 IDE + 本地 JDK + 本地 Maven |
| 前端开发调试 | 本地 Node / pnpm / VS Code |
| 快速启动数据库、Redis、Nginx 等依赖 | Docker |
| 不想污染本机环境 | Docker |
| 多项目版本冲突，例如 A 项目 MySQL 5.7，B 项目 MySQL 8 | Docker |
| 测试环境部署 | Docker / Docker Compose |
| 生产环境部署 | 优先 Docker 镜像化部署，数据库按公司规范处理 |
| 公司已有统一数据库、中间件 | 应用用 Docker，数据库连接外部服务 |

一句话：

> 本地环境适合"开发调试"，Docker 适合"统一运行和部署"。

---

## 2. 本地安装和 Docker 的核心区别

### 2.1 本地安装是什么

本地安装就是把软件直接安装到你的电脑系统里。

比如：

- MySQL 安装到 macOS / Windows 本机。
- Nginx 安装到本机目录。
- Maven 安装到本机目录，并配置环境变量。
- JDK 安装到本机目录。
- Tomcat 解压到本机目录。

优点：

- 使用直观。
- IDE 调试方便。
- 性能通常更好。
- 对开发人员来说更熟悉。

缺点：

- 容易污染本机环境。
- 多项目版本容易冲突。
- 环境迁移麻烦。
- 换电脑需要重新安装一遍。
- 和同事环境不一致时容易出现问题。

---

### 2.2 Docker 是什么

Docker 是把程序运行所需的环境打包成镜像，然后通过容器运行。

比如：

- 不在本机安装 MySQL，而是运行一个 MySQL 容器。
- 不在本机安装 Nginx，而是运行一个 Nginx 容器。
- 不在服务器手动装 Tomcat，而是把 Tomcat + war 包做成一个镜像。

优点：

- 环境一致。
- 启停方便。
- 删除干净。
- 多版本共存方便。
- 适合部署和交付。
- 可以用 `docker-compose.yml` 一键启动多服务。

缺点：

- 需要学习 Docker 命令。
- 容器内外路径、端口、网络要理解。
- 本地调试有时不如直接本地启动方便。
- 在 Mac 上跑部分老镜像可能有 ARM 架构兼容问题。

---

## 3. Maven、JDK、Node 这类工具是否需要 Docker 化

### 3.1 Maven 推荐本地保留

Maven 是构建工具，不是运行服务。

日常开发中通常还是建议本地保留 Maven，原因是：

- IDE 需要用 Maven 导入项目。
- 本地打包、下载依赖更方便。
- 后端开发调试时用本地 Maven 更自然。

Docker 里也可以使用 Maven，但更适合以下场景：

- CI/CD 自动构建。
- 保证构建环境一致。
- 公司流水线统一打包。

普通开发建议：

- 本地 Maven：用于开发和打包。
- Docker Maven：用于流水线构建或特殊隔离场景。

---

### 3.2 JDK 推荐本地保留

如果你是后端开发，本地 JDK 仍然建议保留。

原因：

- IDE 启动项目需要 JDK。
- Debug 断点调试更方便。
- 跑单元测试更方便。

Docker 里的 JDK 更适合：

- 运行 jar。
- 构建后端镜像。
- 统一服务器运行环境。

普通开发建议：

- 本地 JDK：开发、调试。
- Docker JDK：运行部署包、生产发布。

---

### 3.3 Node / pnpm 推荐本地保留

前端开发一般还是建议本地安装 Node、pnpm、VS Code。

原因：

- 热更新更快。
- IDE 插件和调试方便。
- 修改代码后即时预览方便。

Docker 也可以跑前端，但通常适合：

- 构建前端镜像。
- 部署打包后的 dist。
- CI/CD 自动构建。

普通开发建议：

- 本地 Node/pnpm：开发、调试、打包。
- Docker Nginx：部署前端 dist。

---

## 4. MySQL 应该本地装还是 Docker 跑

### 4.1 适合用本地 MySQL 的情况

你可以继续使用本地 MySQL，如果：

- 你只做一个项目。
- 公司项目统一就是这个 MySQL 版本。
- 本地已经配置好，不想迁移。
- 数据库数据需要长期保留。
- 你不想处理容器数据卷和端口映射。

本地 MySQL 的典型使用方式：

- 后端项目直接连接 `127.0.0.1:3306`。
- 数据用 DBeaver、Navicat、MySQL Workbench 管理。

---

### 4.2 适合用 Docker MySQL 的情况

推荐使用 Docker MySQL，如果：

- 不同项目需要不同 MySQL 版本。
- 想快速创建、删除数据库环境。
- 不想污染本机环境。
- 想让同事直接使用同一套环境配置。
- 测试环境希望一键部署。
- 需要模拟服务器环境。

例如：

- A 项目使用 MySQL 5.7。
- B 项目使用 MySQL 8.0。
- C 项目需要一个干净的临时数据库。

这种情况下，用 Docker 更方便。

---

### 4.3 本地 MySQL 和 Docker MySQL 不能同时占用同一个端口

如果你本地 MySQL 已经占用了 `3306`，Docker MySQL 再映射 `3306:3306` 就会失败。

解决方案有三种：

#### 方案一：继续用本地 MySQL

Docker Compose 中不启动 MySQL，后端直接连接本机数据库。

#### 方案二：停掉本地 MySQL，用 Docker MySQL 占用 3306

适合你想完全切到 Docker 管理数据库时使用。

#### 方案三：Docker MySQL 改成本机其他端口

例如映射为：

```yaml
ports:
  - "3307:3306"
```

这样：

- 容器内部 MySQL 还是 `3306`。
- 你本机访问 Docker MySQL 用 `127.0.0.1:3307`。
- 本地原来的 MySQL 仍然用 `127.0.0.1:3306`。

---

## 5. Nginx 应该本地装还是 Docker 跑

### 5.1 适合用本地 Nginx 的情况

你可以继续使用本地 Nginx，如果：

- 你已经熟悉本地 Nginx 配置。
- 只是自己开发联调。
- 不需要多项目同时运行多个 Nginx。
- 本机路径比较固定。

---

### 5.2 适合用 Docker Nginx 的情况

推荐使用 Docker Nginx，如果：

- 想模拟服务器部署。
- 想把 Nginx 配置和项目放在一起。
- 想用 Docker Compose 一键启动。
- 多项目 Nginx 配置不同，怕互相影响。
- 前端 dist 想用标准方式部署。

Docker Nginx 的好处是：

- 删除容器不会影响本机 Nginx。
- 每个项目可以有自己的 Nginx 配置。
- 路径和配置都放在项目部署目录里，更容易迁移。

---

## 6. Tomcat 应该本地装还是 Docker 跑

### 6.1 开发调试推荐本地 Tomcat 或 IDE 内置运行

如果你是后端开发，需要断点调试，推荐：

- Eclipse / IDEA 中直接启动。
- 或者使用本地 Tomcat。

这样最方便调试代码。

---

### 6.2 部署验证推荐 Docker Tomcat

如果你已经打包出 `war`，想模拟部署环境，推荐用 Docker Tomcat。

原因：

- 可以更接近服务器运行方式。
- 不需要手动复制 war 到本地 Tomcat。
- 可以把 Tomcat 版本固定下来。
- 后续测试、生产可以复用同一套镜像。

---

## 7. 推荐组合方案

### 7.1 后端开发人员推荐组合

推荐：

| 工具 | 建议 |
| --- | --- |
| JDK | 本地安装 |
| Maven | 本地安装 |
| IDE | 本地安装 |
| MySQL | 本地或 Docker，根据项目选择 |
| Redis | Docker，除非公司要求本地安装 |
| Nginx | Docker 或本地均可，部署验证推荐 Docker |
| Tomcat | 开发用本地/IDE，部署验证用 Docker |

推荐工作方式：

1. 本地 IDE 写代码。
2. 本地 JDK/Maven 编译调试。
3. MySQL 可以本地，也可以 Docker。
4. 打包后用 Docker Tomcat 验证部署效果。
5. 前端 dist 用 Docker Nginx 验证访问效果。

---

### 7.2 前端开发人员推荐组合

推荐：

| 工具 | 建议 |
| --- | --- |
| VS Code | 本地安装 |
| Node / nvm / pnpm | 本地安装 |
| Nginx | 部署验证用 Docker |
| 后端接口 | 连接本地后端、测试环境后端或 Docker 后端 |

推荐工作方式：

1. 本地启动前端开发服务。
2. 接口代理到后端。
3. 打包后生成 `dist`。
4. 用 Docker Nginx 验证正式部署路径。

---

### 7.3 测试/交付人员推荐组合

推荐尽量使用 Docker Compose。

原因：

- 不需要关心每个工具怎么安装。
- 拿到部署目录后，一条命令启动。
- 环境更统一。
- 出问题时方便把日志、配置、容器状态发给开发排查。

推荐工作方式：

1. 准备 `docker-compose.yml`。
2. 准备 `.env`。
3. 准备后端包、前端 dist、初始化 SQL。
4. 执行 `docker compose up -d`。
5. 通过 `docker compose logs -f` 查看日志。

---

### 7.4 生产环境推荐组合

生产环境不建议所有东西都随意容器化，要按公司规范来。

推荐：

| 服务 | 建议 |
| --- | --- |
| 前端 Nginx | 可以 Docker 化 |
| 后端服务 | 推荐 Docker 镜像化 |
| MySQL | 优先使用公司统一数据库服务；如容器化必须做好备份和持久化 |
| Redis / MQ | 优先使用公司统一中间件；如容器化必须做好高可用和持久化 |
| 日志 | 挂载宿主机目录或接入公司日志平台 |
| 配置 | 外置，不要写死在镜像里 |

生产环境重点不是"能跑起来"，而是：

- 可回滚。
- 可备份。
- 可监控。
- 可恢复。
- 版本可追踪。
- 配置不泄露。

---

## 8. 如何选择：决策表

### 8.1 MySQL 选择表

| 问题 | 选择建议 |
| --- | --- |
| 本机已安装 MySQL，且只有一个项目使用 | 继续用本地 MySQL |
| 多个项目 MySQL 版本不同 | 用 Docker MySQL |
| 想快速初始化一套干净数据库 | 用 Docker MySQL |
| 生产环境 | 优先公司统一数据库，不建议随便用单机容器 MySQL |
| 本地 3306 已占用 | Docker 改映射端口，如 `3307:3306` |

---

### 8.2 Nginx 选择表

| 问题 | 选择建议 |
| --- | --- |
| 只想简单本地调试 | 本地 Nginx 或前端 dev server |
| 想模拟真实部署路径 | Docker Nginx |
| 多项目配置容易冲突 | Docker Nginx |
| 生产环境 | Docker Nginx 或服务器统一 Nginx，按公司规范 |

---

### 8.3 Maven/JDK 选择表

| 问题 | 选择建议 |
| --- | --- |
| 日常开发调试 | 本地 JDK + 本地 Maven |
| CI/CD 自动构建 | Docker Maven 或流水线固定构建环境 |
| 生产运行 jar/war | Docker 镜像内置 JDK/Tomcat |

---

## 9. 你当前最推荐的落地方式

结合你现在的情况：

- 本机已经装了 MySQL、Nginx、Maven 等。
- Docker 也已经安装成功。
- 你还没开始用 Docker 部署项目。

建议你不要立刻把所有本地环境删掉，也不要强行所有东西都 Docker 化。

推荐采用"混合模式"：

### 开发阶段

使用：

- 本地 JDK。
- 本地 Maven。
- 本地 IDE。
- 本地 Node/pnpm。

可选：

- MySQL 用本地或 Docker。
- Nginx 用 Docker 做部署验证。
- Redis、MQ 这类依赖优先用 Docker。

### 部署验证阶段

使用 Docker Compose：

- 后端容器。
- 前端 Nginx 容器。
- 可选 MySQL 容器。
- 可选 Redis 容器。

### 公司测试/生产阶段

使用：

- Docker 镜像。
- Docker Compose 或公司容器平台。
- 公司镜像仓库。
- 外置配置。
- 外置日志。
- 外置数据库或持久化数据库。

---

## 10. 注意事项

### 10.1 不要重复启动同一个端口

常见冲突：

| 服务 | 默认端口 |
| --- | --- |
| MySQL | `3306` |
| Nginx | `80` |
| Tomcat | `8080` |
| Redis | `6379` |

如果本地已经有服务占用端口，Docker 再映射同一个端口会失败。

解决：

- 停掉本地服务。
- 或修改 Docker 映射端口。

---

### 10.2 不要把数据库数据只放在容器内部

容器删除后，容器内部数据可能丢失。

MySQL、Redis、上传文件、附件目录必须做持久化。

常见方式：

- Docker Volume。
- 宿主机目录挂载。
- 公司统一存储。

---

### 10.3 不要把密码写进镜像

错误方式：

- Dockerfile 里写数据库密码。
- 前端代码里写生产密码。
- 镜像里内置生产配置。

推荐方式：

- `.env`。
- 外部配置文件。
- 公司配置中心。
- CI/CD 密钥变量。

---

### 10.4 不要生产环境使用 `latest`

生产环境镜像版本必须明确，例如：

- `project-backend:1.0.0`
- `project-backend:1.0.1`
- `project-frontend:2025.01.15`

不要使用：

- `project-backend:latest`

否则后续无法准确回滚和追踪问题。

---

## 11. 最终建议

你的本地环境和 Docker 不是二选一，而是各自负责不同阶段。

推荐最终策略：

1. **开发工具本地化**
   - JDK、Maven、Node、pnpm、IDE 保留本地。

2. **依赖服务容器化**
   - MySQL、Redis、Nginx、Tomcat 可以逐步用 Docker 管理。

3. **部署流程容器化**
   - 测试和生产尽量使用 Docker 镜像 + Docker Compose 或公司容器平台。

4. **生产数据谨慎容器化**
   - 数据库是否容器化要看公司规范，不能只图方便。

5. **先从 Nginx 或 Redis 这类低风险服务开始练手**
   - 不建议一开始就把生产数据库放进 Docker。

---

## 12. 你可以按这个顺序实践

### 第一步：保留现有本地环境

不要删除已经安装好的 MySQL、Nginx、Maven、JDK。

### 第二步：用 Docker 跑一个 Nginx 测试容器

目标：熟悉容器启动、端口映射、日志查看、删除容器。

### 第三步：用 Docker 跑一个独立 MySQL，端口映射到 3307

这样不会影响本地已有 MySQL。

示例思路：

- 本地 MySQL：`127.0.0.1:3306`
- Docker MySQL：`127.0.0.1:3307`

### 第四步：把前端 dist 放到 Docker Nginx 里跑

目标：验证正式部署路径和接口代理。

### 第五步：把后端 war/jar 做成 Docker 镜像

目标：验证后端容器化。

### 第六步：用 Docker Compose 串起来

最终形成：

- 前端 Nginx。
- 后端服务。
- 数据库或外部数据库连接。
- 日志挂载。
- 配置挂载。

### 第七步：迁移到公司测试环境

测试环境稳定后，再考虑生产环境发布流程。
