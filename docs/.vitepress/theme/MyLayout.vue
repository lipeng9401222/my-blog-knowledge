<template>
  <Layout>
    <template #doc-after>
      <div class="giscus-container">
        <component :is="'script'"
          src="https://giscus.app/client.js"
          data-repo="yourusername/your-repo"
          data-repo-id="YOUR_REPO_ID"
          data-category="General"
          data-category-id="YOUR_CATEGORY_ID"
          data-mapping="pathname"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="top"
          data-theme="preferred_color_scheme"
          data-lang="zh-CN"
          data-loading="lazy"
          crossorigin="anonymous"
          async>
        </component>
      </div>
    </template>
  </Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<style scoped>
.giscus-container {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
