<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { useData, useRoute } from "vitepress";
import { computed, onMounted, watch, nextTick, ref } from "vue";

const { Layout } = DefaultTheme;
const { frontmatter, page, isDark } = useData();
const route = useRoute();

// 是否显示评论（非首页 & 未关闭评论）
const showComment = computed(() => {
  return (
    page.value.relativePath !== "index.md" &&
    frontmatter.value.comment !== false
  );
});

// Giscus 主题跟随暗色模式
const giscusTheme = computed(() => (isDark.value ? "dark_dimmed" : "light"));

function loadGiscus() {
  if (typeof window === "undefined") return;
  const container = document.getElementById("giscus-container");
  if (!container) return;
  container.innerHTML = "";

  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  // ⚠️ 使用前请到 https://giscus.app 配置你的仓库，替换下面 3 个值
  script.setAttribute("data-repo", "YOUR_USERNAME/my-blog-knowledge");
  script.setAttribute("data-repo-id", "YOUR_REPO_ID");
  script.setAttribute("data-category", "General");
  script.setAttribute("data-category-id", "YOUR_CATEGORY_ID");
  script.setAttribute("data-mapping", "pathname");
  script.setAttribute("data-strict", "0");
  script.setAttribute("data-reactions-enabled", "1");
  script.setAttribute("data-emit-metadata", "0");
  script.setAttribute("data-input-position", "bottom");
  script.setAttribute("data-theme", giscusTheme.value);
  script.setAttribute("data-lang", "zh-CN");
  script.setAttribute("data-loading", "lazy");
  script.setAttribute("crossorigin", "anonymous");
  script.async = true;
  container.appendChild(script);
}

// 切换暗色/亮色时更新 Giscus 主题
function updateGiscusTheme() {
  const iframe = document.querySelector<HTMLIFrameElement>(
    "iframe.giscus-frame",
  );
  if (iframe) {
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: giscusTheme.value } } },
      "https://giscus.app",
    );
  }
}

onMounted(() => {
  if (showComment.value) loadGiscus();
});

watch(
  () => route.path,
  () =>
    nextTick(() => {
      if (showComment.value) loadGiscus();
    }),
);

watch(isDark, () => updateGiscusTheme());
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
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 24px;
}
</style>
