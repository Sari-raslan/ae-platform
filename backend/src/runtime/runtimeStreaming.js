export function createRuntimeStreamingLayer() {
  let active = false;

  function start() {
    active = true;
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
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    start,
    stop,
    snapshot,
  };
}
