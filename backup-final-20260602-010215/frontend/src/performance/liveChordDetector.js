const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B"
];

const CHORDS = [
  { intervals: "0,4,7", quality: "major" },
  { intervals: "0,3,7", quality: "minor" },
  { intervals: "0,4,7,10", quality: "7" },
  { intervals: "0,3,7,10", quality: "m7" },
  { intervals: "0,4,7,11", quality: "maj7" },
  { intervals: "0,3,6", quality: "dim" },
  { intervals: "0,4,8", quality: "aug" },
  { intervals: "0,5,7", quality: "sus4" },
];

export function detectRealtimeChord(notes = []) {
  const pitchClasses = [...new Set(notes.map((note) => note % 12))].sort((a, b) => a - b);

  if (pitchClasses.length < 3) {
    return {
      ok: false,
      chord: null,
      reason: "not enough notes",
    };
  }

  for (const root of pitchClasses) {
    const intervals = pitchClasses
      .map((note) => (note - root + 12) % 12)
      .sort((a, b) => a - b)
      .join(",");

    const match = CHORDS.find((chord) => chord.intervals === intervals);

    if (match) {
      return {
        ok: true,
        root,
        rootName: NOTE_NAMES[root],
        quality: match.quality,
        chord: `${NOTE_NAMES[root]} ${match.quality}`,
      };
    }
  }

  return {
    ok: false,
    chord: "unknown",
    pitchClasses,
  };
}

export function createLiveChordDetector() {
  let state = {
    notes: [],
    detected: {
      ok: false,
      chord: null,
    },
    history: [],
  };

  function feed(notes = []) {
    state.notes = [...notes].sort((a, b) => a - b);
    state.detected = detectRealtimeChord(state.notes);

    state.history.unshift({
      notes: state.notes,
      detected: state.detected,
      detectedAt: new Date().toISOString(),
    });

    state.history = state.history.slice(0, 32);

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
