const ROOTS = {
  C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5,
  "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11
};

export function transposeStyleEvents(events = [], chord = "C major") {
  const root = String(chord).split(" ")[0] || "C";
  const offset = ROOTS[root] ?? 0;

  return events.map((event) => ({
    ...event,
    originalNote: event.note,
    note: event.track === "DRUMS" ? event.note : event.note + offset,
    chord
  }));
}
