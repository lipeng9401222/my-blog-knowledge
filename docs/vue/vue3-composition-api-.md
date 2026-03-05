---
title: Vue3 Composition API 深入解析
date: 2026-03-05
category: vue
tags:
  - vue
  - javascript
  - react
  - 组件
  - vue3
description: Vue3 Composition API 深入解析
---

# Vue3 Composition API 深入解析

Vue3 引入了全新的 Composition API，这是一个基于函数的 API，让我们可以更灵活地组织组件逻辑。

## 核心概念

### ref 和 reactive

ref 用于创建响应式的基本类型数据，reactive 用于创建响应式的对象。

\\\javascript
import { ref, reactive } from 'vue'

const count = ref(0)
const state = reactive({ name: 'Vue3' })
\\\

### computed

计算属性，依赖的响应式数据变化时自动重新计算。

\\\javascript
import { computed } from 'vue'

const doubleCount = computed(() => count.value * 2)
\\\

## 总结

Composition API 让代码组织更加灵活，逻辑复用更加简单。