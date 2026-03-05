# 前端知识库博客系统（2026版）

一个完全自动化的个人知识库博客系统，基于 VitePress 构建。

## ✨ 核心特性

- 🚀 **智能归档**：粘贴文章内容，自动分类、自动创建目录、自动生成标签
- 📝 **Markdown 写作**：专注内容创作，无需关心技术细节
- 🔍 **本地搜索**：基于 Pagefind 的快速全文搜索
- 💬 **评论系统**：集成 Giscus，基于 GitHub Discussions
- 📱 **响应式设计**：完美支持移动端和桌面端
- 🌙 **暗黑模式**：自动适配系统主题
- ⚡ **自动部署**：推送代码即自动构建和部署

## 🎯 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发

```bash
npm run dev
```

访问 http://localhost:5173 查看效果

### 3. 智能归档文章

这是本系统的核心功能！只需粘贴文章内容，系统会自动完成所有工作。

**方式一：交互式输入**

```bash
npm run archive
```

然后粘贴你的文章内容，按 Ctrl+D (Mac/Linux) 或 Ctrl+Z (Windows) 结束输入。

**方式二：管道输入**

```bash
echo "你的文章内容" | npm run archive
```

系统会自动：
- ✅ 分析内容，判断所属分类（JavaScript/React/Vue/工程化/性能优化/面试题）
- ✅ 提取关键词，生成标签
- ✅ 创建分类目录（如果不存在）
- ✅ 生成规范的 frontmatter
- ✅ 更新侧边栏导航

### 4. 手动创建文章

如果你想手动指定分类：

```bash
npm run new javascript/event-loop
```

### 5. 发布到线上

```bash
npm run publish
```

或者直接：

```bash
git add .
git commit -m "新增文章"
git push
```

GitHub Actions 会自动构建并部署到 Cloudflare Pages。

## 📁 项目结构

```
.
├── docs/                    # 文档目录
│   ├── index.md            # 首页
│   ├── javascript/         # JavaScript 分类
│   ├── react/              # React 分类
│   ├── vue/                # Vue 分类
│   ├── engineering/        # 工程化分类
│   ├── performance/        # 性能优化分类
│   └── interview/          # 面试题分类
├── .vitepress/             # VitePress 配置
│   ├── config.ts           # 主配置文件
│   └── theme/              # 自定义主题
│       ├── index.ts
│       ├── MyLayout.vue    # 自定义布局（含评论）
│       └── style.css       # 自定义样式
├── scripts/                # 自动化脚本
│   ├── auto-archive.js     # 🌟 智能归档脚本
│   ├── generate-sidebar.js # 自动生成侧边栏
│   ├── new-post.js         # 创建新文章
│   └── publish.js          # 发布脚本
└── .github/workflows/      # GitHub Actions
    └── deploy.yml          # 自动部署配置
```

## 🛠️ 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览构建结果 |
| `npm run archive` | 🌟 智能归档文章 |
| `npm run new <分类>/<标题>` | 手动创建文章 |
| `npm run sidebar` | 重新生成侧边栏 |
| `npm run publish` | 发布到远程仓库 |

## 🎨 自定义配置

### 修改站点信息

编辑 `.vitepress/config.ts`：

```typescript
export default defineConfig({
  title: '你的站点名称',
  description: '你的站点描述',
  // ...
})
```

### 配置评论系统

1. 访问 [giscus.app](https://giscus.app)
2. 按照指引配置你的 GitHub 仓库
3. 获取配置参数
4. 编辑 `.vitepress/theme/MyLayout.vue`，填入你的配置

### 配置 Cloudflare Pages

1. 登录 Cloudflare Dashboard
2. 进入 Pages，连接你的 GitHub 仓库
3. 构建命令：`npm run build`
4. 输出目录：`.vitepress/dist`
5. 在 GitHub 仓库设置中添加 Secrets：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

## 📝 文章格式

每篇文章都包含 frontmatter：

```markdown
---
title: 文章标题
date: 2026-03-05
category: javascript
tags:
  - javascript
  - async
description: 文章描述
---

# 文章标题

文章内容...
```

使用 `npm run archive` 时，这些信息会自动生成！

## 🚀 部署

### Cloudflare Pages（推荐）

- 免费
- 全球 CDN
- 自动 HTTPS
- 无限带宽

### 其他平台

也支持部署到：
- Vercel
- Netlify
- GitHub Pages

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
