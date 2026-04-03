**Drafting a Markdown Guide**

I’m thinking I need to create a clear plan after gathering all the necessary context. The user asked for a guide in markdown, so I will structure it appropriately. The proposed document could include sections like the title, objectives, prerequisites, an understanding of Mac basics, installing tools, network checks, and choosing Git configuration modes. I also should outline a step-by-step recommended configuration and verify the presence of Git credential helpers. This should be straightforward!**Clarifying Git Credential Commands**

I’m considering mentioning the test command, `git credential-osxkeychain`, but I think I should clarify how to approach it. It seems like the actual executable might enter a protocol, so I shouldn’t provide instructions that could confuse the user. Instead, I should focus on giving clear, straightforward guidance without overcomplicating things. Keeping instructions simple will help ensure the user understands how to proceed without any confusion. That's really important!**Clarifying git config usage**

I need to note that the command `git config --global includeIf.gitdir:/work/company/.path /.gitconfig-company` may not correctly expand the tilde. Git config can store literal strings, which is fine, but `includeIf` patterns should end with a trailing slash. For example, the documentation shows `[includeIf "gitdir:/to/group/"] path=/foo.inc`. The syntax might be tricky because of the dot notation. It’s crucial to include both the command and manual file content to avoid errors.**Verifying Git configuration**

I’m working on the `git config` command for configuring global settings for specific directories. I need to make sure I'm using the correct syntax for paths, especially with the `includeIf` directive. The tilde `` expands only at the start of a word, so in this case, Git would expand it properly as it looks for the home directory. However, I should probably include a trailing slash in the path for clarity. It might be safer to recommend manual edits to `/.gitconfig` to avoid mistakes.**Considering user experience**

I’m thinking about what would be most helpful for the user, especially since they’re new to Mac. While manual editing could work, using commands might be easier. I should clarify that if they're using zsh, they need to edit the `/.zshrc` file, and provide steps for checking their shell with `echo $SHELL`. There are potential issues with commands like `ping` where they’ll need to stop it with Ctrl+C. 

I'll mention credential management for Git clones, especially if using HTTP and the `osxkeychain`. I wonder if they will find this information valuable and if I should ask how satisfied they are with the guidance. I think I’ll also mention that I can’t create files directly in the repository, so they should save the content as `docs/mac-onboarding-guide.md`.**Providing final Markdown**

I should let the user know something like, "下面是最终版 Markdown，可直接复制保存为 `mac-git-and-dev-setup.md`." After that, I’ll present the Markdown content in a large code block to keep it structured and easy to copy. I want to ensure that everything is clear and readable for them, so they can easily save it without any issues. This way, they have a complete document ready to go!**Considering user options**

Since the user is a novice, I realize that Homebrew could be an extra step for them. I think I might suggest "Option A is to install Homebrew then nvm," or alternatively, "If you only need Git, you can skip Homebrew." However, it seems the user is looking for a clear and actionable final markdown response. I’ll make sure to structure that well to meet their needs!**Setting up Node on Mac**

I’m thinking about the steps for setting up Node on a Mac: start with Xcode CLT, then Homebrew if the user’s comfortable with it, followed by nvm for version switching. It’s probably wise to mention Homebrew installation since it could be complex for a novice. I’ll include specific commands for installation like `brew install nvm`, ensuring the paths are correct for different Mac architectures. I should also note terminal tips for beginners and consider including markdown or a concise format. Let's keep it clear and detailed!**Drafting Git Configuration for Mac**

I want to draft clear commands that are user-friendly for Mac. I think the command `git config --global includeIf."gitdir:/work/company/".path /.gitconfig-company` is valid, but using manual file editing might be safer to avoid syntax errors. For new Mac users, I could suggest editing `/.gitconfig` with `nano`, although that might lead to mistakes. A simpler approach could be:

1. Create the necessary files with `touch`.
2. Edit `/.gitconfig` and paste in the relevant section.
3. Create and configure `/.gitconfig-company`.

I should remind users that the `gitdir:` path must end with a slash for it to work properly, and that it applies recursively to repositories.**Clarifying Pattern Behavior**

I’m looking at the documentation regarding patterns and their behavior. It seems that if a pattern ends with a `/`, it will automatically append `**`, which means it applies recursively. That’s interesting and actually quite useful! I should ensure to keep this in mind when setting up my configurations or commands, as it can simplify how I include files or directories. Making sense of these details is essential for avoiding confusion later on!**Considering Git configuration**

I'm thinking about how the `includeIf` directive works in Git. It seems like the pattern `gitdir:/path/to/group/` should apply to repositories under that path. I noticed an example in the docs about using `gitdir:/work/`, and I'm wondering if using a trailing slash implies some behavior like `**`. 

To be clear, I’ll suggest using `gitdir:/work/company/**` in the config to avoid ambiguity. Checking the Git documentation is also essential to validate this. Just to note, using `credential.helper=osxkeychain` means that the helper needs to be installed.**Reviewing Git and Node setup**

I'm considering the steps to update the Git configuration and Node setup. First, I'd recommend removing the includeIf section manually. It's crucial to clear the keychain by searching for the specific IP address in Keychain Access. 

I might also want to suggest using a project-level credential file, along with some caveats. The project specifies Node version >=18 and pnpm >=8, but since there’s no `.nvmrc` file, I'll suggest using `nvm` to set up Node 18 manually. It's probably best to avoid setting a default alias to prevent conflicts with other projects. If the user wants auto-switching later, they could add a `.nvmrc`.**Reviewing project documentation**

I think I need to include some current project facts, like the remote URL and known risks, in the repository summary documentation. That sounds good! I also want to make sure that the code blocks inside the document are formatted correctly. Proper formatting is important for readability, so I’ll definitely double-check that. Let’s keep everything clear and organized to help anyone who might look at this later!
可以，下面我直接给你一份“**最终版 Markdown 文档**”，你可以复制保存为：

- `mac-company-git-dev-guide.md`

这份文档已经尽量按你现在的情况做了精细化处理：

- 适合 Mac 新手
- 分为“**目录级共享配置**”和“**项目级配置**”
- 每一步都尽量可操作
- 包含当前这个项目的已知情况
- 包含常见报错排查
- 考虑“不影响其他项目”的目标

说明一下：当前你还在 ask mode，我不能直接帮你写入仓库文件，所以先把完整 Markdown 成品给你，你可以直接复制保存。

````markdown
# Mac 上公司内网 Git 与项目开发环境准备指南

> 适用对象：第一次或刚开始在 Mac 上做开发，希望拉取公司内网 Git 代码，并且尽量做到“只影响指定项目/指定目录，不影响其他项目”。

---

## 目录

- [1. 文档目标](#1-文档目标)
- [2. 当前项目已确认的信息](#2-当前项目已确认的信息)
- [3. 推荐方案总览](#3-推荐方案总览)
- [4. 操作前你需要知道的几个 Mac 基础概念](#4-操作前你需要知道的几个-mac-基础概念)
- [5. 第一部分：Mac 基础准备](#5-第一部分mac-基础准备)
- [6. 第二部分：公司内网访问准备](#6-第二部分公司内网访问准备)
- [7. 第三部分：Git 配置方案选择](#7-第三部分git-配置方案选择)
- [8. 第四部分：推荐方案——目录级共享 Git 配置](#8-第四部分推荐方案目录级共享-git-配置)
- [9. 第五部分：备选方案——单个项目单独配置 Git](#9-第五部分备选方案单个项目单独配置-git)
- [10. 第六部分：clone 当前项目的标准步骤](#10-第六部分clone-当前项目的标准步骤)
- [11. 第七部分：Node / pnpm 开发环境准备](#11-第七部分node--pnpm-开发环境准备)
- [12. 第八部分：第一次安装依赖前的提醒](#12-第八部分第一次安装依赖前的提醒)
- [13. 第九部分：常见问题排查](#13-第九部分常见问题排查)
- [14. 第十部分：如何撤销或修改配置](#14-第十部分如何撤销或修改配置)
- [15. 第十一部分：最终建议与执行清单](#15-第十一部分最终建议与执行清单)

---

## 1. 文档目标

本文档帮助你完成以下事情：

1. 在 **Mac** 上准备使用公司内网 Git
2. 尽量做到 **不影响其他项目**
3. 支持两种模式：
   - **项目级配置**：只影响当前仓库
   - **目录级共享配置**：一个大目录下多个公司项目共用一套 Git 配置
4. 为后续项目开发准备基础环境：
   - Git
   - Node.js
   - pnpm
5. 明确当前项目在 Mac 上可能遇到的风险点

---

## 2. 当前项目已确认的信息

基于当前仓库的检查，已确认如下信息：

### 2.1 Git 仓库信息
- 仓库远端地址为公司内网 HTTP：
  - `http://192.168.217.8/febase/egocopilot.git`
- 当前工作分支曾使用：
  - `feature/lip`

### 2.2 项目环境要求
当前项目要求：
- `Node.js >= 18.0.0`
- `pnpm >= 8.0.0`
- 推荐版本：
  - `pnpm@8.15.4`

### 2.3 当前仓库中未发现的文件
当前未发现以下文件：
- `.nvmrc`
- `.node-version`
- 项目级 `.npmrc`
- `.gitmodules`

这说明：
- Node 版本不会自动帮你切换
- npm / pnpm registry 暂未发现项目级固定配置
- 若后面公司有内网 npm 源，可能需要单独配置

### 2.4 当前项目的 Mac 风险提示
当前项目里存在 **Windows 绝对路径依赖** 的痕迹，尤其在前端依赖部分。  
因此：

- `git clone` / `git pull`：通常问题不大
- `pnpm install` / `pnpm dev`：未来在 Mac 上可能需要额外调整

所以当前阶段应优先完成：

1. Git 能在 Mac 上正常使用
2. 网络 / VPN 能访问内网仓库
3. Git 配置尽量只作用于公司项目

---

## 3. 推荐方案总览

### 3.1 最推荐方案
如果你以后在 Mac 上会放多个公司项目，推荐使用：

- 一个统一的大目录，例如：`~/work/company/`
- 在 `~/.gitconfig` 中使用 `includeIf`
- 让这个目录下所有 Git 仓库自动加载一份“公司专用配置”

这样能做到：

- 公司项目共用同一套 Git 配置
- 不影响个人项目
- 某个项目还可以单独覆盖配置

### 3.2 如果你暂时只有一个项目
可以只使用项目级配置：

- `git config --local ...`

这种方式只会影响当前仓库，不影响其他仓库。

### 3.3 推荐决策
- **只有一个公司项目**：先用项目级配置
- **未来会有多个公司项目**：直接上目录级共享配置
- **最灵活的实践**：
  - 目录级配置作为默认
  - 单个仓库用 `local` 做覆盖

---

## 4. 操作前你需要知道的几个 Mac 基础概念

### 4.1 如何打开终端
Mac 上最常用的方法：

1. 按 `Command + Space`
2. 输入 `Terminal`
3. 回车打开“终端”

### 4.2 什么是 `~`
在 Mac 终端中：

- `~` 表示当前用户的“主目录”

例如：
- `~/work/company`
- 实际上通常等价于：
  - `/Users/你的用户名/work/company`

### 4.3 常用命令
查看当前目录：

```bash
pwd
```

查看当前目录内容：

```bash
ls
ls -la
```

切换目录：

```bash
cd ~/work
cd ~/work/company
```

回到主目录：

```bash
cd ~
```

返回上一级：

```bash
cd ..
```

### 4.4 如何停止一个一直运行的命令
例如 `ping` 会持续输出。  
想停止时按：

```text
Control + C
```

---

## 5. 第一部分：Mac 基础准备

---

### 步骤 1：安装 Apple 命令行工具

#### 操作
打开终端，执行：

```bash
xcode-select --install
```

#### 作用
这会安装：
- Git
- 编译工具链
- 一些基础开发命令

#### 预期结果
系统弹出安装提示，按步骤安装即可。

#### 验证
安装完成后执行：

```bash
git --version
```

#### 预期输出
类似：

```bash
git version 2.x.x
```

如果能看到版本号，说明 Git 已经可用。

---

### 步骤 2：确认当前 shell 类型

#### 操作
执行：

```bash
echo $SHELL
```

#### 常见结果
通常是：

```bash
/bin/zsh
```

#### 说明
如果看到 `/bin/zsh`，说明你用的是 zsh。  
后续若配置 shell 环境变量，通常编辑的是：

```bash
~/.zshrc
```

---

### 步骤 3：可选，安装 Homebrew

> 说明：如果你后面要装 `nvm`、Node 等，推荐安装 Homebrew。  
> 如果你暂时只想先处理 Git，这一步可以先跳过。

#### 操作
执行：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 验证
安装完成后执行：

```bash
brew --version
```

#### 预期输出
类似：

```bash
Homebrew 4.x.x
```

---

## 6. 第二部分：公司内网访问准备

由于当前项目仓库地址是公司内网：

- `http://192.168.217.8/febase/egocopilot.git`

所以在 clone 之前，先确认 Mac 能访问这个地址。

---

### 步骤 1：确认网络环境

你需要满足以下任一条件：

- 在公司办公网络内
- 已连接公司 VPN
- 你的 Mac 能访问公司内网地址

---

### 步骤 2：测试内网连通性

#### 操作 A：先用 ping 测试
```bash
ping 192.168.217.8
```

按 `Control + C` 停止。

#### 操作 B：再用 HTTP 测试
```bash
curl -I http://192.168.217.8
```

---

### 结果判断

#### 情况 1：能通
说明网络层面没问题，可以继续。

#### 情况 2：不通
优先排查：
- 是否连了公司 VPN
- VPN 是否支持 macOS
- 是否需要公司证书
- 是否只有公司设备才能访问

#### 情况 3：服务器能访问，但 Git 认证失败
说明：
- 网络已经通了
- 问题大概率在账号/密码/token 上

---

## 7. 第三部分：Git 配置方案选择

## 7.1 方案 A：项目级配置（单仓库隔离）
适用于：
- 你暂时只打算先 clone 一个项目
- 希望严格只影响当前仓库

特点：
- 配置写入 `项目/.git/config`
- 不影响其他仓库

---

## 7.2 方案 B：目录级共享配置（推荐）
适用于：
- 一个大目录下会放多个公司项目
- 想让这些项目共用同一套 Git 配置
- 又不想影响其他个人项目

特点：
- 使用 `~/.gitconfig` + `includeIf`
- 只对某个目录下的 Git 仓库生效
- 是最适合“公司项目统一管理”的方式

---

## 7.3 我的推荐
你的情况更适合：

- 建一个目录：`~/work/company/`
- 所有公司项目都放这里
- 用目录级共享配置
- 某个仓库如有特殊需求，再用 `local` 覆盖

---

## 8. 第四部分：推荐方案——目录级共享 Git 配置

> 本部分是最推荐你采用的方案。

---

### 步骤 1：创建统一的公司项目目录

#### 操作
```bash
mkdir -p ~/work/company
mkdir -p ~/work/personal
```

#### 说明
建议目录结构为：

```text
~/work/
├── company/
│   ├── egocopilot/
│   ├── meta-runtime/
│   └── other-project/
└── personal/
    ├── demo1/
    └── demo2/
```

#### 验证
```bash
ls -la ~/work
```

#### 预期结果
应能看到：
- `company`
- `personal`

---

### 步骤 2：检查是否已有全局 Git 配置

#### 操作
```bash
ls -la ~/.gitconfig
```

#### 说明
- 如果文件存在：后面是在现有基础上追加
- 如果不存在：后面会创建它

---

### 步骤 3：创建或编辑全局 Git 配置文件

#### 操作
```bash
touch ~/.gitconfig
nano ~/.gitconfig
```

#### 在文件中加入以下内容
如果文件里本来没有相关内容，请加入：

```ini
[includeIf "gitdir:~/work/company/"]
    path = ~/.gitconfig-company
```

> 注意：
> - `gitdir:~/work/company/` 末尾的 `/` 不要漏
> - 这是告诉 Git：当仓库位于 `~/work/company/` 下时，自动加载 `~/.gitconfig-company`

#### 保存方式
- 按 `Control + O`
- 回车确认
- 按 `Control + X` 退出

---

### 步骤 4：创建公司专用 Git 配置文件

#### 操作
```bash
touch ~/.gitconfig-company
nano ~/.gitconfig-company
```

#### 粘贴以下内容
请把 `你的姓名` 和 `你的公司邮箱` 替换为真实值：

```ini
[user]
    name = 你的姓名
    email = 你的公司邮箱

[credential]
    helper = osxkeychain
    useHttpPath = true

[core]
    autocrlf = input

[pull]
    rebase = false

[init]
    defaultBranch = master
```

#### 保存并退出
- 按 `Control + O`
- 回车确认
- 按 `Control + X`

---

### 步骤 5：理解这份公司配置

#### `[user]`
```ini
[user]
    name = 你的姓名
    email = 你的公司邮箱
```

作用：
- 作为公司仓库默认提交身份

---

#### `[credential]`
```ini
[credential]
    helper = osxkeychain
    useHttpPath = true
```

作用：
- `osxkeychain`：使用 macOS 钥匙串保存凭据，更安全
- `useHttpPath = true`：同一个 Git 服务器下，不同仓库路径分开识别凭据，避免串用

> 对你们这种公司内网 HTTP Git 很有帮助。

---

#### `[core]`
```ini
[core]
    autocrlf = input
```

作用：
- 提交时把 CRLF 转成 LF
- 避免 Win / Mac 换行符混乱

---

#### `[pull]`
```ini
[pull]
    rebase = false
```

作用：
- `git pull` 默认使用 merge

> 如果你们团队明确要求 rebase，可改成：
>
> ```ini
> [pull]
>     rebase = true
> ```

---

#### `[init]`
```ini
[init]
    defaultBranch = master
```

作用：
- `git init` 时默认分支名为 `master`

> 当前项目历史上使用过 `master`，所以这里这样写更贴近现状。  
> 如果以后团队统一为 `main`，再调整即可。

---

### 步骤 6：验证全局条件配置是否正确

#### 操作
```bash
git config --global --list --show-origin
```

#### 你希望看到的内容
应该至少能看到来自 `~/.gitconfig` 的记录，类似：

```text
file:/Users/你的用户名/.gitconfig  includeif.gitdir:~/work/company/.path=~/.gitconfig-company
```

> 这里如果看到的显示格式和你预期略有差异，不用太紧张，只要包含 `includeif` 和 `~/.gitconfig-company` 即可。

---

### 步骤 7：为什么这样不会影响其他项目

因为只有当 Git 仓库位于：

```text
~/work/company/
```

这个目录下时，`~/.gitconfig-company` 才会被加载。

所以：

- 公司仓库：会生效
- `~/work/personal/` 下的个人仓库：不会生效

这正符合你的目标：**公司项目共享，其他项目不受影响。**

---

## 9. 第五部分：备选方案——单个项目单独配置 Git

> 如果你暂时不想上目录级共享，也可以用这个方案。

### 适用场景
- 只打算先维护 `egocopilot` 一个仓库
- 希望配置最小化
- 只对当前仓库生效

---

### clone 完成后执行

进入项目目录后执行：

```bash
git config --local user.name "你的姓名"
git config --local user.email "你的公司邮箱"
git config --local credential.helper osxkeychain
git config --local credential.useHttpPath true
git config --local core.autocrlf input
git config --local pull.rebase false
```

### 配置保存位置
这些内容会写入：

```text
项目目录/.git/config
```

### 优点
- 完全只影响当前仓库

### 缺点
- 如果你后面有多个公司仓库，每个都要单独配置一次

---

## 10. 第六部分：clone 当前项目的标准步骤

> 以下步骤适用于你已经完成了前面的 Git 和网络准备。

---

### 步骤 1：进入公司项目目录

```bash
cd ~/work/company
```

#### 验证
```bash
pwd
```

#### 预期
输出应类似：

```text
/Users/你的用户名/work/company
```

---

### 步骤 2：clone 仓库

```bash
git clone http://192.168.217.8/febase/egocopilot.git
```

#### 可能出现的情况
- 提示输入用户名 / 密码
- 提示输入 token
- 若公司内网有单点登录，也可能有其他认证方式

> 如果你不确定认证方式，建议先问团队内已经在 Mac 上使用过该仓库的同事。

---

### 步骤 3：进入仓库

```bash
cd egocopilot
```

#### 验证
```bash
git remote -v
```

#### 预期
应能看到类似：

```text
origin  http://192.168.217.8/febase/egocopilot.git (fetch)
origin  http://192.168.217.8/febase/egocopilot.git (push)
```

---

### 步骤 4：验证目录级配置是否生效

```bash
git config --show-origin --list
```

#### 预期
应能看到配置来源中包含：

- `~/.gitconfig`
- `~/.gitconfig-company`

若当前仓库还有本地配置，也会看到：

- `.git/config`

---

### 步骤 5：查看远端分支

```bash
git branch -r
```

#### 说明
你想用的是 `feature/lip`，所以先确认远端有这个分支。

---

### 步骤 6：切换到目标分支

如果远端有 `origin/feature/lip`，执行：

```bash
git checkout -b feature/lip origin/feature/lip
```

如果本地已经有这个分支，执行：

```bash
git checkout feature/lip
```

---

### 步骤 7：拉取最新代码

```bash
git pull
```

如果你想更保守一点，也可以用：

```bash
git pull --ff-only
```

---

## 11. 第七部分：Node / pnpm 开发环境准备

> 这一部分是“后续要跑项目”时建议准备的。  
> 如果你现在只是想先 clone 成功，可以先不做，但我建议你提前准备好。

---

### 当前项目要求
- `Node.js >= 18.0.0`
- `pnpm >= 8.0.0`
- 推荐：
  - `pnpm@8.15.4`

---

### 步骤 1：安装 nvm（推荐）

> 推荐原因：  
> 不会粗暴影响整机 Node 环境，更适合“不同项目使用不同 Node 版本”的场景。

#### 前提
你已经安装了 Homebrew。

#### 操作
```bash
brew update
brew install nvm
mkdir -p ~/.nvm
```

---

### 步骤 2：配置 shell 让 nvm 可用

#### 先确认你是不是 zsh
```bash
echo $SHELL
```

如果结果是 `/bin/zsh`，继续下面步骤。

#### 操作
```bash
touch ~/.zshrc
nano ~/.zshrc
```

#### 在文件末尾加入
```bash
export NVM_DIR="$HOME/.nvm"
source "$(brew --prefix nvm)/nvm.sh"
```

#### 保存退出
- `Control + O`
- 回车
- `Control + X`

#### 让配置立即生效
```bash
source ~/.zshrc
```

#### 验证
```bash
nvm --version
```

---

### 步骤 3：安装 Node 18

```bash
nvm install 18
nvm use 18
node -v
```

#### 预期
输出类似：

```bash
v18.x.x
```

> 不建议你现在就把 `18` 设置成全局默认，除非你明确知道其他项目也都用它。  
> 因为你的目标是“尽量不影响其他项目”。

---

### 步骤 4：启用 corepack

```bash
corepack enable
```

#### 说明
`corepack` 用于管理包管理器版本，比如 pnpm。

---

### 步骤 5：准备项目要求的 pnpm 版本

```bash
corepack prepare pnpm@8.15.4 --activate
pnpm -v
```

#### 预期
输出：

```bash
8.15.4
```

---

## 12. 第八部分：第一次安装依赖前的提醒

> 这一部分非常重要，因为当前项目在 Mac 上可能不是“clone 完就能直接 install”。

---

### 12.1 当前项目的已知风险
当前项目里存在 **Windows 本地绝对路径依赖** 的痕迹。

这意味着：

- `git clone`：通常没问题
- `git pull`：通常没问题
- `pnpm install`：可能失败
- `pnpm dev`：也可能因为路径问题出错

---

### 12.2 你应该怎么做
建议顺序如下：

1. 先把 Git 和网络打通
2. 成功 clone 仓库
3. 再尝试：
   ```bash
   pnpm install
   ```
4. 如果报路径相关错误，再针对前端依赖单独处理

---

### 12.3 初次安装依赖的建议命令
在项目根目录执行：

```bash
pnpm install
```

如果你只是先观察错误，也可以先看输出，不着急修。

---

### 12.4 如果安装失败，可能是什么原因
常见原因包括：

- 某个依赖写死了 Windows 路径
- 公司内网 npm 源未配置
- 代理/VPN影响下载
- Node 版本不对
- pnpm 版本不对

---

## 13. 第九部分：常见问题排查

---

### 问题 1：`git --version` 报错，提示找不到 git

#### 原因
通常是：
- 没装 Apple 命令行工具
- 安装未完成
- shell 环境未刷新

#### 处理
重新执行：

```bash
xcode-select --install
```

安装完成后再执行：

```bash
git --version
```

---

### 问题 2：`curl -I http://192.168.217.8` 访问不了

#### 原因
通常是：
- 不在公司网络
- VPN 未连接
- VPN 不支持 Mac
- 内网访问策略限制

#### 处理
优先检查：
- 公司 VPN 是否已连接
- Mac 是否有权限访问内网
- 是否需要证书

---

### 问题 3：`git clone` 提示认证失败

#### 原因
通常是：
- 用户名/密码错误
- 需要 token
- 账号无权限
- 公司 Git 服务认证方式不同

#### 处理
建议向同事确认以下信息：
- 是用户名密码还是 token
- 是否需要域账号
- 是否对 HTTP Git 有额外认证要求

---

### 问题 4：凭据记错了，Git 总是自动用错误密码

#### 原因
因为 `osxkeychain` 会记住凭据。

#### 处理方法 A：使用“钥匙串访问”
1. 按 `Command + Space`
2. 搜索并打开 `钥匙串访问` / `Keychain Access`
3. 搜索：
   - `192.168.217.8`
   - 或仓库地址中的关键词
4. 删除错误的 Git 凭据记录
5. 下次 clone/pull 时重新输入

#### 处理方法 B：联系我，我可以再给你整理一份“钥匙串清理指南”

---

### 问题 5：目录级共享配置没有生效

#### 检查点
1. 仓库是否真的在：
   ```text
   ~/work/company/
   ```
   下面？
2. `~/.gitconfig` 里是否写了：
   ```ini
   [includeIf "gitdir:~/work/company/"]
       path = ~/.gitconfig-company
   ```
3. 是否进入的是 **Git 仓库目录**？
4. 是否用这个命令验证过：
   ```bash
   git config --show-origin --list
   ```

#### 说明
`includeIf` 只有在真正的 Git 仓库中才会体现出来，普通目录不会触发。

---

### 问题 6：`pnpm install` 报路径错误或依赖找不到

#### 原因
当前项目里已知有 Windows 绝对路径依赖风险。

#### 处理建议
先不要急着全局乱改环境，建议按顺序排查：

1. `node -v`
2. `pnpm -v`
3. `git branch`
4. `pnpm install` 的完整报错信息
5. 再决定是否要改依赖路径或加项目级 `.npmrc`

---

## 14. 第十部分：如何撤销或修改配置

---

### 14.1 修改目录级共享配置

#### 修改全局触发规则
编辑：

```bash
nano ~/.gitconfig
```

#### 修改公司专用配置
编辑：

```bash
nano ~/.gitconfig-company
```

---

### 14.2 不想再让公司配置自动生效
打开：

```bash
nano ~/.gitconfig
```

删除这一段：

```ini
[includeIf "gitdir:~/work/company/"]
    path = ~/.gitconfig-company
```

保存退出即可。

---

### 14.3 某个仓库配置错了，只想删当前仓库本地配置

在仓库根目录中执行：

```bash
git config --local --unset user.name
git config --local --unset user.email
git config --local --unset credential.helper
git config --local --unset credential.useHttpPath
git config --local --unset core.autocrlf
git config --local --unset pull.rebase
```

如果某项不存在，Git 可能会提示未设置，这通常没关系。

---

### 14.4 想看当前最终生效的是哪份配置
在仓库里执行：

```bash
git config --show-origin --list
```

这是排查 Git 配置问题最重要的命令之一。

---

## 15. 第十一部分：最终建议与执行清单

---

### 15.1 最推荐的最终实践

对于你当前的使用场景，我建议采用以下方案：

#### Git 配置
- 公司项目统一放在：
  - `~/work/company/`
- 使用：
  - `~/.gitconfig`
  - `~/.gitconfig-company`
  - `includeIf`
- 凭据方式优先使用：
  - `osxkeychain`

#### 项目开发环境
- 使用 `nvm` 管理 Node
- 当前项目先使用：
  - Node 18
  - pnpm 8.15.4
- 不要一开始就全局改很多设置

#### 项目运行策略
- 先解决 Git clone / pull
- 再处理 Node / pnpm
- 最后再看前端 Windows 路径兼容问题

---

### 15.2 可直接照做的最终步骤清单

#### A. Mac 基础准备
- [ ] 安装 Apple 命令行工具
- [ ] 验证 `git --version`
- [ ] 可选安装 Homebrew

#### B. 内网准备
- [ ] 确认 VPN / 公司网络可用
- [ ] `ping 192.168.217.8`
- [ ] `curl -I http://192.168.217.8`

#### C. Git 目录级共享配置
- [ ] 创建 `~/work/company`
- [ ] 编辑 `~/.gitconfig`
- [ ] 添加 `includeIf`
- [ ] 创建 `~/.gitconfig-company`
- [ ] 填写用户、邮箱、凭据方式

#### D. clone 项目
- [ ] `cd ~/work/company`
- [ ] `git clone http://192.168.217.8/febase/egocopilot.git`
- [ ] `cd egocopilot`
- [ ] `git config --show-origin --list`
- [ ] 切到 `feature/lip`
- [ ] `git pull`

#### E. 开发环境
- [ ] 安装 Homebrew
- [ ] 安装 nvm
- [ ] 安装 Node 18
- [ ] `corepack enable`
- [ ] `corepack prepare pnpm@8.15.4 --activate`
- [ ] `pnpm install`

---

### 15.3 推荐的最小命令清单

#### 目录级共享 Git 配置的关键文件内容

`~/.gitconfig`

```ini
[includeIf "gitdir:~/work/company/"]
    path = ~/.gitconfig-company
```

`~/.gitconfig-company`

```ini
[user]
    name = 你的姓名
    email = 你的公司邮箱

[credential]
    helper = osxkeychain
    useHttpPath = true

[core]
    autocrlf = input

[pull]
    rebase = false

[init]
    defaultBranch = master
```

#### clone 当前项目

```bash
mkdir -p ~/work/company
cd ~/work/company
git clone http://192.168.217.8/febase/egocopilot.git
cd egocopilot
git config --show-origin --list
git branch -r
git checkout -b feature/lip origin/feature/lip
git pull
```

#### Node / pnpm 准备

```bash
brew install nvm
mkdir -p ~/.nvm
touch ~/.zshrc
```

在 `~/.zshrc` 追加：

```bash
export NVM_DIR="$HOME/.nvm"
source "$(brew --prefix nvm)/nvm.sh"
```

然后执行：

```bash
source ~/.zshrc
nvm install 18
nvm use 18
corepack enable
corepack prepare pnpm@8.15.4 --activate
node -v
pnpm -v
```

---

## 结论

对于你当前的情况，推荐路线如下：

1. 先在 Mac 上把 Git 和内网访问打通
2. 使用“目录级共享 Git 配置”管理公司仓库
3. 将公司项目统一放到 `~/work/company/`
4. 后续再补 Node / pnpm 环境
5. 等真正开始跑项目时，再单独处理 Mac 与 Windows 路径差异问题

这样最稳，也最符合你“不影响其他项目”的目标。
````

如果你愿意，我下一步还能继续帮你做两件事中的任意一个：

1. 把这份文档再压缩成一份“**超简版执行清单**”，适合你实际照着点命令做  
2. 再补一份“**Mac 开发环境专用 md 文档**”，专门讲：
   - `Homebrew`
   - `nvm`
   - `Node 18`
   - `pnpm 8.15.4`
   - 以及这个项目后续 `pnpm install` 可能遇到的兼容问题

如果你满意这份文档，我建议你下一步切到 `CRAFT MODE`，我可以继续帮你把它整理成更适合放进项目文档目录的版本。