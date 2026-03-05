# 使用指南

本文档详细介绍如何使用博客系统的各项功能。

## 🌟 核心功能：智能归档

这是本系统最强大的功能！只需粘贴文章内容，系统会自动完成所有工作。

### 使用方法

**方式一：交互式输入**

```bash
npm run archive
```

然后粘贴你的文章内容，完成后按：
- Mac/Linux: `Ctrl + D`
- Windows: `Ctrl + Z` 然后 `Enter`

**方式二：从文件读取**

```bash
cat article.md | npm run archive
```

**方式三：直接输入**

```bash
echo "# Vue3 响应式原理

Vue3 使用 Proxy 实现响应式系统..." | npm run archive
```

### 自动化流程

系统会自动：

1. **分析分类**：根据内容关键词判断所属分类
   - 检测到 `react`、`hooks`、`jsx` → React 分类
   - 检测到 `vue`、`composition api` → Vue 分类
   - 检测到 `webpack`、`vite` → 工程化分类
   - 等等...

2. **提取标签**：自动识别技术关键词作为标签

3. **创建目录**：如果分类目录不存在，自动创建

4. **生成文件**：
   - 自动生成规范的 frontmatter
   - 提取标题
   - 格式化内容

5. **更新导航**：自动更新侧边栏配置

### 示例

假设你粘贴了这段内容：

```markdown
# React Hooks 最佳实践

React Hooks 是 React 16.8 引入的新特性，让我们可以在函数组件中使用状态和其他 React 特性。

## useState

useState 是最常用的 Hook...
```

系统会自动：
- 识别为 React 分类
- 提取标签：`react`, `hooks`
- 创建文件：`docs/react/react-hooks-最佳实践.md`
- 生成完整的 frontmatter
- 更新侧边栏

## 📝 手动创建文章

如果你想手动指定分类和文件名：

```bash
npm run new <分类>/<文件名>
```

### 示例

```bash
# 创建 JavaScript 分类下的文章
npm run new javascript/promise

# 创建 React 分类下的文章
npm run new react/hooks-guide

# 创建 Vue 分类下的文章
npm run new vue/composition-api
```

### 可用分类

- `javascript` - JavaScript 相关
- `react` - React 相关
- `vue` - Vue 相关
- `engineering` - 工程化相关
- `performance` - 性能优化相关
- `interview` - 面试题相关

## 🚀 发布文章

### 方式一：使用发布脚本

```bash
npm run publish
```

这会自动执行：
1. 更新侧边栏配置
2. Git add
3. Git commit
4. Git push

### 方式二：手动发布

```bash
git add .
git commit -m "新增文章：React Hooks 最佳实践"
git push
```

推送后，GitHub Actions 会自动：
1. 安装依赖
2. 生成侧边栏
3. 构建站点
4. 部署到 Cloudflare Pages

## 🔍 本地预览

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

特点：
- 热更新
- 快速刷新
- 实时预览

### 生产预览

```bash
npm run build
npm run preview
```

这会构建生产版本并在本地预览，包含：
- 搜索索引
- 优化后的资源
- 完整功能

## 📂 文章格式

### Frontmatter 说明

每篇文章开头的 frontmatter 包含元数据：

```yaml
---
title: 文章标题              # 必需
date: 2026-03-05            # 必需，格式：YYYY-MM-DD
category: javascript        # 必需，所属分类
tags:                       # 必需，标签列表
  - javascript
  - async
description: 文章简介       # 可选
---
```

使用 `npm run archive` 时，这些会自动生成！

### Markdown 语法

支持标准 Markdown 和扩展语法：

#### 代码块

````markdown
```javascript
const greeting = 'Hello World'
console.log(greeting)
```
````

#### 提示框

```markdown
::: tip 提示
这是一个提示
:::

::: warning 警告
这是一个警告
:::

::: danger 危险
这是一个危险提示
:::
```

#### 代码组

````markdown
::: code-group
```javascript [JavaScript]
console.log('Hello')
```

```typescript [TypeScript]
console.log('Hello' as string)
```
:::
````

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

### 修改导航栏

编辑 `.vitepress/config.ts` 中的 `nav`：

```typescript
nav: [
  { text: '首页', link: '/' },
  { text: 'JavaScript', link: '/javascript/' },
  // 添加更多导航项...
]
```

### 修改主题颜色

编辑 `.vitepress/theme/style.css`：

```css
:root {
  --vp-c-brand-1: #3eaf7c;  /* 主色调 */
  --vp-c-brand-2: #42b883;  /* 次要色 */
  /* ... */
}
```

### 添加新分类

1. 在 `scripts/auto-archive.js` 中添加分类关键词：

```javascript
const categoryKeywords = {
  // 现有分类...
  
  // 新分类
  typescript: ['typescript', 'ts', 'type', '类型'],
}
```

2. 在 `.vitepress/config.ts` 中添加导航：

```typescript
nav: [
  // 现有导航...
  { text: 'TypeScript', link: '/typescript/' }
]
```

3. 创建分类目录：

```bash
mkdir docs/typescript
echo "# TypeScript" > docs/typescript/index.md
```

## 🔧 维护操作

### 重新生成侧边栏

如果侧边栏显示不正确：

```bash
npm run sidebar
```

### 清理缓存

```bash
rm -rf .vitepress/cache
rm -rf .vitepress/dist
```

### 更新依赖

```bash
npm update
```

## 📊 内容管理

### 查看所有文章

```bash
# Linux/Mac
find docs -name "*.md" -not -path "*/node_modules/*"

# Windows PowerShell
Get-ChildItem -Path docs -Filter *.md -Recurse
```

### 搜索文章内容

```bash
# Linux/Mac
grep -r "关键词" docs/

# Windows PowerShell
Select-String -Path docs\*.md -Pattern "关键词" -Recurse
```

### 统计文章数量

```bash
# Linux/Mac
find docs -name "*.md" -not -name "index.md" | wc -l

# Windows PowerShell
(Get-ChildItem -Path docs -Filter *.md -Recurse | Where-Object { $_.Name -ne "index.md" }).Count
```

## 💡 最佳实践

### 1. 文章命名

- 使用小写字母
- 用连字符分隔单词
- 避免特殊字符
- 保持简洁明了

✅ 好的命名：
- `react-hooks-guide.md`
- `javascript-event-loop.md`
- `webpack-optimization.md`

❌ 不好的命名：
- `React Hooks Guide.md`（有空格）
- `javascript事件循环.md`（混合中英文）
- `webpack_optimization.md`（使用下划线）

### 2. 内容组织

- 每篇文章专注一个主题
- 使用清晰的标题层级
- 添加代码示例
- 包含实践应用
- 提供参考资料

### 3. 标签使用

- 每篇文章 3-5 个标签
- 使用小写英文
- 保持标签一致性
- 避免过于宽泛的标签

### 4. 定期维护

- 定期更新过时内容
- 修复失效链接
- 优化文章结构
- 补充新的知识点

## 🎯 工作流程建议

### 日常写作流程

1. 有了新想法或学习笔记
2. 整理成 Markdown 格式
3. 运行 `npm run archive` 粘贴内容
4. 系统自动归档和分类
5. 运行 `npm run publish` 发布
6. 完成！

### 批量导入流程

如果你有很多现有文章要导入：

```bash
# 创建一个脚本
for file in old-articles/*.md; do
  cat "$file" | npm run archive
done
```

## 📚 更多资源

- [VitePress 官方文档](https://vitepress.dev)
- [Markdown 语法指南](https://markdown.com.cn)
- [Giscus 文档](https://giscus.app)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages)

## 🆘 获取帮助

遇到问题？

1. 查看 [README.md](README.md)
2. 查看 [DEPLOY.md](DEPLOY.md)
3. 检查 GitHub Issues
4. 提交新的 Issue

祝你写作愉快！ ✨
