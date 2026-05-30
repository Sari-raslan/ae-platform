export function createLivePadTriggerEngine() {
  const pads = new Map();

  function assign(index = 1, sample = "pad.wav") {
    const item = {
      index,
      sample,
      assignedAt: new Date().toISOString(),
    };

    pads.set(index, item);

    return item;
  }

  function trigger(index = 1) {
    const pad = pads.get(index);

    return {
      ok: Boolean(pad),
      pad: pad || null,
      triggeredAt: new Date().toISOString(),
    };
  }

  function snapshot() {
    return {
      ok: true,
      pads: Array.from(pads.values()),
      padCount: pads.size,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    assign,
    trigger,
    snapshot,
  };
}
