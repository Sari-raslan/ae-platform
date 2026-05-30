const ROOT_TO_MIDI = {
  C: 36,
  "C#": 37,
  D: 38,
  "D#": 39,
  E: 40,
  F: 41,
  "F#": 42,
  G: 43,
  "G#": 44,
  A: 45,
  "A#": 46,
  B: 47,
};

export function createDynamicBassGenerator() {
  let history = [];

  function generate(chord = "C major") {
    const root = chord.split(" ")[0] || "C";
    const base = ROOT_TO_MIDI[root] ?? 36;

    const pattern = [
      base,
      base + 7,
      base + 12,
      base + 7,
    ];

    const events = pattern.map((note, index) => ({
      track: "BASS",
      note,
      velocity: 100,
      step: index * 6,
      generatedAt: new Date().toISOString(),
    }));

    history.push({
      chord,
      events,
    });

    history = history.slice(-24);

    return {
      ok: true,
      chord,
      events,
    };
  }

  function snapshot() {
    return {
      ok: true,
      history,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    generate,
    snapshot,
  };
}
