#!/usr/bin/env node
/**
 * new-post.js
 * 交互式快速创建文章：npm run new "标题" [分类]
 */
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsDir = path.join(__dirname, '..', 'docs')
const IGNORE_DIRS = ['.vitepress', 'public', 'node_modules', '.git', 'tags']

const DISPLAY_NAMES = {
  javascript: 'JavaScript',
  react: 'React',
  vue: 'Vue',
  engineering: '工程化',
  performance: '性能优化',
  teamwork: '团队协作',
  ai: 'AI技术'
}

function discoverCategories() {
  return fs.readdirSync(docsDir)
    .filter(name => {
      if (IGNORE_DIRS.includes(name) || name.startsWith('.')) return false
      return fs.statSync(path.join(docsDir, name)).isDirectory()
    })
    .sort((a, b) => a.localeCompare(b, 'zh-CN'))
}

function getDisplayName(category) {
  return DISPLAY_NAMES[category] || category.charAt(0).toUpperCase() + category.slice(1)
}

function slugifyText(text) {
  return text
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/_/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function titleToSlug(title) {
  const slug = slugifyText(title).slice(0, 60)
  return slug || `post-${Date.now()}`
}

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve))
}

async function main() {
  const categories = discoverCategories()
  const args = process.argv.slice(2)
  let title = args[0]
  let category = args[1]

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  if (!title) {
    title = await ask(rl, '📝 文章标题: ')
  }

  if (!category) {
    console.log(`\n📂 分类列表: ${categories.join(' | ')}`)
    category = await ask(rl, '📂 选择分类 (默认: javascript): ')
    if (!category) category = 'javascript'
  }

  rl.close()

  if (!categories.includes(category)) {
    console.log(`⚠️  未知分类 "${category}"，将自动创建`)
  }

  const slug = titleToSlug(title)
  const categoryDir = path.join(docsDir, category)
  const targetFile = path.join(categoryDir, `${slug}.md`)

  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true })
    fs.writeFileSync(
      path.join(categoryDir, 'index.md'),
      `---\ntitle: ${getDisplayName(category)}\ncomment: false\n---\n\n# ${getDisplayName(category)}\n`,
      'utf-8'
    )
    console.log(`\n✨ 已创建分类目录: docs/${category}/`)
  }

  if (fs.existsSync(targetFile)) {
    console.error(`❌ 文件已存在: docs/${category}/${slug}.md`)
    process.exit(1)
  }

  const content = `---
title: ${title}
date: ${new Date().toISOString().split('T')[0]}
tags:
  - ${category}
category: ${category}
description: ${title}
---

# ${title}

> 在这里写下你的文章内容...

## 简介



## 正文



## 总结
`

  fs.writeFileSync(targetFile, content, 'utf-8')
  console.log(`\n✅ 文章已创建: docs/${category}/${slug}.md`)

  try {
    execSync('node scripts/generate-sidebar.js', { cwd: path.join(__dirname, '..'), stdio: 'pipe' })
    console.log('✅ 导航、侧边栏与标签页已更新')
  } catch (error) {
    console.warn(`⚠️ 自动更新导航失败: ${error.message}`)
  }

  console.log('\n🚀 编辑文章：')
  console.log(`   code docs/${category}/${slug}.md`)
}

main().catch(console.error)
