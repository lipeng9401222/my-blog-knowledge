# 📖 前端知识库 · 使用指南

> **一句话总结**：写 Markdown → `npm run publish` → 自动部署上线

---

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖（首次）
npm install

# 启动本地预览
npm run dev
# 访问 http://localhost:5173
```

---

## ✍️ 日常写作流程（推荐）

### 方式一：智能归档（推荐）

直接粘贴已有文章内容，脚本**自动识别分类**、**自动提取标签**、**自动创建目录**：

```bash
npm run archive
```

运行后粘贴你的 Markdown 内容，按 `Ctrl+Z`（Windows）或 `Ctrl+D`（Mac/Linux）结束输入。

**效果示例：**

```
🤖 智能归档系统 v2.0

📂 已有分类: engineering | interview | javascript | performance | react | vue

📋 请粘贴文章内容...

📂 匹配分类: "vue" (置信度: 8)
✅ 文章归档成功!
   📁 路径: docs/vue/composition-api-deep-dive.md
   📂 分类: vue
   📝 标题: Vue3 Composition API 深入解析
   🏷️  标签: vue, vue3, composition api, reactive, ref
```

**智能归档特性：**

- ✅ 自动扫描 `docs/` 下所有已有分类
- ✅ 基于关键词权重匹配最佳分类
- ✅ **如果内容不属于已有分类，自动创建新分类目录**
- ✅ 自动从文章标题、正文、h2/h3 标题中提取标签
- ✅ 自动更新侧边栏

---

### 方式二：新建空文章

```bash
npm run new
# 或者指定标题和分类
npm run new "React 18 并发特性" react
```

**交互式提示：**

```
📝 文章标题: React 18 并发特性
📂 分类列表: javascript | react | vue | engineering | browser | performance | css | interview | nodejs
📂 选择分类 (默认: javascript): react

✅ 文章已创建: docs/react/react-18.md
```

---

### 方式三：直接创建文件

在对应目录下新建 `.md` 文件，加上 frontmatter：

```markdown
---
title: 你的文章标题
date: 2026-03-05
category: javascript
tags:
  - javascript
  - es6
description: 文章简介
---

# 你的文章标题

文章内容...
```

---

## 📤 发布流程

### 一键发布（推荐）

```bash
npm run publish
# 或者指定提交信息
npm run publish "新增：React 18 并发特性详解"
```

执行流程：

1. 自动更新侧边栏
2. `git add .`
3. `git commit`
4. `git push`
5. GitHub Actions 自动构建 + 部署（约 2 分钟）

### 手动发布

```bash
# 更新侧边栏
npm run sidebar

# 提交推送
git add .
git commit -m "新增文章：xxx"
git push
```

---

## 📂 目录结构

```
my-blog-knowledge/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts          # 站点配置（sidebar 自动生成，勿手动改）
│   │   └── theme/
│   │       ├── Layout.vue     # 评论系统集成
│   │       └── style.css      # 自定义样式
│   ├── index.md               # 首页
│   ├── javascript/            # JavaScript 分类
│   ├── react/                 # React 分类
│   ├── vue/                   # Vue 分类
│   ├── engineering/           # 工程化分类
│   ├── performance/           # 性能优化分类
│   └── interview/             # 面试题分类
│
├── scripts/
│   ├── auto-archive.js        # 智能归档脚本 ⭐
│   ├── generate-sidebar.js    # 侧边栏自动生成
│   ├── new-post.js            # 新建文章
│   └── publish.js             # 一键发布
│
├── .github/workflows/
│   └── deploy.yml             # GitHub Actions 自动部署
│
└── package.json
```

---

## 🏷️ 新增分类

**无需任何配置**，直接在 `docs/` 下建目录即可：

```bash
mkdir docs/typescript
```

或者直接用智能归档——当文章内容匹配不到已有分类时，**自动创建新分类**。

下次运行 `npm run sidebar` 或 `npm run publish` 时，新分类会自动出现在导航栏和侧边栏。

---

## 💬 评论系统配置（Giscus）

评论系统使用 [Giscus](https://giscus.app)，基于 GitHub Discussions，**完全免费**。

### 配置步骤

**1. 开启 GitHub Discussions**

- 进入仓库 Settings → Features → 勾选 **Discussions**

**2. 获取 Giscus 配置**

- 访问 https://giscus.app/zh-CN
- 仓库填：`lipeng9401222/my-blog-knowledge`
- 页面底部会生成 `data-repo-id` 和 `data-category-id`

**3. 更新代码**

编辑 `docs/.vitepress/theme/Layout.vue`，替换以下 3 个值：

```javascript
script.setAttribute("data-repo", "lipeng9401222/my-blog-knowledge"); // ✅ 已配置
script.setAttribute("data-repo-id", "YOUR_REPO_ID"); // ← 替换为你的 repo-id
script.setAttribute("data-category-id", "YOUR_CATEGORY_ID"); // ← 替换为你的 category-id
```

**4. 关闭某篇文章的评论**

在文章 frontmatter 中加：

```markdown
---
comment: false
---
```

---

## 🌐 在线部署

### GitHub Pages（已配置）

- 每次 `git push` 到 `main` 分支自动触发
- 查看部署进度：https://github.com/lipeng9401222/my-blog-knowledge/actions
- 线上地址：**https://lipeng9401222.github.io/my-blog-knowledge/**

### 启用 GitHub Pages

1. 进入 https://github.com/lipeng9401222/my-blog-knowledge/settings/pages
2. Source 选择 **"GitHub Actions"**
3. 保存

### 使用自定义域名（可选）

1. 修改 `docs/.vitepress/config.ts`：

   ```typescript
   base: '/',  // 改为 /
   ```

2. 在 `docs/public/` 下新建 `CNAME` 文件：

   ```
   your-domain.com
   ```

3. 在域名 DNS 添加 CNAME 记录指向 `lipeng9401222.github.io`

---

## 🛠️ NPM 命令速查

| 命令              | 说明                         |
| ----------------- | ---------------------------- |
| `npm run dev`     | 本地开发预览                 |
| `npm run new`     | 交互式新建文章               |
| `npm run archive` | 智能归档（粘贴内容自动分类） |
| `npm run sidebar` | 重新生成侧边栏               |
| `npm run publish` | 一键提交 + 推送 + 自动部署   |
| `npm run build`   | 本地构建（生产环境）         |
| `npm run preview` | 预览构建产物                 |

---

## 📝 Frontmatter 字段说明

```markdown
---
title: 文章标题 # 必填
date: 2026-03-05 # 发布日期，用于侧边栏排序
category: javascript # 分类（对应 docs/ 下的目录名）
tags: # 标签列表
  - javascript
  - es6
description: 文章简介 # SEO 描述
comment: true # 是否开启评论，默认 true（false 关闭）
---
```

---

## ❓ 常见问题

**Q: 侧边栏没有更新？**

```bash
npm run sidebar
```

**Q: 本地能看到文章但线上没有？**

- 检查 GitHub Actions 是否运行成功：https://github.com/lipeng9401222/my-blog-knowledge/actions
- 确认 `docs/.vitepress/config.ts` 中的 `base` 设置正确

**Q: 评论不显示？**

- 确认仓库已开启 Discussions
- 确认 Layout.vue 中的 `data-repo-id` 和 `data-category-id` 已替换为真实值
- 确认仓库是 Public

**Q: 如何删除文章？**

- 直接删除对应 `.md` 文件
- 运行 `npm run sidebar` 更新导航
- `npm run publish` 推送

**Q: 新增分类后导航栏没显示？**

- 运行 `npm run sidebar` 会自动扫描并更新导航栏
