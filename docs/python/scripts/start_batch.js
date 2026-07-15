(async () => {
  if (window.__framedocFetcher && window.__framedocFetcher.running) {
    return { status: 'already running', state: window.__framedocFetcher.state };
  }
  const tree = $.fn.zTree.getZTreeObj('left-nav-tree');
  const all = tree.transformToArray(tree.getNodes());

  // Build path lookup
  const pathOf = (n) => {
    const p = [];
    let c = n;
    while (c) { p.unshift(c.name); c = c.getParentNode && c.getParentNode(); }
    return p.join(' / ');
  };

  // Targets: leaf article nodes only (skip dirs and external links). We have already handled type='multiple' nodes.
  const targets = [];
  for (const n of all) {
    if (n.type === 'link') continue;
    if (n.isParent) continue;
    if (n.type === 'multiple') continue;
    targets.push({
      id: n.id,
      name: n.name,
      path: pathOf(n),
      level: n.level,
      type: n.type || '',
      isParent: !!n.isParent
    });
  }

  const apiSingle = '/onlinedoc/rest/docshow/docshowaction/getMarkdownUrl?isCommondto=true&columnguid=031&menuguid=031001&nodeguid=a71c622b-ca86-43f6-b63a-850396994061';
  const apiMulti = '/onlinedoc/rest/docshow/docshowaction/getArticlesListUrl?isCommondto=true&columnguid=031&menuguid=031001&nodeguid=a71c622b-ca86-43f6-b63a-850396994061';

  const state = {
    total: targets.length,
    done: 0,
    failed: 0,
    skipped: 0,
    inFlight: 0,
    startedAt: Date.now(),
    queue: targets.slice(),
    finished: false,
    errors: []
  };

  async function postArticle(node, raw) {
    const r = await fetch('http://localhost:8765/article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ node, raw })
    });
    return r.json();
  }
  async function reportError(node, msg) {
    try {
      await fetch('http://localhost:8765/error', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ node, msg, t: Date.now() })
      });
    } catch (_) {}
  }

  async function fetchNode(node) {
    try {
      // Decide endpoint
      if (node.type === 'multiple') {
        const r = await fetch(apiMulti, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'id=' + encodeURIComponent(node.id),
          credentials: 'include'
        });
        if (!r.ok) throw new Error('multi http ' + r.status);
        const raw = await r.json();
        await postArticle({ ...node, _multi: true }, raw);
        return;
      }
      const r = await fetch(apiSingle, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'id=' + encodeURIComponent(node.id),
        credentials: 'include'
      });
      if (!r.ok) throw new Error('single http ' + r.status);
      const raw = await r.json();
      // For dir nodes that have no content, server still saves a stub but only if there's any content
      if (raw && raw.error && node.isParent) {
        state.skipped++;
        return;
      }
      await postArticle(node, raw);
    } catch (e) {
      state.failed++;
      state.errors.push({ id: node.id, name: node.name, msg: String(e && e.message || e) });
      reportError(node, String(e && e.message || e));
    }
  }

  const CONCURRENCY = 5;
  async function worker() {
    while (state.queue.length) {
      const node = state.queue.shift();
      state.inFlight++;
      await fetchNode(node);
      state.inFlight--;
      state.done++;
      // tiny pacing
      await new Promise(r => setTimeout(r, 30));
    }
  }
  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  Promise.all(workers).then(() => { state.finished = true; });

  window.__framedocFetcher = { running: true, state };
  return { msg: 'batch started', total: state.total };
})()
