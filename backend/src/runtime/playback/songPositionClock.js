export function createSongPositionClock() {
  let state = {
    songPosition: 0,
    measure: 1,
    beat: 1,
  };

  function advance(ppq = 24) {
    state.songPosition += 1;

    if (state.songPosition % ppq === 0) {
      state.beat += 1;
    }

    if (state.beat > 4) {
      state.beat = 1;
      state.measure += 1;
    }

    return snapshot();
  }

  function reset() {
    state = {
      songPosition: 0,
      measure: 1,
      beat: 1,
    };

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
    advance,
    reset,
    snapshot,
  };
}
