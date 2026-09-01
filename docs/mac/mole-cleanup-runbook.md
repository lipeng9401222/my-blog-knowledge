---
title: Mole 分阶段清理执行清单
date: 2026-08-28
category: mac
tags:
  - Mac
  - Mole
  - 系统清理
  - 开发工具缓存
---

# Mole 分阶段清理执行清单

本清单针对当前 Mac 和 Mole 1.48.1。每一阶段都先预览、再执行；不要把所有命令一次性粘贴运行。

已确认的边界：

- 不配置 Mole 白名单，但必须逐项检查 `mo clean` 的交互清单。
- 保留 Codex、Trae、Kiro、Claude、Antigravity、CodeBuddy、VS Code、IntelliJ 的登录、设置、扩展、技能、会话和工作区数据。
- Cursor、Windsurf、Qoder、Zed 按已卸载残留处理，先移动到废纸篓。
- `mo purge` 只扫描 `~/Projects`、`~/Workspace`、Codex worktree 和 Claude worktree。
- 纳入用户级清理和系统级 `sudo mo clean`，排除 `mo optimize`。
- npm、pnpm 使用官方维护命令；保留 Maven 仓库。

## 0. 执行前准备

保存所有工作。读完整份清单后，完全退出 Codex、Trae、Kiro、Claude、Antigravity、CodeBuddy、VS Code、IntelliJ 和所有浏览器，再从 macOS Terminal.app 执行后续命令。

记录清理前空间：

```bash
mo --version
df -h /
mo analyze "$HOME"
```

## 1. 限定项目构建产物扫描范围

先备份原配置，再写入已经确认的四个扫描根目录：

```bash
mkdir -p "$HOME/.config/mole"
if [ -f "$HOME/.config/mole/purge_paths" ]; then cp -p "$HOME/.config/mole/purge_paths" "$HOME/.config/mole/purge_paths.backup.$(date +%Y%m%d-%H%M%S)"; fi
printf '%s\n' '~/Projects' '~/Workspace' '~/.codex/worktrees' '~/.claude/worktrees' > "$HOME/.config/mole/purge_paths"
sed -n '1,20p' "$HOME/.config/mole/purge_paths"
```

输出必须只有上述四个路径。不要加入 `~/Documents` 或 `~/Library/CloudStorage`。

## 2. 预览所有 Mole 清理

逐条运行。每条预览结束后先阅读结果，再继续下一条：

```bash
mo clean --dry-run --debug
less "$HOME/.config/mole/clean-list.txt"
mo purge --dry-run --debug
mo installer --dry-run --debug
sudo mo clean --dry-run --debug
```

额外搜索高风险用户数据路径：

```bash
rg -n '\.codex|\.trae-cn|\.kiro|\.claude|\.antigravity|\.codebuddy|Application Support/(Codex|TRAE SOLO CN|Kiro|Antigravity|CodeBuddy CN)' "$HOME/.config/mole/clean-list.txt"
```

出现匹配不一定代表有问题，但如果预览准备删除整个配置目录、`User`、`Workspaces`、`Backups`、`Cookies`、`Local Storage`、`IndexedDB` 或 `Session Storage`，实际清理时必须取消选择。

## 3. 执行 Mole 清理

只有第 2 阶段预览无误后才逐条执行。每次都在交互界面复核选择：

```bash
mo clean
mo purge
mo installer
sudo mo clean
```

`mo purge` 删除依赖或构建产物后，相关项目下次启动需要重新安装依赖或重新构建。

## 4. 预览开发工具缓存

先查看独立缓存目录大小：

```bash
du -sh "$HOME/Library/Caches/Codex" "$HOME/Library/Caches/com.openai.codex" "$HOME/Library/Caches/com.openai.sky.CUAService" "$HOME/Library/Caches/dev.kiro.desktop" "$HOME/Library/Caches/dev.kiro.desktop.ShipIt" "$HOME/Library/Caches/claude-cli-nodejs" "$HOME/Library/Caches/JetBrains" "$HOME/Library/Caches/com.microsoft.VSCode" "$HOME/Library/Caches/com.microsoft.VSCode.helper" "$HOME/Library/Caches/com.microsoft.VSCode.ShipIt" 2>/dev/null
du -sh "$HOME/.codex/cache" "$HOME/.codex/.tmp" "$HOME/.codex/tmp" "$HOME/.codex/node_repl" "$HOME/.codex/shell_snapshots" "$HOME/.trae-cn/trae-browser-screenshots" "$HOME/.trae-cn/hub_event_cache" "$HOME/.kiro/logs" 2>/dev/null
```

列出桌面工具中将要删除的可重建子目录：

```bash
for app in 'Codex' 'TRAE SOLO CN' 'Kiro' 'CodeBuddy CN' 'Antigravity' 'Code'; do find "$HOME/Library/Application Support/$app" -mindepth 1 -maxdepth 1 -type d \( -name 'Cache' -o -name 'Code Cache' -o -name 'GPUCache' -o -name 'CachedData' -o -name 'CachedProfilesData' -o -name 'CachedConfigurations' -o -name 'CachedExtensionVSIXs' -o -name 'DawnGraphiteCache' -o -name 'DawnWebGPUCache' -o -name 'GraphiteDawnCache' -o -name 'GrShaderCache' -o -name 'ShaderCache' -o -name 'GPUPersistentCache' -o -name 'component_crx_cache' -o -name 'extensions_crx_cache' -o -name 'Crashpad' -o -name 'logs' \) -print 2>/dev/null; done
```

确认输出中没有 `User`、`Workspaces`、`Backups`、存储目录或其他用户数据。

## 5. 清理开发工具缓存

删除第 4 阶段列出的独立缓存和临时目录：

```bash
rm -rf "$HOME/Library/Caches/Codex" "$HOME/Library/Caches/com.openai.codex" "$HOME/Library/Caches/com.openai.sky.CUAService" "$HOME/Library/Caches/dev.kiro.desktop" "$HOME/Library/Caches/dev.kiro.desktop.ShipIt" "$HOME/Library/Caches/claude-cli-nodejs" "$HOME/Library/Caches/JetBrains" "$HOME/Library/Caches/com.microsoft.VSCode" "$HOME/Library/Caches/com.microsoft.VSCode.helper" "$HOME/Library/Caches/com.microsoft.VSCode.ShipIt"
rm -rf "$HOME/.codex/cache" "$HOME/.codex/.tmp" "$HOME/.codex/tmp" "$HOME/.codex/node_repl" "$HOME/.codex/shell_snapshots" "$HOME/.trae-cn/trae-browser-screenshots" "$HOME/.trae-cn/hub_event_cache" "$HOME/.kiro/logs"
rm -rf "$HOME/Library/Logs/JetBrains" "$HOME/Library/Logs/com.openai.codex"
for app in 'Codex' 'TRAE SOLO CN' 'Kiro' 'CodeBuddy CN' 'Antigravity' 'Code'; do find "$HOME/Library/Application Support/$app" -mindepth 1 -maxdepth 1 -type d \( -name 'Cache' -o -name 'Code Cache' -o -name 'GPUCache' -o -name 'CachedData' -o -name 'CachedProfilesData' -o -name 'CachedConfigurations' -o -name 'CachedExtensionVSIXs' -o -name 'DawnGraphiteCache' -o -name 'DawnWebGPUCache' -o -name 'GraphiteDawnCache' -o -name 'GrShaderCache' -o -name 'ShaderCache' -o -name 'GPUPersistentCache' -o -name 'component_crx_cache' -o -name 'extensions_crx_cache' -o -name 'Crashpad' -o -name 'logs' \) -exec rm -rf {} + 2>/dev/null; done
```

这些目录会在应用下次启动时重建；首次启动和重新索引可能比平时慢。

## 6. 将已卸载工具残留移入废纸篓

先创建带时间戳的恢复目录，再按来源分类移动，避免同名目录冲突：

```bash
residual_trash="$HOME/.Trash/dev-tool-residuals-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$residual_trash/home" "$residual_trash/config" "$residual_trash/app-support" "$residual_trash/preferences" "$residual_trash/http-storage" "$residual_trash/caches"
for p in "$HOME/.cursor" "$HOME/.windsurf" "$HOME/.qoder-cli" "$HOME/.qoder-alpha"; do [ ! -e "$p" ] || mv "$p" "$residual_trash/home/"; done
for p in "$HOME/.config/zed"; do [ ! -e "$p" ] || mv "$p" "$residual_trash/config/"; done
for p in "$HOME/Library/Application Support/Cursor" "$HOME/Library/Application Support/Windsurf" "$HOME/Library/Application Support/Qoder" "$HOME/Library/Application Support/QoderWork" "$HOME/Library/Application Support/QoderWork CN" "$HOME/Library/Application Support/Zed"; do [ ! -e "$p" ] || mv "$p" "$residual_trash/app-support/"; done
for p in "$HOME/Library/Preferences/Qoder.plist" "$HOME/Library/Preferences/dev.zed.Zed.plist" "$HOME/Library/Preferences/qodercli.plist" "$HOME/Library/Preferences/com.exafunction.windsurf.plist" "$HOME/Library/Preferences/com.qoder.work.cn.plist" "$HOME/Library/Preferences/com.qoder.ide.plist"; do [ ! -e "$p" ] || mv "$p" "$residual_trash/preferences/"; done
for p in "$HOME/Library/HTTPStorages/com.exafunction.windsurf" "$HOME/Library/HTTPStorages/com.qoder.ide" "$HOME/Library/HTTPStorages/com.qoder.QoderWake.MenuBar" "$HOME/Library/HTTPStorages/com.exafunction.windsurf.binarycookies" "$HOME/Library/HTTPStorages/com.qoder.ide.binarycookies" "$HOME/Library/HTTPStorages/com.qoder.work.cn" "$HOME/Library/HTTPStorages/Qoder"; do [ ! -e "$p" ] || mv "$p" "$residual_trash/http-storage/"; done
for p in "$HOME/Library/Caches/com.exafunction.windsurf"; do [ ! -e "$p" ] || mv "$p" "$residual_trash/caches/"; done
printf '残留已移动到：%s\n' "$residual_trash"
du -sh "$residual_trash"
```

暂时不要清空废纸篓。确认常用工具和项目工作正常后，再手动清空；如发现误移，可从该目录恢复。

## 7. 维护 npm 和 pnpm 缓存

```bash
pnpm store prune
npm cache verify
```

保留 `~/.m2/repository`，不执行整库删除，也不删除当前 SNAPSHOT。

## 8. 验证与审计

```bash
mo history
mo history --json
df -h /
du -sh "$HOME/.m2/repository" "$HOME/.npm" "$HOME/Library/pnpm/store" 2>/dev/null
tail -n 100 "$HOME/Library/Logs/mole/operations.log"
tail -n 100 "$HOME/Library/Logs/mole/deletions.log"
```

重新打开常用开发工具，检查登录状态、扩展、项目和会话。项目缺少依赖时，按项目使用的包管理器执行 `pnpm install`、`npm install` 或 `mvn clean install`。
