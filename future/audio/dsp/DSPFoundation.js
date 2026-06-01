export function createDSPFoundation() {

  const state = {
    reverb: false,
    delay: false,
    compressor: false,
    limiter: false,
  };

  function enable(name) {

    if (state[name] !== undefined) {
      state[name] = true;
    }
  }

  function snapshot() {

    return {
      ...state,
      generatedAt:
        new Date().toISOString(),
    };
  }

  return {
    enable,
    snapshot,
  };
}
