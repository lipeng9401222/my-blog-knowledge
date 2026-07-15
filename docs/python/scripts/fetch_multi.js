(async () => {
  const tree = $.fn.zTree.getZTreeObj('left-nav-tree');
  const all = tree.transformToArray(tree.getNodes());
  const multiNodes = all.filter(n => n.type === 'multiple');
  const pathOf = (n) => { const p=[]; let c=n; while(c){p.unshift(c.name); c=c.getParentNode&&c.getParentNode();} return p.join(' / '); };
  const apiList = '/onlinedoc/rest/docshow/docshowaction/getArticlesListUrl?isCommondto=true&columnguid=031&menuguid=031001&nodeguid=a71c622b-ca86-43f6-b63a-850396994061';
  const apiSingle = '/onlinedoc/rest/docshow/docshowaction/getMarkdownUrl?isCommondto=true&columnguid=031&menuguid=031001&nodeguid=a71c622b-ca86-43f6-b63a-850396994061';

  const results = [];
  for (const parent of multiNodes) {
    // 1. fetch list
    const lr = await fetch(apiList, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'nodeId=' + encodeURIComponent(parent.id) + '&currentPage=0&pageSize=500&keyWord=',
      credentials: 'include'
    });
    const lj = await lr.json();
    let listParsed = null;
    try { listParsed = typeof lj.custom === 'string' ? JSON.parse(lj.custom) : lj.custom; } catch(_) {}
    const articles = (listParsed && listParsed.articlesList) || [];
    const parentPath = pathOf(parent);

    let saved = 0;
    for (const art of articles) {
      // 2. fetch each article
      const r = await fetch(apiSingle, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'id=' + encodeURIComponent(art.id),
        credentials: 'include'
      });
      const raw = await r.json();
      // POST to local server using a synthetic node
      const childPath = parentPath + ' / ' + art.name;
      const post = await fetch('http://localhost:8765/article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          node: { id: art.id, name: art.name, path: childPath, level: parent.level + 1, type: 'multi-child' },
          raw
        })
      });
      const pj = await post.json();
      if (pj.ok) saved++;
      // tiny pacing
      await new Promise(r => setTimeout(r, 30));
    }
    results.push({ parent: parent.name, total: articles.length, saved });
  }
  return results;
})()
