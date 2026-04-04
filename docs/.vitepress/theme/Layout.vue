<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import { computed, nextTick, onMounted, watch } from 'vue'

const { Layout } = DefaultTheme
const { frontmatter, page, isDark } = useData()
const route = useRoute()

const showComment = computed(() => {
  return page.value.relativePath !== 'index.md' && frontmatter.value.comment !== false
})

const giscusTheme = computed(() => (isDark.value ? 'dark_dimmed' : 'light'))

function loadGiscus() {
  if (typeof window === 'undefined') return
  const container = document.getElementById('giscus-container')
  if (!container) return

  container.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'lipeng9401222/my-blog-knowledge')
  script.setAttribute('data-repo-id', 'R_kgDORe95Tw')
  script.setAttribute('data-category', 'General')
  script.setAttribute('data-category-id', 'DIC_kwDORe95T84C3uvv')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', giscusTheme.value)
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('data-loading', 'lazy')
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true
  container.appendChild(script)
}

function updateGiscusTheme() {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  if (!iframe) return

  iframe.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: giscusTheme.value } } },
    'https://giscus.app'
  )
}

onMounted(() => {
  if (showComment.value) loadGiscus()
})

watch(
  () => route.path,
  () =>
    nextTick(() => {
      if (showComment.value) loadGiscus()
    })
)

watch(isDark, () => updateGiscusTheme())
</script>

<template>
  <Layout>
    <template #doc-after>
      <div v-if="showComment" class="giscus-wrapper">
        <div class="giscus-divider"></div>
        <h3 class="giscus-title">💬 评论区</h3>
        <div id="giscus-container"></div>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.giscus-wrapper {
  margin-top: 48px;
  padding-top: 24px;
}

.giscus-divider {
  height: 1px;
  background: var(--vp-c-divider);
  margin-bottom: 32px;
}

.giscus-title {
  margin-bottom: 24px;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
</style>
