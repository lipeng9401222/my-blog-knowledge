---
title: Git 用户名与邮箱配置指南
date: 2026-04-29
category: teamwork
tags:
  - Git
  - 配置
description: Git 用户名和邮箱的配置方法，包括全局配置和仓库级别配置
---

# Git 用户名与邮箱配置指南

> Git 提交记录会记录作者信息（用户名 + 邮箱），如果配置不正确，提交记录中的作者会显示为系统用户名，影响协作识别。

---

## 1. 查看当前配置

```bash
# 查看全局用户名
git config --global user.name

# 查看全局邮箱
git config --global user.email

# 查看当前仓库的用户名
git config --local user.name

# 查看当前仓库的邮箱
git config --local user.email

# 查看所有配置
git config --list
```

---

## 2. 全局配置（推荐）

全局配置对所有 Git 仓库生效，适合个人开发机统一使用同一身份。

```bash
# 设置全局用户名
git config --global user.name "lipeng"

# 设置全局邮箱
git config --global user.email "lipeng@epoint.com.cn"
```

设置后验证：

```bash
git config --global user.name
git config --global user.email
```

---

## 3. 仓库级别配置（--local）

如果某个仓库需要使用不同的用户名或邮箱（例如个人项目和公司项目区分），可以在仓库内单独设置。

```bash
# 进入目标仓库目录
cd /path/to/your/repo

# 设置当前仓库的用户名
git config --local user.name "lipeng"

# 设置当前仓库的邮箱
git config --local user.email "lipeng@epoint.com.cn"
```

设置后验证：

```bash
git config --local user.name
git config --local user.email
```

> `--local` 配置仅对当前仓库生效，优先级高于 `--global`。

---

## 4. 优先级说明

Git 配置有三个级别，优先级从高到低：

| 级别 | 参数 | 作用范围 | 配置文件位置 |
| --- | --- | --- | --- |
| 仓库级 | `--local` | 仅当前仓库 | `.git/config` |
| 全局级 | `--global` | 当前用户所有仓库 | `~/.gitconfig` |
| 系统级 | `--system` | 本机所有用户 | `/etc/gitconfig` |

当不同级别存在相同配置项时，高优先级覆盖低优先级。

---

## 5. 常见问题

### 5.1 提交记录显示的用户名不对

原因：未配置或配置了错误的用户名/邮箱。

解决：按上述方法重新设置，**新提交**将使用新配置。已有提交的作者信息不会自动变更。

### 5.2 如何修改已有提交的作者信息

如果之前的提交使用了错误的身份，可以通过 `git commit --amend` 修改最近一次提交：

```bash
# 修改最近一次提交的作者
git commit --amend --author="lipeng <lipeng@epoint.com.cn>"
```

如果需要批量修改历史提交，需要使用 `git filter-branch` 或 `git rebase`，这是破坏性操作，请谨慎处理并在操作前备份。

### 5.3 公司项目和个人项目使用不同身份

推荐做法：

- 全局配置设置个人身份。
- 公司仓库内用 `--local` 设置公司身份。

这样切换项目时无需反复修改全局配置。
