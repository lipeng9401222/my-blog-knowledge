<script setup>
const resourceGroups = [
  {
    title: '代码托管与协作',
    items: [
      {
        name: 'GitHub',
        url: 'https://github.com',
        desc: '代码托管与协作',
        icon: '🐙'
      },
      {
        name: 'Gitee',
        url: 'https://gitee.com',
        desc: '国内代码托管平台',
        icon: '🧭'
      },
      {
        name: 'GitLab',
        url: 'https://about.gitlab.com',
        desc: 'DevOps 一体化平台',
        icon: '🦊'
      }
    ]
  },
  {
    title: '文档与规范',
    items: [
      {
        name: 'MDN',
        url: 'https://developer.mozilla.org/zh-CN',
        desc: 'Web 标准文档',
        icon: '📘'
      },
      {
        name: 'TypeScript',
        url: 'https://www.typescriptlang.org/docs/',
        desc: 'TypeScript 官方文档',
        icon: '📐'
      },
      {
        name: 'Node.js',
        url: 'https://nodejs.org/docs/latest/api/',
        desc: 'Node API 参考手册',
        icon: '🟢'
      }
    ]
  },
  {
    title: '框架与工程生态',
    items: [
      {
        name: 'React Docs',
        url: 'https://react.dev',
        desc: 'React 官方文档',
        icon: '⚛️'
      },
      {
        name: 'Vue Docs',
        url: 'https://cn.vuejs.org',
        desc: 'Vue 官方文档',
        icon: '💚'
      },
      {
        name: 'Vite',
        url: 'https://cn.vite.dev',
        desc: '新一代前端构建工具',
        icon: '⚡'
      }
    ]
  },
  {
    title: '调试与性能',
    items: [
      {
        name: 'Can I Use',
        url: 'https://caniuse.com',
        desc: '浏览器兼容性查询',
        icon: '✅'
      },
      {
        name: 'web.dev',
        url: 'https://web.dev',
        desc: '性能与用户体验最佳实践',
        icon: '🚀'
      },
      {
        name: 'Lighthouse',
        url: 'https://developer.chrome.com/docs/lighthouse/overview',
        desc: '页面质量评估指南',
        icon: '🔦'
      }
    ]
  },
  {
    title: 'AI 与 Agent',
    items: [
      {
        name: 'skills.sh',
        url: 'https://skills.sh',
        desc: 'AI Agent Skills 目录与排行榜',
        icon: '🧠'
      },
      {
        name: 'OpenAI Docs',
        url: 'https://platform.openai.com/docs/overview',
        desc: '模型、API 与 Agent 文档',
        icon: '🤖'
      },
      {
        name: 'Anthropic Docs',
        url: 'https://docs.anthropic.com',
        desc: 'Claude 与工作流文档',
        icon: '🪄'
      }
    ]
  },
  {
    title: '设计与表达',
    items: [
      {
        name: 'Figma',
        url: 'https://www.figma.com',
        desc: '界面设计与协作',
        icon: '🎨'
      },
      {
        name: 'Excalidraw',
        url: 'https://excalidraw.com',
        desc: '流程与架构草图',
        icon: '✏️'
      },
      {
        name: 'Iconify',
        url: 'https://iconify.design',
        desc: '统一图标检索与引用',
        icon: '🧩'
      }
    ]
  },
  {
    title: '工具服务',
    items: [
      {
        name: 'npm',
        url: 'https://www.npmjs.com',
        desc: '前端包生态',
        icon: '📦'
      },
      {
        name: 'VitePress',
        url: 'https://vitepress.dev',
        desc: '文档站点框架',
        icon: '⚡'
      },
      {
        name: 'Cloudflare Pages',
        url: 'https://pages.cloudflare.com',
        desc: '静态站点部署平台',
        icon: '☁️'
      }
    ]
  }
]
</script>

<template>
  <section id="dev-resources" class="resource-section">
    <div class="resource-header">
      <span class="resource-kicker">开发资源</span>
      <h2 class="resource-title">常用开发网站快捷导航</h2>
      <p class="resource-desc">
        聚合文档、调试、设计、部署与 AI 开发资源，尽量让首页成为真正能高频打开的工作台入口。
      </p>
    </div>

    <div class="resource-groups">
      <article v-for="group in resourceGroups" :key="group.title" class="resource-group">
        <header class="resource-group-header">
          <h3 class="resource-group-title">{{ group.title }}</h3>
        </header>

        <div class="resource-items">
          <a
            v-for="item in group.items"
            :key="item.name"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="resource-item"
          >
            <span class="resource-item-icon">{{ item.icon }}</span>
            <span class="resource-item-main">
              <span class="resource-item-name">{{ item.name }}</span>
              <span class="resource-item-desc">{{ item.desc }}</span>
            </span>
            <span class="resource-item-arrow">↗</span>
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.resource-section {
  max-width: 1152px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

.resource-header {
  margin-bottom: 32px;
  text-align: center;
}

.resource-kicker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.8rem;
  font-weight: 600;
}

.resource-title {
  margin: 12px 0 8px;
  font-size: 1.9rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.resource-desc {
  margin: 0 auto;
  max-width: 680px;
  color: var(--vp-c-text-2);
  line-height: 1.75;
}

.resource-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.resource-group {
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: linear-gradient(180deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg) 100%);
  box-shadow: var(--blog-card-shadow);
  overflow: hidden;
}

.resource-group-header {
  padding: 18px 20px 0;
}

.resource-group-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.resource-items {
  display: grid;
  gap: 10px;
  padding: 18px 20px 20px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  border: 1px solid transparent;
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.resource-item:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  box-shadow: 0 12px 28px rgba(124, 106, 251, 0.14);
}

.resource-item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.resource-item-main {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}

.resource-item-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.resource-item-desc {
  margin-top: 2px;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.resource-item-arrow {
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .resource-section {
    padding: 32px 20px 56px;
  }

  .resource-title {
    font-size: 1.55rem;
  }

  .resource-groups {
    grid-template-columns: 1fr;
  }
}
</style>
