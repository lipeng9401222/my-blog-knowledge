import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const docsDir = path.join(__dirname, '..', 'docs')

const IGNORE_DIRS = ['.vitepress', 'public', 'node_modules', '.git', 'tags']

const DISPLAY_NAMES = {
  javascript: 'JavaScript',
  react: 'React',
  vue: 'Vue',
  engineering: '工程化',
  performance: '性能优化',
  teamwork: '团队协作',
  ai: 'AI技术',
  environment: '环境安装',
  mac: 'Mac',
  git: 'Git',
  skills: 'Skills 收集',
  tools: '实用 AI 工具',
  applications: 'AI 技术应用'
}

const TOP_LEVEL_ORDER = ['javascript', 'react', 'vue', 'engineering', 'performance', 'teamwork', 'ai', 'environment', 'mac']
const SECTION_ORDER = {
  teamwork: ['git'],
  ai: ['skills', 'tools', 'applications']
}

function getDisplayName(name) {
  return DISPLAY_NAMES[name] || name.charAt(0).toUpperCase() + name.slice(1)
}

function getFrontmatterBlock(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return match ? match[1] : ''
}

function parseFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const block = getFrontmatterBlock(content)
    if (!block) return {}

    const frontmatter = {}
    const lines = block.split(/\r?\n/)

    for (const line of lines) {
      const index = line.indexOf(':')
      if (index > 0 && !line.startsWith(' ') && !line.startsWith('-')) {
        const key = line.slice(0, index).trim()
        const value = line.slice(index + 1).trim()
        frontmatter[key] = value
      }
    }

    return frontmatter
  } catch {
    return {}
  }
}

function parseTags(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const block = getFrontmatterBlock(content)
    if (!block) return []

    const tagMatch = block.match(/(?:^|\n)tags:\s*\n((?:\s*-\s+.+(?:\n|$))*)/)
    if (!tagMatch) return []

    return tagMatch[1]
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.startsWith('- '))
      .map(line => line.slice(2).trim())
      .filter(Boolean)
  } catch {
    return []
  }
}

function extractTitle(filePath) {
  const frontmatter = parseFrontmatter(filePath)
  if (frontmatter.title) return frontmatter.title

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const headingMatch = content.replace(/^---[\s\S]*?---\r?\n*/, '').match(/^#\s+(.+)/m)
    return headingMatch ? headingMatch[1].trim() : path.basename(filePath, '.md')
  } catch {
    return path.basename(filePath, '.md')
  }
}

function getDateValue(filePath) {
  return parseFrontmatter(filePath).date || '1970-01-01'
}

function getFileLink(segments) {
  return `/${segments.join('/')}`
}

function getDirectoryLink(segments) {
  return `/${segments.join('/')}/`
}

function hasMarkdownContent(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true })

  return entries.some(entry => {
    if (entry.name.startsWith('.')) return false
    const fullPath = path.join(directory, entry.name)

    if (entry.isFile()) {
      return entry.name.endsWith('.md')
    }

    if (entry.isDirectory()) {
      return hasMarkdownContent(fullPath)
    }

    return false
  })
}

function sortDirectoryNames(names, context) {
  return names.sort((a, b) => compareByOrder(a, b, context))
}

function compareByOrder(a, b, context) {
  const order = context === 'root' ? TOP_LEVEL_ORDER : SECTION_ORDER[context] || []

  const indexA = order.indexOf(a)
  const indexB = order.indexOf(b)

  if (indexA !== -1 || indexB !== -1) {
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  }

  return a.localeCompare(b, 'zh-CN')
}

function discoverCategories() {
  const categoryNames = fs.readdirSync(docsDir)
    .filter(name => {
      if (IGNORE_DIRS.includes(name) || name.startsWith('.')) return false
      const fullPath = path.join(docsDir, name)
      return fs.statSync(fullPath).isDirectory() && hasMarkdownContent(fullPath)
    })

  return sortDirectoryNames(categoryNames, 'root')
}

function buildSidebarItems(directory, segments, rootCategory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true })
  const fileItems = []
  const groupItems = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue

    const fullPath = path.join(directory, entry.name)

    if (entry.isFile()) {
      if (!entry.name.endsWith('.md') || entry.name === 'index.md') continue
      fileItems.push({
        text: extractTitle(fullPath),
        link: getFileLink([...segments, entry.name.replace(/\.md$/, '')]),
        date: getDateValue(fullPath)
      })
      continue
    }

    if (!entry.isDirectory() || !hasMarkdownContent(fullPath)) continue

    const childSegments = [...segments, entry.name]
    const childItems = buildSidebarItems(fullPath, childSegments, rootCategory)
    const overviewPath = path.join(fullPath, 'index.md')
    const items = []

    if (fs.existsSync(overviewPath)) {
      items.push({ text: '概览', link: getDirectoryLink(childSegments) })
    }

    items.push(...childItems)

    if (!items.length) continue

    groupItems.push({
      name: entry.name,
      text: getDisplayName(entry.name),
      collapsed: false,
      items
    })
  }

  fileItems.sort((a, b) => b.date.localeCompare(a.date))

  const sortedGroups = groupItems
    .sort((a, b) => compareByOrder(a.name, b.name, rootCategory))
    .map(({ name, ...group }) => group)

  return [
    ...fileItems.map(({ text, link }) => ({ text, link })),
    ...sortedGroups
  ]
}

function generateSidebarForCategory(category) {
  const categoryPath = path.join(docsDir, category)
  const items = []
  const indexPath = path.join(categoryPath, 'index.md')

  if (fs.existsSync(indexPath)) {
    items.push({ text: '概览', link: getDirectoryLink([category]) })
  }

  items.push(...buildSidebarItems(categoryPath, [category], category))

  return items
}

function collectArticles(directory, segments = []) {
  const articles = []
  const entries = fs.readdirSync(directory, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    if (IGNORE_DIRS.includes(entry.name) && segments.length === 0) continue

    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      articles.push(...collectArticles(fullPath, [...segments, entry.name]))
      continue
    }

    if (!entry.name.endsWith('.md') || entry.name === 'index.md') continue

    const slug = entry.name.replace(/\.md$/, '')
    const frontmatter = parseFrontmatter(fullPath)
    const tags = parseTags(fullPath)

    articles.push({
      title: extractTitle(fullPath),
      date: frontmatter.date || '1970-01-01',
      category: segments[0] || '',
      tags,
      link: getFileLink([...segments, slug])
    })
  }

  return articles
}

function generateTagsPage() {
  const articles = collectArticles(docsDir)
  const tagMap = new Map()

  for (const article of articles) {
    for (const tag of article.tags) {
      if (!tagMap.has(tag)) tagMap.set(tag, [])
      tagMap.get(tag).push(article)
    }
  }

  const tags = Array.from(tagMap.entries())
    .map(([name, items]) => ({
      name,
      items: items.sort((a, b) => b.date.localeCompare(a.date))
    }))
    .sort((a, b) => b.items.length - a.items.length || a.name.localeCompare(b.name, 'zh-CN'))
    .map((tag, index) => ({ ...tag, anchor: `tag-${index + 1}` }))

  const maxCount = tags.reduce((max, tag) => Math.max(max, tag.items.length), 1)
  const cloudHtml = tags.length
    ? tags.map(tag => {
        const level = Math.max(1, Math.round((tag.items.length / maxCount) * 5))
        return `  <a class="tag-cloud-item" href="#${tag.anchor}" style="--tag-level: ${level}"><span>${tag.name}</span><span class="tag-cloud-count">${tag.items.length}</span></a>`
      }).join('\n')
    : '  <p>当前还没有可展示的标签。</p>'

  const sections = tags.map(tag => {
    const items = tag.items
      .map(article => `- [${article.title}](${article.link}) · ${article.date}`)
      .join('\n')

    return `<section class="tag-index-section">\n<h2 id="${tag.anchor}">${tag.name}<span class="tag-cloud-count">${tag.items.length}</span></h2>\n\n${items}\n</section>`
  }).join('\n\n')

  const content = `---
title: 标签云
comment: false
---

# 标签云

通过标签快速发现内容，支持从高频主题反向浏览文章。

<div class="tag-cloud">
${cloudHtml}
</div>

${sections || '当前还没有可展示的标签。'}
`

  const tagsDir = path.join(docsDir, 'tags')
  fs.mkdirSync(tagsDir, { recursive: true })
  fs.writeFileSync(path.join(tagsDir, 'index.md'), content, 'utf-8')
}

function generateSidebar() {
  const categories = discoverCategories()
  const sidebar = {}

  for (const category of categories) {
    sidebar[`/${category}/`] = [
      {
        text: getDisplayName(category),
        items: generateSidebarForCategory(category)
      }
    ]
  }

  return { sidebar, categories }
}

function findBlockRange(content, key) {
  const startPattern = new RegExp(`${key}:\\s*\\{`)
  const match = content.match(startPattern)
  if (!match) return null

  const startIdx = match.index
  const braceStart = content.indexOf('{', startIdx + key.length)
  let depth = 0
  let endIdx = braceStart

  for (let i = braceStart; i < content.length; i++) {
    if (content[i] === '{') depth++
    if (content[i] === '}') depth--
    if (depth === 0) {
      endIdx = i
      break
    }
  }

  return { start: startIdx, end: endIdx + 1 }
}

function findArrayRange(content, key) {
  const startPattern = new RegExp(`${key}:\\s*\\[`)
  const match = content.match(startPattern)
  if (!match) return null

  const startIdx = match.index
  const bracketStart = content.indexOf('[', startIdx + key.length)
  let depth = 0
  let endIdx = bracketStart

  for (let i = bracketStart; i < content.length; i++) {
    if (content[i] === '[') depth++
    if (content[i] === ']') depth--
    if (depth === 0) {
      endIdx = i
      break
    }
  }

  return { start: startIdx, end: endIdx + 1 }
}

function updateConfigFile() {
  const configPath = path.join(docsDir, '.vitepress', 'config.ts')
  let config = fs.readFileSync(configPath, 'utf-8')

  generateTagsPage()
  const { sidebar, categories } = generateSidebar()

  const sidebarRange = findBlockRange(config, 'sidebar')
  if (sidebarRange) {
    const sidebarJson = JSON.stringify(sidebar, null, 6)
    config = config.slice(0, sidebarRange.start) + `sidebar: ${sidebarJson}` + config.slice(sidebarRange.end)
  }

  const navItems = [
    `{ text: '首页', link: '/' }`,
    `{ text: '开发资源', link: '/#dev-resources' }`,
    `{ text: '标签', link: '/tags/' }`,
    ...categories.map(category => `{ text: '${getDisplayName(category)}', link: '/${category}/' }`)
  ]

  const navRange = findArrayRange(config, 'nav')
  if (navRange) {
    const navContent = `nav: [\n      ${navItems.join(',\n      ')}\n    ]`
    config = config.slice(0, navRange.start) + navContent + config.slice(navRange.end)
  }

  fs.writeFileSync(configPath, config, 'utf-8')
  console.log(`✅ 侧边栏已更新 (${categories.length} 个分类)`)
  console.log(`   分类: ${categories.map(category => getDisplayName(category)).join(' | ')}`)
  console.log('✅ 标签云页面已更新')
}

function main() {
  try {
    updateConfigFile()
  } catch (error) {
    console.error('❌ 错误:', error.message)
    process.exit(1)
  }
}

main()
