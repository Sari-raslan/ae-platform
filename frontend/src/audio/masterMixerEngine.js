export function createMasterMixerEngine() {
  let state = {
    master: 100,
    drums: 100,
    bass: 100,
    acc: 100,
    pad: 100,
  };

  function set(channel, value) {
    state[channel] = Math.max(0, Math.min(127, Number(value)));
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
    set,
    snapshot,
  };
}
