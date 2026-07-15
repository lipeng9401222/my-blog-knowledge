// Local HTTP server to collect articles fetched by browser-side script.
// - POST /article  : { node: {id,name,path,type,level}, raw: <getMarkdownUrl response> }
// - POST /attach   : multipart-style { guid, name, base64 }
// - GET  /tree     : returns the parsed tree.json
// - GET  /progress : current saved count
// CORS allowed for fdoc.epoint.com.cn so the browser tab can POST here.

const http = require('http');
const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');

const ROOT = path.resolve(__dirname, '..');
const SKILL = path.join(ROOT, 'skill');
const DOCS = path.join(SKILL, 'docs');
const ATTACH = path.join(SKILL, 'attachments');
const PROGRESS_FILE = path.join(__dirname, 'progress.json');
const TREE_FILE = path.join(__dirname, 'tree.json');
const ERROR_LOG = path.join(__dirname, 'errors.log');

fs.mkdirSync(DOCS, { recursive: true });
fs.mkdirSync(ATTACH, { recursive: true });

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*'
});
// Preserve <pre><code> blocks. The fdoc HTML uses <pre><ol class="linenums"><li class="LN"><code class="lang-X">...</code></li>...</ol></pre>
// where each <li> represents one line. Default turndown collapses everything to a single line.
td.addRule('preserveCodeBlock', {
  filter: ['pre'],
  replacement: (content, node) => {
    let lang = '';
    if (node.getElementsByTagName) {
      const codes = Array.from(node.getElementsByTagName('code'));
      const codeEl = codes.find(c => /lang[-_]/i.test(c.className || ''));
      if (codeEl) {
        const m = (codeEl.className || '').match(/lang(?:uage)?[-_]?([a-zA-Z0-9]+)/);
        if (m) lang = m[1];
      }
    }

    let ol = null;
    if (node.getElementsByTagName) {
      const ols = Array.from(node.getElementsByTagName('ol'));
      ol = ols.find(o => /linenums/i.test(o.className || '')) || null;
    }
    let body;
    if (ol) {
      // Direct <li> children only
      const lis = Array.from(ol.childNodes || []).filter(n => n.nodeType === 1 && n.tagName && n.tagName.toUpperCase() === 'LI');
      body = lis.map(li => (li.textContent || '').replace(/\u00a0/g, ' ').replace(/\s+$/,'')).join('\n');
    } else {
      body = (node.textContent || '').replace(/\u00a0/g, ' ').replace(/\n{3,}/g, '\n\n');
    }
    body = body.replace(/^\n+/, '').replace(/\n+$/, '');
    return '\n\n```' + lang + '\n' + body + '\n```\n\n';
  }
});

let progress = { saved: 0, failed: 0, started: Date.now() };
try { progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')); } catch (_) {}

function saveProgress() {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function sanitize(name) {
  return String(name || '').replace(/[\\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim().slice(0, 120) || 'unnamed';
}

function buildPath(node) {
  // node.path is like "框架研究中心 / 核心框架 / 通用技术 / 异步线程"
  const parts = String(node.path || node.name).split(' / ').map(sanitize);
  if (parts.length <= 1) return path.join(DOCS, parts[0] + '.md');
  const dir = path.join(DOCS, ...parts.slice(0, -1));
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, parts[parts.length - 1] + '.md');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function htmlToMarkdown(html) {
  if (!html) return '';
  // Strip toc-line wrappers and editormd preview wrappers since they add no info
  let cleaned = html
    .replace(/<div class='editormd-preview'[^>]*>/g, '')
    .replace(/<div class='markdown-body editormd-preview-container'>/g, '')
    .replace(/<\/div>$/g, '');
  // Convert relative attach getContent URLs to absolute (only if not already absolute)
  cleaned = cleaned.replace(
    /(?<!https?:\/\/[^\s"'<>)]{0,200})(\/onlinedoc\/rest\/frame\/base\/attach\/attachAction\/getContent[^"'\)\s>]+)/g,
    'https://fdoc.epoint.com.cn$1'
  );
  return td.turndown(cleaned);
}

function articleToMarkdown(node, parsedRaw) {
  const versions = (parsedRaw && parsedRaw.versionsList) || [];
  const attachList = (parsedRaw && parsedRaw.attachList) || [];
  const html = (parsedRaw && parsedRaw.content) || '';
  const md = htmlToMarkdown(html);

  let header = `# ${node.name}\n\n`;
  if (node.path) header += `> Path: ${node.path}\n\n`;
  if (node.id) header += `> ID: ${node.id}\n\n`;
  if (versions.length) {
    header += `## 版本历史\n\n| 版本 | 日期 | 说明 | 作者 |\n|---|---|---|---|\n`;
    for (const v of versions) {
      header += `| ${v.versions || ''} | ${v.date || ''} | ${(v.explain || '').replace(/\|/g,'\\|')} | ${v.author || ''} |\n`;
    }
    header += '\n';
  }
  let footer = '';
  if (attachList.length) {
    footer += '\n\n## 附件\n\n';
    for (const a of attachList) {
      const link = (a.downloadLink || '').replace(/^http:\/\/[^/]+/, 'https://fdoc.epoint.com.cn');
      footer += `- [${a.attachName || a.infoid}](${link}) ${a.attachSize || ''}\n`;
    }
  }
  return header + md + footer;
}

const server = http.createServer(async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }

  const url = new URL(req.url, 'http://localhost');

  try {
    if (req.method === 'GET' && url.pathname === '/tree') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(fs.readFileSync(TREE_FILE));
    }
    if (req.method === 'GET' && url.pathname === '/progress') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(progress));
    }
    if (req.method === 'GET' && url.pathname === '/ping') {
      return res.end('pong');
    }
    if (req.method === 'POST' && url.pathname === '/article') {
      const body = JSON.parse((await readBody(req)).toString('utf8'));
      const { node, raw } = body;
      let parsedRaw = null;
      try {
        // raw is the full response from getMarkdownUrl: { custom: <stringified JSON>, ... }
        const outer = typeof raw === 'string' ? JSON.parse(raw) : raw;
        parsedRaw = typeof outer.custom === 'string' ? JSON.parse(outer.custom) : outer.custom;
      } catch (e) {
        // fall back: maybe browser already parsed and gave us inner directly
        parsedRaw = raw;
      }
      const md = articleToMarkdown(node, parsedRaw || {});
      const file = buildPath(node);
      fs.writeFileSync(file, md);
      progress.saved++;
      if (progress.saved % 25 === 0) saveProgress();
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ ok: true, file }));
    }
    if (req.method === 'POST' && url.pathname === '/error') {
      const body = (await readBody(req)).toString('utf8');
      fs.appendFileSync(ERROR_LOG, body + '\n');
      progress.failed++;
      saveProgress();
      return res.end('ok');
    }
    res.statusCode = 404;
    res.end('not found');
  } catch (e) {
    res.statusCode = 500;
    res.end(String(e && e.stack || e));
  }
});

const PORT = 8765;
server.listen(PORT, () => {
  console.log(`framedoc collector listening on http://localhost:${PORT}`);
  console.log(`docs dir: ${DOCS}`);
  // periodic flush
  setInterval(saveProgress, 5000);
});

process.on('SIGINT', () => { saveProgress(); process.exit(0); });
process.on('SIGTERM', () => { saveProgress(); process.exit(0); });
