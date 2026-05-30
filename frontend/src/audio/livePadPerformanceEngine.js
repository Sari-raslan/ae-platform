export function createLivePadPerformanceEngine() {
  const pads = {
    PAD1: [
      { note: 72, velocity: 110 },
      { note: 76, velocity: 110 },
    ],

    PAD2: [
      { note: 67, velocity: 120 },
      { note: 71, velocity: 120 },
    ],

    PAD3: [
      { note: 60, velocity: 127 },
    ],

    PAD4: [
      { note: 48, velocity: 127 },
    ],
  };

  let history = [];

  function trigger(name = "PAD1") {
    const events = pads[name] || [];

    const result = {
      ok: true,
      pad: name,
      events,
      triggeredAt: new Date().toISOString(),
    };

    history.push(result);
    history = history.slice(-32);

    return result;
  }

  function snapshot() {
    return {
      ok: true,
      pads: Object.keys(pads),
      history,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    trigger,
    snapshot,
  };
}
