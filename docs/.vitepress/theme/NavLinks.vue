<script setup>
import { ref } from "vue";

const navGroups = ref([
  {
    title: "🔧 开发工具",
    items: [
      {
        name: "GitHub",
        url: "https://github.com",
        desc: "代码托管平台",
        icon: "🐙",
      },
      {
        name: "VS Code",
        url: "https://code.visualstudio.com",
        desc: "编辑器官网",
        icon: "💻",
      },
      {
        name: "CodePen",
        url: "https://codepen.io",
        desc: "在线代码演示",
        icon: "🖊️",
      },
      {
        name: "StackBlitz",
        url: "https://stackblitz.com",
        desc: "在线 IDE",
        icon: "⚡",
      },
    ],
  },
  {
    title: "📚 学习资源",
    items: [
      {
        name: "MDN",
        url: "https://developer.mozilla.org/zh-CN",
        desc: "Web 开发文档",
        icon: "📖",
      },
      {
        name: "Can I Use",
        url: "https://caniuse.com",
        desc: "浏览器兼容性",
        icon: "🌐",
      },
      {
        name: "TypeScript",
        url: "https://www.typescriptlang.org",
        desc: "TS 官方文档",
        icon: "🔷",
      },
      { name: "掘金", url: "https://juejin.cn", desc: "技术社区", icon: "💎" },
    ],
  },
  {
    title: "🎨 设计 & UI",
    items: [
      {
        name: "Figma",
        url: "https://www.figma.com",
        desc: "设计协作工具",
        icon: "🎨",
      },
      {
        name: "Dribbble",
        url: "https://dribbble.com",
        desc: "设计灵感",
        icon: "🏀",
      },
      {
        name: "Iconfont",
        url: "https://www.iconfont.cn",
        desc: "图标库",
        icon: "🎯",
      },
      {
        name: "Coolors",
        url: "https://coolors.co",
        desc: "配色方案",
        icon: "🌈",
      },
    ],
  },
  {
    title: "⚙️ 框架文档",
    items: [
      {
        name: "Vue 3",
        url: "https://cn.vuejs.org",
        desc: "Vue.js 官方文档",
        icon: "💚",
      },
      {
        name: "React",
        url: "https://react.dev",
        desc: "React 官方文档",
        icon: "⚛️",
      },
      {
        name: "Vite",
        url: "https://cn.vitejs.dev",
        desc: "下一代构建工具",
        icon: "⚡",
      },
      {
        name: "VitePress",
        url: "https://vitepress.dev",
        desc: "静态站点生成器",
        icon: "📝",
      },
    ],
  },
]);
</script>

<template>
  <div class="nav-links-container">
    <div class="nav-links-header">
      <h2 class="nav-links-title">🔗 常用导航</h2>
      <p class="nav-links-desc">精选前端开发常用网站，快速直达</p>
    </div>
    <div class="nav-links-groups">
      <div v-for="group in navGroups" :key="group.title" class="nav-group">
        <h3 class="nav-group-title">{{ group.title }}</h3>
        <div class="nav-group-items">
          <a
            v-for="item in group.items"
            :key="item.name"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-item"
          >
            <span class="nav-item-icon">{{ item.icon }}</span>
            <div class="nav-item-info">
              <span class="nav-item-name">{{ item.name }}</span>
              <span class="nav-item-desc">{{ item.desc }}</span>
            </div>
            <span class="nav-item-arrow">↗</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-links-container {
  max-width: 1152px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

.nav-links-header {
  text-align: center;
  margin-bottom: 48px;
}

.nav-links-title {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #7c6afb 0%, #5eead4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.nav-links-desc {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.nav-links-groups {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media (max-width: 768px) {
  .nav-links-groups {
    grid-template-columns: 1fr;
  }
}

.nav-group {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 24px;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
}

.nav-group:hover {
  box-shadow: 0 8px 32px rgba(124, 106, 251, 0.12);
  transform: translateY(-2px);
}

.dark .nav-group:hover {
  box-shadow: 0 8px 32px rgba(157, 142, 255, 0.15);
}

.nav-group-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.nav-group-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: all 0.2s ease;
  position: relative;
}

.nav-item:hover {
  background: var(--vp-c-brand-soft);
  transform: translateX(4px);
}

.nav-item-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.nav-item-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.nav-item-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item-desc {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item-arrow {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  opacity: 0;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  flex-shrink: 0;
}

.nav-item:hover .nav-item-arrow {
  opacity: 1;
  transform: translate(2px, -2px);
}

.nav-item:hover .nav-item-name {
  color: var(--vp-c-brand-1);
}
</style>
