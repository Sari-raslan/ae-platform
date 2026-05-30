export function createStyleVariationRouter() {
  let state = {
    activeVariation: "VAR1",
    pendingVariation: null,
  };

  function queue(variation = "VAR1") {
    state.pendingVariation = variation;

    return snapshot();
  }

  function applyPending() {
    if (state.pendingVariation) {
      state.activeVariation = state.pendingVariation;
      state.pendingVariation = null;
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
    applyPending,
    snapshot,
  };
}
