/*
 * @Author: lipeng 2394533940@qq.com
 * @Date: 2026-03-05 16:03:22
 * @LastEditors: lipeng 2394533940@qq.com
 * @LastEditTime: 2026-03-05 16:05:22
 * @FilePath: \my-blog-knowledge\scripts\publish.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { execSync } from 'child_process'

// 自动发布脚本
console.log('开始发布流程...\n')

try {
  // 1. 更新侧边栏
  console.log('1. 更新侧边栏配置...')
  execSync('node scripts/generate-sidebar.js', { stdio: 'inherit' })
  
  // 2. Git 操作
  console.log('\n2. 提交更改到 Git...')
  execSync('git add .', { stdio: 'inherit' })
  
  const message = process.argv[2] || `更新文章 - ${new Date().toISOString().split('T')[0]}`
  execSync(`git commit -m "${message}"`, { stdio: 'inherit' })
  
  console.log('\n3. 推送到远程仓库...')
  execSync('git push', { stdio: 'inherit' })
  
  console.log('\n✓ 发布完成! GitHub Actions 将自动构建和部署')
  console.log('  请访问 GitHub Actions 查看部署进度')
  
} catch (error) {
  console.error('\n错误:', error.message)
  process.exit(1)
}
