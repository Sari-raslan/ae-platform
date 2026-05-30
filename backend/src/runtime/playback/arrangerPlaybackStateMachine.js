export function createArrangerPlaybackStateMachine() {
  let state = {
    status: "stopped",
    tempo: 120,
    bar: 1,
    beat: 1,
    tick: 0,
    ppq: 24
  };

  function snapshot() {
    return { ok: true, ...state };
  }

  function start() {
    state.status = "playing";
    return snapshot();
  }

  function stop() {
    state.status = "stopped";
    state.bar = 1;
    state.beat = 1;
    state.tick = 0;
    return snapshot();
  }

  function advanceTick() {
    if (state.status !== "playing") return snapshot();
    state.tick += 1;
    if (state.tick >= state.ppq) {
      state.tick = 0;
      state.beat += 1;
    }
    if (state.beat > 4) {
      state.beat = 1;
      state.bar += 1;
    }
    return snapshot();
  }

  return { snapshot, start, stop, advanceTick };
}
