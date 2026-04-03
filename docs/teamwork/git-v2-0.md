---
title: Git 使用规范与最佳实践 v2.0（团队知识库）
date: 2026-03-09
category: teamwork
tags:
  - git
  - 团队协作
  - 规范
  - 工作流
description: Git 使用规范与最佳实践 v2.0（团队知识库）
---

很好 👍
我在你现有文档基础上，**升级成一份更完整的《企业级 Git 使用规范 v2.0》**。
新增内容包括：

1. Commit Message 规范（Angular 规范）
2. Git 回滚指南（reset / revert / cherry-pick）
3. Git stash 使用场景
4. 减少冲突的 rebase 工作流

这份文档 **可以直接放团队知识库 / Wiki / Confluence**。

---

# Git 使用规范与最佳实践 v2.0（团队知识库）

---

# 一、Git 基础概念

| 概念       | 说明         |
| ---------- | ------------ |
| Repository | 代码仓库     |
| Branch     | 分支         |
| Commit     | 提交         |
| Merge      | 合并         |
| Pull       | 拉取远程代码 |
| Push       | 推送代码     |

---

# 二、团队分支结构

推荐使用 **Git Flow 简化版**：

```text
main / master    生产环境
develop          主开发分支
feature/*        功能开发
fix/*            Bug 修复
hotfix/*         紧急修复
release/*        发布版本
```

结构示例：

```text
main
 │
develop
 │
feature/login
feature/exam
```

---

# 三、团队分支命名规范

统一格式：

```bash
类型/功能名称
```

示例：

```bash
feature/login
feature/exam
fix/login-error
hotfix/payment-bug
release/v1.0
```

| 类型    | 说明     |
| ------- | -------- |
| feature | 新功能   |
| fix     | bug 修复 |
| hotfix  | 紧急修复 |
| release | 发布版本 |

示例：

```bash
git checkout -b feature/exam
```

---

# 四、项目初始化

初始化仓库：

```bash
git init
```

添加远程仓库：

```bash
git remote add origin 仓库地址
```

首次提交：

```bash
git add .
git commit -m "初始化项目"
```

推送：

```bash
git push -u origin develop
```

---

# 五、克隆项目

```bash
git clone 仓库地址
```

示例：

```bash
git clone https://git.xxx.com/project.git
```

clone 会自动：

- 下载代码
- 创建本地仓库
- 设置 remote

---

# 六、Clone 与 Remote 区别

| 对比         | clone    | remote       |
| ------------ | -------- | ------------ |
| 作用         | 下载仓库 | 管理远程仓库 |
| 是否下载代码 | 是       | 否           |
| 是否创建仓库 | 是       | 否           |

常见 remote 命令：

```bash
git remote -v
git remote add origin url
git remote set-url origin newurl
git remote remove origin
```

---

# 七、标准开发流程（推荐）

## 1 更新 develop

```bash
git checkout develop
git pull origin develop
```

---

## 2 创建功能分支

```bash
git checkout -b feature/exam
```

---

## 3 开发代码

提交：

```bash
git add .
git commit -m "feat: 新增考试模块"
```

---

## 4 推送分支

```bash
git push origin feature/exam
```

---

## 5 创建 Merge Request

```text
feature/exam → develop
```

管理员审核合并。

---

# 八、Merge Request 操作

1 推送分支

```bash
git push origin feature/exam
```

2 打开 GitLab / GitHub

3 点击：

```text
New Merge Request
```

选择：

```text
Source branch: feature/exam
Target branch: develop
```

4 填写信息：

标题：

```text
feat: 新增考试模块
```

5 点击：

```text
Create Merge Request
```

6 审核后点击：

```text
Merge
```

---

# 九、Git Commit Message 规范（推荐）

采用 **Angular Commit 规范**。

格式：

```text
type: 描述
```

示例：

```text
feat: 新增考试模块
fix: 修复登录错误
docs: 更新文档
refactor: 重构代码
style: 代码格式调整
test: 增加测试
```

| 类型     | 含义    |
| -------- | ------- |
| feat     | 新功能  |
| fix      | bug修复 |
| docs     | 文档    |
| style    | 格式    |
| refactor | 重构    |
| test     | 测试    |

示例：

```bash
git commit -m "feat: 新增考试功能"
```

---

# 十、Git Stash（临时代码保存）

当代码未提交但需要切换分支时：

保存代码：

```bash
git stash
```

查看 stash：

```bash
git stash list
```

恢复代码：

```bash
git stash pop
```

应用但不删除：

```bash
git stash apply
```

---

# 十一、Git 回滚指南

## 回滚最近提交

```bash
git reset --soft HEAD~1
```

---

## 撤销提交（保留历史）

```bash
git revert commit_id
```

---

## 强制回滚

```bash
git reset --hard commit_id
```

⚠ 注意：

```text
--hard 会删除代码
```

---

# 十二、Cherry Pick（选择提交）

将某个提交应用到当前分支：

```bash
git cherry-pick commit_id
```

适用于：

- 修复 bug
- 迁移提交

---

# 十三、冲突解决

冲突代码示例：

```text
<<<<<<< HEAD
本地代码
=======
远程代码
>>>>>>> branch
```

处理方法：

1 删除标记
2 手动合并
3 提交代码

```bash
git add .
git commit
```

---

# 十四、减少冲突的 Rebase 工作流

推荐在 feature 分支使用：

```bash
git pull --rebase origin develop
```

作用：

- 保持提交历史整洁
- 减少 merge commit

流程：

```bash
git checkout feature/exam
git pull --rebase origin develop
```

---

# 十五、常用 Git 命令

查看分支：

```bash
git branch
```

查看状态：

```bash
git status
```

查看日志：

```bash
git log --oneline
```

推送代码：

```bash
git push origin 分支
```

拉取代码：

```bash
git pull origin 分支
```

---

# 十六、团队 Git 最佳实践

1 不要直接在 develop 开发

```text
develop
   ↑
feature/*
```

---

2 每天开发前更新代码

```bash
git pull origin develop
```

---

3 提交粒度小

```text
一次 commit 只做一件事
```

---

4 使用 Merge Request

```text
feature → develop
```

进行 Code Review。

---

5 统一 commit 规范

```text
feat / fix / docs / refactor
```

---

# 十七、推荐 Git 工作流

```text
main
 │
develop
 │
feature/*
```

开发流程：

```text
1 创建 feature 分支
2 开发功能
3 commit
4 push
5 Merge Request
6 Code Review
7 合并 develop
```

---

如果你愿意，我还能帮你 **再升级一个版本（Git v3 企业版）**，补充 **开发团队最常遇到的 5 个 Git 场景**：

1️⃣ **误提交到 develop 如何撤回**
2️⃣ **误 push 如何回滚远程仓库**
3️⃣ **合并错误分支如何恢复**
4️⃣ **Git tag 版本管理规范**
5️⃣ **Git release 发布流程**

这些基本是 **公司内部 Git 手册都会写的内容**。
