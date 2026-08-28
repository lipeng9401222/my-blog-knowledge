---
title: Mole 使用手册（macOS 系统清理与优化工具）
date: 2026-07-28
category: mac
tags:
  - Mac
  - Mole
  - 系统清理
  - 终端工具
---

# Mole 使用手册

> Mole 是一个开源终端工具，集合了 CleanMyMac、AppCleaner、DaisyDisk、iStat Menus 的功能于一体。
> 官方仓库：https://github.com/tw93/Mole
> 适用系统：macOS 14 及以上

---

## 一、安装

### 方式 1：Homebrew 安装（推荐）

```bash
brew install mole
```

### 方式 2：脚本安装

```bash
curl -fsSL https://raw.githubusercontent.com/tw93/mole/main/install.sh | bash

# 可选参数
# -s latest    安装 main 分支最新代码
# -s 1.17.0    安装指定版本
```

### 验证安装

```bash
mo --version
mo --help
```

---

## 二、常用命令速查

| 命令 | 用途 | 风险等级 |
|---|---|---|
| `mo` | 交互式主菜单 | 安全 |
| `mo clean` | 深度清理缓存、日志、残留 | 中（删除缓存） |
| `mo uninstall` | 卸载已安装的 App + 残留 | 高（删除 App） |
| `mo optimize` | 重建缓存、刷新系统服务 | 中 |
| `mo analyze` | 可视化磁盘占用分析 | 安全（只读） |
| `mo status` | 实时系统状态监控 | 安全（只读） |
| `mo purge` | 清理项目构建产物（node_modules 等） | 高 |
| `mo installer` | 找出并删除 dmg/pkg 安装包 | 中 |
| `mo history` | 查看历史清理记录 | 安全 |
| `mo touchid` | 配置 Touch ID 用于 sudo | 安全 |
| `mo completion` | 配置 shell tab 补全 | 安全 |
| `mo update` | 更新 Mole | 安全 |
| `mo remove` | 卸载 Mole | 高 |

---

## 三、标准清理流程（推荐顺序）

### 第 1 步：分析磁盘占用（只读，安全）

```bash
# 交互式可视化分析
mo analyze

# 分析家目录（JSON 格式，方便脚本处理）
mo analyze --json ~

# 分析指定目录
mo analyze ~/Documents

# 分析外接磁盘
mo analyze /Volumes
```

### 第 2 步：预览清理内容（不删除，安全）

**重要：执行任何破坏性操作前，先用 `--dry-run` 预览。**

```bash
# 预览深度清理
mo clean --dry-run

# 预览 + 详细日志
mo clean --dry-run --debug

# 预览项目构建产物清理
mo purge --dry-run

# 预览安装包清理
mo installer --dry-run

# 预览 App 卸载
mo uninstall --dry-run
```

预览结果会保存到 `~/.config/mole/clean-list.txt`，可以打开查看完整清单：

```bash
cat ~/.config/mole/clean-list.txt
```

### 第 3 步：执行实际清理

```bash
# 深度清理（交互式确认）
mo clean

# 清理项目构建产物（node_modules、target、dist 等）
mo purge

# 清理下载的安装包
mo installer

# 系统级清理（需要 sudo，清理 Apple 系统容器内的缓存）
sudo mo clean
```

### 第 4 步：查看清理历史

```bash
# 查看最近清理记录
mo history

# 导出 JSON 格式
mo history --json
```

操作日志位置：`~/Library/Logs/mole/operations.log`

---

## 四、各类清理场景

### 1. 深度清理（mo clean）

清理范围：
- 用户 App 缓存（`~/Library/Caches/*`）
- 浏览器缓存（Chrome、Safari、Firefox）
- 开发工具缓存（npm、pnpm、pip、Homebrew、Xcode、JetBrains）
- 系统日志和临时文件
- 孤儿 dotfiles 和 ShipIt 缓存
- 已卸载 App 的残留文件

```bash
mo clean                          # 交互式
mo clean --dry-run                # 预览
mo clean --dry-run --debug        # 预览 + 详细日志

# 管理白名单（保护特定缓存不被清理）
mo clean --whitelist
```

白名单配置文件：`~/.config/mole/whitelist`

### 2. 项目构建产物清理（mo purge）

清理范围：`node_modules`、`target`、`build`、`dist`、`.build`、`venv` 等

```bash
mo purge                          # 交互式选择
mo purge --dry-run                # 预览
mo purge --paths                  # 配置自定义扫描目录
```

自定义扫描路径配置：编辑 `~/.config/mole/purge_paths`，每行一个路径：

```
~/Documents/MyProjects
~/Work/ClientA
~/Work/ClientB
```

> 默认扫描 `~/Projects`、`~/GitHub`、`~/dev`。
> 7 天内的新项目默认不选中。

**注意事项**：删除 `node_modules` 后，下次启动项目需要重新执行 `pnpm install` / `npm install`。

### 3. App 卸载（mo uninstall）

```bash
mo uninstall                     # 卸载已安装的 App + 清理残留
mo uninstall --dry-run           # 预览
```

清理范围：
- 应用本体
- Application Support
- Caches
- Preferences
- Logs、WebKit storage、Cookies
- Extensions、Plugins、Launch daemons

**关键区分**：
- App 已卸载完 → 用 `mo clean`（清理残留）
- App 还在 → 用 `mo uninstall`（卸载 App + 残留）

### 4. 安装包清理（mo installer）

扫描位置：Downloads、Desktop、Homebrew caches、iCloud、Mail

```bash
mo installer                      # 交互式
mo installer --dry-run            # 预览
```

### 5. 系统优化（mo optimize）

```bash
mo optimize                       # 执行优化
mo optimize --dry-run             # 预览
mo optimize --whitelist           # 管理保护规则
```

执行内容：
- 重建系统数据库和缓存
- 重置网络服务
- 刷新 Finder 和 Dock
- 清理诊断和崩溃日志
- 删除 swap 文件
- 重建 LaunchServices 和 Spotlight 索引

### 6. Maven 仓库清理（手动执行）

Mole 把 `~/.m2/repository` 归类为 Large files，不会自动删除。如需手动清理：

```bash
# 方式 1：彻底删除整个 Maven 仓库（释放最多空间，下次构建重新下载）
rm -rf ~/.m2/repository

# 方式 2：只删除 lastUpdated 文件（解决依赖下载失败导致的问题）
find ~/.m2/repository -name "*.lastUpdated" -delete

# 方式 3：只删除旧 SNAPSHOT
find ~/.m2/repository -name "*-SNAPSHOT*" -type d -exec rm -rf {} +
```

### 7. pnpm 仓库清理（手动执行）

```bash
# 清理 pnpm store（下次 install 会重新填充）
rm -rf ~/Library/pnpm/store

# 清理 pnpm 缓存
rm -rf ~/Library/Caches/pnpm
```

### 8. IDE 残留清理（手动执行）

针对不再使用的 IDE，可以手动删除：

```bash
# Trae
rm -rf ~/Library/Caches/Trae*
rm -rf ~/Library/Caches/cn.trae.*
rm -rf ~/.trae ~/.trae-cn

# Codex
rm -rf ~/.codex
rm -rf ~/Library/Caches/com.openai.sky.CUAService*

# Qoder
rm -rf ~/.qoder ~/.qoderwake ~/.qoderworkcn
rm -rf ~/Library/Caches/com.qoder.*

# Antigravity
rm -rf ~/Library/Caches/antigravity-updater
rm -rf ~/Library/Caches/com.google.antigravity*
rm -rf ~/.antigravity_cockpit ~/.antigravity-ide

# 腾讯 CodeBuddy
rm -rf ~/.codebuddy ~/.codebuddycn
rm -rf ~/Library/Caches/com.tencent.codebuddy*
```

---

## 五、实时监控

### 系统状态仪表盘

```bash
mo status                         # 实时仪表盘
```

快捷键：
- `k` 切换猫咪显示
- `c` 切换 CPU 核心显示数量（2/4/8/全部）
- `q` 退出

### JSON 输出（用于脚本）

```bash
# 系统状态 JSON
mo status --json
mo status | jq '.health_score'    # 自动检测管道输出 JSON

# 磁盘分析 JSON
mo analyze --json ~/Documents
```

---

## 六、安全注意事项

### 1. 永远先预览

破坏性命令（`clean`、`uninstall`、`purge`、`installer`、`remove`）都支持 `--dry-run`，**执行前务必预览**：

```bash
mo clean --dry-run --debug
```

### 2. 操作可回溯

所有文件操作都记录在：

```
~/Library/Logs/mole/operations.log    # 操作日志
~/Library/Logs/mole/deletions.log     # 删除审计
```

查看历史：

```bash
mo history
mo history --json
```

如需关闭日志记录：

```bash
export MO_NO_OPLOG=1
```

### 3. 白名单保护

保护重要缓存不被清理：

```bash
mo clean --whitelist          # 管理清理白名单
mo optimize --whitelist       # 管理优化白名单
```

配置文件位置：`~/.config/mole/whitelist`

### 4. 运行中进程的文件会被跳过

Mole 会自动检测运行中的进程（Chrome、Codex、VSCode 等），跳过它们的活跃文件，不会强制删除。

### 5. 推荐使用 mo analyze 进行临时清理

`mo analyze` 通过 Finder 移动文件到废纸篓（可恢复），比直接删除更安全：

> `mo analyze` is safer for ad hoc cleanup because it moves files to Trash through Finder instead of deleting them directly.

---

## 七、增强配置

### 1. 安装 fd 提升扫描速度

```bash
brew install fd
```

### 2. 配置 Touch ID 用于 sudo

```bash
mo touchid enable
```

之后执行 `sudo` 命令时可以使用 Touch ID 指纹解锁，无需输入密码。

### 3. 配置 Shell Tab 补全

```bash
mo completion
```

支持 zsh、bash、fish。

### 4. 快速启动器（Raycast / Alfred）

```bash
curl -fsSL https://raw.githubusercontent.com/tw93/Mole/main/scripts/setup-quick-launchers.sh | bash
```

会添加 5 个快捷命令：`Mole Clean`、`Mole Uninstall`、`Mole Optimize`、`Mole Analyze`、`Mole Status`。

**Raycast 配置步骤**：
1. 打开 Raycast 设置（⌘ + ,）
2. 进入 **Extensions** → **Script Commands**
3. 点击 **"Add Script Directory"** 或 **"+"**
4. 添加路径：`~/Library/Application Support/Raycast/script-commands`
5. 在 Raycast 中搜索 **"Reload Script Directories"** 并执行
6. 完成后搜索 `Mole Clean` 即可使用

### 5. 终端推荐

iTerm2 有兼容性问题。推荐：
- [Kaku](https://github.com/tw93/Kaku)（作者自家，推荐）
- Alacritty
- kitty
- WezTerm
- Ghostty
- Warp

覆盖终端检测：

```bash
export MO_LAUNCHER_APP=<name>
```

---

## 八、常见问题

### Q1: 在 IDE 嵌入式终端中运行 `mo clean` 失败？

**原因**：IDE（如 Trae、VSCode、Cursor）的终端通常有沙盒保护，无法删除工作目录以外的文件。

**解决**：在 Mac 系统自带的 Terminal.app 或 iTerm 中运行：

```bash
open -a Terminal
# 然后执行
mo clean
```

### Q2: `zsh: command not found: #` 报错？

**原因**：zsh 默认不把 `#` 当注释符号。

**解决**：复制命令时跳过 `#` 开头的注释行，或者开启 zsh 交互式注释：

```bash
setopt interactive_comments
```

### Q3: 清理后某些项目启动报错（找不到依赖）？

**原因**：清理了 `node_modules` 或 `~/.m2/repository`。

**解决**：重新安装依赖即可：

```bash
# Node.js 项目
pnpm install      # 或 npm install / yarn install

# Maven 项目
mvn clean install
```

### Q4: Chrome 缓存被跳过？

**原因**：Chrome 正在运行，Mole 自动跳过它的活跃文件。

**解决**：先关闭 Chrome，再执行清理：

```bash
# 优雅关闭 Chrome
osascript -e 'quit app "Google Chrome"'
# 再清理
mo clean
```

### Q5: 系统级缓存（`~/Library/Containers/com.apple.*`）清理失败？

**原因**：需要 sudo 权限。

**解决**：

```bash
sudo mo clean
```

### Q6: 想撤销某次清理？

Mole 不支持撤销，但删除的缓存可以重建。如果误删重要文件，可以查看日志定位：

```bash
cat ~/Library/Logs/mole/deletions.log
```

---

## 九、推荐清理脚本（一键执行）

将以下内容保存为 `~/cleanup.sh`，需要时一键执行：

```bash
#!/bin/bash
set -e

echo "=== 1. 预览深度清理 ==="
mo clean --dry-run

echo ""
echo "=== 2. 预览项目构建产物清理 ==="
mo purge --dry-run

echo ""
echo "=== 3. 预览安装包清理 ==="
mo installer --dry-run

echo ""
echo "======================================"
echo "预览完成。确认无误后执行："
echo "  mo clean       # 深度清理"
echo "  mo purge       # 清理项目产物"
echo "  mo installer   # 清理安装包"
echo "  sudo mo clean  # 系统级清理"
echo "======================================"
```

赋权并执行：

```bash
chmod +x ~/cleanup.sh
~/cleanup.sh
```

---

## 十、卸载 Mole

如需移除 Mole：

```bash
# 预览移除
mo remove --dry-run

# 执行移除
mo remove

# 通过 Homebrew 卸载
brew uninstall mole
```

---

## 附录：配置文件位置

| 文件 | 用途 |
|---|---|
| `~/.config/mole/whitelist` | 清理白名单 |
| `~/.config/mole/purge_paths` | 项目扫描路径 |
| `~/.config/mole/clean-list.txt` | 上次预览的清理清单 |
| `~/Library/Logs/mole/operations.log` | 操作日志 |
| `~/Library/Logs/mole/deletions.log` | 删除审计日志 |
| `~/Library/Logs/mole/mole_debug_session.log` | 调试会话日志 |

## 附录：环境变量

| 变量 | 用途 |
|---|---|
| `MO_NO_OPLOG=1` | 关闭操作日志记录 |
| `MO_LAUNCHER_APP=<name>` | 覆盖终端检测 |
| `--proc-cpu-threshold` | `mo status` 进程 CPU 阈值 |
| `--proc-cpu-window` | `mo status` 持续时间窗口 |
| `--proc-cpu-alerts=false` | 关闭进程告警 |

---

## 实测数据参考（2026-07-28）

- 系统：macOS 26.4 Tahoe
- 工具版本：Mole 1.48.1
- 安装前磁盘可用：816 GB
- `mo clean` 释放：14.57 GB（删除 703 项）
- `rm -rf ~/.m2/repository` 释放：4.35 GB
- `mo purge` 可释放：8.79 GB（43 个项目的 node_modules/build/dist）
- **累计释放：约 18.9 GB**
