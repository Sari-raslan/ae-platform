export function createLivePerformanceEngine() {
  let active = false;
  const history = [];

  function start(style = "STYLE_A") {
    active = true;

    const entry = {
      id: `live-${history.length + 1}`,
      style,
      startedAt: new Date().toISOString(),
    };

    history.push(entry);

    return snapshot();
  }

  function stop() {
    active = false;
    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      active,
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
