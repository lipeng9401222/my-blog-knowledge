# Mac 上的 Git 仓库管理指南

> 本文介绍在 Mac 上如何组织代码目录、创建 Git 仓库以及日常开发的最佳实践。

## 📁 代码目录组织

### 推荐的目录结构

在 Mac 上，推荐将代码统一存放在用户主目录下，便于管理和备份。

#### 方案一：Projects 目录（推荐）

```bash
# 创建代码根目录
mkdir -p ~/Projects

# 按项目类型分类
mkdir -p ~/Projects/personal      # 个人项目
mkdir -p ~/Projects/work          # 工作项目
mkdir -p ~/Projects/opensource    # 开源项目
```

**优点**：
- 路径简短，快速访问：`cd ~/Projects`
- 不受系统更新影响
- 便于整体备份
- 符合开发者习惯

#### 方案二：按技术栈分类

```bash
mkdir -p ~/Projects/frontend      # 前端项目
mkdir -p ~/Projects/backend       # 后端项目
mkdir -p ~/Projects/mobile        # 移动端项目
mkdir -p ~/Projects/tools         # 工具脚本
```

#### 方案三：Documents 目录

```bash
mkdir -p ~/Documents/Code
```

**优点**：
- 自动被 iCloud Drive 备份
- 自动被 Time Machine 备份
- 符合 macOS 文件组织规范

### ❌ 不推荐的位置

避免将代码放在以下位置：

- `/Applications` - 系统应用目录
- `/System` - 系统文件目录  
- `/tmp` - 临时文件会被自动清理
- `~/Desktop` - 桌面容易混乱，不便管理
- `~/Downloads` - 下载目录，容易误删

## 🚀 创建新仓库

### 场景一：从 GitHub 克隆现有仓库

```bash
# 进入代码目录
cd ~/Projects

# 克隆仓库
git clone https://github.com/username/repository.git

# 进入项目
cd repository
```

### 场景二：创建全新项目

```bash
# 创建项目目录
cd ~/Projects
mkdir my-new-project
cd my-new-project

# 初始化 Git
git init

# 创建 README
echo "# My New Project" > README.md

# 首次提交
git add .
git commit -m "初始化项目"

# 关联远程仓库（需先在 GitHub 创建）
git remote add origin https://github.com/username/my-new-project.git

# 推送到远程
git branch -M main
git push -u origin main
```

### 场景三：已有代码推送到 GitHub

如果你已经有一个项目文件夹，想要推送到 GitHub：

```bash
# 1. 进入项目目录
cd /path/to/your/project

# 2. 初始化 Git（如果还没有）
git init

# 3. 创建 .gitignore
cat > .gitignore << EOF
node_modules/
.DS_Store
dist/
.env
EOF

# 4. 添加所有文件
git add .

# 5. 首次提交
git commit -m "初始化项目"

# 6. 关联远程仓库
git remote add origin https://github.com/username/repository.git

# 7. 推送到 GitHub
git branch -M main
git push -u origin main
```

## ⚙️ Git 初始配置

### 配置用户信息

首次使用 Git 需要配置用户信息：

```bash
# 配置用户名
git config --global user.name "你的名字"

# 配置邮箱（建议使用 GitHub 邮箱）
git config --global user.email "your.email@example.com"

# 配置默认分支名为 main
git config --global init.defaultBranch main

# 配置编辑器（可选）
git config --global core.editor "code --wait"  # VS Code
# 或
git config --global core.editor "vim"          # Vim

# 查看所有配置
git config --list
```

### 配置 SSH 密钥（推荐）

使用 SSH 可以避免每次推送都输入密码：

```bash
# 1. 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your.email@example.com"

# 按提示操作：
# - 直接回车使用默认路径 (~/.ssh/id_ed25519)
# - 可以设置密码保护（推荐）或直接回车跳过

# 2. 启动 ssh-agent
eval "$(ssh-agent -s)"

# 3. 添加 SSH 密钥到 ssh-agent
ssh-add ~/.ssh/id_ed25519

# 4. 复制公钥到剪贴板
cat ~/.ssh/id_ed25519.pub | pbcopy

# 5. 添加到 GitHub
# 访问 https://github.com/settings/keys
# 点击 "New SSH key"
# Title: 填写 "MacBook Pro" 或其他标识
# Key: 粘贴刚才复制的内容
# 点击 "Add SSH key"

# 6. 测试连接
ssh -T git@github.com
# 看到 "Hi username! You've successfully authenticated" 表示成功
```

配置 SSH 后，克隆仓库时使用 SSH 地址：

```bash
# HTTPS 方式（需要输入密码）
git clone https://github.com/username/repository.git

# SSH 方式（推荐，无需密码）
git clone git@github.com:username/repository.git
```

## 📝 常用 Git 命令

### 基础操作

```bash
# 查看状态
git status

# 查看修改内容
git diff                    # 查看未暂存的修改
git diff --staged           # 查看已暂存的修改

# 添加文件
git add .                   # 添加所有修改
git add filename.txt        # 添加指定文件
git add *.js                # 添加所有 js 文件

# 提交
git commit -m "提交说明"
git commit -am "提交说明"   # 添加并提交（仅已跟踪文件）

# 推送
git push                    # 推送到当前分支
git push origin main        # 推送到 main 分支
git push -f                 # 强制推送（慎用）

# 拉取
git pull                    # 拉取并合并
git fetch                   # 仅拉取不合并
```

### 分支操作

```bash
# 查看分支
git branch                  # 查看本地分支
git branch -r               # 查看远程分支
git branch -a               # 查看所有分支

# 创建分支
git branch feature-login    # 创建分支
git checkout -b feature-login  # 创建并切换

# 切换分支
git checkout main           # 切换到 main
git switch main             # 新语法（Git 2.23+）

# 合并分支
git checkout main
git merge feature-login     # 将 feature-login 合并到 main

# 删除分支
git branch -d feature-login    # 删除本地分支
git push origin --delete feature-login  # 删除远程分支
```

### 查看历史

```bash
# 查看提交历史
git log                     # 详细日志
git log --oneline           # 简洁模式
git log --graph --oneline   # 图形化显示
git log -p                  # 显示每次提交的差异
git log --author="张三"     # 查看指定作者的提交

# 查看某个文件的历史
git log -- filename.txt
git blame filename.txt      # 查看每行代码的作者
```

### 撤销操作

```bash
# 撤销工作区修改
git checkout -- filename.txt   # 恢复单个文件
git checkout .                 # 恢复所有文件

# 撤销暂存
git reset HEAD filename.txt    # 取消暂存单个文件
git reset HEAD .               # 取消所有暂存

# 撤销提交
git reset --soft HEAD^         # 撤销提交，保留修改
git reset --hard HEAD^         # 撤销提交，丢弃修改（危险）

# 修改最后一次提交
git commit --amend -m "新的提交信息"
```

### 远程仓库操作

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/username/repo.git

# 修改远程仓库地址
git remote set-url origin git@github.com:username/repo.git

# 删除远程仓库
git remote remove origin
```

## 🔍 实用技巧

### 快速查找项目位置

如果忘记项目在哪里：

```bash
# 搜索项目目录
find ~ -name "project-name" -type d 2>/dev/null

# 搜索包含特定文件的目录
find ~ -name "package.json" -path "*/project-name/*" 2>/dev/null

# 使用 Spotlight 搜索
# Command + Space，输入项目名称
```

### 配置全局 .gitignore

创建全局忽略文件，避免每个项目都配置：

```bash
# 创建全局 gitignore
cat > ~/.gitignore_global << EOF
# macOS
.DS_Store
.AppleDouble
.LSOverride

# IDE
.vscode/
.idea/
*.swp
*.swo

# 依赖
node_modules/
vendor/

# 环境变量
.env
.env.local

# 日志
*.log
npm-debug.log*

# 临时文件
*.tmp
.cache/
EOF

# 配置 Git 使用全局 gitignore
git config --global core.excludesfile ~/.gitignore_global
```

### 使用别名提高效率

```bash
# 配置常用别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# 使用别名
git st              # 等同于 git status
git co main         # 等同于 git checkout main
git lg              # 美化的日志显示
```

### 配置代理（如需要）

```bash
# 配置 HTTP 代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 仅对 GitHub 使用代理
git config --global http.https://github.com.proxy http://127.0.0.1:7890

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 🛠️ 推荐工具

### 命令行工具

- **[Oh My Zsh](https://ohmyz.sh/)** - 强大的 Zsh 配置框架
  ```bash
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
  ```

- **[tig](https://jonas.github.io/tig/)** - 命令行 Git 可视化工具
  ```bash
  brew install tig
  ```

- **[lazygit](https://github.com/jesseduffield/lazygit)** - 终端 Git UI
  ```bash
  brew install lazygit
  ```

### GUI 工具

- **[Sourcetree](https://www.sourcetreeapp.com/)** - 免费的 Git 客户端
- **[GitKraken](https://www.gitkraken.com/)** - 跨平台 Git 客户端
- **[Tower](https://www.git-tower.com/)** - 强大的 Mac Git 客户端

### VS Code 插件

- **GitLens** - 增强 Git 功能
- **Git Graph** - 可视化分支图
- **Git History** - 查看文件历史

## ⚠️ 注意事项

### 1. 敏感信息保护

```bash
# 永远不要提交这些文件
.env                # 环境变量
.env.local          # 本地环境变量
config/secrets.yml  # 密钥配置
*.pem               # 私钥文件
*.key               # 密钥文件
```

### 2. 大文件处理

Git 不适合存储大文件，如果需要：

```bash
# 使用 Git LFS（Large File Storage）
brew install git-lfs
git lfs install
git lfs track "*.psd"
git lfs track "*.mp4"
```

### 3. 提交规范

遵循良好的提交信息规范：

```bash
# 推荐格式
feat: 添加用户登录功能
fix: 修复导航栏样式问题
docs: 更新 README 文档
style: 格式化代码
refactor: 重构用户模块
test: 添加单元测试
chore: 更新依赖包

# 不推荐
git commit -m "修改"
git commit -m "update"
git commit -m "fix bug"
```

### 4. 定期备份

```bash
# 使用 Time Machine 备份整个 Projects 目录
# 或使用云同步服务（注意 .git 目录可能很大）

# 定期推送到远程仓库
git push origin --all    # 推送所有分支
git push origin --tags   # 推送所有标签
```

## 📚 相关资源

- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 官方指南](https://docs.github.com/cn)
- [Pro Git 中文版](https://git-scm.com/book/zh/v2)
- [Git 飞行规则](https://github.com/k88hudson/git-flight-rules/blob/master/README_zh-CN.md)

## 总结

良好的代码目录组织和 Git 使用习惯能大幅提升开发效率：

1. 统一使用 `~/Projects` 存放代码
2. 配置 SSH 密钥避免重复输入密码
3. 使用有意义的提交信息
4. 定期推送到远程仓库
5. 善用 Git 别名和工具提高效率

---

**最后更新**: 2026-04-04
