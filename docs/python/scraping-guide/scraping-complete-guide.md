---
title: 抓取任意在线文档站点并打包成 AI Skill 的完整指南
date: 2026-04-30
tags:
  - python
  - 爬虫
  - scraping
  - agent-browser
  - AI Skill
---

# 抓取任意"在线文档站点"并打包成 AI Skill 的完整指南

> 这是把 [`fdoc.epoint.com.cn/onlinedoc`](https://fdoc.epoint.com.cn/onlinedoc/) 整站 2700+ 篇文档离线打包成 AI Skill 的方法论。下次你想抓别的站点（无论是公司 OA 文档、Confluence、内部 Wiki，还是其它 token 鉴权的 SPA），把同一套思路复用即可。

---

## 0. 整体心智模型

90% 的"内部文档站点"都长这样：

```
浏览器 ──登录──► IDP/SSO ──颁发 access_token──► 业务 API
                                                  ▲
                          前端 SPA（zTree / antd Tree）── fetch / XHR ──┘
```

直接 `curl` 几乎都拿不到东西，因为：

1. **鉴权基于 SSO**：`access_token` 在浏览器 cookie 里，curl 拿不到完整的 session 链路。
2. **CORS / Origin 校验**：服务端只接受来自自家域名的请求。
3. **SPA 内部路由**：URL 不变，节点点击都是 XHR，没法靠 wget 爬。

最稳的破局思路：**让请求"在已登录的浏览器里发出"**，再把抓到的数据投递回本地保存。

```
┌──────────────┐ fetch JSON  ┌────────────┐ POST  ┌────────────┐
│ 已登录浏览器 │────────────►│ 业务 API   │       │ 本地 server│
│ (worker pool)│◄────────────│            │       │ (Node.js)  │
└──────┬───────┘ articles    └────────────┘       └─────┬──────┘
       │ POST {node, raw}                               │
       └────────────────────────────────────────────────┘
                                                        ▼
                                                  HTML→Markdown
                                                  写入 docs/<path>.md
```

三个核心组件：

1. **`agent-browser`**：CLI 控制浏览器 / 注入 JS / 抓 HAR。**关键武器**。
2. **浏览器端 worker**：在前端 fetch 业务 API，把结果 POST 给本地 server。
3. **本地 Node.js server**：接收数据 → HTML → Markdown → 写盘。

---

## 1. 准备工具

### 1.1 安装 agent-browser

```bash
# 官方安装命令（macOS / Linux）
curl -fsSL https://agent-browser.dev/install | bash

# 或用 brew
brew install agent-browser

# 验证
agent-browser doctor
```

`agent-browser` 提供以下能力（本指南都会用到）：

- `agent-browser open {url}`：在受控浏览器里打开页面（用户手动登录）。
- `agent-browser eval --stdin`：在当前页面注入 JS 并执行，stdout 返回值。
- `agent-browser network har start/stop {file}`：HAR 抓包，分析 API。
- `--auto-connect`：自动找到运行中的 daemon 并连接。

### 1.2 准备一个 Node.js 工作区

```bash
mkdir -p framedoc-scraper && cd framedoc-scraper
npm init -y
npm install turndown
```

---

## 2. 阶段一 · 探测目标站点

### 2.1 在受控浏览器里登录

```bash
agent-browser open "https://fdoc.epoint.com.cn/onlinedoc/docshow/docshow?columnguid=031&menuguid=031001&nodeguid=a71c622b-ca86-43f6-b63a-850396994061"
```

> 这个浏览器是 agent-browser 自带的 Chrome for Testing。**手动**完成 SSO 登录，session 由 agent-browser 维护。

### 2.2 用 HAR 抓包定位 API

启动录制，**手动点几个文档节点**（普通文章、目录节点、外链、特殊类型各点一次），然后停止：

```bash
agent-browser --auto-connect network har start /tmp/probe.har
# ... 在浏览器里点击 5-10 个节点 ...
agent-browser --auto-connect network har stop /tmp/probe.har
```

解析 HAR 找出"加载文章正文"的 API：

```bash
node -e "
const har = JSON.parse(require('fs').readFileSync('/tmp/probe.har','utf8'));
har.log.entries
  .filter(e => /docshowaction|article|content|markdown/i.test(e.request.url))
  .forEach(e => {
    console.log(e.request.method, e.request.url);
    if (e.request.postData) console.log('  body:', e.request.postData.text);
    console.log('  status:', e.response.status, 'size:', e.response.content.size);
  });
"
```

对 fdoc 的输出大致是：

```
POST /onlinedoc/rest/docshow/docshowaction/getMarkdownUrl?...   body: id=<nodeId>
POST /onlinedoc/rest/docshow/docshowaction/getArticlesListUrl?... body: nodeId=<id>&currentPage=0&pageSize=10
GET  /onlinedoc/rest/frame/base/attach/attachAction/getContent?attachGuid=...
```

到此你已经知道：**接口名、HTTP 方法、参数名、参数值来源**。这是抓取的基石。

### 2.3 验证用 fetch 直接调 API

仍然 **在浏览器里**（用 agent-browser eval），别用 curl（CORS / SSO 拦截）：

```bash
cat <<'EOF' | agent-browser --auto-connect eval --stdin
(async () => {
  const r = await fetch('/onlinedoc/rest/docshow/docshowaction/getMarkdownUrl?isCommondto=true&columnguid=031&menuguid=031001&nodeguid=a71c622b-ca86-43f6-b63a-850396994061', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'id=d678eb6f-4ab2-4868-83e8-94ffee582210',
    credentials: 'include'
  });
  const j = await r.json();
  return Object.keys(j).concat(['---', JSON.stringify(j).substring(0, 200)]);
})()
EOF
```

返回结构里通常是这样：

```js
{
  controls: [],
  custom: '<JSON string>',     // 真正的内容用 JSON.parse(custom) 解开
  status: { code: '1' }
}
```

在 fdoc 里 `parsed.content` 是 HTML，`parsed.attachList` 是附件，`parsed.versionsList` 是版本历史。

### 2.4 抓出全量"目录树"

绝大多数文档站都有一棵节点树（zTree / Element Tree / antd Tree）。**先把树整棵 dump 出来**，再据此遍历每个 leaf 节点抓正文。

fdoc 用 zTree，dump 全树：

```bash
cat <<'EOF' | agent-browser --auto-connect eval --stdin > tools/tree.json
(() => {
  const t = $.fn.zTree.getZTreeObj('left-nav-tree');
  const all = t.transformToArray(t.getNodes());
  return all.map(n => ({
    id: n.id, name: n.name, level: n.level,
    isParent: !!n.isParent, type: n.type || '',
    parentId: n.parentTId ? (n.getParentNode() && n.getParentNode().id) : null
  }));
})()
EOF
```

> 别的框架对应：`document.querySelectorAll('.ant-tree-treenode')`、`document.querySelectorAll('.el-tree-node__content')`、Vue/React 实例上的 `vm.$root.tree`。**先点开 DevTools 找到树组件实例**，再写个 30 行的 `transformToArray`。

注意要识别**节点类型**：

- 普通单文：调内容 API
- 目录（`isParent=true`）：通常没有正文，跳过或返回 500
- 外链（`type='link'`）：`url` 字段直接保存，跳过抓取
- 多文（`type='multiple'`）：是另一个 API，例如 fdoc 的 `getArticlesListUrl`

---

## 3. 阶段二 · 写本地 server（数据落地）

为什么要本地 server，不在浏览器里直接 download？

1. 浏览器 download 大量文件会被拦截（"是否允许多次下载"）。
2. localStorage 5MB，IndexedDB 用起来太重。
3. 本地 server 可以做 HTML→Markdown 转换，把脏活留在 Node 端。

完整代码见 [`scripts/server.js`](../scripts/server.js)，关键点：

```js
// 1) 跨域：允许浏览器 fetch http://localhost:8765
function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// 2) HTML → Markdown：用 turndown
const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

// 3) 关键自定义规则：fdoc 用 <pre><ol class="linenums"><li>...</li></ol></pre> 表示代码
//    默认 turndown 把它压成单行，必须按 <li> 拆行重建：
td.addRule('preserveCodeBlock', {
  filter: ['pre'],
  replacement: (content, node) => {
    const ols = Array.from(node.getElementsByTagName('ol'));
    const ol = ols.find(o => /linenums/i.test(o.className || ''));
    if (!ol) return '\n```\n' + (node.textContent || '').trim() + '\n```\n';
    const lines = Array.from(ol.childNodes)
      .filter(n => n.nodeType === 1 && n.tagName === 'LI')
      .map(li => (li.textContent || '').replace(/\u00a0/g, ' ').trimEnd())
      .join('\n');
    const code = Array.from(node.getElementsByTagName('code')).find(c => /lang/i.test(c.className || ''));
    const lang = code ? ((code.className.match(/lang(?:uage)?[-_]?(\w+)/) || [])[1] || '') : '';
    return '\n```' + lang + '\n' + lines + '\n```\n';
  }
});

// 4) 端点：POST /article 接收 { node: {id,name,path,...}, raw: <API 返回原文> }
//    server 解开 custom，调用 turndown，按 node.path 写文件
http.createServer(async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  // ... 见 scripts/server.js
}).listen(8765);
```

**避坑**：

- `turndown` 在 Node 环境用的是它内部的 lite DOM，**不要用** `:scope`、`querySelectorAll(':scope > li')` 这种选择器。优先 `getElementsByTagName` + 手动过滤 `childNodes`。
- 路径里有非法字符要替换：`replace(/[\\\/:*?"< >|]/g, '_')`，并截断 120 字以下避免 NTFS / Linux 短文件名问题。
- 中文目录在 macOS 上是 NFD 形式（å'è°·），写文件没问题，但 grep 时记得 `LC_ALL=C` 或正常用 `LC_ALL=zh_CN.UTF-8`。

---

## 4. 阶段三 · 浏览器端批量任务

直接在浏览器里跑 worker pool，并发 fetch 业务 API，结果 POST 给本地 server。

完整代码见 [`scripts/start_batch.js`](../scripts/start_batch.js)，骨架：

```js
(async () => {
  // 1) 拿到目录树（前面 dump 过 tree.json，但浏览器里直接读 zTree 更准）
  const tree = $.fn.zTree.getZTreeObj('left-nav-tree');
  const all = tree.transformToArray(tree.getNodes());
  const targets = all.filter(n => !n.isParent && n.type !== 'link' && n.type !== 'multiple');

  // 2) 状态对象挂 window，方便 check_progress.js 查看
  const state = { total: targets.length, done: 0, failed: 0, queue: targets.slice(), errors: [] };
  window.__fetcher = { state };

  // 3) worker
  async function fetchOne(node) {
    // ... fetch business API ...
    // ... POST {node, raw} to http://localhost:8765/article ...
  }

  // 4) 5 个并发，每个干完一个 sleep 30ms（爱护服务端）
  const N = 5;
  await Promise.all(Array.from({ length: N }, async function worker() {
    while (state.queue.length) {
      const n = state.queue.shift();
      try { await fetchOne(n); state.done++; }
      catch (e) { state.failed++; state.errors.push(String(e)); }
      await new Promise(r => setTimeout(r, 30));
    }
  }));
})();
```

**为什么并发只开 5**？

- 太高（>20）很多内部文档站会 throttle 或封 token。
- 5 在 100Mbps 局域网约 4-5 篇/秒，3000 篇约 10 分钟，体验最佳。

**进度监控**（每分钟看一次）：

```bash
agent-browser --auto-connect eval --stdin < scripts/check_progress.js
```

---

## 5. 阶段四 · 处理特殊节点

### 5.1 多文章节点（fdoc 的 type='multiple'）

调列表 API → 拿到 `articlesList` 数组 → 对每个文章再调内容 API。完整代码 [`scripts/fetch_multi.js`](../scripts/fetch_multi.js)。

### 5.2 外链节点（type='link'）

不抓内容，但**索引文件里仍要列出来**：

```js
if (n.type === 'link') {
  fs.writeFileSync(`${dst}.url`, `[InternetShortcut]\nURL=${n.url}\n`);
}
```

或直接在生成的索引里写 `[名称](http://...)`。

### 5.3 附件 / 图片

fdoc 的图片链接形如 `/onlinedoc/.../getContent?attachGuid=xxx`。两种处理：

1. **保留远程链接**（最省事）：把相对路径改绝对，写 markdown 的 `![](https://fdoc.epoint.com.cn/...)`。**离线时图片不可用**。
2. **离线下载**（更完整）：用 fetch 拿二进制，存 `attachments/{guid}.{ext}`，markdown 里改写为相对路径。

本仓库选了方案 1（远程链接），因为：

- 附件占空间大（往往 >100MB）。
- 大多数附件是截图，不下载也不影响 AI 文本理解。
- 如果未来要离线，加一段批量 fetch 即可，所有 guid 都能从 markdown 里 grep 出来。

---

## 6. 阶段五 · 生成 references / SKILL.md

### 6.1 自动生成各主题索引

```bash
node scripts/build_references.js
```

它做的事：

1. 扫描 `skills/{skill-name}/docs/{root}/{topic}/...`
2. 对每个一级目录（topic）生成 `skills/{skill-name}/references/{topic-slug}.md`，按层级列出所有文章 + 相对链接到 `../docs/...`
3. 顶层生成 `skills/{skill-name}/references/INDEX.md`，所有 topic 一表概览

### 6.2 SKILL.md 写作要点

> Skill description 是 **触发开关**，必须写"pushy"才能让 AI 主动加载。

参考本仓库的 `skills/epoint-framework-dev/SKILL.md`：

- **description 字段 ≥150 字**：列出所有可能的关键词、类名、注解、报错关键字。
  > "当用户提到 Epoint / com.epoint / CommonContext / PageResult / @ApiDescription / frame_user / 工作流 / ... 时**必须**主动使用本 skill。"
- **正文** ≤ 200 行：知识结构 + 标准工作流 + 硬约束 + 速查表。
- **不要把全部文档塞进 SKILL.md**，让 AI 按需 `read_file` references/{topic}.md。

### 6.3 references 设计原则

每个 reference 是**索引而非内容**，模型看完 references/{topic}.md 后，应能精确定位到 1-3 篇 `docs/{full-path}.md` 去读详细内容。这是 progressive disclosure 的核心。

---

## 7. 把这套迁移到别的站点的清单

抓一个新站点时，按这个清单走一遍即可：

| 步骤 | 时间预估 | 关键产物 |
|---|---|---|
| 1. agent-browser 打开站点并登录 | 2 min | 受控浏览器 session |
| 2. HAR 录制 5-10 次点击 | 5 min | 找到内容 API、参数 |
| 3. 浏览器 fetch 验证 API | 5 min | 返回 JSON 结构清楚 |
| 4. 写 dump_tree.js 把目录树 dump 出来 | 10 min | `tree.json` |
| 5. 复制 `scripts/server.js` 改 endpoint / HTML 解析规则 | 30 min | server.js |
| 6. 复制 `scripts/start_batch.js` 改字段名 | 15 min | start_batch.js |
| 7. 跑全量抓取（3000 篇约 15 分钟） | 15 min | docs/ |
| 8. 写 `build_references.js` 扫 `docs/{topic}/` | 10 min | references/ |
| 9. 写 SKILL.md（重点：触发条件 + 速查表） | 30 min | SKILL.md |
| 10. 改根 README.md / package.json / bin/install.js | 10 min | 可发布的 npm 包 |
| **合计** | **~2 hour** | 完整 skill |

---

## 8. 排错速查

| 现象 | 原因 | 解法 |
|---|---|---|
| `curl` 拿到 302，跳转 SSO | curl 没有完整 session | 改用 agent-browser eval |
| `fetch` 返回 401 | token 过期（fdoc 是 24h） | 浏览器重新登录 |
| 浏览器 fetch 返回 CORS 错 | server 没设 `Access-Control-Allow-*` | 见 server.js 的 `cors(res)` |
| 代码块全部压成单行 | 站点用 `&lt;ol class="linenums"&gt;&lt;li&gt;` 表示行 | 加 turndown 自定义规则（见 §3） |
| 中文路径写盘报 ENAMETOOLONG | 文件名太长 | 截断到 120 字符 + 替换非法字符 |
| 多文章节点失败 500 | 用错了 API（list vs single） | 重抓 HAR，看真实 endpoint 和 body 字段 |
| agent-browser eval 卡住 | 浏览器 worker 还在跑 | 直接 `curl localhost:8765/progress` 观察 |
| 任务跑一半 token 过期 | session 24h 失效 | 浏览器重登 → 重启 batch（已存的不重抓） |

---

## 9. 安全 / 合规提醒

- 站点的 ToS 可能禁止"批量抓取"。本仓库的目标只是**自用 + 自家公司内部知识助手**，请不要分发抓到的内容。
- 离线后的附件链接仍指向原站点，未授权用户打开仍要登录，不构成数据泄露。
- npm publish 前请把内容审一遍，避免泄露内部敏感信息（特别是用户名、内网 IP、密钥）。

---

## 10. 进一步阅读

- [`scripts/server.js`](../scripts/server.js)：完整的 server 实现
- [`scripts/start_batch.js`](../scripts/start_batch.js)：完整的 worker pool
- [`scripts/fetch_multi.js`](../scripts/fetch_multi.js)：多文章节点
- [`scripts/build_references.js`](../scripts/build_references.js)：自动索引生成
- [`scripts/dump_tree.js`](../scripts/dump_tree.js)：目录树 dump
- [`scripts/check_progress.js`](../scripts/check_progress.js)：进度检查
- agent-browser 文档：https://agent-browser.dev
- turndown 文档：https://github.com/mixmark-io/turndown
