export function createVariationSwitchEngine() {
  let state = {
    current: "VAR1",
    queued: null,
    history: [],
  };

  function queue(variation = "VAR1") {
    state.queued = variation;

    state.history.push({
      type: "queue",
      variation,
      at: new Date().toISOString(),
    });

    state.history = state.history.slice(-32);

    return snapshot();
  }

  function apply() {
    if (state.queued) {
      state.current = state.queued;

      state.history.push({
        type: "apply",
        variation: state.current,
        at: new Date().toISOString(),
      });

      state.queued = null;
    }

    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      ...state,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    queue,
    apply,
    snapshot,
  };
}
