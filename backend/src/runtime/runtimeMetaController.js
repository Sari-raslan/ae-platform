export function createMetaController() {
  const states = [];

  function activate(state = {}) {
    const entry = {
      id: state.id || `meta-${states.length + 1}`,
      mode: state.mode || "meta-runtime",
      activatedAt: new Date().toISOString(),
    };

    states.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      states,
      stateCount: states.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    activate,
    snapshot,
  };
}
