# 首次提交指南

这份文档将指导你完成 Git 初始化和首次提交。

## 📋 前提条件

- ✅ 已安装 Git
- ✅ 已有 GitHub 账号
- ✅ 项目已在本地构建完成

## 🚀 步骤

### 1. 初始化 Git 仓库

```bash
git init
```

### 2. 添加所有文件

```bash
git add .
```

### 3. 首次提交

```bash
git commit -m "初始化博客系统

- 完成 VitePress 配置
- 实现智能归档功能
- 创建 6 个预设分类
- 添加示例文章
- 配置自动化脚本
- 完善项目文档"
```

### 4. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`frontend-knowledge-base`（或你喜欢的名字）
3. 描述：`个人前端知识库博客系统`
4. 选择 `Public`（公开，评论系统需要）
5. 不要勾选任何初始化选项
6. 点击 `Create repository`

### 5. 连接远程仓库

复制 GitHub 提供的命令，或使用以下命令（替换为你的用户名）：

```bash
git remote add origin https://github.com/你的用户名/frontend-knowledge-base.git
git branch -M main
git push -u origin main
```

### 6. 验证推送

访问你的 GitHub 仓库页面，确认所有文件已上传。

## ✅ 完成后的检查清单

- [ ] Git 仓库已初始化
- [ ] 所有文件已提交
- [ ] GitHub 仓库已创建
- [ ] 代码已推送到 GitHub
- [ ] 可以在 GitHub 上看到所有文件

## 🎯 下一步

现在你可以：

1. **配置评论系统**
   - 查看 [DEPLOY.md](DEPLOY.md) 的 Giscus 配置部分

2. **配置自动部署**
   - 查看 [DEPLOY.md](DEPLOY.md) 的 Cloudflare Pages 配置部分

3. **开始写作**
   - 使用 `npm run archive` 添加文章
   - 使用 `npm run publish` 发布更新

## 💡 Git 常用命令

### 日常提交流程

```bash
# 查看状态
git status

# 添加所有更改
git add .

# 提交更改
git commit -m "新增文章：文章标题"

# 推送到远程
git push
```

### 查看历史

```bash
# 查看提交历史
git log --oneline

# 查看最近 5 次提交
git log --oneline -5
```

### 撤销操作

```bash
# 撤销工作区的修改
git checkout -- 文件名

# 撤销暂存区的修改
git reset HEAD 文件名

# 撤销最后一次提交（保留更改）
git reset --soft HEAD^
```

## 🔧 配置 Git

### 设置用户信息

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

### 设置默认分支名

```bash
git config --global init.defaultBranch main
```

### 设置编辑器

```bash
# 使用 VS Code
git config --global core.editor "code --wait"

# 使用 Vim
git config --global core.editor "vim"
```

## 📝 提交信息规范

建议使用以下格式：

```
类型: 简短描述

详细描述（可选）
```

类型示例：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：

```bash
git commit -m "feat: 添加 TypeScript 分类

- 创建 TypeScript 目录
- 添加分类关键词
- 更新导航配置"
```

## 🎉 完成

恭喜！你的博客系统已经成功推送到 GitHub。

现在可以继续配置部署，或者开始写作了！

查看 [START_HERE.md](START_HERE.md) 了解下一步操作。
