# 快速开始指南

5 分钟快速上手你的博客系统！

## 🚀 第一步：安装依赖

```bash
npm install
```

## ✨ 第二步：体验智能归档

这是本系统最强大的功能！

```bash
npm run archive
```

然后粘贴以下示例内容（或你自己的文章）：

```markdown
# JavaScript Promise 详解

Promise 是 JavaScript 中处理异步操作的重要方式。

## 基本用法

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1000)
})

promise.then(result => {
  console.log(result)
})
\`\`\`

## Promise 链式调用

\`\`\`javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))
\`\`\`

## async/await

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}
\`\`\`

## 总结

Promise 让异步代码更加优雅和易于维护。
```

粘贴完成后：
- Windows: 按 `Ctrl + Z` 然后 `Enter`
- Mac/Linux: 按 `Ctrl + D`

系统会自动：
- ✅ 识别为 JavaScript 分类
- ✅ 提取标签：javascript, promise, async
- ✅ 创建文件：`docs/javascript/javascript-promise-.md`
- ✅ 生成完整的 frontmatter
- ✅ 更新侧边栏

## 👀 第三步：查看效果

启动开发服务器：

```bash
npm run dev
```

打开浏览器访问：http://localhost:5173

你会看到：
- 🏠 精美的首页
- 📚 自动生成的分类导航
- 📝 刚才创建的文章
- 🔍 搜索功能
- 🌙 暗黑模式切换

## 📝 第四步：继续添加文章

### 方式一：智能归档（推荐）

```bash
npm run archive
# 粘贴任意技术文章，系统自动分类
```

### 方式二：手动创建

```bash
npm run new react/hooks-guide
# 编辑生成的文件
```

## 🚀 第五步：发布到线上

```bash
npm run publish
```

或者：

```bash
git add .
git commit -m "新增文章"
git push
```

## 🎯 常用命令速查

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run archive` | 🌟 智能归档文章 |
| `npm run new <分类>/<标题>` | 手动创建文章 |
| `npm run build` | 构建生产版本 |
| `npm run publish` | 发布到远程仓库 |
| `npm run sidebar` | 重新生成侧边栏 |

## 📚 下一步

- 📖 阅读 [README.md](README.md) 了解完整功能
- 🚀 阅读 [DEPLOY.md](DEPLOY.md) 学习如何部署到线上
- 📝 阅读 [USAGE.md](USAGE.md) 掌握高级用法

## 💡 小贴士

### 智能归档的魔法

系统会根据内容关键词自动判断分类：

- 包含 `react`, `hooks`, `jsx` → React 分类
- 包含 `vue`, `composition api` → Vue 分类
- 包含 `javascript`, `promise`, `async` → JavaScript 分类
- 包含 `webpack`, `vite`, `构建` → 工程化分类
- 包含 `性能`, `优化`, `cache` → 性能优化分类
- 包含 `面试`, `算法`, `leetcode` → 面试题分类

### 批量导入现有文章

如果你有很多现有文章：

```bash
# Linux/Mac
for file in old-articles/*.md; do
  cat "$file" | npm run archive
done

# Windows PowerShell
Get-ChildItem old-articles\*.md | ForEach-Object {
  Get-Content $_.FullName | node scripts/auto-archive.js
}
```

### 自定义分类

想添加新分类？编辑 `scripts/auto-archive.js`：

```javascript
const categoryKeywords = {
  // 现有分类...
  
  // 添加新分类
  typescript: ['typescript', 'ts', 'type', '类型'],
  nodejs: ['node', 'nodejs', 'express', 'koa'],
}
```

## 🎉 开始创作吧！

现在你已经掌握了基本用法，开始记录你的技术学习之旅吧！

记住：
- 💡 有想法就记录
- 📝 用 Markdown 写作
- 🚀 一键归档发布
- 🌟 专注内容创作

祝你写作愉快！ ✨
