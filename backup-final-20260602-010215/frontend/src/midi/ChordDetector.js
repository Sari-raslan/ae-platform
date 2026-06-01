export class ChordDetector {
  constructor() {
    this.activeNotes = new Set();
  }

  noteName(note) {
    const names = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    return names[note % 12];
  }

  detect(notes) {
    const pcs = [...new Set(notes.map((n) => n % 12))].sort((a, b) => a - b);

    if (pcs.length < 3) {
      return null;
    }

    const chordTypes = [
      { name: "", intervals: [0, 4, 7] },
      { name: "m", intervals: [0, 3, 7] },
      { name: "7", intervals: [0, 4, 7, 10] },
      { name: "maj7", intervals: [0, 4, 7, 11] },
      { name: "m7", intervals: [0, 3, 7, 10] },
      { name: "sus4", intervals: [0, 5, 7] }
    ];

    for (let root = 0; root < 12; root++) {
      for (const type of chordTypes) {
        const match = type.intervals.every((i) =>
          pcs.includes((root + i) % 12)
        );

        if (match) {
          return this.noteName(root) + type.name;
        }
      }
    }

    return null;
  }

  noteOn(note) {
    this.activeNotes.add(note);
    return this.detect(Array.from(this.activeNotes));
  }

  noteOff(note) {
    this.activeNotes.delete(note);
    return this.detect(Array.from(this.activeNotes));
  }

  status() {
    return {
      activeNotes: Array.from(this.activeNotes),
      chord: this.detect(Array.from(this.activeNotes))
    };
  }
}

export const chordDetector = new ChordDetector();
