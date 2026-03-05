import { defineConfig } from 'vitepress'

export default defineConfig({
  // 站点配置
  title: '前端知识库',
  description: '系统化的前端技术文档',
  lang: 'zh-CN',
  // GitHub Pages 部署时需要设置 base
  // 如果你的仓库名是 my-blog-knowledge，则 base 为 /my-blog-knowledge/
  // 如果使用自定义域名，设置为 /
  base: '/my-blog-knowledge/',

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '工程化', link: '/engineering/' },
      { text: '面试题', link: '/interview/' },
      { text: 'JavaScript', link: '/javascript/' },
      { text: '性能优化', link: '/performance/' },
      { text: 'React', link: '/react/' },
      { text: 'Vue', link: '/vue/' }
    ],

    // 侧边栏（由 generate-sidebar.js 自动生成，请勿手动修改）
    sidebar: {
      "/engineering/": [
            {
                  "text": "工程化",
                  "items": []
            }
      ],
      "/interview/": [
            {
                  "text": "面试题",
                  "items": []
            }
      ],
      "/javascript/": [
            {
                  "text": "JavaScript",
                  "items": [
                        {
                              "text": "JavaScript Event Loop 事件循环机制",
                              "link": "/javascript/event-loop"
                        }
                  ]
            }
      ],
      "/performance/": [
            {
                  "text": "性能优化",
                  "items": []
            }
      ],
      "/react/": [
            {
                  "text": "React",
                  "items": [
                        {
                              "text": "React Hooks 性能优化指南",
                              "link": "/react/react-hooks-"
                        }
                  ]
            }
      ],
      "/vue/": [
            {
                  "text": "Vue",
                  "items": [
                        {
                              "text": "Vue3 Composition API 深入解析",
                              "link": "/vue/vue3-composition-api-"
                        }
                  ]
            }
      ]
},

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/lipeng9401222/my-blog-knowledge' }
    ],

    // 搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },

    // 页脚
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2026-present'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/lipeng9401222/my-blog-knowledge/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    // 文档页脚
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 大纲配置
    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    // 返回顶部
    returnToTopLabel: '返回顶部',

    // 侧边栏菜单标签
    sidebarMenuLabel: '菜单',

    // 暗黑模式切换
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },

  // Head 配置
  head: [
    ['link', { rel: 'icon', href: '/my-blog-knowledge/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }]
  ],

  // Markdown 配置
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  // 构建配置
  srcDir: '.',
  outDir: '.vitepress/dist',
  cacheDir: '.vitepress/cache'
})
