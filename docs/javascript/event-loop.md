---
title: JavaScript Event Loop 事件循环机制
date: 2026-03-05
category: javascript
tags:
  - javascript
  - event-loop
  - async
description: 深入理解 JavaScript 的事件循环机制
---

# JavaScript Event Loop 事件循环机制

## 简介

Event Loop（事件循环）是 JavaScript 实现异步编程的核心机制。理解事件循环对于编写高性能的 JavaScript 代码至关重要。

## 核心概念

### 调用栈（Call Stack）

JavaScript 是单线程语言，所有代码都在调用栈中执行。

```javascript
function first() {
  console.log('first')
}

function second() {
  first()
  console.log('second')
}

second()
// 输出：
// first
// second
```

### 任务队列（Task Queue）

异步任务会被放入任务队列，等待调用栈清空后执行。

```javascript
console.log('1')

setTimeout(() => {
  console.log('2')
}, 0)

console.log('3')

// 输出：
// 1
// 3
// 2
```

### 微任务（Microtask）

Promise 的回调属于微任务，优先级高于宏任务。

```javascript
console.log('1')

setTimeout(() => {
  console.log('2')
}, 0)

Promise.resolve().then(() => {
  console.log('3')
})

console.log('4')

// 输出：
// 1
// 4
// 3
// 2
```

## 事件循环流程

1. 执行同步代码
2. 检查微任务队列，执行所有微任务
3. 执行一个宏任务
4. 重复步骤 2-3

## 实践应用

### 避免阻塞主线程

```javascript
// ❌ 不好的做法
function heavyTask() {
  for (let i = 0; i < 1000000000; i++) {
    // 长时间计算
  }
}

// ✅ 好的做法
function heavyTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      for (let i = 0; i < 1000000000; i++) {
        // 长时间计算
      }
      resolve()
    }, 0)
  })
}
```

### 合理使用 async/await

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
  }
}
```

## 总结

理解事件循环机制是掌握 JavaScript 异步编程的关键。记住：
- JavaScript 是单线程的
- 微任务优先于宏任务
- 合理使用异步避免阻塞主线程

## 参考资料

- [MDN - Event Loop](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)
- [JavaScript.info - Event Loop](https://javascript.info/event-loop)
