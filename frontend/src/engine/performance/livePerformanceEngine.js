export function createLivePerformanceEngine() {

  let state = {
    fills: 0,
    pads: 0,
    registrations: 0,
  };

  function fill() {
    state.fills += 1;
    return snapshot();
  }

  function pad() {
    state.pads += 1;
    return snapshot();
  }

  function registration() {
    state.registrations += 1;
    return snapshot();
  }

  function snapshot() {
    return {
      ...state,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    fill,
    pad,
    registration,
    snapshot,
  };
}
