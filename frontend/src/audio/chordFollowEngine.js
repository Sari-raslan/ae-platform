const NOTE_NAMES = [
  "C","C#","D","D#","E","F",
  "F#","G","G#","A","A#","B"
];

function normalize(notes = []) {
  return [...new Set(notes.map((n) => n % 12))].sort((a,b)=>a-b);
}

function detect(notes = []) {
  if (notes.length < 3) {
    return {
      ok: false,
      chord: null,
    };
  }

  const normalized = normalize(notes);

  for (const root of normalized) {
    const intervals = normalized
      .map((n) => (n - root + 12) % 12)
      .sort((a,b)=>a-b)
      .join(",");

    if (intervals === "0,4,7") {
      return {
        ok: true,
        root,
        type: "major",
        chord: `${NOTE_NAMES[root]} major`,
      };
    }

    if (intervals === "0,3,7") {
      return {
        ok: true,
        root,
        type: "minor",
        chord: `${NOTE_NAMES[root]} minor`,
      };
    }
  }

  return {
    ok: false,
    chord: "unknown",
  };
}

export function createChordFollowEngine() {
  let state = {
    notes: [],
    chord: null,
    history: [],
  };

  function feed(notes = []) {
    const detected = detect(notes);

    state.notes = notes;
    state.chord = detected.chord;

    state.history.push({
      notes,
      chord: detected.chord,
      detectedAt: new Date().toISOString(),
    });

    state.history = state.history.slice(-32);

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
    feed,
    snapshot,
  };
}
