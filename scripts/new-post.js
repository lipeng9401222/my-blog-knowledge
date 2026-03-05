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

const CATEGORIES = ['javascript', 'react', 'vue', 'engineering', 'browser', 'performance', 'css', 'interview', 'nodejs']

function titleToSlug(title) {
    const english = title.match(/[a-zA-Z]+/g)
    if (english && english.length >= 2) {
        return english.join('-').toLowerCase().slice(0, 50)
    }
    return `post-${Date.now()}`
}

function ask(rl, question) {
    return new Promise(resolve => rl.question(question, resolve))
}

async function main() {
    const args = process.argv.slice(2)
    let title = args[0]
    let category = args[1]

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

    if (!title) {
        title = await ask(rl, '📝 文章标题: ')
    }
    if (!category) {
        console.log(`\n📂 分类列表: ${CATEGORIES.join(' | ')}`)
        category = await ask(rl, '📂 选择分类 (默认: javascript): ')
        if (!category) category = 'javascript'
    }
    rl.close()

    if (!CATEGORIES.includes(category)) {
        console.log(`⚠️  未知分类 "${category}"，将自动创建`)
    }

    const slug = titleToSlug(title)
    const categoryDir = path.join(docsDir, category)
    const targetFile = path.join(categoryDir, `${slug}.md`)

    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true })
        fs.writeFileSync(path.join(categoryDir, 'index.md'), `---\ntitle: ${category}\ncomment: false\n---\n\n# ${category}\n`)
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
---

# ${title}

> 在这里写下你的文章内容...

## 简介



## 正文



## 总结

`

    fs.writeFileSync(targetFile, content, 'utf-8')
    console.log(`\n✅ 文章已创建: docs/${category}/${slug}.md`)

    // 更新 sidebar
    try {
        execSync('node scripts/generateSidebar.js', { cwd: path.join(__dirname, '..'), stdio: 'pipe' })
        console.log('✅ Sidebar 已更新')
    } catch { }

    console.log('\n🚀 编辑文章：')
    console.log(`   code docs/${category}/${slug}.md`)
}

main().catch(console.error)
