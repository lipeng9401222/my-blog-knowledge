---
title: 后端：Tomcat 插件（war）启动
sidebar: auto
collapsable: true
---

# 后端：Tomcat 插件（war）启动

## 目的

从公司仓库拉取后端代码，配置数据库连接，并用 Maven 的 Tomcat 插件（`tomcat7:run`）启动后端服务。

## 前置条件（必须满足）

- 你已经完成数据库准备（至少能连通应用账号）：[准备环境（数据库）](../准备环境/)
- JDK 1.8 可用（后端要求不高于 1.8）
- Maven 可用
- Git 可用
- 你能访问公司 GitLab（文档里是内网地址 `192.168.0.200`）

## 关键约定（后续都按这个走）

- 后端端口：`8080`
- 后端 context path：`/epoint-web`
- 后端访问地址：`http://localhost:8080/epoint-web`

## 步骤 1：获取后端代码

原始文档参考：

- [开发环境启动](file:///Users/juanjuan/Projects/personal/myknowledge/docs/environment/01-快速入门/开发环境启动.md)

后端仓库地址（你提供的页面地址）：

- http://192.168.0.200/frame-public-group/web/epoint-web

实际用于 clone 的地址（会以 `.git` 结尾）：

- http://192.168.0.200/frame-public-group/web/epoint-web.git

本机推荐目录（不含中文/空格）：

- `~/Workspace/epoint/epoint-web`

clone 命令（推荐使用 `release` 分支）：

```bash
mkdir -p ~/Workspace/epoint
cd ~/Workspace/epoint
git clone -b release http://192.168.0.200/frame-public-group/web/epoint-web.git
```

如果你不能访问该地址，先确认：

- 当前是否在公司网络环境（VPN/内网/Wi-Fi）
- GitLab 是否可在浏览器打开
- 账号是否可登录

## 步骤 2：导入到 IDE 并拉取 Maven 依赖

原文档以 Eclipse 为例，macOS 上你可以选其中一种：

### 选项 A：Eclipse（与原文一致）

Import → Maven → Existing Maven Projects → 选择工程目录 → Finish，然后执行 Maven Update（勾选 Force Update）。

### 选项 B：IntelliJ IDEA（更常用）

- Open / Import 选择 `pom.xml`
- 等待 IDEA 自动下载依赖
- 如未自动下载：在 Maven 工具窗点击 Reload All Maven Projects

## 步骤 3：修改数据库连接（关键）

原文档说明：修改 `jdbc.properties` 里的 `url/username/password` 指向你创建的数据库。

你需要做的事是把配置改成与你在数据库章节确定的值一致：

- host：127.0.0.1
- port：3306
- db：`epoint_dev`
- user：`epoint`
- password：`<DB_PASSWORD>`

注意：

- 不要把真实密码提交到 Git 仓库
- 如果项目本身要求某些参数（字符集/时区），按项目现有写法补全

本项目中 `jdbc.properties` 文件位置：

- `epoint-web/src/main/resources/jdbc.properties`

建议做法（本地开发）：直接把 `url/username/password` 改成明文（不要把密码提交到仓库）。

推荐 MySQL 8 本地连接串（按你当前环境：3306 + epoint_dev）：

```properties
url=jdbc:mysql://localhost:3306/epoint_dev?useSSL=false&serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8&allowPublicKeyRetrieval=true
username=epoint
password=<DB_PASSWORD>
```

其中 `<DB_PASSWORD>` 填你本机给 `epoint@localhost` 设置的密码（不要发到聊天里，也不要写进文档）。

## 步骤 4：确认端口与 context path

原文档提示：端口和上下文在 `pom.xml` 配置。

你需要确认两件事：

- 端口是不是 8080（如果冲突，先找冲突原因再改端口）
- context path 是不是 `/epoint-web`（前端也要对齐这个值）

## 步骤 5：启动（tomcat7:run）

在 IDE 的 Run/Debug Configurations 里配置 Maven 启动：

- Goals：`tomcat7:run`

启动后观察控制台日志，直到出现“服务已启动/端口监听”类似信息。

## 步骤 6：验证后端启动成功

### 1. 浏览器访问

打开：

```text
http://localhost:8080/epoint-web
```

### 2. 数据库验证（表是否自动初始化）

原始文档参考：

- [访问系统：确认数据库](file:///Users/juanjuan/Projects/personal/myknowledge/docs/environment/01-快速入门/访问系统.md#L16-L20)

你可以在 DBeaver 或命令行里查看你的库中是否出现大量表。

## 常见问题与排查

### 1) 8080 端口被占用

处理顺序建议：

1. 先查占用者是什么（通常是其他服务或另一个 Tomcat）
2. 停掉占用服务后再启动
3. 实在不行再改端口，并同步更新前端代理配置

### 2) 启动后数据库无表、或报数据库连接错误

优先检查：

- `jdbc.properties` 的库名/账号/密码是否一致
- MySQL 是否允许该账号以当前 host 登录（localhost vs 127.0.0.1）
- 账号是否有对该库的权限

## 本步产出（你来填写）

- 后端代码目录：`~/Workspace/epoint/epoint-web`
- 后端启动方式：tomcat7:run
- Java 版本：OpenJDK 1.8.0_322（Zulu）
- Maven 版本：Apache Maven 3.9.7
- 实际端口：
- 实际 context path：
- 启动是否成功：成功 / 失败
- 失败时报错（粘贴关键几行）：
