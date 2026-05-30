const CHORD_LIBRARY = {
  "0,4,7": "major",
  "0,3,7": "minor",
  "0,3,6": "diminished",
  "0,4,8": "augmented",
  "0,5,7": "sus4",
};

const NOTE_NAMES = [
  "C","C#","D","D#","E","F",
  "F#","G","G#","A","A#","B"
];

export function recognizeChord(notes = []) {
  if (!Array.isArray(notes) || notes.length < 3) {
    return {
      ok: false,
      chord: null,
    };
  }

  const normalized = [...new Set(notes.map((n) => n % 12))].sort((a,b)=>a-b);

  for (const root of normalized) {
    const intervals = normalized
      .map((n) => (n - root + 12) % 12)
      .sort((a,b)=>a-b);

    const key = intervals.join(",");

    if (CHORD_LIBRARY[key]) {
      return {
        ok: true,
        root,
        rootName: NOTE_NAMES[root],
        quality: CHORD_LIBRARY[key],
        chord: `${NOTE_NAMES[root]} ${CHORD_LIBRARY[key]}`,
      };
    }
  }

  return {
    ok: false,
    chord: "unknown",
  };
}
