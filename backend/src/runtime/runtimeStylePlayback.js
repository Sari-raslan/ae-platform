export function createStylePlaybackEngine() {
  let current = null;
  const history = [];

  function start(style = {}) {
    current = {
      ...style,
      startedAt: new Date().toISOString(),
    };

    history.push(current);

    return snapshot();
  }

  function stop() {
    current = null;
    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      current,
      history,
      historyCount: history.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    start,
    stop,
    snapshot,
  };
}
