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
function updateConfigFile() {
  const configPath = path.join(docsDir, '.vitepress', 'config.ts')
  let config = fs.readFileSync(configPath, 'utf-8')

  const { sidebar, categories } = generateSidebar()
  const sidebarJson = JSON.stringify(sidebar, null, 6)

  // 替换 sidebar 配置
  const sidebarRegex = /sidebar:\s*\{[\s\S]*?\n\s*\},?\s*\n/
  if (sidebarRegex.test(config)) {
    config = config.replace(sidebarRegex, `sidebar: ${sidebarJson},\n    \n`)
  }

  // 同步更新 nav（自动生成）
  const navItems = [
    `{ text: '首页', link: '/' }`,
    ...categories.map(cat => `{ text: '${getDisplayName(cat)}', link: '/${cat}/' }`)
  ]
  const navStr = `nav: [\n      ${navItems.join(',\n      ')}\n    ]`

  const navRegex = /nav:\s*\[[\s\S]*?\]/
  if (navRegex.test(config)) {
    config = config.replace(navRegex, navStr)
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
