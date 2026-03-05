import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const docsDir = path.join(__dirname, '..', 'docs')

// ============================================================
// 1. 自动扫描 docs/ 目录获取已有分类（不再硬编码）
// ============================================================
function discoverCategories() {
  const ignore = ['.vitepress', 'public', 'node_modules']
  return fs.readdirSync(docsDir)
    .filter(name => {
      if (ignore.includes(name)) return false
      return fs.statSync(path.join(docsDir, name)).isDirectory()
    })
}

// ============================================================
// 2. 分类关键词映射（作为提示，可动态扩展）
// ============================================================
const BUILTIN_KEYWORDS = {
  javascript: ['javascript', 'js', 'es6', 'es2015', 'promise', 'async', 'await', 'closure', '闭包', '原型', 'prototype', 'event loop', '事件循环', 'proxy', 'reflect', 'generator', 'iterator', 'symbol', 'weakmap', 'weakset', 'arraybuffer', 'module'],
  react: ['react', 'jsx', 'tsx', 'hooks', 'usestate', 'useeffect', 'usememo', 'usecallback', 'useref', 'redux', 'context', 'fiber', 'suspense', 'concurrent', 'next.js', 'nextjs'],
  vue: ['vue', 'vue3', 'vue2', 'composition api', 'options api', 'reactive', 'ref', 'computed', 'watch', 'pinia', 'vuex', 'vue-router', 'nuxt', 'vueuse'],
  engineering: ['webpack', 'vite', 'rollup', 'esbuild', 'babel', 'eslint', 'prettier', '工程化', '构建', 'build', 'ci/cd', 'docker', 'monorepo', 'turborepo', 'pnpm', 'npm', 'yarn', 'typescript', 'ts'],
  performance: ['性能', 'performance', '优化', 'optimization', 'lazy load', '懒加载', 'cache', '缓存', 'cdn', 'lighthouse', 'core web vitals', 'tree shaking', 'code splitting'],
  interview: ['面试', 'interview', '面试题', '算法', 'algorithm', 'leetcode', '笔试', '手写', 'handwrite'],
  browser: ['浏览器', 'browser', '渲染', 'render', 'dom', 'bom', 'http', 'https', 'tcp', 'cookie', 'session', 'storage', '跨域', 'cors', 'web安全', 'xss', 'csrf'],
  css: ['css', 'scss', 'sass', 'less', 'tailwind', 'flex', 'grid', '布局', 'layout', '动画', 'animation', 'transition', 'transform', 'responsive', '响应式'],
  nodejs: ['node', 'nodejs', 'express', 'koa', 'nest', 'deno', 'bun', 'stream', 'buffer', 'cluster', 'child_process', 'fs', 'path']
}

// ============================================================
// 3. 自动分析内容 → 匹配分类
// ============================================================
function analyzeCategory(content) {
  const lowerContent = content.toLowerCase()
  const existingCategories = discoverCategories()

  // 对每个已知关键词映射计算分数
  const scores = {}
  for (const [category, keywords] of Object.entries(BUILTIN_KEYWORDS)) {
    scores[category] = 0
    for (const kw of keywords) {
      // 统计关键词出现次数（权重）
      const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      const matches = lowerContent.match(regex)
      if (matches) scores[category] += matches.length
    }
  }

  // 找得分最高的
  let bestCategory = null
  let maxScore = 0
  for (const [cat, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      bestCategory = cat
    }
  }

  // 如果得分 > 0，使用最佳匹配
  if (bestCategory && maxScore > 0) {
    return { category: bestCategory, confidence: maxScore, isNew: !existingCategories.includes(bestCategory) }
  }

  // 得分全部为 0 → 尝试从标题中提取分类名
  const titleMatch = content.match(/^#\s+(.+)/m)
  if (titleMatch) {
    const title = titleMatch[1].toLowerCase().trim()
    // 检查标题是否直接包含某个已有分类名
    for (const cat of existingCategories) {
      if (title.includes(cat)) {
        return { category: cat, confidence: 1, isNew: false }
      }
    }
  }

  // 完全无法匹配 → 默认 javascript
  return { category: 'javascript', confidence: 0, isNew: false }
}

// ============================================================
// 4. 自动提取标签（从内容中智能抽取，不限于预设关键词）
// ============================================================
function extractTags(content, category) {
  const tags = new Set([category])
  const lowerContent = content.toLowerCase()

  // 从预设关键词中匹配
  for (const [, keywords] of Object.entries(BUILTIN_KEYWORDS)) {
    for (const kw of keywords) {
      if (lowerContent.includes(kw.toLowerCase())) {
        tags.add(kw)
      }
    }
  }

  // 从 frontmatter 中已有的 tags 保留
  const fmMatch = content.match(/^---[\s\S]*?tags:\s*\n([\s\S]*?)(?:\n\w|\n---)/m)
  if (fmMatch) {
    const tagLines = fmMatch[1].match(/^\s*-\s+(.+)$/gm)
    if (tagLines) {
      tagLines.forEach(line => {
        const tag = line.replace(/^\s*-\s+/, '').trim()
        if (tag) tags.add(tag)
      })
    }
  }

  // 从 h2/h3 标题中提取潜在标签
  const headings = content.match(/^#{2,3}\s+(.+)/gm) || []
  for (const h of headings) {
    const text = h.replace(/^#+\s+/, '').trim().toLowerCase()
    // 只保留简短标题作为标签
    if (text.length <= 20 && text.length >= 2) {
      tags.add(text)
    }
  }

  return Array.from(tags).slice(0, 8) // 最多8个标签
}

// ============================================================
// 5. 提取标题
// ============================================================
function extractTitle(content) {
  const lines = content.split('\n')
  for (const line of lines) {
    const match = line.match(/^#\s+(.+)/)
    if (match) return match[1].trim()
  }
  return '未命名文章'
}

// ============================================================
// 6. 生成文件名
// ============================================================
function generateFileName(title) {
  if (!title || title === '未命名文章') return `post-${Date.now()}`

  // 提取英文单词
  const english = title.match(/[a-zA-Z0-9]+/g)
  if (english && english.length >= 2) {
    return english.join('-').toLowerCase().slice(0, 50)
  }

  // 无英文 → 用时间戳
  return `post-${Date.now()}`
}

// ============================================================
// 7. 确保分类目录存在（自动创建新分类）
// ============================================================
function ensureCategoryDir(category) {
  const categoryDir = path.join(docsDir, category)
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true })

    // 创建分类索引页
    const displayName = category.charAt(0).toUpperCase() + category.slice(1)
    const indexContent = `---
title: ${displayName}
comment: false
---

# ${displayName}

这里是 ${displayName} 相关的文章列表。
`
    fs.writeFileSync(path.join(categoryDir, 'index.md'), indexContent, 'utf-8')
    console.log(`✨ 自动创建新分类目录: docs/${category}/`)

    // 同步更新导航栏（config.ts 中加入新分类）
    updateNavForNewCategory(category, displayName)

    return true // 标记为新创建
  }
  return false
}

// ============================================================
// 8. 自动更新 config.ts 导航栏（新分类时）
// ============================================================
function updateNavForNewCategory(category, displayName) {
  const configPath = path.join(docsDir, '.vitepress', 'config.ts')
  if (!fs.existsSync(configPath)) return

  let config = fs.readFileSync(configPath, 'utf-8')

  // 检查导航栏是否已包含该分类
  if (config.includes(`'/${category}/'`)) return

  // 在 nav 数组最后一项前插入新分类
  const navRegex = /(nav:\s*\[[\s\S]*?)(]\s*,)/
  const match = config.match(navRegex)
  if (match) {
    const newNavItem = `      { text: '${displayName}', link: '/${category}/' },\n    `
    config = config.replace(navRegex, `$1${newNavItem}$2`)
    fs.writeFileSync(configPath, config, 'utf-8')
    console.log(`✅ 导航栏已添加: ${displayName}`)
  }
}

// ============================================================
// 9. 创建文章文件
// ============================================================
function createArticleFile(filePath, title, category, tags, content) {
  const dateStr = new Date().toISOString().split('T')[0]

  // 移除已有 frontmatter
  let cleanContent = content.replace(/^---[\s\S]*?---\n*/, '')

  const frontmatter = `---
title: ${title}
date: ${dateStr}
category: ${category}
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
description: ${title}
---

`
  const finalContent = frontmatter + cleanContent
  fs.writeFileSync(filePath, finalContent, 'utf-8')

  console.log(`\n✅ 文章归档成功!`)
  console.log(`   📁 路径: ${path.relative(path.join(__dirname, '..'), filePath)}`)
  console.log(`   📂 分类: ${category}`)
  console.log(`   📝 标题: ${title}`)
  console.log(`   🏷️  标签: ${tags.join(', ')}`)

  return filePath
}

// ============================================================
// 10. 主入口：创建文章
// ============================================================
async function createArticle(content) {
  // 分析分类
  const { category, confidence, isNew } = analyzeCategory(content)

  if (isNew) {
    console.log(`🆕 检测到新分类: "${category}" (置信度: ${confidence})`)
  } else {
    console.log(`📂 匹配分类: "${category}" (置信度: ${confidence})`)
  }

  // 确保目录存在（自动创建）
  ensureCategoryDir(category)

  // 提取标题和标签
  const title = extractTitle(content)
  const tags = extractTags(content, category)
  const fileName = generateFileName(title)

  // 生成文件路径
  const categoryDir = path.join(docsDir, category)
  let filePath = path.join(categoryDir, `${fileName}.md`)

  // 文件名冲突处理
  if (fs.existsSync(filePath)) {
    console.log(`⚠️  文件已存在: ${fileName}.md`)
    filePath = path.join(categoryDir, `${fileName}-${Date.now()}.md`)
    console.log(`   使用新文件名: ${path.basename(filePath)}`)
  }

  return createArticleFile(filePath, title, category, tags, content)
}

// ============================================================
// 11. 读取输入
// ============================================================
async function readInput() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    let content = ''
    console.log('📋 请粘贴文章内容（输入完成后按 Ctrl+D 或 Ctrl+Z 结束）:\n')

    rl.on('line', (line) => { content += line + '\n' })
    rl.on('close', () => { resolve(content.trim()) })
  })
}

// ============================================================
// 12. 主函数
// ============================================================
async function main() {
  console.log('🤖 智能归档系统 v2.0\n')

  // 显示已有分类
  const existingCats = discoverCategories()
  console.log(`📂 已有分类: ${existingCats.join(' | ')}\n`)

  try {
    let content = ''

    if (!process.stdin.isTTY) {
      const chunks = []
      for await (const chunk of process.stdin) {
        chunks.push(chunk)
      }
      content = Buffer.concat(chunks).toString('utf-8').trim()
    } else {
      content = await readInput()
    }

    if (!content) {
      console.error('❌ 没有输入内容')
      process.exit(1)
    }

    await createArticle(content)

    // 自动更新 sidebar
    console.log('\n🔄 正在更新侧边栏...')
    const { execSync } = await import('child_process')
    execSync('node scripts/generate-sidebar.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') })

    console.log('\n🎉 全部完成! 运行 npm run dev 查看效果')

  } catch (error) {
    console.error('❌ 错误:', error.message)
    process.exit(1)
  }
}

main()
