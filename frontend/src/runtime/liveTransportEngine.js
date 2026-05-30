export function createLiveTransportEngine() {

  let state = {
    playing: false,
    tempo: 120,
    tick: 0,
    bar: 1,
    beat: 1,
  };

  function start() {
    state.playing = true;
    return snapshot();
  }

  function stop() {
    state.playing = false;
    return snapshot();
  }

  function pulse() {
    if (!state.playing) {
      return snapshot();
    }

    state.tick += 1;

    if (state.tick % 4 === 0) {
      state.beat += 1;
    }

    if (state.beat > 4) {
      state.beat = 1;
      state.bar += 1;
    }

    return snapshot();
  }

  function snapshot() {
    return {
      ...state,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    start,
    stop,
    pulse,
    snapshot,
  };
}
