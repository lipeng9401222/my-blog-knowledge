#!/usr/bin/env node
// Build per-topic reference indexes by walking skills/<skill-name>/docs/<root>/<topic>/...
// Each topic produces a single .md index that the skill can pull on demand.
// The index includes the full hierarchy of articles with relative paths to the actual files.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SKILL = path.join(ROOT, "skills", "epoint-framework-dev");
const DOCS = path.join(SKILL, "docs");
const REF = path.join(SKILL, "references");
fs.mkdirSync(REF, { recursive: true });

// Find the first-level container (e.g. "框架研究中心")
const topRoots = fs
  .readdirSync(DOCS)
  .filter((n) => fs.statSync(path.join(DOCS, n)).isDirectory());
if (topRoots.length === 0) {
  console.error("No docs found");
  process.exit(1);
}
const ROOT_NAME = topRoots[0];
const ROOT_DIR = path.join(DOCS, ROOT_NAME);

// Topic mapping: dir name -> { slug, title, summary }
const TOPIC_META = {
  快速入门: {
    slug: "quick-start",
    title: "快速入门 / Quick Start",
    summary:
      "环境准备、第一个工程、页面开发、常见模型（编码模型、低代码模型、Vue 模型）。新人首次接触 Epoint 框架时优先看这里。",
  },
  项目介绍: {
    slug: "overview",
    title: "项目介绍 / Overview",
    summary:
      "工程结构、技术规范、版本更新记录、研发红线。理解整个项目工程组织和编码规范的入口。",
  },
  核心框架: {
    slug: "core",
    title: "核心框架 / Core Framework",
    summary:
      "FDD、通用技术（REST、HTTP、Excel、异步线程、Redis、加解密 等）、安全架构、缓存架构、异常架构、路由架构、日志架构、微服务、SaaS 框架、自动化测试、国际化、国产化、框架配置、组件化等核心能力。框架开发的主战场。",
  },
  框架组件: {
    slug: "components",
    title: "框架组件 / Components",
    summary:
      "工作流平台、在线电子表单、各类设计器（大屏/中屏/登录/统一界面）、接口管理、统一权限、统一元数据、日志中心、事件中心、告警中心、KMS 密钥管理、短信平台、网盘、三方开放平台 等框架级业务组件。",
  },
  支撑服务: {
    slug: "services",
    title: "支撑服务 / Services",
    summary:
      "EMP 移动平台、移动运营管理平台、即时通讯、消息推送、审计、监控等支撑服务的开发、部署与运维。",
  },
  低代码平台: {
    slug: "lowcode",
    title: "低代码平台 / Low-Code",
    summary: "低代码平台的设计器、组件、模型、运行时与发布。",
  },
  效能工具: {
    slug: "tools",
    title: "效能工具 / Productivity",
    summary: "提升研发效能的工具与脚本（如代码生成、批量操作、CLI 等）。",
  },
  共性整改: {
    slug: "code-fix",
    title: "共性整改 / Refactor",
    summary:
      "历史 Bug 整改专项、性能/安全/代码质量整改方案与最佳实践。遇到旧项目升级问题先看这里。",
  },
  在线API: {
    slug: "api-online",
    title: "在线 API / Online API",
    summary: "在线 API 文档与说明，包括服务端（Java）和前端（Vue）的接口列表。",
  },
  FAQ: {
    slug: "faq",
    title: "常见问题 / FAQ",
    summary:
      "工作流、基础框架、应用集成、移动端、第三方控件、数据库、意识流（脏数据/配置变更/排查）等高频问题。报错或诡异行为时先在这里搜关键词。",
  },
  更新日志: {
    slug: "changelog",
    title: "更新日志 / Changelog",
    summary: "框架版本变更与新特性。",
  },
};

function rel(p) {
  return p
    .replace(ROOT + path.sep, "")
    .split(path.sep)
    .join("/");
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  // Sort: dirs first then files, both alphabetically
  const dirs = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, "zh"));
  const files = entries
    .filter((e) => e.isFile() && e.name.endsWith(".md"))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, "zh"));
  return { dirs, files };
}

function buildTreeLines(dir, depth = 0) {
  const lines = [];
  const { dirs, files } = walk(dir);
  // List markdown files in this dir
  for (const f of files) {
    const full = path.join(dir, f);
    const name = f.replace(/\.md$/, "");
    const link =
      "./" +
      rel(full)
        .replace(/^references\/?/, "")
        .split("/")
        .map(encodeURIComponent)
        .join("/");
    // We are inside references/, but link target lives in docs/. Compute relative to references/.
    const target = path.relative(REF, full).split(path.sep).join("/");
    lines.push(`${"  ".repeat(depth)}- [${name}](${target})`);
  }
  for (const d of dirs) {
    lines.push(`${"  ".repeat(depth)}- **${d}/**`);
    lines.push(...buildTreeLines(path.join(dir, d), depth + 1));
  }
  return lines;
}

// Stats helper
function countFiles(dir) {
  let n = 0;
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.isFile() && e.name.endsWith(".md")) n++;
    }
  }
  return n;
}

// Index page that maps topic -> reference file
const indexLines = [];
indexLines.push(`# Epoint 框架知识库 - 主题索引`);
indexLines.push("");
indexLines.push(
  `本文件由 \`build_references.js\` 自动生成，列出所有主题入口及对应的索引文件。`,
);
indexLines.push(``);
indexLines.push(
  `> 完整原文位于 \`../docs/${ROOT_NAME}/\` 目录下，每个 \`.md\` 是一篇独立文章。`,
);
indexLines.push("");
indexLines.push(`| 主题 | 文章数 | 索引文件 | 说明 |`);
indexLines.push(`|---|---:|---|---|`);

const topicDirs = fs
  .readdirSync(ROOT_DIR)
  .filter((n) => fs.statSync(path.join(ROOT_DIR, n)).isDirectory());
for (const topic of topicDirs) {
  const meta = TOPIC_META[topic] || {
    slug: topic.replace(/\s+/g, "-").toLowerCase(),
    title: topic,
    summary: "",
  };
  const slug = meta.slug;
  const topicDir = path.join(ROOT_DIR, topic);
  const total = countFiles(topicDir);

  // Build per-topic reference file
  const out = [];
  out.push(`# ${meta.title}`);
  out.push("");
  out.push(`> 主题位置: \`docs/${ROOT_NAME}/${topic}/\``);
  out.push(`> 文章数量: ${total}`);
  out.push("");
  if (meta.summary) {
    out.push(`## 概述`);
    out.push("");
    out.push(meta.summary);
    out.push("");
  }
  out.push(`## 文章索引`);
  out.push("");
  out.push(`下面按目录层级列出所有文章。点击链接即可阅读全文。`);
  out.push("");
  out.push(...buildTreeLines(topicDir, 0));
  out.push("");
  out.push(`---`);
  out.push(
    `*Generated from ${ROOT_NAME}/${topic} containing ${total} articles.*`,
  );

  const outFile = path.join(REF, `${slug}.md`);
  fs.writeFileSync(outFile, out.join("\n"));
  console.log(`wrote ${outFile} (${total} articles)`);

  indexLines.push(
    `| **${topic}** | ${total} | [\`references/${slug}.md\`](./${slug}.md) | ${meta.summary} |`,
  );
}

indexLines.push("");
indexLines.push(`---`);
indexLines.push(`*总计 ${countFiles(ROOT_DIR)} 篇文档。*`);

fs.writeFileSync(path.join(REF, "INDEX.md"), indexLines.join("\n"));
console.log("wrote references/INDEX.md");
