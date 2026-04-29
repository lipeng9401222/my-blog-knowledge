import { defineConfig } from 'vitepress'

export default defineConfig({
  // 站点配置
  title: '前端知识库',
  description: '系统化的前端、团队协作与 AI 技术文档',
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
      { text: '开发资源', link: '/#dev-resources' },
      { text: '标签', link: '/tags/' },
      { text: 'JavaScript', link: '/javascript/' },
      { text: 'React', link: '/react/' },
      { text: 'Vue', link: '/vue/' },
      { text: '工程化', link: '/engineering/' },
      { text: '性能优化', link: '/performance/' },
      { text: '团队协作', link: '/teamwork/' },
      { text: 'AI技术', link: '/ai/' },
      { text: '环境安装', link: '/environment/' },
      { text: 'Mac', link: '/mac/' }
    ],

    // 侧边栏（由 generate-sidebar.js 自动生成，请勿手动修改）
    sidebar: {
      "/javascript/": [
            {
                  "text": "JavaScript",
                  "items": [
                        {
                              "text": "概览",
                              "link": "/javascript/"
                        },
                        {
                              "text": "JavaScript Event Loop 事件循环机制",
                              "link": "/javascript/event-loop"
                        }
                  ]
            }
      ],
      "/react/": [
            {
                  "text": "React",
                  "items": [
                        {
                              "text": "概览",
                              "link": "/react/"
                        },
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
                              "text": "概览",
                              "link": "/vue/"
                        },
                        {
                              "text": "Vue3 Composition API 深入解析",
                              "link": "/vue/vue3-composition-api-"
                        }
                  ]
            }
      ],
      "/engineering/": [
            {
                  "text": "工程化",
                  "items": [
                        {
                              "text": "概览",
                              "link": "/engineering/"
                        }
                  ]
            }
      ],
      "/performance/": [
            {
                  "text": "性能优化",
                  "items": [
                        {
                              "text": "概览",
                              "link": "/performance/"
                        },
                        {
                              "text": "Core Web Vitals 实战：从指标理解到前端性能优化闭环",
                              "link": "/performance/core-web-vitals-practice"
                        }
                  ]
            }
      ],
      "/teamwork/": [
            {
                  "text": "团队协作",
                  "items": [
                        {
                              "text": "概览",
                              "link": "/teamwork/"
                        },
                        {
                              "text": "Git",
                              "collapsed": false,
                              "items": [
                                    {
                                          "text": "概览",
                                          "link": "/teamwork/git/"
                                    },
                                    {
                                          "text": "Git 用户名与邮箱配置指南",
                                          "link": "/teamwork/git/git-用户名与邮箱配置"
                                    },
                                    {
                                          "text": "Mac 上公司内网 Git 与项目开发环境准备指南",
                                          "link": "/teamwork/git/公司环境git配置手册"
                                    },
                                    {
                                          "text": "Mac 下 Git / Gitee 配置说明（guidemanageweb）",
                                          "link": "/teamwork/git/本地gitee配置手册"
                                    },
                                    {
                                          "text": "Git 使用规范与最佳实践 v2.0（团队知识库）",
                                          "link": "/teamwork/git/git-v2-0"
                                    }
                              ]
                        }
                  ]
            }
      ],
      "/ai/": [
            {
                  "text": "AI技术",
                  "items": [
                        {
                              "text": "概览",
                              "link": "/ai/"
                        },
                        {
                              "text": "Skills 收集",
                              "collapsed": false,
                              "items": [
                                    {
                                          "text": "概览",
                                          "link": "/ai/skills/"
                                    },
                                    {
                                          "text": "AI Coding Skills 体系设计：从 Prompt、上下文到可复用工作流",
                                          "link": "/ai/skills/ai-coding-skills-system-design"
                                    }
                              ]
                        },
                        {
                              "text": "实用 AI 工具",
                              "collapsed": false,
                              "items": [
                                    {
                                          "text": "概览",
                                          "link": "/ai/tools/"
                                    }
                              ]
                        },
                        {
                              "text": "AI 技术应用",
                              "collapsed": false,
                              "items": [
                                    {
                                          "text": "概览",
                                          "link": "/ai/applications/"
                                    }
                              ]
                        }
                  ]
            }
      ],
      "/environment/": [
            {
                  "text": "环境安装",
                  "items": [
                        {
                              "text": "概览",
                              "link": "/environment/"
                        },
                        {
                              "text": "Docker 部署操作文档",
                              "link": "/environment/Docker部署操作文档"
                        },
                        {
                              "text": "本地环境与 Docker 选择指南",
                              "link": "/environment/本地环境与Docker选择指南"
                        },
                        {
                              "text": "安装环境",
                              "link": "/environment/安装环境"
                        },
                        {
                              "text": "AI开发规则整合",
                              "link": "/environment/AI开发规则整合"
                        },
                        {
                              "text": "01-快速入门",
                              "collapsed": false,
                              "items": [
                                    {
                                          "text": "jar包模式启动",
                                          "link": "/environment/01-快速入门/jar包模式启动"
                                    },
                                    {
                                          "text": "准备环境",
                                          "link": "/environment/01-快速入门/准备环境"
                                    },
                                    {
                                          "text": "开发环境启动",
                                          "link": "/environment/01-快速入门/开发环境启动"
                                    },
                                    {
                                          "text": "访问系统",
                                          "link": "/environment/01-快速入门/访问系统"
                                    }
                              ]
                        },
                        {
                              "text": "02-页面开发",
                              "collapsed": false,
                              "items": [
                                    {
                                          "text": "页面开发[vue]",
                                          "link": "/environment/02-页面开发/页面开发vue"
                                    },
                                    {
                                          "text": "页面开发[编码模型vue]",
                                          "link": "/environment/02-页面开发/页面开发编码模型vue"
                                    }
                              ]
                        },
                        {
                              "text": "03-服务开发",
                              "collapsed": false,
                              "items": [
                                    {
                                          "text": "Action接口开发",
                                          "link": "/environment/03-服务开发/Action接口开发"
                                    },
                                    {
                                          "text": "rest接口开发",
                                          "link": "/environment/03-服务开发/rest接口开发"
                                    },
                                    {
                                          "text": "微服务开发",
                                          "link": "/environment/03-服务开发/微服务开发"
                                    },
                                    {
                                          "text": "流程开发",
                                          "link": "/environment/03-服务开发/流程开发"
                                    },
                                    {
                                          "text": "组件安装",
                                          "link": "/environment/03-服务开发/组件安装"
                                    }
                              ]
                        },
                        {
                              "text": "04-部署调试",
                              "collapsed": false,
                              "items": [
                                    {
                                          "text": "F10快速开始",
                                          "link": "/environment/04-部署调试/F10快速开始"
                                    },
                                    {
                                          "text": "vue部署",
                                          "link": "/environment/04-部署调试/vue部署"
                                    },
                                    {
                                          "text": "前后端分离部署",
                                          "link": "/environment/04-部署调试/前后端分离部署"
                                    },
                                    {
                                          "text": "打包发布",
                                          "link": "/environment/04-部署调试/打包发布"
                                    },
                                    {
                                          "text": "热部署",
                                          "link": "/environment/04-部署调试/热部署"
                                    },
                                    {
                                          "text": "远程调试",
                                          "link": "/environment/04-部署调试/远程调试"
                                    }
                              ]
                        }
                  ]
            }
      ],
      "/mac/": [
            {
                  "text": "Mac",
                  "items": [
                        {
                              "text": "概览",
                              "link": "/mac/"
                        },
                        {
                              "text": "Mac 上的 Git 仓库管理指南",
                              "link": "/mac/git-repository-management"
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
