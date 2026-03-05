---
title: React Hooks 性能优化指南
date: 2026-03-05
category: react
tags:
  - react
  - js
  - jsx
  - hooks
  - 组件
description: React Hooks 性能优化指南
---

# React Hooks 性能优化指南

React Hooks 为函数组件带来了状态管理能力，但如果使用不当，可能会导致性能问题。

## useMemo 和 useCallback

### useMemo

用于缓存计算结果，避免不必要的重复计算。

\\\jsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])
\\\

### useCallback

用于缓存函数引用，避免子组件不必要的重新渲染。

\\\jsx
const handleClick = useCallback(() => {
  console.log('clicked')
}, [])
\\\

## React.memo

包裹组件，只在 props 变化时重新渲染。

\\\jsx
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>
})
\\\

## 最佳实践

1. 不要过度优化
2. 使用 React DevTools Profiler 分析性能
3. 合理使用 useMemo 和 useCallback
4. 避免在 render 中创建新对象和函数

## 总结

性能优化要基于实际测量，不要盲目优化。