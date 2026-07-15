---
title: 前端：Vue 组件化（pnpm workspace + vue-web）启动
sidebar: auto
collapsable: true
---

# 前端：Vue 组件化（pnpm workspace + vue-web）启动

## 目的

在 macOS 上启动 Vue 组件化前端开发环境，使页面可访问，并通过 Vite 代理访问后端 `http://localhost:8080/epoint-web`。

## 前置条件

- 后端已能启动并可访问（至少能打开）：`http://localhost:8080/epoint-web`
- Node.js 可用（建议用 nvm 管理）
- pnpm 已安装（建议 v10）
- 你能访问公司前端组件仓库（通常是内网 Git 仓库）

## 关键约定（必须与后端一致）

- 后端地址：`http://localhost:8080`
- 后端 ROOTPATH（接口与页面前缀）：`/epoint-web`

## 步骤 1：确认 Node 与 pnpm

在终端执行：

```bash
node -v
pnpm -v
```

把输出记录到“本步产出”。

## 步骤 2：创建 pnpm workspace（如果你已有工作区可跳过）

建议目录结构（示例）：

```text
~/Workspace/epoint-fe/
```

在工作区根目录创建 `pnpm-workspace.yaml`（示例逻辑：把所有子工程纳入 workspace 管理）：

```yaml
packages:
  - "*"
  - "packages/*"
```

同时确保根目录有 `package.json`（可以是一个最小文件，仅用于 workspace 根）：

```json
{
  "name": "epoint-fe-workspace",
  "private": true
}
```

## 步骤 3：准备 vue-web（主 web 工程）

原始文档参考：

- [开发环境启动：启动前端（vue）](file:///Users/juanjuan/Projects/personal/myknowledge/docs/environment/01-快速入门/开发环境启动.md#L88-L161)
- [安装环境：vue组件化环境安装](file:///Users/juanjuan/Projects/personal/myknowledge/docs/environment/安装环境.md#L423-L470)

你需要准备一个“主 web 工程”（通常叫 `vue-web` 或公司约定的 web 工程名），它负责聚合子组件并运行。

如果公司要求使用脚手架（例如 `eui-cli`）创建，请按公司前端规范创建；如果你已经有现成仓库，直接 clone 到 workspace 下即可。

## 步骤 4：修改前端基础路径与虚拟路径

在 `vue-web` 工程里找到 `src/config.js`，确认：

- `BASEPATH`（研发环境）建议为 `/`
- `ROOTPATH` 必须为 `/epoint-web`

原文示例：

```js
const BASEPATH = '/'
const ROOTPATH = '/epoint-web'
```

## 步骤 5：配置 Vite 代理（让前端请求打到后端）

在 `vue-web` 的 `vite.config.js` 中，确保代理把 `/epoint-web` 指向后端地址：

```js
server: {
  proxy: {
    '/epoint-web': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

如果项目里封装了一个 `BACKEND_SERVER_URL` 常量，只需要把它指向：

```text
http://localhost:8080
```

## 步骤 6：安装依赖并启动

在 workspace 根目录执行：

```bash
pnpm install
```

如果你有组件化子工程并且需要 build，按文档执行一次统一 build（名称以你实际工具为准）：

```bash
eui-cli build
```

进入 `vue-web` 目录启动：

```bash
cd vue-web
pnpm run dev
```

## 步骤 7：验证前端启动成功

### 1) 页面可打开

在终端输出里会有本地访问地址（通常是 `http://localhost:5173` 或类似端口）。

### 2) 接口能代理到后端

打开浏览器 DevTools → Network：

- 页面请求不应出现大量 404（静态资源）
- `/epoint-web/...` 相关请求不应出现 502/504（代理失败）

## 常见问题与排查

### 1) `pnpm: command not found`

说明 pnpm 没装或没进 PATH。

建议用 npm 全局安装（你已经装好 Node 的前提下）：

```bash
npm i -g pnpm@10
```

### 2) 前端能打开但接口 404/502

优先检查：

- 后端是否已启动、`http://localhost:8080/epoint-web` 是否能打开
- `ROOTPATH` 是否是 `/epoint-web`
- Vite 代理是否正确配置到 `http://localhost:8080`

## 本步产出（你来填写）

- workspace 路径：
- node -v 输出：
- pnpm -v 输出：
- vue-web 启动地址：
- 是否已能访问页面：是 / 否
- 是否已能代理接口：是 / 否

