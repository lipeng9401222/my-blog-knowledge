---
title: 01-确认 MySQL 服务与版本
sidebar: auto
collapsable: true
---

# 01-确认 MySQL 服务与版本

## 目的

确认本机 MySQL 已启动、端口正确、版本信息清晰（推荐 5.7.x；如果你本机是 8.0，也可以继续走通开发），并记录下来，后续排查问题时用得上。

## 前置条件

- 你已安装 MySQL（推荐 5.7.x；也可能是 8.0.x）
- 你知道 MySQL 的 root 密码（或你有可用的管理员账号）

## 操作步骤

### 1. 确认 MySQL 版本

在终端执行：

```bash
mysql --version
```

预期看到类似：

```text
mysql  Ver 14.14 Distrib 5.7.xx, for osx10.xx (x86_64) ...
```

如果你看到的是 8.0.x（例如 `Distrib 8.0.xx`），也先不要急着换版本，先按后续步骤把“数据库可用 + 后端能连上”走通；如果后端出现 MySQL 兼容性问题，再回头处理版本切换。

### 2. 连接本机 MySQL（最小验证）

需要输入密码的登录命令不要把密码写在命令行里，直接使用交互式输入：

```bash
mysql -uroot -p
```

进入 MySQL 后执行：

```sql
select version();
show variables like 'port';
```

退出：

```sql
exit;
```

### 3. 记录关键参数（写入“本步产出”）

你需要记录：

- MySQL 版本：5.7.xx 或 8.0.xx
- MySQL 端口：通常 3306
- 连接方式：本机（127.0.0.1 或 localhost）

## 预期结果

- 能成功进入 MySQL
- `select version()` 返回 5.7.x 或 8.0.x
- `port` 返回你预期的端口（默认 3306）

## 常见问题与排查

### 1) `mysql: command not found`

说明 MySQL 客户端命令未安装或不在 PATH。

排查思路：

- 你安装的是 MySQL Server 还是仅通过 GUI 安装？
- 确认 `/usr/local/mysql/bin`（或你安装目录）是否存在 `mysql`

### 2) 连接时报错 `Can't connect to local MySQL server`

说明 MySQL 服务可能没启动，或端口不是 3306。

排查思路：

- 先用你的安装方式启动 MySQL（例如 MySQL Preference Pane、LaunchAgent、或你自己的启动脚本）
- 再回到本节第 2 步重试

## 本步产出（你来填写）

- MySQL 版本：8.0.46
- MySQL 端口：3306
- 管理员账号（不要写密码）：root
