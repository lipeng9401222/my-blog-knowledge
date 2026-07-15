---
title: Python
---

# Python

Python 技术专题，涵盖爬虫抓取、文档站点离线打包、AI Skill 生成方法论等内容。

## 专题内容

### 爬虫指南

- [抓取任意"在线文档站点"并打包成 AI Skill 的完整指南](/python/scraping-guide/scraping-complete-guide) — 从探测目标站点到批量抓取、生成 AI Skill 的全流程方法论

### 配套脚本

| 脚本 | 说明 |
|---|---|
| [server.js](https://github.com/lipeng9401222/my-blog-knowledge/blob/main/docs/python/scripts/server.js) | 本地 HTTP server，接收浏览器端抓取数据并转换为 Markdown |
| [start_batch.js](https://github.com/lipeng9401222/my-blog-knowledge/blob/main/docs/python/scripts/start_batch.js) | 浏览器端 worker pool，并发 fetch 业务 API |
| [build_references.js](https://github.com/lipeng9401222/my-blog-knowledge/blob/main/docs/python/scripts/build_references.js) | 自动生成各主题索引文件 |
| [dump_tree.js](https://github.com/lipeng9401222/my-blog-knowledge/blob/main/docs/python/scripts/dump_tree.js) | Dump 目标站点目录树 |
| [fetch_multi.js](https://github.com/lipeng9401222/my-blog-knowledge/blob/main/docs/python/scripts/fetch_multi.js) | 多文章节点抓取 |
| [check_progress.js](https://github.com/lipeng9401222/my-blog-knowledge/blob/main/docs/python/scripts/check_progress.js) | 抓取进度检查 |
