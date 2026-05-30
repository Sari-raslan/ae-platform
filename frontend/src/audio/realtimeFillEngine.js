export function createRealtimeFillEngine() {
  const fills = {
    FILL1: [
      { step: 0, note: 38, velocity: 120, track: "DRUMS" },
      { step: 3, note: 42, velocity: 100, track: "DRUMS" },
      { step: 6, note: 45, velocity: 115, track: "DRUMS" },
      { step: 9, note: 38, velocity: 120, track: "DRUMS" },
      { step: 12, note: 47, velocity: 127, track: "DRUMS" },
    ],

    FILL2: [
      { step: 0, note: 36, velocity: 120, track: "DRUMS" },
      { step: 4, note: 42, velocity: 100, track: "DRUMS" },
      { step: 8, note: 38, velocity: 120, track: "DRUMS" },
      { step: 12, note: 50, velocity: 127, track: "DRUMS" },
    ],
  };

  let history = [];

  function trigger(name = "FILL1") {
    const pattern = fills[name] || [];

    const event = {
      ok: true,
      fill: name,
      events: pattern,
      triggeredAt: new Date().toISOString(),
    };

    history.push(event);
    history = history.slice(-20);

    return event;
  }

  function snapshot() {
    return {
      ok: true,
      fills: Object.keys(fills),
      history,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    trigger,
    snapshot,
  };
}
