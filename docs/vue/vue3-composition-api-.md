---
title: Vue3 Composition API 深入解析
date: 2026-03-05
category: vue
tags:
  - vue
  - vue3
  - composition-api
  - reactivity
description: Vue3 Composition API 深入解析
---

# Vue3 Composition API 深入解析

Vue3 引入 Composition API 的核心目的，不是“语法换新”，而是让组件逻辑能够按关注点组织、按能力复用，并在复杂场景下比 Options API 更容易维护。

## 为什么 Composition API 更适合复杂组件

当一个组件同时承担数据请求、表单状态、权限判断、埋点上报等职责时，Options API 往往会把同一块逻辑拆散在 `data`、`computed`、`methods`、`watch` 中；Composition API 则可以把同一类逻辑收拢在一起。

## 核心概念

### ref 和 reactive

`ref` 适合基础类型和独立响应式值，`reactive` 适合对象结构。

```javascript
import { ref, reactive } from 'vue'

const count = ref(0)
const state = reactive({ name: 'Vue3' })
```

经验上可以这样理解：

- 单个值优先用 `ref`
- 一组彼此关联的数据可以用 `reactive`
- 需要解构暴露时，优先暴露 `ref`，避免响应式丢失

### computed

计算属性用于声明式地表达“由响应式状态推导出的结果”。

```javascript
import { computed } from 'vue'

const doubleCount = computed(() => count.value * 2)
```

如果结果本身没有缓存价值，只是一次性逻辑，也可以直接写普通函数；不要把所有派生逻辑都机械地塞进 `computed`。

### watch 与 watchEffect

- `watch` 适合精确监听特定来源，并处理副作用
- `watchEffect` 适合“依赖来源不固定”的自动收集场景

## 更高价值的用法：抽离 composable

Composition API 真正强大的地方在于可以把一组逻辑抽成 `composable`。

```javascript
import { ref, onMounted } from 'vue'

export function useUserProfile(fetchProfile) {
  const loading = ref(false)
  const profile = ref(null)

  async function loadProfile() {
    loading.value = true
    try {
      profile.value = await fetchProfile()
    } finally {
      loading.value = false
    }
  }

  onMounted(loadProfile)

  return {
    loading,
    profile,
    reload: loadProfile
  }
}
```

这样做有三个直接收益：

- 组件体积更小，模板和逻辑边界更清晰
- 同类逻辑可以复用
- 更容易写单元测试和做职责拆分

## 常见误区

- 在 `reactive` 对象上随意解构，导致响应式丢失
- `ref` / `reactive` 混用没有边界，后期难维护
- 看到副作用就写 `watchEffect`，结果依赖范围失控
- 所有逻辑都挪到 `setup` 里，但没有再做 composable 拆分

## 总结

Composition API 的价值在于“组织复杂性”，而不是单纯减少几行代码。只要围绕响应式边界、逻辑分层和 composable 复用来设计组件，Vue3 项目的可维护性会明显提高。
