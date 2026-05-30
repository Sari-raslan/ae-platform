export function createRealtimeSamplerEngine() {
  let samples = [
    {
      id: "kick-1",
      name: "Kick",
      note: 36,
      file: "kick.wav",
    },
    {
      id: "snare-1",
      name: "Snare",
      note: 38,
      file: "snare.wav",
    },
  ];

  let triggers = [];

  function trigger(note = 36, velocity = 120) {
    const sample =
      samples.find((s) => s.note === note) || samples[0];

    const event = {
      ok: true,
      sample,
      velocity,
      triggeredAt: new Date().toISOString(),
    };

    triggers.push(event);
    triggers = triggers.slice(-64);

    return event;
  }

  function add(sample = {}) {
    const item = {
      id: sample.id || `sample-${samples.length + 1}`,
      name: sample.name || "New Sample",
      note: sample.note || 60,
      file: sample.file || "sample.wav",
    };

    samples.push(item);

    return item;
  }

  function snapshot() {
    return {
      ok: true,
      samples,
      triggers,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    trigger,
    add,
    snapshot,
  };
}
