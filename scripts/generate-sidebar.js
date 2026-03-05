import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const docsDir = path.join(__dirname, '..', 'docs')

// 忽略的目录
const IGNORE_DIRS = ['.vitepress', 'public', 'node_modules', '.git']

// 分类显示名映射
const DISPLAY_NAMES = {
  javascript: 'JavaScript',
  react: 'React',
  vue: 'Vue',
  engineering: '工程化',
  performance: '性能优化',
  interview: '面试题',
  browser: '浏览器',
  css: 'CSS',
  nodejs: 'Node.js',
  typescript: 'TypeScript',
}

function getDisplayName(category) {
  return DISPLAY_NAMES[category] || category.charAt(0).toUpperCase() + category.slice(1)
}

// ============================================================
// 自动发现 docs/ 下所有分类目录
// ============================================================
function discoverCategories() {
  return fs.readdirSync(docsDir)
    .filter(name => {
      if (IGNORE_DIRS.includes(name)) return false
      return fs.statSync(path.join(docsDir, name)).isDirectory()
    })
    .sort()
}

// ============================================================
// 读取 frontmatter
// ============================================================
function parseFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!match) return {}

    const fm = {}
    const lines = match[1].split(/\r?\n/)
    for (const line of lines) {
      const idx = line.indexOf(':')
      if (idx > 0 && !line.startsWith(' ') && !line.startsWith('-')) {
        const key = line.slice(0, idx).trim()
        const val = line.slice(idx + 1).trim()
        fm[key] = val
      }
    }
    return fm
  } catch {
    return {}
  }
}

// ============================================================
// 为单个分类生成侧边栏
// ============================================================
function generateSidebarForCategory(categoryPath, categoryName) {
  const files = fs.readdirSync(categoryPath)
  const items = []

  for (const file of files) {
    if (file === 'index.md') continue
    if (!file.endsWith('.md')) continue

    const filePath = path.join(categoryPath, file)
    const fm = parseFrontmatter(filePath)
    const title = fm.title || file.replace('.md', '')
    const link = `/${categoryName}/${file.replace('.md', '')}`

    items.push({ text: title, link, date: fm.date || '1970-01-01' })
  }

  // 按日期倒序
  items.sort((a, b) => b.date.localeCompare(a.date))

  // 移除 date 字段（不输出到配置）
  return items.map(({ text, link }) => ({ text, link }))
}

// ============================================================
// 生成完整 sidebar 配置
// ============================================================
function generateSidebar() {
  const categories = discoverCategories()
  const sidebar = {}

  for (const category of categories) {
    const categoryPath = path.join(docsDir, category)
    const items = generateSidebarForCategory(categoryPath, category)

    sidebar[`/${category}/`] = [
      {
        text: getDisplayName(category),
        items
      }
    ]
  }

  return { sidebar, categories }
}

// ============================================================
// 更新 config.ts
// ============================================================

// 用括号计数法找到 key: { ... } 的完整范围
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

// 用括号计数法找到 key: [ ... ] 的完整范围
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

  const { sidebar, categories } = generateSidebar()

  // 1. 替换 sidebar
  const sidebarRange = findBlockRange(config, 'sidebar')
  if (sidebarRange) {
    const sidebarJson = JSON.stringify(sidebar, null, 6)
    config = config.slice(0, sidebarRange.start) + `sidebar: ${sidebarJson}` + config.slice(sidebarRange.end)
  }

  // 2. 替换 nav
  const navItems = [
    `{ text: '首页', link: '/' }`,
    ...categories.map(cat => `{ text: '${getDisplayName(cat)}', link: '/${cat}/' }`)
  ]
  const navRange = findArrayRange(config, 'nav')
  if (navRange) {
    const navStr = `nav: [\n      ${navItems.join(',\n      ')}\n    ]`
    config = config.slice(0, navRange.start) + navStr + config.slice(navRange.end)
  }

  fs.writeFileSync(configPath, config, 'utf-8')
  console.log(`✅ 侧边栏已更新 (${categories.length} 个分类)`)
  console.log(`   分类: ${categories.map(c => getDisplayName(c)).join(' | ')}`)
}

// ============================================================
// 主函数
// ============================================================
function main() {
  try {
    updateConfigFile()
  } catch (error) {
    console.error('❌ 错误:', error.message)
    process.exit(1)
  }
}

main()
