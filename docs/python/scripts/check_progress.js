(() => {
  const f = window.__framedocFetcher;
  if (!f) return { msg: 'not started' };
  const s = f.state;
  return {
    total: s.total,
    done: s.done,
    failed: s.failed,
    skipped: s.skipped,
    inFlight: s.inFlight,
    queueRemain: s.queue.length,
    finished: s.finished,
    elapsedSec: Math.round((Date.now() - s.startedAt) / 1000),
    rate: s.done > 0 ? Math.round(s.done / ((Date.now() - s.startedAt) / 1000) * 10) / 10 : 0,
    lastErrors: s.errors.slice(-5)
  };
})()
