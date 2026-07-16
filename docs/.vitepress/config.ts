import { defineConfig } from 'vitepress'

export default defineConfig({
  // 站点配置
  title: '前端知识库',
  description: '系统化的前端、团队协作与 AI 技术文档',
  lang: 'zh-CN',
  ignoreDeadLinks: true,
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
      { text: '前端技术', items: [{ text: 'JavaScript', link: '/javascript/' }, { text: 'React', link: '/react/' }, { text: 'Vue', link: '/vue/' }] },
      { text: '工程与性能', items: [{ text: '工程化', link: '/engineering/' }, { text: '性能优化', link: '/performance/' }] },
      { text: '团队协作', link: '/teamwork/' },
      { text: 'AI技术', link: '/ai/' },
      { text: 'Python', link: '/python/' },
      { text: '开发环境', items: [{ text: '环境安装', link: '/environment/' }, { text: '实操指南', link: '/实操指南/' }, { text: 'Mac', link: '/mac/' }] },
      { text: '公考备考', link: '/公考备考/' }
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
                                    },
                                    {
                                          "text": "Claude Code 完整操作指南（macOS 版）",
                                          "link": "/ai/tools/claude-code-complete-guide-macos"
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
                                    },
                                    {
                                          "text": "工业互联网 / ERP Agent 工作台产品规划（生成式 UI 实践）",
                                          "link": "/ai/applications/industrial-erp-agent-workbench-plan"
                                    },
                                    {
                                          "text": "生产级 Agent 平台架构全景（FastAPI + LangGraph 实战解析）",
                                          "link": "/ai/applications/nexbot-architecture-guide"
                                    },
                                    {
                                          "text": "PPT Agent 设计思路解析：从需求调研到 SVG 全自动生成",
                                          "link": "/ai/applications/ppt-agent-design-guide"
                                    }
                              ]
                        },
                        {
                              "text": "AI 应用工程师学习路线",
                              "collapsed": false,
                              "items": [
                                    {
                                          "text": "概览",
                                          "link": "/ai/learning-roadmap/"
                                    },
                                    {
                                          "text": "Agent 框架补充篇：Coze / Semantic Kernel / MCP / Multi-Agent",
                                          "link": "/ai/learning-roadmap/agent-frameworks-supplement"
                                    },
                                    {
                                          "text": "RAG 知识库搭建专项指南",
                                          "link": "/ai/learning-roadmap/rag-knowledge-base-guide"
                                    },
                                    {
                                          "text": "Agent 框架专项学习指南",
                                          "link": "/ai/learning-roadmap/agent-frameworks-guide"
                                    },
                                    {
                                          "text": "AI 应用工程师三个月面试通关学习指南",
                                          "link": "/ai/learning-roadmap/ai-engineer-3month-guide"
                                    },
                                    {
                                          "text": "AI 面试题分类整理与答案详解（13 家公司真题）",
                                          "link": "/ai/learning-roadmap/ai-interview-qa-guide"
                                    },
                                    {
                                          "text": "01 岗位技能与要求拆解",
                                          "link": "/ai/learning-roadmap/01-岗位技能与要求拆解"
                                    },
                                    {
                                          "text": "02 从零准备周期评估",
                                          "link": "/ai/learning-roadmap/02-从零准备周期评估"
                                    },
                                    {
                                          "text": "03 36周学习路线",
                                          "link": "/ai/learning-roadmap/03-36周学习路线"
                                    },
                                    {
                                          "text": "04 核心技能学习手册",
                                          "link": "/ai/learning-roadmap/04-核心技能学习手册"
                                    },
                                    {
                                          "text": "05 项目实战路线",
                                          "link": "/ai/learning-roadmap/05-项目实战路线"
                                    },
                                    {
                                          "text": "06 学习资源与官方文档",
                                          "link": "/ai/learning-roadmap/06-学习资源与官方文档"
                                    },
                                    {
                                          "text": "07 面试与简历准备",
                                          "link": "/ai/learning-roadmap/07-面试与简历准备"
                                    },
                                    {
                                          "text": "08 每周检查清单",
                                          "link": "/ai/learning-roadmap/08-每周检查清单"
                                    },
                                    {
                                          "text": "09 36周逐周详细执行计划",
                                          "link": "/ai/learning-roadmap/09-36周逐周详细执行计划"
                                    },
                                    {
                                          "text": "每周学习计划",
                                          "collapsed": false,
                                          "items": [
                                                {
                                                      "text": "概览",
                                                      "link": "/ai/learning-roadmap/weekly/"
                                                },
                                                {
                                                      "text": "0608-0614 学习计划：环境搭建与 Python 基础",
                                                      "link": "/ai/learning-roadmap/weekly/0608-0614学习计划"
                                                }
                                          ]
                                    }
                              ]
                        }
                  ]
            }
      ],
      "/python/": [
            {
                  "text": "Python",
                  "items": [
                        {
                              "text": "概览",
                              "link": "/python/"
                        },
                        {
                              "text": "爬虫指南",
                              "collapsed": false,
                              "items": [
                                    {
                                          "text": "概览",
                                          "link": "/python/scraping-guide/"
                                    },
                                    {
                                          "text": "抓取任意在线文档站点并打包成 AI Skill 的完整指南",
                                          "link": "/python/scraping-guide/scraping-complete-guide"
                                    }
                              ]
                        },
                        {
                              "text": "Scripts",
                              "collapsed": false,
                              "items": [
                                    {
                                          "text": "图片缩放与压缩脚本说明",
                                          "link": "/python/scripts/process_image"
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
      ],
      "/公考备考/": [
            {
                  "text": "公考备考",
                  "items": [
                        {
                              "text": "概览",
                              "link": "/公考备考/"
                        },
                        {
                              "text": "模块专项突破与课程匹配手册（江苏省考 B 类在职备考）",
                              "link": "/公考备考/模块专项突破与课程匹配手册"
                        },
                        {
                              "text": "江苏省考 B 类一战上岸备考方案（在职）",
                              "link": "/公考备考/江苏省考B类一战上岸备考方案"
                        }
                  ]
            }
      ],
      "/实操指南/": [
            {
                  "text": "实操指南",
                  "items": [
                        {
                              "text": "概览",
                              "link": "/实操指南/"
                        },
                        {
                              "text": "访问系统",
                              "collapsed": false,
                              "items": [
                                    {
                                          "text": "概览",
                                          "link": "/实操指南/访问系统/"
                                    },
                                    {
                                          "text": "本地访问与登录",
                                          "link": "/实操指南/访问系统/本地访问与登录"
                                    }
                              ]
                        },
                        {
                              "text": "开发环境启动",
                              "collapsed": false,
                              "items": [
                                    {
                                          "text": "概览",
                                          "link": "/实操指南/开发环境启动/"
                                    },
                                    {
                                          "text": "前端：Vue 组件化（pnpm workspace + vue-web）启动",
                                          "link": "/实操指南/开发环境启动/前端-vue组件化启动"
                                    },
                                    {
                                          "text": "后端：Tomcat 插件（war）启动",
                                          "link": "/实操指南/开发环境启动/后端-tomcat插件启动"
                                    }
                              ]
                        },
                        {
                              "text": "准备环境",
                              "collapsed": false,
                              "items": [
                                    {
                                          "text": "概览",
                                          "link": "/实操指南/准备环境/"
                                    },
                                    {
                                          "text": "01-确认 MySQL 服务与版本",
                                          "link": "/实操指南/准备环境/01-确认MySQL服务与版本"
                                    },
                                    {
                                          "text": "02-创建数据库与账号权限",
                                          "link": "/实操指南/准备环境/02-创建数据库与账号权限"
                                    },
                                    {
                                          "text": "03-连接验证（DBeaver + 命令行）",
                                          "link": "/实操指南/准备环境/03-连接验证"
                                    }
                              ]
                        }
                  ]
            }
      ],
      "/原生APP/": [
            {
                  "text": "原生APP",
                  "items": [
                        {
                              "text": "概览",
                              "link": "/原生APP/"
                        },
                        {
                              "text": "Android App 上架及账号申请详细指南",
                              "link": "/原生APP/Android-App上架通用指南"
                        },
                        {
                              "text": "Android 多应用市场上架手册（OPPO / 小米 / VIVO / 荣耀 / 一加 / iQOO 等）",
                              "link": "/原生APP/Android多市场上架手册"
                        },
                        {
                              "text": "uni-app 一键发布到应用市场完整操作指南",
                              "link": "/原生APP/uniapp一键发布指南"
                        },
                        {
                              "text": "华为应用市场（AppGallery）上架指南",
                              "link": "/原生APP/华为AppGallery上架指南"
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
