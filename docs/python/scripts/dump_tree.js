// Dump the full zTree of fdoc into a flat array of nodes.
// Run with: agent-browser --auto-connect eval --stdin < tools/dump_tree.js > tools/tree.json
(() => {
  const t = $.fn.zTree.getZTreeObj('left-nav-tree');
  if (!t) throw new Error('zTree instance not found; are you on the doc page?');
  const all = t.transformToArray(t.getNodes());
  const map = new Map(all.map(n => [n.tId, n]));
  return all.map(n => {
    const parent = n.parentTId ? map.get(n.parentTId) : null;
    return {
      id: n.id,
      name: n.name,
      level: n.level,
      isParent: !!n.isParent,
      type: n.type || '',
      url: n.url || null,
      target: n.target || null,
      parentId: parent ? parent.id : null
    };
  });
})()
